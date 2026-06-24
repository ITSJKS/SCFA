import os
import re
import html
import json
import requests

class MetabaseClient:
    def __init__(self, base_url=None, session_token=None, username=None, password=None):
        self.base_url = (base_url or os.environ.get("METABASE_URL", "https://metabase-lierhfgoeiwhr.newtonschool.co")).rstrip("/")
        self.session_token = session_token or os.environ.get("METABASE_SESSION", "")
        self.username = username or os.environ.get("METABASE_USERNAME", "")
        self.password = password or os.environ.get("METABASE_PASSWORD", "")
        self.session = requests.Session()
        
    def authenticate(self):
        """Authenticates with Metabase using session token or username/password."""
        if self.session_token:
            self.session.headers.update({"X-Metabase-Session": self.session_token})
            return True
            
        if self.username and self.password:
            try:
                url = f"{self.base_url}/api/session"
                resp = self.session.post(url, json={"username": self.username, "password": self.password})
                if resp.status_code == 200:
                    self.session_token = resp.json().get("id")
                    self.session.headers.update({"X-Metabase-Session": self.session_token})
                    return True
                else:
                    print(f"Failed to authenticate Metabase: {resp.status_code} {resp.text}")
            except Exception as e:
                print(f"Error authenticating Metabase: {e}")
        return False

    def query_card(self, card_id, parameters=None):
        """Queries a Metabase card by ID with optional dictionary of parameters."""
        if not self.authenticate():
            raise Exception("Metabase client is not authenticated. Please configure session_token or credentials.")
            
        url = f"{self.base_url}/api/card/{card_id}/query"
        payload = {}
        
        if parameters:
            mb_params = []
            for k, v in parameters.items():
                mb_params.append({
                    "type": "category",
                    "target": ["variable", ["template-tag", k]],
                    "value": v
                })
            payload["parameters"] = mb_params
            
        resp = self.session.post(url, json=payload)
        if resp.status_code in (200, 202):
            return resp.json()
        else:
            raise Exception(f"Query failed: {resp.status_code} {resp.text}")

def clean_html_to_markdown(text):
    """Utility to strip simple HTML tags and clean up formatting for LLM usage."""
    if not text:
        return ""
    # Replace standard breaks with newlines
    text = re.sub(r"<br\s*/?>", "\n", text)
    # Replace inlineMath tags with markdown backticks
    text = re.sub(r"<inline[mM]ath>", "`", text)
    text = re.sub(r"</inline[mM]ath>", "`", text)
    # Replace list tags
    text = re.sub(r"<li>", "- ", text)
    text = re.sub(r"</li>", "\n", text)
    # Remove all other HTML tags safely without stripping inequality signs like <=
    text = re.sub(r"</?[a-zA-Z][a-zA-Z0-9\-]*\b[^>]*>", "", text)
    # Unescape HTML entities (e.g. &#39; to ')
    text = html.unescape(text)
    return text.strip()

def transform_metabase_response(response_json):
    """
    Transforms a standard Metabase query response into the SCFA problems_metadata format.
    """
    data = response_json.get("data", {})
    rows = data.get("rows", [])
    cols = data.get("cols", [])
    
    # Map column name to index
    col_map = {col["name"]: idx for idx, col in enumerate(cols)}
    
    problems_metadata = {}
    for row in rows:
        # Extract row fields by index
        q_id = str(row[col_map["question_id"]])
        title = row[col_map["question_title"]]
        
        # Clean HTML fields to clean text/markdown
        desc = clean_html_to_markdown(row[col_map.get("description", 3)])
        constraints = clean_html_to_markdown(row[col_map.get("constraints", 4)])
        example = clean_html_to_markdown(row[col_map.get("example", 5)])
        
        # Combine example/input/output into a single comprehensive description/prompt if needed
        # Or attach them as distinct helper keys
        problems_metadata[q_id] = {
            "title": title,
            "description": desc,
            "constraints": constraints,
            "optimal_approach": "", # To be filled in manually or by LLM
            "example": example
        }
        
    return problems_metadata

def transform_submissions_response(response_json):
    """
    Transforms Card 8751 Metabase response into the standard SCFA submissions JSON format.
    """
    data = response_json.get("data", {})
    rows = data.get("rows", [])
    cols = data.get("cols", [])
    
    col_map = {col["name"]: idx for idx, col in enumerate(cols)}
    
    submissions = []
    for row in rows:
        def get_val(col_name, default=""):
            if col_name in col_map:
                val = row[col_map[col_name]]
                return val if val is not None else default
            return default
            
        submissions.append({
            "user_id": str(get_val("user_id")),
            "email": str(get_val("email")),
            "id": str(get_val("id", get_val("submission_id"))),
            "hash": str(get_val("hash")),
            "source_code": str(get_val("source_code")),
            "language_id": str(get_val("language_id")),
            "created_at": str(get_val("created_at")),
            "coding_playground_id": str(get_val("coding_playground_id")),
            "all_test_cases_passing": str(get_val("all_test_cases_passing")).lower(),
            "compilation_error": str(get_val("compilation_error")).lower(),
            "current_status": str(get_val("current_status")),
            "number_of_test_cases_passing": str(get_val("number_of_test_cases_passing")),
            "wrong_submission": str(get_val("wrong_submission")).lower(),
            "assignment_id": str(get_val("assignment_id")),
            "assignment_question_id": str(get_val("assignment_question_id", get_val("question_id"))),
            "was_internal_error": str(get_val("was_internal_error")).lower(),
            "evaluation_completed_at": str(get_val("evaluation_completed_at")),
            "error_message": str(get_val("error_message")),
            "ai_suggestion": str(get_val("ai_suggestion"))
        })
        
    return submissions

def transform_mock_response(response_json):
    """
    Transforms Card 9146 Metabase response into the standard SCFA AI Mock JSON format.
    """
    data = response_json.get("data", {})
    rows = data.get("rows", [])
    cols = data.get("cols", [])
    
    col_map = {col["name"]: idx for idx, col in enumerate(cols)}
    
    mocks = []
    for row in rows:
        def get_val(col_name, default=""):
            if col_name in col_map:
                val = row[col_map[col_name]]
                return val if val is not None else default
            return default
            
        mocks.append({
            "user_id": str(get_val("user_id")),
            "first_name": str(get_val("first_name")),
            "last_name": str(get_val("last_name")),
            "email": str(get_val("email")),
            "one_to_one_id": str(get_val("one_to_one_id")),
            "start_timestamp": str(get_val("start_timestamp")),
            "end_timestamp": str(get_val("end_timestamp")),
            "actual_duration": str(get_val("actual_duration")),
            "rating": str(get_val("rating")),
            "o2o_hash": str(get_val("o2o_hash")),
            "o2o_title": str(get_val("o2o_title")),
            "reg_college": str(get_val("reg_college")),
            "verdict": str(get_val("verdict")),
            "communication_score": str(get_val("communication_score")),
            "override_audio_recording_url": str(get_val("override_audio_recording_url")),
            "hr_report_link": str(get_val("hr_report_link")),
            "phone_number": str(get_val("phone_number"))
        })
        
    return mocks
