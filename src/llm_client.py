import os
import json
import difflib
from dotenv import load_dotenv
from openai import OpenAI
from src.prompts import STUDENT_ANALYSIS_SYSTEM_PROMPT, build_student_feedback_prompt

import threading

# Load environment variables from .env
load_dotenv()

# Thread-local cost tracking to ensure safety in parallel analysis threads
_thread_local = threading.local()

def _get_tracker():
    if not hasattr(_thread_local, "cost_tracker"):
        _thread_local.cost_tracker = {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "cost_usd": 0.0
        }
    return _thread_local.cost_tracker

def reset_cost_tracker():
    _thread_local.cost_tracker = {
        "prompt_tokens": 0,
        "completion_tokens": 0,
        "cost_usd": 0.0
    }

def get_current_cost():
    return _get_tracker()

def _record_completions_usage(response):
    if not response or not hasattr(response, 'usage') or not response.usage:
        return
    
    prompt_tokens = response.usage.prompt_tokens
    completion_tokens = response.usage.completion_tokens
    
    tracker = _get_tracker()
    tracker["prompt_tokens"] += prompt_tokens
    tracker["completion_tokens"] += completion_tokens
    
    # Pricing for gpt-4o-mini: $0.15 / 1M input, $0.60 / 1M output
    in_rate = 0.15 / 1000000
    out_rate = 0.60 / 1000000
    cost = (prompt_tokens * in_rate) + (completion_tokens * out_rate)
    tracker["cost_usd"] += cost

def get_openai_client(custom_api_key=None):
    api_key = custom_api_key or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None
    try:
        return OpenAI(api_key=api_key)
    except Exception as e:
        print(f"Error initializing OpenAI client: {e}")
        return None

def generate_mock_feedback(student_email, questions_data):
    """
    Returns placeholder feedback structure when OpenAI API is not available.
    """
    question_feedback = {}
    for q in questions_data:
        qid = str(q["question_id"])
        solved_str = "solved" if q["solved"] else "attempted but did not solve"
        question_feedback[qid] = {
          "summary": f"Analyzed {q['total_attempts']} attempts locally. Student {solved_str} the problem.",
          "critique": f"Local metrics show {q['total_attempts']} attempts. Best test cases passed: {q['best_tests_passed']}. Configure OPENAI_API_KEY to get detailed code critique.",
          "score_rating": "Completed" if q["solved"] else "Needs Review"
        }
        
    return {
        "strengths": ["Local pre-processing completed. Ready for AI feedback."],
        "weaknesses": ["OpenAI API key missing. Code progression metrics are available locally."],
        "recommendations": ["Set the OPENAI_API_KEY in your .env file to generate personalized feedback, logical critiques, and recommendations."],
        "question_feedback": question_feedback
    }

def analyze_student_feedback(student_email, questions_data, custom_api_key=None, raise_on_error=False, existing_feedback=None):
    """
    Sends the student's problem attempts data to OpenAI to generate personalized feedback.
    """
    client = get_openai_client(custom_api_key)
    if not client:
        if raise_on_error:
            raise Exception("OpenAI API client is not configured or failed to initialize.")
        # Graceful fallback if OpenAI is not configured
        return generate_mock_feedback(student_email, questions_data)
        
    prompt = build_student_feedback_prompt(student_email, questions_data, existing_feedback)
    
    try:
        response = client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": STUDENT_ANALYSIS_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=2000,
            timeout=30.0
        )
        
        _record_completions_usage(response)
        result_text = response.choices[0].message.content
        return json.loads(result_text)
    except Exception as e:
        print(f"Error calling OpenAI API for student {student_email}: {e}")
        if raise_on_error:
            raise e
        # Return fallback mock feedback so the entire pipeline doesn't crash on a single API issue
        return generate_mock_feedback(student_email, questions_data)

def summarize_code_change(code1, code2, custom_api_key=None):
    """
    Summarizes the code changes between two successive submissions using a cheap OpenAI model.
    Falls back to local diff metrics description if OpenAI is not available.
    """
    if not code1:
        client = get_openai_client(custom_api_key)
        if not client:
            return "Initial code written."
        try:
            response = client.chat.completions.create(
                model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a CS coach. Summarize the student's initial coding approach in the provided code block in a single, short, clear sentence. Start your sentence with 'Initial code written: '. Be specific about their approach (e.g., 'Initial code written: sets up a nested loop brute-force search' or 'Initial code written: attempts a recursive solution')."
                    },
                    {"role": "user", "content": f"Code:\n```python\n{code2}\n```"}
                ],
                temperature=0.1,
                max_tokens=60,
                timeout=15.0
            )
            _record_completions_usage(response)
            return response.choices[0].message.content.strip().replace('"', '').replace("'", "")
        except Exception as e:
            print(f"Error calling OpenAI for initial code summary: {e}")
            return "Initial code written."
            
    if code1 == code2:
        return "No changes."
        
    # Generate unified diff patch
    diff = list(difflib.unified_diff(
        code1.splitlines(), 
        code2.splitlines(), 
        fromfile='previous_code', 
        tofile='current_code', 
        lineterm=''
    ))
    diff_patch = "\n".join(diff)
    
    if not diff_patch.strip():
        return "No functional line changes."
        
    client = get_openai_client(custom_api_key)
    if not client:
        # Fallback to local diff characterization
        from src.analyzer import compute_diff
        return compute_diff(code1, code2)
        
    try:
        response = client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {
                    "role": "system", 
                    "content": "You are a CS coach. Describe the student's logic change in the diff patch in a single, short, clear sentence. Be specific about what variables, conditions, or algorithms changed. Do not write generic phrases like 'Updated code'."
                },
                {"role": "user", "content": f"Diff patch:\n```diff\n{diff_patch}\n```"}
            ],
            temperature=0.1,
            max_tokens=60,
            timeout=15.0
        )
        _record_completions_usage(response)
        return response.choices[0].message.content.strip().replace('"', '').replace("'", "")
    except Exception as e:
        print(f"Error calling OpenAI for diff summary: {e}")
        from src.analyzer import compute_diff
        return compute_diff(code1, code2)

