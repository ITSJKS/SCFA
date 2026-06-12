// ==========================================
// SCFA Dashboard Application Logic
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  let appData = null;
  let activeStudentEmail = null;
  let activeQuestionId = null;

  // Cache DOM elements
  const tabButtons = document.querySelectorAll(".nav-tab");
  const tabPanels = document.querySelectorAll(".content-tab-panel");
  const modal = document.getElementById("code-viewer-modal");
  const modalClose = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalCodeDisplay = document.getElementById("modal-code-display");
  const modalDiffDisplay = document.getElementById("modal-diff-display");
  const modalCompareTabs = document.querySelectorAll(".compare-tab");

  // New DOM elements
  const contestSelector = document.getElementById("contest-selector");
  const uploadBtn = document.getElementById("upload-btn");
  const fileInput = document.getElementById("contest-file-input");
  const uploadStatus = document.getElementById("upload-status-indicator");

  // Load available contests list
  async function loadContestsList(selectKey = null) {
    try {
      const res = await fetch("/api/contests");
      if (!res.ok) throw new Error();
      const contests = await res.json();
      
      contestSelector.innerHTML = "";
      if (contests.length === 0) {
        contestSelector.innerHTML = '<option value="">No contests uploaded</option>';
        loadContestData(null);
        return;
      }
      
      contests.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.key;
        opt.textContent = c.contest_name || c.source_file;
        contestSelector.appendChild(opt);
      });
      
      // Auto-select contest
      if (selectKey) {
        contestSelector.value = selectKey;
      } else if (contests.length > 0) {
        contestSelector.value = contests[0].key;
      }
      
      // Load selected contest data
      if (contestSelector.value) {
        loadContestData(contestSelector.value);
      } else {
        loadContestData(null);
      }
    } catch (err) {
      console.error("Failed to fetch contests directory list:", err);
      loadContestData(null);
    }
  }

  // Load specific contest summary report
  async function loadContestData(key) {
    if (!key) {
      const studentDetails = document.getElementById("student-detail-view");
      const problemDetails = document.getElementById("problem-detail-view");
      if (studentDetails) {
        studentDetails.innerHTML = `
          <div class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 40px; color: var(--text-secondary);">
            <span class="material-icons-round" style="font-size: 48px; margin-bottom: 16px; color: var(--accent-cyan);">cloud_upload</span>
            <h3>No Contest Selected</h3>
            <p>Please select a contest from the folder dropdown or upload a new contest JSON file to begin.</p>
          </div>
        `;
      }
      if (problemDetails) {
        problemDetails.innerHTML = `
          <div class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 40px; color: var(--text-secondary);">
            <span class="material-icons-round" style="font-size: 48px; margin-bottom: 16px; color: var(--accent-cyan);">code</span>
            <h3>No Contest Loaded</h3>
            <p>Please upload a contest JSON file to begin.</p>
          </div>
        `;
      }
      document.getElementById("meta-contest-name").textContent = "N/A";
      document.getElementById("meta-file").textContent = "N/A";
      document.getElementById("meta-students").textContent = "-";
      document.getElementById("meta-submissions").textContent = "-";
      document.getElementById("stat-total-students").textContent = "-";
      document.getElementById("stat-total-submissions").textContent = "-";
      document.getElementById("stat-success-rate").textContent = "-";
      document.getElementById("stat-avg-attempts").textContent = "-";
      document.getElementById("problems-table-body").innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No contest data loaded.</td></tr>`;
      document.getElementById("problems-list").innerHTML = `<div class="empty-message">No problems loaded. Select a contest.</div>`;
      document.getElementById("students-list").innerHTML = `<div class="empty-message">No students loaded. Select a contest.</div>`;
      return;
    }
    
    const url = `/reports/contests/${key}/summary.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not find contest summary report.");
      appData = await res.json();
      
      // Reset active selections
      activeStudentEmail = null;
      activeQuestionId = null;
      
      const studentDetails = document.getElementById("student-detail-view");
      const problemDetails = document.getElementById("problem-detail-view");
      
      if (studentDetails) {
        studentDetails.innerHTML = `
          <div class="select-prompt">
            <span class="material-icons-round">account_circle</span>
            <p>Select a student from the sidebar to view their personalized AI feedback and submission history.</p>
          </div>
        `;
      }
      if (problemDetails) {
        problemDetails.innerHTML = `
          <div class="select-prompt">
            <span class="material-icons-round">code</span>
            <p>Select a problem from the list to view its analysis, correct solutions, and statistics.</p>
          </div>
        `;
      }
      
      initDashboard();
    } catch (err) {
      console.error("Error loading contest data:", err);
      alert("Error loading contest data: Please ensure analysis is completed.");
    }
  }

  // Handle contest dropdown selection
  contestSelector.addEventListener("change", () => {
    if (contestSelector.value) {
      loadContestData(contestSelector.value);
    }
  });

  // Handle upload triggers
  uploadBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    if (fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    
    const defaultName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
    const contestName = prompt("Please enter the name of this contest:", defaultName);
    if (contestName === null) {
      fileInput.value = "";
      return;
    }
    const cleanContestName = contestName.trim();
    if (!cleanContestName) {
      alert("Contest name cannot be empty.");
      fileInput.value = "";
      return;
    }
    
    uploadStatus.classList.remove("hidden");
    uploadStatus.textContent = "Analyzing...";
    
    try {
      const text = await file.text();
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&contest_name=${encodeURIComponent(cleanContestName)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: text
      });
      
      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.message || "Failed to analyze.");
      }
      
      uploadStatus.textContent = "Success!";
      setTimeout(() => uploadStatus.classList.add("hidden"), 3000);
      
      // Reload contest list and select the new contest
      await loadContestsList(resData.contest_key);
    } catch (err) {
      console.error(err);
      alert(`Upload Failed: ${err.message}`);
      uploadStatus.classList.add("hidden");
    } finally {
      fileInput.value = ""; // reset input
    }
  });

  // Initial load
  loadContestsList();

  // Tab Navigation
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));
      
      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(`tab-${targetTab}`).classList.add("active");
    });
  });

  // Init Dashboard
  function initDashboard() {
    if (!appData) return;

    // Set header metadata
    document.getElementById("meta-contest-name").textContent = appData.metadata.contest_name || appData.metadata.contest_key || "N/A";
    document.getElementById("meta-file").textContent = appData.metadata.source_file;
    document.getElementById("meta-students").textContent = appData.metadata.total_students;
    document.getElementById("meta-submissions").textContent = appData.metadata.total_submissions;
    
    const aiBadge = document.getElementById("meta-ai-badge");
    if (appData.metadata.openai_api_used) {
      aiBadge.innerHTML = `<span class="material-icons-round">verified</span> AI Feedback Active`;
      aiBadge.className = "meta-item font-green";
    } else {
      aiBadge.innerHTML = `<span class="material-icons-round">warning</span> Local Metrics Only`;
      aiBadge.className = "meta-item font-orange";
    }

    // Render Overview metrics
    renderOverview();

    // Render Problems Explorer
    renderProblems();

    // Render Student Portal
    renderStudents();
  }

  // 1. Render Overview Tab
  function renderOverview() {
    const totalStudents = appData.metadata.total_students;
    const totalSubmissions = appData.metadata.total_submissions;

    document.getElementById("stat-total-students").textContent = totalStudents;
    document.getElementById("stat-total-submissions").textContent = totalSubmissions;

    // Calculate total solved submissions across all student-question timelines
    let totalSolved = 0;
    let successRatesSum = 0;
    let validProblemsCount = 0;

    const probTableBody = document.querySelector("#problems-summary-table tbody");
    probTableBody.innerHTML = "";

    // Render problem summary table
    for (const qid in appData.problems) {
      const p = appData.problems[qid];
      totalSolved += p.passed_students;
      successRatesSum += p.success_rate_percent;
      validProblemsCount++;

      const successRatio = `${p.passed_students}/${p.unique_students}`;
      const rateColor = p.success_rate_percent > 75 ? "font-green" : (p.success_rate_percent < 40 ? "font-rose" : "font-orange");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>#${p.question_id}</strong></td>
        <td>${escapeHTML(p.title)}</td>
        <td>${p.total_attempts}</td>
        <td class="${rateColor}"><strong>${p.success_rate_percent}%</strong></td>
        <td>${p.avg_attempts_to_pass || "N/A"}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>${successRatio}</span>
            <div class="progress-bar-bg" style="width: 80px; height: 6px;">
              <div class="progress-bar-fill ${p.success_rate_percent > 75 ? 'green' : (p.success_rate_percent < 40 ? 'rose' : 'cyan')}" style="width: ${p.success_rate_percent}%"></div>
            </div>
          </div>
        </td>
      `;
      probTableBody.appendChild(tr);
    }

    const avgSuccess = validProblemsCount > 0 ? Math.round(successRatesSum / validProblemsCount) : 0;
    document.getElementById("stat-solved-submissions").textContent = totalSolved;
    document.getElementById("stat-avg-success").textContent = `${avgSuccess}%`;

    // Global Status Distribution Chart
    const statusContainer = document.getElementById("global-status-distribution");
    statusContainer.innerHTML = "";

    // Accumulate status counts
    const globalStatuses = {};
    let totalStatusCount = 0;
    for (const qid in appData.problems) {
      const p = appData.problems[qid];
      for (const status in p.status_distribution) {
        globalStatuses[status] = (globalStatuses[status] || 0) + p.status_distribution[status];
        totalStatusCount += p.status_distribution[status];
      }
    }

    // Sort by count
    const sortedStatuses = Object.entries(globalStatuses).sort((a, b) => b[1] - a[1]);
    
    sortedStatuses.forEach(([name, count]) => {
      const pct = Math.round((count / totalStatusCount) * 100);
      let colorClass = "cyan";
      if (name.includes("Accepted")) colorClass = "green";
      else if (name.includes("Wrong")) colorClass = "rose";
      else if (name.includes("Limit")) colorClass = "orange";
      else if (name.includes("Error") || name.includes("Compile")) colorClass = "purple";

      const item = document.createElement("div");
      item.className = "progress-item";
      item.innerHTML = `
        <div class="progress-info">
          <span class="progress-label">${name}</span>
          <span class="progress-val">${count} (${pct}%)</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill ${colorClass}" style="width: ${pct}%"></div>
        </div>
      `;
      statusContainer.appendChild(item);
    });
  }

  // 2. Render Problems Tab
  function renderProblems() {
    const listContainer = document.getElementById("problems-list");
    listContainer.innerHTML = "";

    for (const qid in appData.problems) {
      const p = appData.problems[qid];
      const div = document.createElement("div");
      div.className = "list-item";
      div.setAttribute("data-qid", qid);
      div.innerHTML = `
        <div class="list-item-title">#${p.question_id} - ${escapeHTML(p.title)}</div>
        <div class="list-item-meta">
          <span>Rate: ${p.success_rate_percent}%</span>
          <span>Attempts: ${p.total_attempts}</span>
        </div>
      `;

      div.addEventListener("click", () => {
        document.querySelectorAll("#problems-list .list-item").forEach(item => item.classList.remove("active"));
        div.classList.add("active");
        renderProblemDetails(qid);
      });
      listContainer.appendChild(div);
    }
  }

  function renderProblemDetails(qid) {
    const p = appData.problems[qid];
    const detailsContainer = document.getElementById("problem-detail-view");

    // Build status list bars
    let statusBars = "";
    const statusEntries = Object.entries(p.status_distribution).sort((a, b) => b[1] - a[1]);
    statusEntries.forEach(([name, count]) => {
      const pct = Math.round((count / p.total_attempts) * 100);
      let colorClass = "cyan";
      if (name.includes("Accepted")) colorClass = "green";
      else if (name.includes("Wrong")) colorClass = "rose";
      else if (name.includes("Limit")) colorClass = "orange";
      else if (name.includes("Error") || name.includes("Compile")) colorClass = "purple";

      statusBars += `
        <div class="progress-item">
          <div class="progress-info">
            <span class="progress-label">${name}</span>
            <span class="progress-val">${count} (${pct}%)</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${colorClass}" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    });

    detailsContainer.innerHTML = `
      <div class="problem-detail">
        <div class="problem-header">
          <div>
            <h2>${escapeHTML(p.title)}</h2>
            <span class="problem-badge">Question ID: #${p.question_id}</span>
          </div>
        </div>

        <div class="problem-grid-stats">
          <div class="prob-stat-card">
            <h4>Success Rate</h4>
            <p class="${p.success_rate_percent > 75 ? 'font-green' : (p.success_rate_percent < 40 ? 'font-rose' : 'font-orange')}">${p.success_rate_percent}%</p>
          </div>
          <div class="prob-stat-card">
            <h4>Total Attempts</h4>
            <p>${p.total_attempts}</p>
          </div>
          <div class="prob-stat-card">
            <h4>Unique Students</h4>
            <p>${p.unique_students}</p>
          </div>
          <div class="prob-stat-card">
            <h4>Avg. Attempts to Pass</h4>
            <p>${p.avg_attempts_to_pass || "N/A"}</p>
          </div>
        </div>

        <div class="problem-description-box">
          <h3>Problem Description (AI Inferred / Loaded)</h3>
          <p>${escapeHTML(p.description)}</p>
        </div>

        <div class="dashboard-card glass" style="margin-top: 10px;">
          <h2>Submission Status Distribution</h2>
          <div class="progress-bar-list">
            ${statusBars || "<p style='color: var(--text-muted)'>No submissions recorded.</p>"}
          </div>
        </div>
      </div>
    `;
  }

  // 3. Render Student Portal Tab
  function renderStudents() {
    const listContainer = document.getElementById("students-list");
    const searchInput = document.getElementById("student-search-input");
    const filterSelect = document.getElementById("student-filter");

    function updateStudentList() {
      const query = searchInput.value.toLowerCase().strip();
      const filter = filterSelect.value;
      
      listContainer.innerHTML = "";

      const students = Object.entries(appData.students);
      
      // Filter list
      const filtered = students.filter(([email, s]) => {
        // Search filter
        const matchSearch = email.toLowerCase().includes(query) || String(s.user_id).includes(query);
        if (!matchSearch) return false;

        // Dropdown filters
        if (filter === "solved-all") {
          return s.solved_count === s.attempted_count && s.attempted_count > 0;
        } else if (filter === "struggling") {
          const rate = s.attempted_count > 0 ? (s.solved_count / s.attempted_count) : 0;
          return rate < 0.5 && s.attempted_count > 0;
        } else if (filter === "high-attempts") {
          return s.total_submissions > 15;
        }
        return true;
      });

      // Sort by email
      filtered.sort((a, b) => a[0].localeCompare(b[0]));

      if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No students found.</div>`;
        return;
      }

      filtered.forEach(([email, s]) => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.setAttribute("data-email", email);
        if (email === activeStudentEmail) div.classList.add("active");

        const solvedRatio = `${s.solved_count}/${s.attempted_count}`;
        const pct = s.attempted_count > 0 ? Math.round((s.solved_count / s.attempted_count) * 100) : 0;
        const rateColor = pct > 75 ? "font-green" : (pct < 40 ? "font-rose" : "font-orange");

        div.innerHTML = `
          <div class="list-item-title">${escapeHTML(email)}</div>
          <div class="list-item-meta">
            <span>ID: ${s.user_id}</span>
            <span class="${rateColor}">Solved: ${solvedRatio} (${s.total_submissions} subs)</span>
          </div>
        `;

        div.addEventListener("click", () => {
          document.querySelectorAll("#students-list .list-item").forEach(item => item.classList.remove("active"));
          div.classList.add("active");
          activeStudentEmail = email;
          renderStudentDetails(email);
        });

        listContainer.appendChild(div);
      });
    }

    searchInput.addEventListener("input", updateStudentList);
    filterSelect.addEventListener("change", updateStudentList);
    
    // Initial render
    updateStudentList();
  }

  function renderStudentDetails(email) {
    const s = appData.students[email];
    const detailsContainer = document.getElementById("student-detail-view");

    // Build Strengths List
    let strengthsHTML = "";
    s.feedback.strengths.forEach(st => {
      strengthsHTML += `<li><span class="material-icons-round">check_circle_outline</span>${escapeHTML(st)}</li>`;
    });

    // Build Weaknesses List
    let weaknessesHTML = "";
    s.feedback.weaknesses.forEach(wk => {
      weaknessesHTML += `<li><span class="material-icons-round">report_problem</span>${escapeHTML(wk)}</li>`;
    });

    // Build Recommendations List
    let recommendationsHTML = "";
    s.feedback.recommendations.forEach(rc => {
      recommendationsHTML += `<li><span class="material-icons-round">lightbulb</span>${escapeHTML(rc)}</li>`;
    });

    // Build Question Accordion List
    let accordionHTML = "";
    s.attempts_details.forEach(q => {
      const qid = String(q.question_id);
      const solvedBadgeClass = q.solved ? "accepted" : "wrong-answer";
      const solvedText = q.solved ? "Passed" : "Failed";
      
      // per-question feedback from LLM if exists
      const qFeedback = s.feedback.question_feedback && s.feedback.question_feedback[qid] 
        ? s.feedback.question_feedback[qid] 
        : { summary: "No detailed feedback generated for this problem.", critique: "Review timeline details for code transitions.", score_rating: "N/A" };

      // Build timeline attempt details
      let timelineEventsHTML = "";
      
      // Parse timeline details
      const timelineLines = q.timeline_summary.split("\n\n");
      timelineLines.forEach(lineBlock => {
        if (!lineBlock.trim()) return;
        const lines = lineBlock.split("\n");
        const header = lines[0]; // e.g. "Attempt 1 | Status: Wrong Answer | Tests Passed: 1"
        const diffDesc = lines.slice(1).join("\n");

        let eventColorClass = "event-wrong-answer";
        let statusTitle = "Wrong Answer";
        let titleColor = "rose";
        let icon = "close";

        if (header.includes("Accepted")) {
          eventColorClass = "event-accepted";
          statusTitle = "Accepted";
          titleColor = "green";
          icon = "check";
        } else if (header.includes("Time Limit")) {
          eventColorClass = "event-tle";
          statusTitle = "Time Limit Exceeded";
          titleColor = "orange";
          icon = "schedule";
        } else if (header.includes("Error") || header.includes("Compile")) {
          eventColorClass = "event-error";
          statusTitle = "Runtime/Compilation Error";
          titleColor = "purple";
          icon = "warning";
        }

        const isAttempt1 = header.includes("Attempt 1 |") || header.includes("Attempt 1 ");
        
        timelineEventsHTML += `
          <div class="timeline-event-card ${eventColorClass}">
            <div class="timeline-event-header">
              <div class="event-title ${titleColor}">
                <span class="material-icons-round" style="font-size: 16px;">${icon}</span>
                ${escapeHTML(header.split(" | ")[0])}: ${statusTitle}
              </div>
              <div class="event-time">${escapeHTML(header.split(" | ")[2] || "")}</div>
            </div>
            <div class="event-body">
              ${isAttempt1 && q.first_attempt_code ? `
                <div style="border: 1px solid var(--panel-border); border-radius: var(--border-radius-sm); overflow: hidden;">
                  <div style="background: rgba(255,255,255,0.03); padding: 4px 10px; font-size: 0.75rem; color: var(--text-secondary); border-bottom: 1px solid var(--panel-border); font-weight: 600;">Initial Source Code</div>
                  <div style="padding: 10px; background: #070a13; max-height: 250px; overflow-y: auto;">
                    <pre style="margin:0;"><code style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #cbd5e1; line-height: 1.4;">${escapeHTML(q.first_attempt_code)}</code></pre>
                  </div>
                </div>
              ` : `
                <div class="event-diff-narrative">${escapeHTML(diffDesc)}</div>
              `}
            </div>
          </div>
        `;
      });

      accordionHTML += `
        <div class="timeline-accordion-item" data-qid="${qid}">
          <div class="timeline-header">
            <div class="timeline-header-info">
              <h4>#${qid} - ${escapeHTML(q.title)}</h4>
              <span class="status-badge ${solvedBadgeClass}">${solvedText}</span>
            </div>
            <div class="timeline-header-meta">
              <span>Attempts: ${q.total_attempts}</span>
              <span class="status-badge ${qFeedback.score_rating === 'Excellent' || qFeedback.score_rating === 'Completed' ? 'accepted' : 'error'}">${qFeedback.score_rating}</span>
              <span class="material-icons-round toggle-icon">expand_more</span>
            </div>
          </div>
          
          <div class="timeline-body">
            <div style="background: rgba(255,255,255,0.02); border-radius: var(--border-radius-md); padding: 16px; margin-bottom: 20px; border-left: 3px solid var(--accent-cyan);">
              <h5 style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 6px; text-transform: uppercase;">AI Code Critique</h5>
              <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-primary); font-weight: 500;">${escapeHTML(qFeedback.summary)}</p>
              <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-top: 6px; font-style: italic;">${escapeHTML(qFeedback.critique)}</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h5 style="font-size: 0.9rem; font-weight: 600;">Code Progression Timeline</h5>
              <button class="btn-sm btn-primary view-code-btn" data-qid="${qid}">
                <span class="material-icons-round" style="font-size: 14px;">visibility</span>
                View & Compare Code
              </button>
            </div>

            <div class="timeline-event-list">
              ${timelineEventsHTML}
            </div>
          </div>
        </div>
      `;
    });

    detailsContainer.innerHTML = `
      <div class="student-profile-header">
        <div class="student-identity">
          <h2>${escapeHTML(email)}</h2>
          <p>User Database ID: ${s.user_id} | Total submissions: ${s.total_submissions}</p>
        </div>
        <div class="student-overall-score">
          <div class="score-badge">CONTEST SCORE: ${s.solved_count} / ${s.attempted_count} SOLVED</div>
        </div>
      </div>

      <div class="ai-feedback-grid">
        <div class="feedback-card strengths">
          <h3><span class="material-icons-round">check_circle</span> Strengths</h3>
          <ul class="bullet-list">
            ${strengthsHTML || "<li>No strengths identified.</li>"}
          </ul>
        </div>
        
        <div class="feedback-card weaknesses">
          <h3><span class="material-icons-round">warning</span> Weaknesses</h3>
          <ul class="bullet-list">
            ${weaknessesHTML || "<li>No weaknesses identified.</li>"}
          </ul>
        </div>

        <div class="feedback-card recommendations">
          <h3><span class="material-icons-round">lightbulb</span> AI Recommendations</h3>
          <ul class="bullet-list">
            ${recommendationsHTML || "<li>No recommendations compiled.</li>"}
          </ul>
        </div>
      </div>

      <div class="student-timeline-section">
        <h3>Question Analysis & Code History</h3>
        ${accordionHTML || "<p style='color: var(--text-muted)'>No submissions made during this contest.</p>"}
      </div>
    `;

    // Hook up Accordion toggles
    document.querySelectorAll(".timeline-header").forEach(header => {
      header.addEventListener("click", () => {
        const item = header.parentElement;
        const isActive = item.classList.contains("active");
        
        // Collapse all others
        // document.querySelectorAll('.timeline-accordion-item').forEach(i => i.classList.remove('active'));
        
        if (isActive) {
          item.classList.remove("active");
        } else {
          item.classList.add("active");
        }
      });
    });

    // Hook up Code Viewer buttons
    document.querySelectorAll(".view-code-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent accordion toggle
        const qid = btn.getAttribute("data-qid");
        openCodeViewer(email, qid);
      });
    });
  }

  // Code Viewer Logic
  function openCodeViewer(email, qid) {
    activeStudentEmail = email;
    activeQuestionId = qid;

    const s = appData.students[email];
    const q = s.attempts_details.find(d => String(d.question_id) === String(qid));
    if (!q) return;

    modalTitle.innerHTML = `Code Analysis: Student ${escapeHTML(email)} | Problem #${qid}`;
    modal.classList.add("active");

    // Load active tab
    const activeTab = document.querySelector(".compare-tab.active").getAttribute("data-code");
    loadModalCode(activeTab, q);
  }

  function loadModalCode(tabType, q) {
    modalCodeDisplay.classList.remove("hidden");
    modalDiffDisplay.classList.add("hidden");

    if (tabType === "best") {
      modalCodeDisplay.textContent = q.best_attempt_code || "# No submission code captured.";
    } else if (tabType === "first") {
      modalCodeDisplay.textContent = q.first_attempt_code || "# No submission code captured.";
    } else if (tabType === "diff") {
      modalCodeDisplay.classList.add("hidden");
      modalDiffDisplay.classList.remove("hidden");
      modalDiffDisplay.innerHTML = `
        <h3>Attempt Debugging Progression Narrative</h3>
        <p style="margin-bottom: 14px; font-size: 0.85rem; color: var(--text-secondary);">
          Below is a chronological log of changes between attempts, calculated locally by checking lines modified, added, and deleted.
        </p>
        <pre>${escapeHTML(q.timeline_summary)}</pre>
      `;
    }
  }

  // Modal Compare tab switching
  modalCompareTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      modalCompareTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const tabType = tab.getAttribute("data-code");
      const s = appData.students[activeStudentEmail];
      const q = s.attempts_details.find(d => String(d.question_id) === String(activeQuestionId));
      if (q) {
        loadModalCode(tabType, q);
      }
    });
  });

  // Close Modal
  modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // Helper function to escape HTML
  function escapeHTML(str) {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Helper string trim fallback
  if (!String.prototype.strip) {
    String.prototype.strip = function() {
      return this.trim();
    };
  }
});
