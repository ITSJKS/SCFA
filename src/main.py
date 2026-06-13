import os
import sys
import json
import argparse
import threading
from datetime import datetime
from fastapi import FastAPI, Request, Query, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import time
import hmac
import hashlib
import base64

# Security Configuration
SECRET_KEY = os.environ.get("SECRET_KEY", "scfa_default_secret_key_123_change_me")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
FACULTY_PASSWORD = os.environ.get("FACULTY_PASSWORD", "faculty123")

class LoginRequest(BaseModel):
    role: str
    password: str

class FeedbackRequest(BaseModel):
    feedback_text: str

def create_token(payload: dict) -> str:
    payload_json = json.dumps(payload)
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode()).decode()
    signature = hmac.new(SECRET_KEY.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{signature}"

def verify_token(token: str) -> dict or None:
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        payload_b64, signature = parts
        expected_sig = hmac.new(SECRET_KEY.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected_sig):
            return None
        payload_json = base64.urlsafe_b64decode(payload_b64.encode()).decode()
        payload = json.loads(payload_json)
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token. Please log in.")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token has expired or is invalid. Please log in.")
    return payload

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src import parser, analyzer, llm_client

DEFAULT_REPORT_DIR = "reports"
DEFAULT_SUBMISSIONS_DIR = "reports/correct_submissions"

# Global state for tracking running background analyses and user aborts
ACTIVE_ANALYSES = {}
ACTIVE_ANALYSES_LOCK = threading.Lock()

def run_analysis(file_path, dry_run=False, student_limit=None, output_dir=None, contest_name=None, program_name=None, cost_limit=0.50, custom_api_key=None):
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
    api_key_configured = (custom_api_key is not None) or (os.environ.get("OPENAI_API_KEY") is not None)
    
    print("\nInitializing local timelines and feedback mock fallbacks...")
    sys.stdout.flush()

    # Pre-populate students_summary with existing analyses or mock fallbacks
    student_timelines_by_email = {}
    for email, s_data in student_groups.items():
        uid = s_data["user_id"]
        s_subs = s_data["submissions"]
        
        # Group submissions of this student by question
        student_q_timeline = {}
        for sub in s_subs:
            qid = str(sub["question_id"])
            student_q_timeline.setdefault(qid, []).append(sub)
        student_timelines_by_email[email] = student_q_timeline
        
        # Check if student already has a valid completed AI analysis checkpoint
        if email in existing_students:
            estudent = existing_students[email]
            if estudent.get("ai_critique_completed") and estudent.get("total_submissions") == len(s_subs):
                students_summary[email] = estudent
                continue

        # Otherwise pre-populate with local timeline analysis (instant, no LLM call) and mock feedback
        questions_analyzed = []
        solved_qids = []
        attempted_qids = []
        for qid, q_subs in student_q_timeline.items():
            timeline_res = analyzer.analyze_student_problem_timeline(
                q_subs, 
                diff_summarizer=None # Instant local diff summary
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
        if email in existing_students and "custom_feedback" in existing_students[email]:
            students_summary[email]["custom_feedback"] = existing_students[email]["custom_feedback"]

    print("Pre-population complete. Running AI feedback loop...")
    sys.stdout.flush()

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

    summary_path = os.path.join(output_dir, "summary.json")

    for idx, (email, s_data) in enumerate(student_groups.items()):
        # 1. Check user abort flag
        is_aborted = False
        with ACTIVE_ANALYSES_LOCK:
            if contest_key in ACTIVE_ANALYSES and ACTIVE_ANALYSES[contest_key].get("aborted"):
                is_aborted = True
        if is_aborted:
            print(f"🛑 Analysis aborted by user. Exiting loop at student {idx+1}/{len(student_groups)}.")
            sys.stdout.flush()
            aborted_by_user = True
            break

        # 2. Check cost limit
        cost_info = llm_client.get_current_cost()
        if cost_info["cost_usd"] >= cost_limit:
            print(f"⚠️ OpenAI cost limit of ${cost_limit:.4f} reached. Stopping remaining AI calls.")
            sys.stdout.flush()
            cost_limit_reached = True
            break

        # If student already has a completed AI critique from previous run, skip them
        if students_summary[email]["ai_critique_completed"]:
            processed_count += 1
            with ACTIVE_ANALYSES_LOCK:
                if contest_key in ACTIVE_ANALYSES:
                    ACTIVE_ANALYSES[contest_key]["processed_students"] = processed_count
            continue

        # Run AI feedback for this student
        uid = s_data["user_id"]
        s_subs = s_data["submissions"]
        questions_analyzed = students_summary[email]["attempts_details"]
        
        # Determine whether to call OpenAI API
        use_mock = dry_run or not api_key_configured
        if student_limit is not None and processed_count >= student_limit:
            use_mock = True

        if not use_mock:
            print(f"[{idx+1}/{len(student_groups)}] Generating AI feedback for student: {email}")
            sys.stdout.flush()
            
            # Lazily generate LLM diff summaries only for the student being analyzed
            questions_analyzed_llm = []
            student_q_timeline = student_timelines_by_email[email]
            for qid, q_subs in student_q_timeline.items():
                timeline_res_llm = analyzer.analyze_student_problem_timeline(
                    q_subs,
                    diff_summarizer=lambda c1, c2: llm_client.summarize_code_change(c1, c2, custom_api_key=custom_api_key)
                )
                meta = problems_metadata.get(qid, {})
                timeline_res_llm["title"] = meta.get("title", f"Problem {qid}")
                timeline_res_llm["description"] = meta.get("description", "No description provided.")
                questions_analyzed_llm.append(timeline_res_llm)
                
            feedback = llm_client.analyze_student_feedback(email, questions_analyzed_llm, custom_api_key=custom_api_key)
            students_summary[email]["attempts_details"] = questions_analyzed_llm
            processed_count += 1
        else:
            feedback = students_summary[email]["feedback"]

        # Update student record with completed AI critique
        students_summary[email]["feedback"] = feedback
        students_summary[email]["ai_critique_completed"] = not use_mock

        # Update real-time background task stats
        current_cost = llm_client.get_current_cost()
        with ACTIVE_ANALYSES_LOCK:
            if contest_key in ACTIVE_ANALYSES:
                ACTIVE_ANALYSES[contest_key]["processed_students"] = processed_count
                ACTIVE_ANALYSES[contest_key]["cost_usd"] = current_cost["cost_usd"]
                ACTIVE_ANALYSES[contest_key]["prompt_tokens"] = current_cost["prompt_tokens"]
                ACTIVE_ANALYSES[contest_key]["completion_tokens"] = current_cost["completion_tokens"]

        # Incremental Save: Write current state to summary.json instantly
        os.makedirs(output_dir, exist_ok=True)
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
                "accumulated_openai_cost_usd": current_cost["cost_usd"],
                "prompt_tokens": current_cost["prompt_tokens"],
                "completion_tokens": current_cost["completion_tokens"],
                "aborted_by_user": aborted_by_user,
                "cost_limit_reached": cost_limit_reached
            },
            "problems": problems_summary,
            "students": students_summary
        }
        with open(summary_path, "w") as f:
            json.dump(report_data, f, indent=2)

    # 7. Final compilation and status save (handles case when dry_run is true or no students were analyzed)
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

    with open(summary_path, "w") as f:
        json.dump(report_data, f, indent=2)
        
    print(f"\n✅ Analysis complete!")
    print(f"📊 Contest summary saved to: {summary_path}")
    sys.stdout.flush()
    
    return report_data
        
def start_analysis_in_background(file_path, dry_run, contest_name, program_name, cost_limit=0.50, custom_api_key=None):
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
        args=(file_path, dry_run, contest_name, program_name, contest_key, cost_limit, custom_api_key)
    )
    thread.daemon = True
    thread.start()
    return contest_key

def run_analysis_worker(file_path, dry_run, contest_name, program_name, contest_key, cost_limit, custom_api_key):
    try:
        run_analysis(
            file_path,
            dry_run=dry_run,
            contest_name=contest_name,
            program_name=program_name,
            cost_limit=cost_limit,
            custom_api_key=custom_api_key
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

app = FastAPI(title="Student Coding Feedback API")

# Enable CORS for Vite dev server proxy or direct access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/login")
async def login(req: LoginRequest):
    if req.role == "admin":
        if req.password == ADMIN_PASSWORD:
            token = create_token({"role": "admin", "exp": time.time() + 86400})
            return {"success": True, "token": token, "role": "admin"}
    elif req.role == "faculty":
        if req.password == FACULTY_PASSWORD:
            token = create_token({"role": "faculty", "exp": time.time() + 86400})
            return {"success": True, "token": token, "role": "faculty"}
    raise HTTPException(status_code=401, detail="Invalid role or password.")

@app.get("/api/analysis-status")
async def get_analysis_status(contest_key: str = Query(...), current_user: dict = Depends(get_current_user)):
    with ACTIVE_ANALYSES_LOCK:
        status_info = ACTIVE_ANALYSES.get(contest_key, {
            "status": "idle",
            "processed_students": 0,
            "total_students": 0,
            "cost_usd": 0.0,
            "prompt_tokens": 0,
            "completion_tokens": 0
        })
    return status_info

@app.get("/api/contests")
async def get_contests(current_user: dict = Depends(get_current_user)):
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
    return contests

@app.get("/api/progress")
async def get_progress(program: str = Query("All"), current_user: dict = Depends(get_current_user)):
    progress_data = {
        "program_name": program,
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
                            
                            if program == "All" or prog_name == program:
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
            
    return progress_data

@app.post("/api/upload")
async def upload_contest(
    request: Request,
    filename: str = Query("contest.json"),
    contest_name: str = Query(None),
    program_name: str = Query(None),
    cost_limit: float = Query(0.50),
    run_ai: bool = Query(True),
    x_openai_api_key: str = Header(None),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ("admin", "faculty"):
        raise HTTPException(status_code=403, detail="Permission denied.")
    try:
        post_data = await request.body()
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
            
        # Run the analysis in the background (role-based rules)
        if current_user["role"] == "admin":
            has_key = os.environ.get("OPENAI_API_KEY") is not None
            dry_run = not (run_ai and has_key)
            custom_api_key = None
        else:  # faculty
            has_key = x_openai_api_key is not None
            dry_run = not (run_ai and has_key)
            custom_api_key = x_openai_api_key if has_key else None
        
        contest_key = start_analysis_in_background(
            file_path, 
            dry_run=dry_run, 
            contest_name=contest_name, 
            program_name=program_name,
            cost_limit=cost_limit,
            custom_api_key=custom_api_key
        )
        
        return {
            "success": True,
            "contest_key": contest_key,
            "message": "Contest uploaded. AI analysis has started in the background."
        }
    except Exception as e:
        print(f"Error handling file upload: {e}")
        raise HTTPException(status_code=500, detail=f"Server error during upload: {str(e)}")

@app.post("/api/reanalyze")
async def reanalyze_contest(
    contest_key: str = Query(...),
    cost_limit: float = Query(0.50),
    x_openai_api_key: str = Header(None),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only Admins can trigger OpenAI critiques.")
    try:
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
            
        has_key = os.environ.get("OPENAI_API_KEY") is not None
        if not has_key:
            raise Exception("No server OpenAI API key is configured. Cannot perform AI critique.")
        
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
            cost_limit=cost_limit,
            custom_api_key=None # Admin only uses server key
        )
        
        return {
            "success": True,
            "contest_key": contest_key,
            "message": "AI analysis started in the background."
        }
    except Exception as e:
        print(f"Error during re-analysis: {e}")
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

@app.post("/api/abort-analysis")
async def abort_analysis(contest_key: str = Query(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only Admins can abort analyses.")
    try:
        with ACTIVE_ANALYSES_LOCK:
            if contest_key in ACTIVE_ANALYSES:
                ACTIVE_ANALYSES[contest_key]["aborted"] = True
                ACTIVE_ANALYSES[contest_key]["status"] = "aborting"
                msg = "Analysis abort requested. Progress will be saved."
            else:
                msg = "No running analysis found for this contest."
        
        return {
            "success": True,
            "message": msg
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to abort analysis: {str(e)}")

@app.post("/api/analyze-student")
async def analyze_student(
    contest_key: str = Query(...),
    email: str = Query(...),
    x_openai_api_key: str = Header(None),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ("admin", "faculty"):
        raise HTTPException(status_code=403, detail="Permission denied.")
    try:
        # Locate raw file
        raw_filename = f"{contest_key}.json"
        raw_file_path = os.path.join("data", "contests", raw_filename)
        
        summary_path = os.path.join(DEFAULT_REPORT_DIR, "contests", contest_key, "summary.json")
        if not os.path.exists(raw_file_path) and os.path.exists(summary_path):
            with open(summary_path, "r") as f:
                sum_data = json.load(f)
                source_file = sum_data.get("metadata", {}).get("source_file")
                if source_file:
                    raw_file_path = os.path.join("data", "contests", source_file)
                    
        if not os.path.exists(raw_file_path):
            raise Exception(f"Raw submissions file not found for: {contest_key}")
            
        # Determine key to use based on role
        if current_user["role"] == "admin":
            api_key_to_use = os.environ.get("OPENAI_API_KEY")
            if not api_key_to_use:
                raise Exception("No server OpenAI API key configured. Admin cannot perform AI critique.")
        else:  # faculty
            api_key_to_use = x_openai_api_key
            if not api_key_to_use:
                raise Exception("No custom OpenAI API key configured. Faculty cannot perform AI critique. Please configure it in Settings.")
        
        # Load problems metadata
        problems_metadata = parser.load_problems_metadata()
        
        # Parse raw submissions
        submissions = parser.parse_submissions_file(raw_file_path, problems_metadata)
        student_groups, problem_groups = parser.group_data(submissions, problems_metadata)
        
        if email not in student_groups:
            raise Exception(f"Student {email} not found in this contest.")
            
        s_data = student_groups[email]
        uid = s_data["user_id"]
        s_subs = s_data["submissions"]
        
        # Group by question
        student_q_timeline = {}
        for sub in s_subs:
            qid = str(sub["question_id"])
            student_q_timeline.setdefault(qid, []).append(sub)
            
        # Reset LLM client cost tracker
        llm_client.reset_cost_tracker()
        
        # Run timelines with LLM summarizer
        questions_analyzed_llm = []
        solved_qids = []
        attempted_qids = []
        for qid, q_subs in student_q_timeline.items():
            timeline_res = analyzer.analyze_student_problem_timeline(
                q_subs, 
                diff_summarizer=lambda c1, c2: llm_client.summarize_code_change(c1, c2, custom_api_key=api_key_to_use)
            )
            meta = problems_metadata.get(qid, {})
            timeline_res["title"] = meta.get("title", f"Problem {qid}")
            timeline_res["description"] = meta.get("description", "No description provided.")
            questions_analyzed_llm.append(timeline_res)
            attempted_qids.append(qid)
            if timeline_res["solved"]:
                solved_qids.append(qid)
                
        # Call OpenAI for student feedback
        feedback = llm_client.analyze_student_feedback(email, questions_analyzed_llm, custom_api_key=api_key_to_use, raise_on_error=True)
        cost_info = llm_client.get_current_cost()
        
        # Update summary.json
        if not os.path.exists(summary_path):
            raise Exception(f"Contest summary.json not found. Run analysis first.")
            
        with open(summary_path, "r") as f:
            summary_data = json.load(f)
            
        # Preserve custom feedback if it exists
        custom_feedback_exist = summary_data.get("students", {}).get(email, {}).get("custom_feedback")

        # Update specific student
        student_record = {
            "user_id": uid,
            "email": email,
            "total_submissions": len(s_subs),
            "solved_count": len(solved_qids),
            "attempted_count": len(attempted_qids),
            "solved_questions": solved_qids,
            "attempted_questions": attempted_qids,
            "feedback": feedback,
            "attempts_details": questions_analyzed_llm,
            "ai_critique_completed": True
        }
        if custom_feedback_exist:
            student_record["custom_feedback"] = custom_feedback_exist
            
        summary_data["students"][email] = student_record
        
        # Update metadata costs
        metadata = summary_data.get("metadata", {})
        metadata["accumulated_openai_cost_usd"] = metadata.get("accumulated_openai_cost_usd", 0.0) + cost_info["cost_usd"]
        metadata["prompt_tokens"] = metadata.get("prompt_tokens", 0) + cost_info["prompt_tokens"]
        metadata["completion_tokens"] = metadata.get("completion_tokens", 0) + cost_info["completion_tokens"]
        metadata["openai_api_used"] = True
        
        with open(summary_path, "w") as f:
            json.dump(summary_data, f, indent=2)
            
        return {
            "success": True,
            "student_data": student_record,
            "cost_usd": cost_info["cost_usd"],
            "prompt_tokens": cost_info["prompt_tokens"],
            "completion_tokens": cost_info["completion_tokens"]
        }
    except Exception as e:
        print(f"Error analyzing single student: {e}")
        raise HTTPException(status_code=500, detail=f"Single student analysis failed: {str(e)}")

@app.get("/api/contests/{contest_key}/summary")
async def get_contest_summary(contest_key: str, current_user: dict = Depends(get_current_user)):
    summary_path = os.path.join(DEFAULT_REPORT_DIR, "contests", contest_key, "summary.json")
    if not os.path.exists(summary_path):
        raise HTTPException(status_code=404, detail="Contest summary not found.")
    try:
        with open(summary_path, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read summary data: {str(e)}")

@app.post("/api/contests/{contest_key}/students/{email}/feedback")
async def save_student_feedback(
    contest_key: str, 
    email: str, 
    req: FeedbackRequest, 
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ("admin", "faculty"):
        raise HTTPException(status_code=403, detail="Permission denied.")
    
    summary_path = os.path.join(DEFAULT_REPORT_DIR, "contests", contest_key, "summary.json")
    if not os.path.exists(summary_path):
        raise HTTPException(status_code=404, detail="Contest summary not found.")
    
    try:
        with open(summary_path, "r") as f:
            data = json.load(f)
        
        if email not in data.get("students", {}):
            raise HTTPException(status_code=404, detail=f"Student {email} not found in this contest.")
        
        data["students"][email]["custom_feedback"] = req.feedback_text
        
        with open(summary_path, "w") as f:
            json.dump(data, f, indent=2)
            
        return {"success": True, "message": "Custom feedback saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save custom feedback: {str(e)}")

@app.delete("/api/contests/{contest_key}")
async def delete_contest(contest_key: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only Admins can delete contests.")
    
    raw_filename = f"{contest_key}.json"
    raw_file_path = os.path.join("data", "contests", raw_filename)
    deleted_raw = False
    if os.path.exists(raw_file_path):
        try:
            os.remove(raw_file_path)
            deleted_raw = True
        except Exception as e:
            print(f"Error removing raw file {raw_file_path}: {e}")
            
    summary_path = os.path.join(DEFAULT_REPORT_DIR, "contests", contest_key, "summary.json")
    if os.path.exists(summary_path):
        try:
            with open(summary_path, "r") as f:
                sum_data = json.load(f)
                source_file = sum_data.get("metadata", {}).get("source_file")
                if source_file and source_file != raw_filename:
                    mapped_file_path = os.path.join("data", "contests", source_file)
                    if os.path.exists(mapped_file_path):
                        os.remove(mapped_file_path)
                        deleted_raw = True
        except Exception:
            pass

    report_folder = os.path.join(DEFAULT_REPORT_DIR, "contests", contest_key)
    deleted_report = False
    if os.path.exists(report_folder):
        import shutil
        try:
            shutil.rmtree(report_folder)
            deleted_report = True
        except Exception as e:
            print(f"Error removing report folder {report_folder}: {e}")
            
    if not deleted_raw and not deleted_report:
        raise HTTPException(status_code=404, detail="Contest records not found.")
        
    return {"success": True, "message": f"Contest {contest_key} has been permanently deleted."}

# Serve React static distribution folder in production if compiled
if os.path.exists("frontend/dist"):
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")

def start_server(port=8000):
    print(f"\n==================================================")
    print(f"🖥️  FastAPI Backend Server is running!")
    print(f"🔗 Access the app at: http://localhost:{port}")
    print(f"Press Ctrl+C to stop the server.")
    print(f"==================================================\n")
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=True, reload_dirs=["src"])

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

