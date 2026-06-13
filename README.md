# Student Coding Feedback Analyzer (SCFA)

SCFA is a python CLI and web dashboard system designed to clean, analyze, and generate feedback for students' coding playground submissions from a contest. It uses local code-diffing heuristics to track coding progression timelines, saving API token overhead, and uses OpenAI to generate personalized critiques.

## 🚀 Quick Start

### 1. Setup Virtual Environment and Dependencies
The project uses a local virtual environment `venv` to isolate dependencies:
```bash
# Verify venv exists and install requirements
./venv/bin/pip install -r requirements.txt
```

### 2. Configure Environment
Copy the environment example file and add your `OPENAI_API_KEY`:
```bash
cp .env.example .env
```
Edit `.env`:
```env
OPENAI_API_KEY=your_key_here
```

### 3. Run Analysis
To process a raw JSON submissions file (e.g. the 741-record file):
```bash
./venv/bin/python3 src/main.py analyze --file data/user_x_coding_playground_submissions_2026-06-13T00_43_20.422060959+05_30.json
```

*Note: You can add `--dry-run` to run only the local diff and metric pre-processing without calling the OpenAI API. You can also specify `--limit <N>` to run OpenAI calls on only the first N students to test configurations.*

Successful student submissions are exported to:
`reports/correct_submissions/{question_id}/{student_id}_{submission_id}.py`

### 4. Boot Up the Dashboard
Run the built-in HTTP server to serve the frontend:
```bash
./venv/bin/python3 src/main.py serve
```
Open your browser at **http://localhost:8000** to explore the glowing, dark-themed dashboard.

## 📁 Code Structure

* **`src/parser.py`**: Reads raw submissions, cleans booleans and numerical fields, and groups data by student and problem.
* **`src/analyzer.py`**: Computes code differences (line additions/deletions/replacements) chronologically and extracts key transition milestones.
* **`src/llm_client.py`**: OpenAI client utilizing the cheap, fast `gpt-4o-mini` model with robust mock fallbacks if the API key is not supplied.
* **`src/prompts.py`**: Custom CS-educator prompts.
* **`src/main.py`**: Core CLI entrypoint coordinating the analyzer commands and local dashboard server.
* **`web/`**: Dashboard frontend containing `index.html`, `styles.css`, and `app.js` (featuring search filters, timelines, and diff modal views).
