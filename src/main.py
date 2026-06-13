import os
import sys
import json
import argparse
import http.server
import socketserver
import threading
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src import parser, analyzer, llm_client

DEFAULT_REPORT_DIR = "reports"
DEFAULT_SUBMISSIONS_DIR = "reports/correct_submissions"

# Global state for tracking running background analyses and user aborts
ACTIVE_ANALYSES = {}
ACTIVE_ANALYSES_LOCK = threading.Lock()

def run_analysis(file_path, dry_run=False, student_limit=None, output_dir=None, contest_name=None, program_name=None, cost_limit=0.50):
    print(f"🚀 Starting analysis for submissions file: {file_path}")
    print(f"Dry run: {dry_run}")
    if student_limit:
        print(f"Student limit: {student_limit} (AI feedback will only run for first {student_limit} students)")

    # Reset LLM client cost tracker
    llm_client.reset_cost_tracker()

    # 1. Load problems metadata
    problems_metadata = parser.load_problems_metadata()
    print(f"Loaded {len(problems_metadata)} problem metadata entries.")

    # 2. Parse and clean raw JSON
    try:
        submissions = parser.parse_submissions_file(file_path, problems_metadata)
    except Exception as e:
        print(f"❌ Error parsing submissions file: {e}")
        raise e
    print(f"Parsed {len(submissions)} raw submission records.")

    # Determine folders
    filename_base = os.path.splitext(os.path.basename(file_path))[0]
    contest_key = "".join(c for c in filename_base if c.isalnum() or c in ('-', '_')).strip()
    
    if not contest_name:
        contest_name = contest_key.replace('_', ' ').replace('-', ' ').strip()
        
    if not program_name:
        program_name = "General Contests"

    if output_dir is None:
        output_dir = os.path.join(DEFAULT_REPORT_DIR, "contests", contest_key)
        
    submissions_dir = os.path.join(output_dir, "correct_submissions")

    # Load existing summary.json for checkpoint resume if available
    existing_students = {}
    summary_path = os.path.join(output_dir, "summary.json")
    if os.path.exists(summary_path):
        try:
            with open(summary_path, "r") as f:
                existing_data = json.load(f)
                existing_students = existing_data.get("students", {})
                print(f"🔄 Found checkpoint: Loaded {len(existing_students)} students from existing report to resume/skip completed tasks.")
        except Exception as e:
            print(f"Could not read existing summary.json for checkpoint resume: {e}")

    # 3. Export successful submissions to python files
    print("Saving successful student submissions as .py files...")
    exp_count, exp_paths = analyzer.export_correct_submissions(submissions, submissions_dir)
    print(f"Exported {exp_count} successful source code files to '{submissions_dir}'.")

    # 4. Group data by student and problem
    student_groups, problem_groups = parser.group_data(submissions, problems_metadata)
    print(f"Found {len(student_groups)} unique students and {len(problem_groups)} unique questions.")

    # 5. Process problem-wise metrics
    problems_summary = {}
    for qid, p_data in problem_groups.items():
        p_subs = p_data["submissions"]
        total_p_attempts = len(p_subs)
        unique_students = len(set(s["user_id"] for s in p_subs))
        passing_subs = [s for s in p_subs if s["all_test_cases_passing"]]
        passed_students = len(set(s["user_id"] for s in passing_subs))
        
        # Calculate success metrics
        success_rate = (passed_students / unique_students * 100) if unique_students > 0 else 0.0
        avg_attempts_to_pass = 0
        if passed_students > 0:
            # For students who passed, count their attempts up to their first passing submission
            student_attempts_count = []
            for uid in set(s["user_id"] for s in passing_subs):
                student_subs = [s for s in p_subs if s["user_id"] == uid]
                # count submissions until the first passing one
                attempts = 0
                for s in student_subs:
                    attempts += 1
                    if s["all_test_cases_passing"]:
                        break
                student_attempts_count.append(attempts)
            avg_attempts_to_pass = sum(student_attempts_count) / len(student_attempts_count)

        # Count status distribution
        status_counts = {}
        for s in p_subs:
            s_name = analyzer.get_status_name(s["status"])
            status_counts[s_name] = status_counts.get(s_name, 0) + 1

        problems_summary[qid] = {
            "question_id": qid,
            "title": p_data["title"],
            "description": p_data["description"],
            "total_attempts": total_p_attempts,
            "unique_students": unique_students,
            "passed_students": passed_students,
            "success_rate_percent": round(success_rate, 1),
            "avg_attempts_to_pass": round(avg_attempts_to_pass, 1),
            "status_distribution": status_counts
        }

    # 6. Process student-wise timelines and generate feedback
    students_summary = {}
    api_key_configured = os.environ.get("OPENAI_API_KEY") is not None
    
    print("\nAnalyzing student timelines and running feedback engine...")
    processed_count = 0
    aborted_by_user = False
    cost_limit_reached = False

    # Initialize task info
    with ACTIVE_ANALYSES_LOCK:
        ACTIVE_ANALYSES[contest_key] = {
            "status": "running",
            "processed_students": 0,
            "total_students": len(student_groups),
            "cost_usd": 0.0,
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "aborted": False
        }

    for idx, (email, s_data) in enumerate(student_groups.items()):
        # 1. Check user abort flag
        is_aborted = False
        with ACTIVE_ANALYSES_LOCK:
            if contest_key in ACTIVE_ANALYSES and ACTIVE_ANALYSES[contest_key].get("aborted"):
                is_aborted = True
        if is_aborted:
            print(f"🛑 Analysis aborted by user. Exiting at student {idx+1}/{len(student_groups)}.")
            aborted_by_user = True
            break

        # 2. Check cost limit
        cost_info = llm_client.get_current_cost()
        if cost_info["cost_usd"] >= cost_limit:
            print(f"⚠️ OpenAI cost limit of ${cost_limit:.4f} reached (Current: ${cost_info['cost_usd']:.4f}). Stopping AI calls.")
            cost_limit_reached = True
            break

        uid = s_data["user_id"]
        s_subs = s_data["submissions"]
        
        # 3. Check resume checkpoint (skip already completed students)
        if email in existing_students:
            estudent = existing_students[email]
            if estudent.get("ai_critique_completed") and estudent.get("total_submissions") == len(s_subs):
                print(f"skip [{idx+1}/{len(student_groups)}]: Student {email} already analyzed. Skipping.")
                students_summary[email] = estudent
                processed_count += 1
                
                with ACTIVE_ANALYSES_LOCK:
                    if contest_key in ACTIVE_ANALYSES:
                        ACTIVE_ANALYSES[contest_key]["processed_students"] = processed_count
                continue

        # Group submissions of this student by question
        student_q_timeline = {}
        for sub in s_subs:
            qid = str(sub["question_id"])
            student_q_timeline.setdefault(qid, []).append(sub)
            
        # Analyze timelines for each question attempted by this student
        questions_analyzed = []
        solved_qids = []
        attempted_qids = []
        
        for qid, q_subs in student_q_timeline.items():
            timeline_res = analyzer.analyze_student_problem_timeline(
                q_subs, 
                diff_summarizer=llm_client.summarize_code_change
            )
            
            # Map titles/descriptions
            meta = problems_metadata.get(qid, {})
            timeline_res["title"] = meta.get("title", f"Problem {qid}")
            timeline_res["description"] = meta.get("description", "No description provided.")
            
            questions_analyzed.append(timeline_res)
            attempted_qids.append(qid)
            if timeline_res["solved"]:
                solved_qids.append(qid)
                
        # Determine whether to call OpenAI API
        use_mock = dry_run or not api_key_configured
        if student_limit is not None and processed_count >= student_limit:
            use_mock = True

        if not use_mock:
            print(f"[{idx+1}/{len(student_groups)}] Generating AI feedback for student: {email}")
            feedback = llm_client.analyze_student_feedback(email, questions_analyzed)
            processed_count += 1
        else:
            feedback = llm_client.generate_mock_feedback(email, questions_analyzed)
            
        students_summary[email] = {
            "user_id": uid,
            "email": email,
            "total_submissions": len(s_subs),
            "solved_count": len(solved_qids),
            "attempted_count": len(attempted_qids),
            "solved_questions": solved_qids,
            "attempted_questions": attempted_qids,
            "feedback": feedback,
            "attempts_details": questions_analyzed,
            "ai_critique_completed": not use_mock
        }

        # Update real-time background task stats
        current_cost = llm_client.get_current_cost()
        with ACTIVE_ANALYSES_LOCK:
            if contest_key in ACTIVE_ANALYSES:
                ACTIVE_ANALYSES[contest_key]["processed_students"] = processed_count
                ACTIVE_ANALYSES[contest_key]["cost_usd"] = current_cost["cost_usd"]
                ACTIVE_ANALYSES[contest_key]["prompt_tokens"] = current_cost["prompt_tokens"]
                ACTIVE_ANALYSES[contest_key]["completion_tokens"] = current_cost["completion_tokens"]

    # 4. Fill remaining students using previous summary or fallback mock feedback if aborted or cost limit hit
    for email, s_data in student_groups.items():
        if email in students_summary:
            continue
            
        uid = s_data["user_id"]
        s_subs = s_data["submissions"]
        
        # Check if we can resume from existing summary
        if email in existing_students:
            print(f"Copying existing analysis checkpoint for remaining student {email}")
            students_summary[email] = existing_students[email]
            continue
            
        # Group submissions of this student by question for local timelines
        student_q_timeline = {}
        for sub in s_subs:
            qid = str(sub["question_id"])
            student_q_timeline.setdefault(qid, []).append(sub)
            
        questions_analyzed = []
        solved_qids = []
        attempted_qids = []
        
        for qid, q_subs in student_q_timeline.items():
            timeline_res = analyzer.analyze_student_problem_timeline(
                q_subs, 
                diff_summarizer=llm_client.summarize_code_change
            )
            meta = problems_metadata.get(qid, {})
            timeline_res["title"] = meta.get("title", f"Problem {qid}")
            timeline_res["description"] = meta.get("description", "No description provided.")
            
            questions_analyzed.append(timeline_res)
            attempted_qids.append(qid)
            if timeline_res["solved"]:
                solved_qids.append(qid)
                
        feedback = llm_client.generate_mock_feedback(email, questions_analyzed)
        
        students_summary[email] = {
            "user_id": uid,
            "email": email,
            "total_submissions": len(s_subs),
            "solved_count": len(solved_qids),
            "attempted_count": len(attempted_qids),
            "solved_questions": solved_qids,
            "attempted_questions": attempted_qids,
            "feedback": feedback,
            "attempts_details": questions_analyzed,
            "ai_critique_completed": False
        }

    # 7. Compile report and save
    os.makedirs(output_dir, exist_ok=True)
    
    cost_info = llm_client.get_current_cost()
    report_data = {
        "metadata": {
            "contest_key": contest_key,
            "contest_name": contest_name,
            "program_name": program_name,
            "source_file": os.path.basename(file_path),
            "analyzed_at": datetime.now().isoformat(),
            "total_students": len(student_groups),
            "total_questions": len(problem_groups),
            "total_submissions": len(submissions),
            "dry_run": dry_run,
            "openai_api_used": api_key_configured and not dry_run,
            "accumulated_openai_cost_usd": cost_info["cost_usd"],
            "prompt_tokens": cost_info["prompt_tokens"],
            "completion_tokens": cost_info["completion_tokens"],
            "aborted_by_user": aborted_by_user,
            "cost_limit_reached": cost_limit_reached
        },
        "problems": problems_summary,
        "students": students_summary
    }

    # Save to the contest-specific directory
    summary_path = os.path.join(output_dir, "summary.json")
    with open(summary_path, "w") as f:
        json.dump(report_data, f, indent=2)
        
def start_analysis_in_background(file_path, dry_run, contest_name, program_name, cost_limit=0.50):
    filename_base = os.path.splitext(os.path.basename(file_path))[0]
    contest_key = "".join(c for c in filename_base if c.isalnum() or c in ('-', '_')).strip()
    
    with ACTIVE_ANALYSES_LOCK:
        ACTIVE_ANALYSES[contest_key] = {
            "status": "pending",
            "processed_students": 0,
            "total_students": 0,
            "cost_usd": 0.0,
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "aborted": False
        }
        
    thread = threading.Thread(
        target=run_analysis_worker,
        args=(file_path, dry_run, contest_name, program_name, contest_key, cost_limit)
    )
    thread.daemon = True
    thread.start()
    return contest_key

def run_analysis_worker(file_path, dry_run, contest_name, program_name, contest_key, cost_limit):
    try:
        run_analysis(
            file_path,
            dry_run=dry_run,
            contest_name=contest_name,
            program_name=program_name,
            cost_limit=cost_limit
        )
        with ACTIVE_ANALYSES_LOCK:
            if contest_key in ACTIVE_ANALYSES:
                if ACTIVE_ANALYSES[contest_key].get("aborted"):
                    ACTIVE_ANALYSES[contest_key]["status"] = "aborted"
                else:
                    ACTIVE_ANALYSES[contest_key]["status"] = "completed"
    except Exception as e:
        print(f"Error in analysis worker thread: {e}")
        with ACTIVE_ANALYSES_LOCK:
            if contest_key in ACTIVE_ANALYSES:
                ACTIVE_ANALYSES[contest_key]["status"] = "failed"
                ACTIVE_ANALYSES[contest_key]["error"] = str(e)

class DashboardHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Redirect index requests to /web/index.html
        if self.path == "/" or self.path == "":
            self.send_response(302)
            self.send_header('Location', '/web/index.html')
            self.end_headers()
            return
            
        parsed_url = urlparse(self.path)
        if parsed_url.path == "/api/analysis-status":
            query = parse_qs(parsed_url.query)
            contest_key = query.get("contest_key", [None])[0]
            if not contest_key:
                self.send_error(400, "contest_key parameter required")
                return
                
            with ACTIVE_ANALYSES_LOCK:
                status_info = ACTIVE_ANALYSES.get(contest_key, {
                    "status": "idle",
                    "processed_students": 0,
                    "total_students": 0,
                    "cost_usd": 0.0,
                    "prompt_tokens": 0,
                    "completion_tokens": 0
                })
                
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.end_headers()
            self.wfile.write(json.dumps(status_info).encode('utf-8'))
            return

        if parsed_url.path == "/api/contests":
            contests = []
            contests_dir = os.path.join(DEFAULT_REPORT_DIR, "contests")
            if os.path.exists(contests_dir):
                for folder in sorted(os.listdir(contests_dir)):
                    folder_path = os.path.join(contests_dir, folder)
                    if os.path.isdir(folder_path):
                        summary_path = os.path.join(folder_path, "summary.json")
                        if os.path.exists(summary_path):
                            try:
                                with open(summary_path, "r") as f:
                                    summary_data = json.load(f)
                                    metadata = summary_data.get("metadata", {})
                                    contests.append({
                                        "key": folder,
                                        "contest_name": metadata.get("contest_name", metadata.get("source_file", folder)),
                                        "program_name": metadata.get("program_name", "General Contests"),
                                        "source_file": metadata.get("source_file", folder),
                                        "analyzed_at": metadata.get("analyzed_at", ""),
                                        "total_students": metadata.get("total_students", 0),
                                        "total_questions": metadata.get("total_questions", 0),
                                        "total_submissions": metadata.get("total_submissions", 0)
                                    })
                            except Exception as e:
                                print(f"Error reading summary for contest {folder}: {e}")
                                
            # Sort contests by analyzed_at descending (latest first)
            contests.sort(key=lambda c: c.get("analyzed_at", ""), reverse=True)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.end_headers()
            self.wfile.write(json.dumps(contests).encode('utf-8'))
            return

        if parsed_url.path == "/api/progress":
            query = parse_qs(parsed_url.query)
            target_program = query.get("program", ["All"])[0]
            
            progress_data = {
                "program_name": target_program,
                "contests": [],
                "students": {}
            }
            
            contests_dir = os.path.join(DEFAULT_REPORT_DIR, "contests")
            program_contests = []
            
            if os.path.exists(contests_dir):
                for folder in sorted(os.listdir(contests_dir)):
                    folder_path = os.path.join(contests_dir, folder)
                    if os.path.isdir(folder_path):
                        summary_path = os.path.join(folder_path, "summary.json")
                        if os.path.exists(summary_path):
                            try:
                                with open(summary_path, "r") as f:
                                    contest_data = json.load(f)
                                    meta = contest_data.get("metadata", {})
                                    prog_name = meta.get("program_name", "General Contests")
                                    
                                    if target_program == "All" or prog_name == target_program:
                                        program_contests.append((meta, contest_data))
                            except Exception as e:
                                print(f"Error reading summary for progress: {e}")
            
            # Sort by analyzed_at ascending for chronological progression
            program_contests.sort(key=lambda x: x[0].get("analyzed_at", ""))
            
            for meta, data in program_contests:
                c_key = meta.get("contest_key")
                c_name = meta.get("contest_name")
                total_questions = len(data.get("problems", {}))
                
                progress_data["contests"].append({
                    "contest_key": c_key,
                    "contest_name": c_name,
                    "total_questions": total_questions,
                    "analyzed_at": meta.get("analyzed_at", "")
                })
                
                for email, s_info in data.get("students", {}).items():
                    if email not in progress_data["students"]:
                        progress_data["students"][email] = {
                            "email": email,
                            "user_id": s_info.get("user_id"),
                            "history": {}
                        }
                    progress_data["students"][email]["history"][c_key] = {
                        "solved_count": s_info.get("solved_count", 0),
                        "attempted_count": s_info.get("attempted_count", 0)
                    }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.end_headers()
            self.wfile.write(json.dumps(progress_data).encode('utf-8'))
            return

        return super().do_GET()

    def do_POST(self):
        parsed_url = urlparse(self.path)
        if parsed_url.path == "/api/upload":
            try:
                query = parse_qs(parsed_url.query)
                filename = query.get("filename", ["contest.json"])[0]
                contest_name = query.get("contest_name", [None])[0]
                program_name = query.get("program_name", [None])[0]
                cost_limit = float(query.get("cost_limit", [0.50])[0])
                
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                json_text = post_data.decode("utf-8")
                
                # Validate JSON structure
                json.loads(json_text)
                
                # Save uploaded file
                if contest_name:
                    clean_name = "".join(c if c.isalnum() or c in ('-', '_') else '_' for c in contest_name.strip())
                    clean_name = "_".join(part for part in clean_name.split('_') if part)
                    safe_filename = f"{clean_name}.json"
                else:
                    safe_filename = "".join(c for c in filename if c.isalnum() or c in ('.', '-', '_')).strip()

                os.makedirs("data/contests", exist_ok=True)
                file_path = os.path.join("data/contests", safe_filename)
                
                with open(file_path, "w") as f:
                    f.write(json_text)
                    
                # Run the analysis in the background
                dry_run = os.environ.get("OPENAI_API_KEY") is None
                contest_key = start_analysis_in_background(
                    file_path, 
                    dry_run=dry_run, 
                    contest_name=contest_name, 
                    program_name=program_name,
                    cost_limit=cost_limit
                )
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {
                    "success": True,
                    "contest_key": contest_key,
                    "message": "Contest uploaded. AI analysis has started in the background."
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                print(f"Error handling file upload: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {
                    "success": False,
                    "message": f"Server error during upload: {str(e)}"
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
            return

        if parsed_url.path == "/api/reanalyze":
            try:
                query = parse_qs(parsed_url.query)
                contest_key = query.get("contest_key", [None])[0]
                cost_limit = float(query.get("cost_limit", [0.50])[0])
                if not contest_key:
                    raise Exception("contest_key parameter is required")
                
                # Locate raw file
                raw_filename = f"{contest_key}.json"
                raw_file_path = os.path.join("data", "contests", raw_filename)
                
                if not os.path.exists(raw_file_path):
                    # Try finding source_file in summary.json
                    summary_path = os.path.join(DEFAULT_REPORT_DIR, "contests", contest_key, "summary.json")
                    if os.path.exists(summary_path):
                        with open(summary_path, "r") as f:
                            sum_data = json.load(f)
                            source_file = sum_data.get("metadata", {}).get("source_file")
                            if source_file:
                                raw_file_path = os.path.join("data", "contests", source_file)
                
                if not os.path.exists(raw_file_path):
                    raise Exception(f"Raw submissions file not found for: {contest_key}")
                    
                if os.environ.get("OPENAI_API_KEY") is None:
                    raise Exception("OPENAI_API_KEY environment variable is not configured. Cannot perform AI critique.")
                
                # Fetch original contest and program name
                contest_name = None
                program_name = None
                summary_path = os.path.join(DEFAULT_REPORT_DIR, "contests", contest_key, "summary.json")
                if os.path.exists(summary_path):
                    with open(summary_path, "r") as f:
                        sum_data = json.load(f)
                        meta = sum_data.get("metadata", {})
                        contest_name = meta.get("contest_name")
                        program_name = meta.get("program_name")
                
                start_analysis_in_background(
                    raw_file_path, 
                    dry_run=False, 
                    contest_name=contest_name, 
                    program_name=program_name,
                    cost_limit=cost_limit
                )
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {
                    "success": True,
                    "contest_key": contest_key,
                    "message": "AI analysis started in the background."
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                print(f"Error during re-analysis: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {
                    "success": False,
                    "message": f"AI Analysis failed: {str(e)}"
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
            return

        if parsed_url.path == "/api/abort-analysis":
            try:
                query = parse_qs(parsed_url.query)
                contest_key = query.get("contest_key", [None])[0]
                if not contest_key:
                    raise Exception("contest_key parameter is required")
                
                with ACTIVE_ANALYSES_LOCK:
                    if contest_key in ACTIVE_ANALYSES:
                        ACTIVE_ANALYSES[contest_key]["aborted"] = True
                        ACTIVE_ANALYSES[contest_key]["status"] = "aborting"
                        msg = "Analysis abort requested. Progress will be saved."
                    else:
                        msg = "No running analysis found for this contest."
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {
                    "success": True,
                    "message": msg
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {
                    "success": False,
                    "message": f"Failed to abort analysis: {str(e)}"
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
            return
            
        self.send_error(404, "Endpoint not found")

def start_server(port=8000):
    handler = DashboardHTTPRequestHandler
    # Enable socket address reuse to prevent "Address already in use" errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"\n==================================================")
        print(f"🖥️  Student Coding Feedback Dashboard is running!")
        print(f"🔗 Open your browser at: http://localhost:{port}")
        print(f"Press Ctrl+C to stop the server.")
        print(f"==================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down dashboard server. Bye!")

def main():
    parser_arg = argparse.ArgumentParser(description="Student Coding Feedback Analyzer (SCFA)")
    subparsers = parser_arg.add_subparsers(dest="command", help="Available commands")

    # Analyze subparser
    analyze_parser = subparsers.add_parser("analyze", help="Parse and analyze submissions JSON file")
    analyze_parser.add_argument("--file", required=True, help="Path to submissions JSON file")
    analyze_parser.add_argument("--dry-run", action="store_true", help="Pre-process data locally without calling OpenAI")
    analyze_parser.add_argument("--limit", type=int, default=None, help="Limit number of students analyzed via OpenAI API")
    analyze_parser.add_argument("--name", type=str, default=None, help="Name of the contest")
    analyze_parser.add_argument("--program", type=str, default=None, help="Name of the program/cohort")

    # Serve subparser
    serve_parser = subparsers.add_parser("serve", help="Launch the local web dashboard server")
    serve_parser.add_argument("--port", type=int, default=8000, help="Port to run dashboard server on")

    args = parser_arg.parse_args()

    if args.command == "analyze":
        run_analysis(args.file, args.dry_run, args.limit, contest_name=args.name, program_name=args.program)
    elif args.command == "serve":
        start_server(args.port)
    else:
        parser_arg.print_help()

if __name__ == "__main__":
    main()
