import json

STUDENT_ANALYSIS_SYSTEM_PROMPT = """You are an elite Computer Science Educator and Coding Coach. 
Your task is to analyze a student's coding progress during a contest based on their code submissions, compilation statuses, and the chronological progression narrative of their changes.

You must examine:
1. The student's initial code vs. final code for each question.
2. The debugging journey (how they responded to failures like Runtime Errors, TLE, or Wrong Answers).
3. The efficiency, readability, and correctness of their logic.

Provide personalized, encouraging, yet highly targeted feedback. Focus on identifying their exact conceptual or coding weaknesses (e.g. "struggles with loop termination conditions", "uses suboptimal O(N^2) lists instead of O(1) sets", "does not handle empty array edge cases").

You MUST return a JSON response with the following format. Ensure the response is valid JSON and contains only the JSON structure:
{
  "strengths": [
    "A specific strength regarding their coding style, syntax knowledge, or logic implementation."
  ],
  "weaknesses": [
    "A specific conceptual or logic weakness identified in their work."
  ],
  "recommendations": [
    "An actionable advice, exercise, or topic they should study to improve (e.g., 'Practice dry-running binary search boundary updates')."
  ],
  "question_feedback": {
    "<question_id_1>": {
      "summary": "Brief summary of how they solved or failed to solve the problem (e.g., 'Solved in 3 attempts after fixing a division-by-zero error').",
      "critique": "Constructive code critique focusing on complexity, readability, and specific bugs in their submissions.",
      "score_rating": "A short label like 'Excellent', 'Good Effort', 'Needs Help', or 'Incomplete'"
    }
  }
}
"""

def build_student_feedback_prompt(student_email, questions_data):
    """
    Constructs the prompt for analyzing a single student.
    questions_data is a list of dicts, each representing a question attempt.
    """
    prompt = f"Student Identifier: {student_email}\n\n"
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
