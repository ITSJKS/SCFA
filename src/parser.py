import json
import os
from datetime import datetime

def clean_int(val):
    if val is None:
        return 0
    if isinstance(val, int):
        return val
    try:
        # Remove commas and convert to int
        cleaned = str(val).replace(",", "").strip()
        return int(cleaned) if cleaned else 0
    except ValueError:
        try:
            return int(float(cleaned))
        except ValueError:
            return 0

def clean_bool(val):
    if val is None:
        return False
    if isinstance(val, bool):
        return val
    s = str(val).strip().lower()
    return s in ("true", "1", "yes")

def parse_date(date_str):
    if not date_str:
        return datetime.min
    date_str = date_str.strip()
    
    # Try different date formats
    # E.g. "April 2, 2026, 7:13 PM"
    formats = [
        "%B %d, %Y, %I:%M %p",
        "%B %e, %Y, %I:%M %p", # %e is day of month blank-padded (used on some Unix systems)
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%d %H:%M:%S",
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            pass
            
    # Try ISO fromisoformat
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except ValueError:
        pass
        
    # Final fallback: return epoch min but don't crash
    return datetime.min

def load_problems_metadata(filepath="data/problems_metadata.json"):
    if os.path.exists(filepath):
        try:
            with open(filepath, "r") as f:
                data = json.load(f)
                # Normalize keys (strip commas, convert to string)
                normalized = {}
                for k, v in data.items():
                    norm_k = k.replace(",", "").strip()
                    normalized[norm_k] = v
                return normalized
        except Exception as e:
            print(f"Warning: Failed to load problems metadata from {filepath}: {e}")
    return {}

def parse_submissions_file(filepath, problems_metadata=None):
    if problems_metadata is None:
        problems_metadata = {}
        
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Submissions file not found: {filepath}")
        
    with open(filepath, "r") as f:
        raw_data = json.load(f)
        
    submissions = []
    for item in raw_data:
        sub_id = clean_int(item.get("id"))
        user_id = clean_int(item.get("user_id"))
        email = str(item.get("email", "")).strip()
        assignment_id = clean_int(item.get("assignment_id"))
        question_id = clean_int(item.get("assignment_question_id"))
        
        # Parse dates
        created_at_str = item.get("created_at", "")
        created_at = parse_date(created_at_str)
        
        eval_completed_at_str = item.get("evaluation_completed_at", "")
        eval_completed_at = parse_date(eval_completed_at_str)
        
        # Clean boolean strings
        passing = clean_bool(item.get("all_test_cases_passing"))
        comp_error = clean_bool(item.get("compilation_error"))
        wrong_sub = clean_bool(item.get("wrong_submission"))
        internal_err = clean_bool(item.get("was_internal_error"))
        
        # Status code and test cases
        status = clean_int(item.get("current_status"))
        tests_passing = clean_int(item.get("number_of_test_cases_passing"))
        
        # Code and errors
        source_code = item.get("source_code", "")
        language_id = clean_int(item.get("language_id"))
        error_msg = item.get("error_message", "")
        ai_suggestion = item.get("ai_suggestion", "")
        
        # Determine language name fallback
        lang_mapping = {
            71: "Python",
            70: "Python",
            54: "C++",
            50: "C",
            62: "Java",
            63: "JavaScript",
            74: "TypeScript",
            73: "Rust",
            60: "Go",
            51: "C#",
            82: "SQL"
        }
        lang_name = lang_mapping.get(language_id, f"Lang {language_id}")
        
        sub = {
            "submission_id": sub_id,
            "user_id": user_id,
            "email": email,
            "assignment_id": assignment_id,
            "question_id": question_id,
            "created_at": created_at,
            "created_at_str": created_at_str,
            "evaluation_completed_at": eval_completed_at,
            "all_test_cases_passing": passing,
            "compilation_error": comp_error,
            "wrong_submission": wrong_sub,
            "was_internal_error": internal_err,
            "status": status,
            "tests_passing": tests_passing,
            "source_code": source_code,
            "language_id": language_id,
            "language_name": lang_name,
            "error_message": error_msg,
            "ai_suggestion": ai_suggestion,
            "coding_playground_id": clean_int(item.get("coding_playground_id")),
            "hash": item.get("hash", "")
        }
        submissions.append(sub)
        
    return submissions

def group_data(submissions, problems_metadata=None):
    if problems_metadata is None:
        problems_metadata = {}
        
    # Group by student
    student_groups = {}
    for sub in submissions:
        email = sub["email"]
        uid = sub["user_id"]
        key = email if email else f"user_{uid}"
        
        if key not in student_groups:
            student_groups[key] = {
                "user_id": uid,
                "email": email,
                "submissions": []
            }
        student_groups[key]["submissions"].append(sub)
        
    # Sort student submissions chronologically
    for student in student_groups.values():
        student["submissions"].sort(key=lambda s: s["created_at"])
        
    # Group by problem
    problem_groups = {}
    for sub in submissions:
        qid = str(sub["question_id"])
        if qid not in problem_groups:
            meta = problems_metadata.get(qid, {})
            problem_groups[qid] = {
                "question_id": sub["question_id"],
                "title": meta.get("title", f"Problem {sub['question_id']}"),
                "description": meta.get("description", "No description provided."),
                "submissions": []
            }
        problem_groups[qid]["submissions"].append(sub)
        
    # Sort problem submissions chronologically
    for prob in problem_groups.values():
        prob["submissions"].sort(key=lambda s: s["created_at"])
        
    return student_groups, problem_groups
