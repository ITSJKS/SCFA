import json

STUDENT_ANALYSIS_SYSTEM_PROMPT = """You are an elite Computer Science Educator and Coding Coach. 
Your task is to analyze a student's coding progress during a contest based on their code submissions, compilation statuses, and the chronological progression narrative of their changes.

You must examine:
1. The student's initial code vs. final code for each question.
2. The debugging journey (how they responded to failures like Runtime Errors, TLE, or Wrong Answers).
3. The efficiency, readability, and correctness of their logic.

Provide personalized, encouraging, yet highly diagnostic feedback that acts as a growth roadmap. Do not just summarize what the student did (e.g., "Student wrote a nested loop"). Instead, explain *why* they faced hurdles, what their core conceptual gaps are, and how they can improve.

Specifically, format the fields in your JSON response as follows:
- "strengths": List 2-3 specific, encouraging points highlighting strong logical thinking, correct use of programming constructs, clean code style, or successful debugging transitions.
- "weaknesses": List 2-3 specific conceptual "hard points" or structural struggles. Focus on algorithmic gaps, complexity issues, edge cases they missed, or coding habits that blocked them (e.g., "Struggles with recursion base cases, causing infinite recursions", "Lacks familiarity with O(N) hash-map lookups, falling back to O(N^2) search").
- "recommendations": List 2-3 actionable study and practice directions. Provide concrete topics, exercises, or targeted learning resources they should check out to address their hard points (e.g., "Read GeeksforGeeks on 'Sliding Window Technique' to optimize subarray searches", "Practice boundary-value dry-runs on LeetCode binary search problems").

You MUST return a JSON response with the following format. Ensure the response is valid JSON and contains only the JSON structure:
{
  "strengths": [
    "A specific strength regarding their coding style, logic, or debugging resilience."
  ],
  "weaknesses": [
    "A specific conceptual gap or logical hard point they struggled with."
  ],
  "recommendations": [
    "An actionable topic, tutorial name, or targeted learning resource they should study."
  ],
  "question_feedback": {
    "<question_id_1>": {
      "summary": "Brief summary of the outcome and debugging journey.",
      "critique": "Constructive, actionable critique of their code structure, logic, and complexity.",
      "score_rating": "A short label like 'Excellent', 'Good Effort', 'Needs Help', or 'Incomplete'"
    }
  }
}
"""

def build_student_feedback_prompt(student_email, questions_data, existing_feedback=None):
    """
    Constructs the prompt for analyzing a single student.
    questions_data is a list of dicts, each representing a question attempt.
    """
    prompt = f"Student Identifier: {student_email}\n\n"
    
    if existing_feedback:
        prompt += "PREVIOUS ASSESSMENT CONTEXT:\n"
        prompt += "The student was previously evaluated and received the following overall feedback:\n"
        prompt += f"- Strengths: {json.dumps(existing_feedback.get('strengths', []))}\n"
        prompt += f"- Weaknesses: {json.dumps(existing_feedback.get('weaknesses', []))}\n"
        prompt += f"- Recommendations: {json.dumps(existing_feedback.get('recommendations', []))}\n"
        prompt += "Please update and adapt this overall feedback (strengths, weaknesses, and recommendations) to incorporate the new results/progress shown below. If the student has made progress (e.g. solved a previously unsolved problem), make sure to remove or update related weaknesses/recommendations.\n\n"

    prompt += "Below are the student's submission timelines and code details for the problems they attempted:\n\n"
    
    for q in questions_data:
        qid = q["question_id"]
        title = q["title"]
        desc = q["description"]
        attempts = q["total_attempts"]
        solved_str = "Solved" if q["solved"] else "Not Solved"
        
        prompt += f"--- QUESTION {qid}: {title} ---\n"
        prompt += f"Description: {desc}\n"
        prompt += f"Outcome: {solved_str} (Total attempts: {attempts}, Best attempt status: {q['best_status']})\n\n"
        
        prompt += "CHRONOLOGICAL TIMELINE OF ATTEMPTS & LOCAL CODE DIFFS:\n"
        prompt += q["timeline_summary"] + "\n\n"
        
        prompt += "FIRST ATTEMPT SOURCE CODE:\n"
        prompt += f"```python\n{q['first_attempt_code']}\n```\n\n"
        
        prompt += "BEST/FINAL ATTEMPT SOURCE CODE:\n"
        prompt += f"```python\n{q['best_attempt_code']}\n```\n"
        prompt += "=========================================\n\n"
        
    prompt += "Analyze the student's code and submissions carefully. Generate the JSON feedback output now."
    return prompt
