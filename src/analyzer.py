import os
import difflib
import re

def compute_diff(code1, code2):
    """
    Computes a simplified human-readable diff summary between code1 and code2.
    Detects additions, deletions, and replacements.
    """
    if not code1:
        return "Initial code written."
    
    lines1 = code1.splitlines()
    lines2 = code2.splitlines()
    
    diff = list(difflib.ndiff(lines1, lines2))
    
    changes = []
    lines_added = 0
    lines_deleted = 0
    
    i = 0
    line_num_1 = 0
    line_num_2 = 0
    
    while i < len(diff):
        item = diff[i]
        tag = item[0]
        content = item[2:].rstrip()
        
        if tag == ' ':
            line_num_1 += 1
            line_num_2 += 1
            i += 1
        elif tag == '-':
            # Look ahead for a potential replacement
            if i + 1 < len(diff) and diff[i + 1][0] == '+':
                replacement = diff[i + 1][2:].rstrip()
                changes.append(f"Line {line_num_2 + 1}: Modified `{content.strip()}` -> `{replacement.strip()}`")
                lines_deleted += 1
                lines_added += 1
                line_num_1 += 1
                line_num_2 += 1
                i += 2
            else:
                changes.append(f"Line {line_num_2 + 1}: Deleted `{content.strip()}`")
                lines_deleted += 1
                line_num_1 += 1
                i += 1
        elif tag == '+':
            changes.append(f"Line {line_num_2 + 1}: Added `{content.strip()}`")
            lines_added += 1
            line_num_2 += 1
            i += 1
        else:
            i += 1
            
    summary = f"Diff metrics: +{lines_added} lines, -{lines_deleted} lines.\n"
    if changes:
        summary += "Changes:\n" + "\n".join(f"  - {c}" for c in changes[:15]) # cap at 15 changes to prevent bloat
        if len(changes) > 15:
            summary += f"\n  - ... and {len(changes) - 15} more line changes."
    else:
        summary += "No functional line changes."
        
    return summary

def analyze_student_problem_timeline(submissions, diff_summarizer=None):
    """
    Analyzes a list of chronological submissions from a single student for a single question.
    Extracts metrics and a progression timeline of code changes.
    """
    if not submissions:
        return {}
        
    if diff_summarizer is None:
        diff_summarizer = compute_diff
        
    total_attempts = len(submissions)
    
    # Find best submission (passing, or highest tests passing)
    best_sub = None
    for s in submissions:
        if s["all_test_cases_passing"]:
            best_sub = s
            break
            
    if not best_sub:
        # Fallback to the one with the maximum test cases passing
        best_sub = max(submissions, key=lambda s: s["tests_passing"])
        
    first_sub = submissions[0]
    final_sub = submissions[-1]
    
    # Track status transitions
    transitions = []
    prev_status = None
    prev_tests = -1
    
    for idx, s in enumerate(submissions):
        status_changed = s["status"] != prev_status
        tests_changed = s["tests_passing"] != prev_tests
        
        if status_changed or tests_changed:
            transitions.append({
                "attempt_index": idx + 1,
                "submission_id": s["submission_id"],
                "status": s["status"],
                "status_name": get_status_name(s["status"]),
                "tests_passing": s["tests_passing"],
                "all_passing": s["all_test_cases_passing"],
                "created_at_str": s["created_at_str"],
                "source_code": s["source_code"],
                "error_message": s["error_message"]
            })
            prev_status = s["status"]
            prev_tests = s["tests_passing"]
            
    # Compute chronological diff timeline
    timeline_desc = []
    prev_code = ""
    for t in transitions:
        idx = t["attempt_index"]
        status_name = t["status_name"]
        tests = t["tests_passing"]
        
        diff_desc = diff_summarizer(prev_code, t["source_code"])
        err_info = f" (Error: {t['error_message']})" if t["error_message"] else ""
        
        timeline_desc.append(
            f"Attempt {idx} | Status: {status_name} | Tests Passed: {tests}{err_info}\n"
            f"{diff_desc}"
        )
        prev_code = t["source_code"]
        
    # Summarize final outcome
    solved = best_sub["all_test_cases_passing"]
    
    attempts_history = [
        {
            "attempt_index": t["attempt_index"],
            "status_name": t["status_name"],
            "tests_passing": t["tests_passing"],
            "source_code": t["source_code"]
        }
        for t in transitions
    ]
    
    return {
        "question_id": first_sub["question_id"],
        "total_attempts": total_attempts,
        "solved": solved,
        "best_attempt_index": submissions.index(best_sub) + 1,
        "best_status": get_status_name(best_sub["status"]),
        "best_tests_passed": best_sub["tests_passing"],
        "first_attempt_code": first_sub["source_code"],
        "final_attempt_code": final_sub["source_code"],
        "best_attempt_code": best_sub["source_code"],
        "timeline_summary": "\n\n".join(timeline_desc),
        "transitions_count": len(transitions),
        "attempts": attempts_history
    }

def get_status_name(status_code):
    """
    Standard Judge0 status codes.
    """
    mapping = {
        1: "In Queue",
        2: "Processing",
        3: "Accepted",
        4: "Wrong Answer",
        5: "Time Limit Exceeded",
        6: "Compilation Error",
        7: "Runtime Error Sigsegv",
        8: "Runtime Error Sigxfsz",
        9: "Runtime Error Sigfpe",
        10: "Runtime Error Sigabrt",
        11: "Runtime Error",
        12: "Other Error",
        13: "Internal Error",
        14: "Exec Format Error",
        15: "Syntax/Compilation Error"
    }
    return mapping.get(status_code, f"Status {status_code}")

def export_correct_submissions(submissions, output_dir="reports/correct_submissions"):
    """
    Exports successful submissions to separate .py files.
    """
    exported_count = 0
    exported_paths = []
    
    for sub in submissions:
        if sub["all_test_cases_passing"]:
            qid = str(sub["question_id"])
            uid = str(sub["user_id"])
            sid = str(sub["submission_id"])
            
            # Create subfolder for question
            q_dir = os.path.join(output_dir, qid)
            os.makedirs(q_dir, exist_ok=True)
            
            filename = f"{uid}_{sid}.py"
            filepath = os.path.join(q_dir, filename)
            
            # Avoid overwriting if it exists
            if not os.path.exists(filepath):
                with open(filepath, "w") as f:
                    f.write(sub["source_code"])
                exported_paths.append(filepath)
                exported_count += 1
                
    return exported_count, exported_paths
