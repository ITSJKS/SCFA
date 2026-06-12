# Student Coding Feedback Analysis (SCFA) Context

This repository contains the **Student Coding Feedback Analysis (SCFA)** toolkit. It provides a CLI pipeline and an interactive, dark-themed dashboard to parse, pre-process, analyze, and generate AI-driven personalized feedback for student contest coding playground submissions.

---

## 1. Project Purpose & Core Workflow

The toolkit solves the problem of analyzing large-scale student contest submissions by grouping attempts chronological-by-student and problem-by-problem, calculating diff narratives between attempts, and feeding consolidated context to OpenAI's cheap/efficient `gpt-4o-mini` model for structural critique.

The core workflow consists of:
1. **Upload / Ingestion**: Upload raw Metabase playground submission JSONs via the web UI or place them directly in `data/contests/`.
2. **Parsing & Normalization**: Clean dates, map status codes, and group data student-wise and problem-wise using `src/parser.py`.
3. **Timeline & Diff Processing**: Generate attempt-by-attempt timelines, compute unified diff logs between consecutive attempts, and extract successful solutions to organized `.py` files using `src/analyzer.py`.
4. **AI Critique Pipeline**: Run structured LLM critique prompts to extract strengths, weaknesses, and concrete recommendations using `src/llm_client.py`.
5. **Interactive Visualization**: Serve and explore contest metrics, student metrics, timelines, and diff transitions using the custom python server and web dashboard.

---

## 2. Technical Architecture & File Structure

```text
├── .env.example            # Environment variables template (API keys, ports)
├── README.md               # Main developer quickstart guide
├── AGENTS.md               # Master reference and agent instruction guide (this file)
├── requirements.txt        # Minimal python package dependencies (openai, python-dotenv)
├── src/                    # CLI and backend service
│   ├── main.py             # CLI Entrypoint & Custom HTTP static / API server
│   ├── parser.py           # Ingestion & validation parser for playground submissions
│   ├── analyzer.py         # Unified diff generator & timeline builder
│   ├── llm_client.py       # OpenAI client wrapper with dry-run fallbacks
│   └── prompts.py          # System prompts for structured AI evaluations
├── web/                    # Dashboard UI
│   ├── index.html          # Dashboard markup (glassmorphic dark-theme)
│   ├── styles.css          # Theme design styles, animations & responsive grid
│   └── app.js              # State manager, file uploader, timeline & modal renderer
├── data/                   # Input playground submissions
│   ├── contests/           # Uploaded/stored raw JSON contests
│   └── problems_metadata.json # Optional problem mapping metadata
└── reports/                # Saved outputs
    ├── contest_summary.json # Last active contest report
    └── contests/           # Individual contest keys containing:
        ├── summary.json    # Complete parsed/evaluated metrics database
        └── correct_submissions/ # Extracted successful python code
```

---

## 3. CLI Commands Reference

Use the local python virtual environment to run:

```bash
# Set up virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Analyze Submission Data
Parses raw contest submission playground data, exports successful code, and runs AI critiques.

```bash
# Run analysis (full mode - requires OPENAI_API_KEY)
python3 src/main.py analyze --file data/user_x_coding_playground_submissions_2026-06-13T00_43_20.422060959+05_30.json

# Run analysis in Dry-Run mode (uses structural local fallback critiques without API cost)
python3 src/main.py analyze --file data/user_x_coding_playground_submissions_2026-06-13T00_43_20.422060959+05_30.json --dry-run

# Limit analysis to a small set of students for testing
python3 src/main.py analyze --file data/user_x_coding_playground_submissions_2026-06-13T00_43_20.422060959+05_30.json --limit 3
```

### Start Dashboard Server
Launches the custom local python static and API web server to explore contest results.

```bash
# Start server on custom port (default: 8001)
python3 src/main.py serve --port 8001
```

---

## 4. Key Implementation Details & Enhancements

* **Multipart Upload**: To avoid python's deprecated `cgi` module (removed in Python 3.13), uploads are handled by streaming raw JSON files as JSON request bodies to `/api/upload?filename=XYZ`, keeping the server clean and robust.
* **Timeline Diffs**: Attempt 1 directly embeds and renders the student's initial source code, rather than showing a placeholder. Subsequent attempts render inline unified modifications (added, deleted, modified lines).
* **Cost Efficiency**: Unified diff logs are kept concise to feed minimal context tokens to `gpt-4o-mini`, allowing full evaluations for less than $0.08 per 100-student contest.
