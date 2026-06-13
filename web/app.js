// ==========================================
// SCFA Dashboard Application Logic
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  let appData = null;
  let activeStudentEmail = null;
  let activeQuestionId = null;
  let cachedContests = [];
  let progressData = null;

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
  const programSelector = document.getElementById("program-selector");
  const contestSelector = document.getElementById("contest-selector");
  const uploadBtn = document.getElementById("upload-btn");
  const fileInput = document.getElementById("contest-file-input");
  const uploadStatus = document.getElementById("upload-status-indicator");
  const reanalyzeBtn = document.getElementById("reanalyze-btn");

  // Upload configuration modal elements
  const uploadConfigModal = document.getElementById("upload-config-modal");
  const uploadConfigClose = document.getElementById("upload-config-close");
  const uploadConfigCancel = document.getElementById("upload-config-cancel");
  const uploadConfigSubmit = document.getElementById("upload-config-submit");
  const uploadFileNameDisplay = document.getElementById("upload-file-name-display");
  const uploadContestNameInput = document.getElementById("upload-contest-name");
  const uploadProgramSelect = document.getElementById("upload-program-select");
  const uploadProgramNewGroup = document.getElementById("upload-program-new-group");
  const uploadProgramNewInput = document.getElementById("upload-program-new");

  // Floating widget elements
  const progressWidget = document.getElementById("analysis-progress-widget");
  const widgetContestName = document.getElementById("widget-contest-name");
  const widgetProgressText = document.getElementById("widget-progress-text");
  const widgetProgressBar = document.getElementById("widget-progress-bar");
  const widgetCost = document.getElementById("widget-cost");
  const widgetCostLimit = document.getElementById("widget-cost-limit");
  const widgetTokensIn = document.getElementById("widget-tokens-in");
  const widgetTokensOut = document.getElementById("widget-tokens-out");
  const widgetAbortBtn = document.getElementById("widget-abort-btn");
  const uploadCostLimitInput = document.getElementById("upload-cost-limit");

  let activePollInterval = null;
  let activeContestKeyRunning = null;

  function trackAnalysisProgress(contestKey, costLimit, contestName) {
    if (activePollInterval) clearInterval(activePollInterval);
    activeContestKeyRunning = contestKey;
    
    // Setup UI
    widgetContestName.textContent = contestName;
    widgetCostLimit.textContent = `$${costLimit.toFixed(2)}`;
    widgetProgressText.textContent = "0 / 0";
    widgetProgressBar.style.width = "0%";
    widgetCost.textContent = "$0.0000";
    widgetTokensIn.textContent = "0";
    widgetTokensOut.textContent = "0";
    widgetAbortBtn.disabled = false;
    widgetAbortBtn.innerHTML = `
      <span class="material-icons-round" style="font-size: 16px;">stop</span>
      Stop & Save Progress
    `;
    
    progressWidget.classList.remove("hidden");
    
    activePollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/analysis-status?contest_key=${encodeURIComponent(contestKey)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        // Update stats
        const processed = data.processed_students || 0;
        const total = data.total_students || 0;
        widgetProgressText.textContent = `${processed} / ${total}`;
        
        const pct = total > 0 ? (processed / total) * 100 : 0;
        widgetProgressBar.style.width = `${pct}%`;
        
        const costVal = data.cost_usd || 0.0;
        widgetCost.textContent = `$${costVal.toFixed(4)}`;
        
        // If cost approaches the limit, add warning highlights
        if (costVal >= costLimit * 0.9) {
          widgetCost.style.color = "var(--accent-rose)";
        } else {
          widgetCost.style.color = "var(--accent-cyan)";
        }
        
        widgetTokensIn.textContent = (data.prompt_tokens || 0).toLocaleString();
        widgetTokensOut.textContent = (data.completion_tokens || 0).toLocaleString();
        
        // Check terminal statuses
        if (data.status === "completed" || data.status === "aborted" || data.status === "failed") {
          clearInterval(activePollInterval);
          activePollInterval = null;
          
          // Clear localStorage cache
          localStorage.removeItem("activeAnalysisKey");
          localStorage.removeItem("activeAnalysisCostLimit");
          localStorage.removeItem("activeAnalysisName");
          
          if (data.status === "completed") {
            showToast("Analysis Completed successfully!", "success");
          } else if (data.status === "aborted") {
            showToast("Analysis stopped. Progress saved.", "info");
          } else {
            showToast(`Analysis failed: ${data.error || "Unknown error"}`, "error");
          }
          
          widgetAbortBtn.disabled = true;
          setTimeout(() => {
            progressWidget.classList.add("hidden");
          }, 4000);
          
          // Reload contest list and auto-select
          await loadContestsList(contestKey);
          
          const activeTab = document.querySelector(".nav-tab.active").getAttribute("data-tab");
          if (activeTab === "progress") {
            loadProgressData(programSelector.value || "All");
          }
        }
      } catch (err) {
        console.error("Error polling analysis status:", err);
      }
    }, 1000);
  }
  
  function showToast(message, type = "info") {
    console.log(`[Toast ${type}]: ${message}`);
  }


  // Load available contests list
  async function loadContestsList(selectKey = null) {
    try {
      const res = await fetch("/api/contests");
      if (!res.ok) throw new Error();
      cachedContests = await res.json();
      
      // Populate Program Selector
      const currentProgram = programSelector.value || "All";
      const uniquePrograms = ["All", ...new Set(cachedContests.map(c => c.program_name || "General Contests"))];
      
      programSelector.innerHTML = "";
      uniquePrograms.forEach(prog => {
        const opt = document.createElement("option");
        opt.value = prog;
        opt.textContent = prog === "All" ? "All Programs" : prog;
        programSelector.appendChild(opt);
      });
      
      // Determine what program to select
      let targetProgram = currentProgram;
      if (selectKey) {
        const uploadedContest = cachedContests.find(c => c.key === selectKey);
        if (uploadedContest) {
          targetProgram = uploadedContest.program_name || "General Contests";
        }
      }
      
      if (uniquePrograms.includes(targetProgram)) {
        programSelector.value = targetProgram;
      } else {
        programSelector.value = "All";
      }
      
      updateContestSelector(selectKey);
    } catch (err) {
      console.error("Failed to fetch contests directory list:", err);
      loadContestData(null);
    }
  }

  // Update contest dropdown based on selected program
  function updateContestSelector(selectKey = null) {
    const selectedProgram = programSelector.value;
    const filteredContests = cachedContests.filter(c => {
      if (selectedProgram === "All") return true;
      return (c.program_name || "General Contests") === selectedProgram;
    });
    
    contestSelector.innerHTML = "";
    if (filteredContests.length === 0) {
      contestSelector.innerHTML = '<option value="">No contests in program</option>';
      loadContestData(null);
      return;
    }
    
    filteredContests.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.key;
      opt.textContent = c.contest_name || c.source_file;
      contestSelector.appendChild(opt);
    });
    
    // Auto-select contest key
    if (selectKey && filteredContests.some(c => c.key === selectKey)) {
      contestSelector.value = selectKey;
    } else if (filteredContests.length > 0) {
      const prevVal = contestSelector.value;
      if (prevVal && filteredContests.some(c => c.key === prevVal)) {
        contestSelector.value = prevVal;
      } else {
        contestSelector.value = filteredContests[0].key;
      }
    }
    
    if (contestSelector.value) {
      loadContestData(contestSelector.value);
    } else {
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
      const metaContest = document.getElementById("meta-contest-name");
      if (metaContest) metaContest.textContent = "N/A";
      const metaFile = document.getElementById("meta-file");
      if (metaFile) metaFile.textContent = "N/A";
      const metaStudents = document.getElementById("meta-students");
      if (metaStudents) metaStudents.textContent = "-";
      const metaSubmissions = document.getElementById("meta-submissions");
      if (metaSubmissions) metaSubmissions.textContent = "-";
      
      const statTotalStudents = document.getElementById("stat-total-students");
      if (statTotalStudents) statTotalStudents.textContent = "-";
      const statTotalSubmissions = document.getElementById("stat-total-submissions");
      if (statTotalSubmissions) statTotalSubmissions.textContent = "-";
      const statSuccessRate = document.getElementById("stat-success-rate") || document.getElementById("stat-avg-success");
      if (statSuccessRate) statSuccessRate.textContent = "-";
      const statAvgAttempts = document.getElementById("stat-avg-attempts");
      if (statAvgAttempts) statAvgAttempts.textContent = "-";
      
      const problemsTableBody = document.getElementById("problems-table-body") || document.querySelector("#problems-summary-table tbody");
      if (problemsTableBody) {
        problemsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No contest data loaded.</td></tr>`;
      }
      
      const problemsList = document.getElementById("problems-list");
      if (problemsList) problemsList.innerHTML = `<div class="empty-message">No problems loaded. Select a contest.</div>`;
      
      const studentsList = document.getElementById("students-list");
      if (studentsList) studentsList.innerHTML = `<div class="empty-message">No students loaded. Select a contest.</div>`;
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

  // Handle program dropdown selection
  programSelector.addEventListener("change", () => {
    updateContestSelector();
    const activeTab = document.querySelector(".nav-tab.active").getAttribute("data-tab");
    if (activeTab === "progress") {
      loadProgressData(programSelector.value || "All");
    }
  });

  // Handle contest dropdown selection
  contestSelector.addEventListener("change", () => {
    if (contestSelector.value) {
      loadContestData(contestSelector.value);
    }
  });

  // Handle Run AI Critique
  reanalyzeBtn.addEventListener("click", async () => {
    if (!contestSelector.value) {
      alert("No contest selected to analyze.");
      return;
    }
    
    const costLimitStr = prompt("Enter OpenAI cost threshold limit in USD for this analysis:", "0.50");
    if (costLimitStr === null) return;
    const costLimit = parseFloat(costLimitStr) || 0.50;
    
    const contestName = contestSelector.options[contestSelector.selectedIndex].text;
    const confirmRe = confirm(`Are you sure you want to run AI Critique on "${contestName}" with a cost limit of $${costLimit.toFixed(2)}?`);
    if (!confirmRe) return;
    
    reanalyzeBtn.disabled = true;
    const originalText = reanalyzeBtn.innerHTML;
    reanalyzeBtn.innerHTML = `
      <span class="material-icons-round" style="font-size: 16px; animation: spin 1.5s infinite linear;">autorenew</span>
      Starting...
    `;
    
    try {
      const res = await fetch(`/api/reanalyze?contest_key=${encodeURIComponent(contestSelector.value)}&cost_limit=${costLimit}`, {
        method: "POST"
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to run AI Critique.");
      }
      
      // Save state to localStorage to recover on refresh
      localStorage.setItem("activeAnalysisKey", contestSelector.value);
      localStorage.setItem("activeAnalysisCostLimit", costLimit);
      localStorage.setItem("activeAnalysisName", contestName);
      
      // Start real-time monitoring widget
      trackAnalysisProgress(contestSelector.value, costLimit, contestName);
    } catch (err) {
      console.error(err);
      alert(`AI Critique Failed: ${err.message}`);
    } finally {
      reanalyzeBtn.disabled = false;
      reanalyzeBtn.innerHTML = originalText;
    }
  });

  // Handle upload triggers and modal interactions
  let currentUploadFile = null;

  uploadBtn.addEventListener("click", () => fileInput.click());
  
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length === 0) return;
    currentUploadFile = fileInput.files[0];
    
    // Set file name display
    uploadFileNameDisplay.textContent = currentUploadFile.name;
    
    // Pre-fill contest name
    const defaultName = currentUploadFile.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
    uploadContestNameInput.value = defaultName;
    
    // Populate program select dropdown with existing programs
    const programs = [...new Set(cachedContests.map(c => c.program_name || "General Contests"))];
    if (!programs.includes("General Contests")) {
      programs.push("General Contests");
    }
    
    // Sort program names alphabetically
    programs.sort();
    
    uploadProgramSelect.innerHTML = "";
    programs.forEach(prog => {
      const opt = document.createElement("option");
      opt.value = prog;
      opt.textContent = prog;
      uploadProgramSelect.appendChild(opt);
    });
    
    // Add option to create a new program/cohort
    const newProgOpt = document.createElement("option");
    newProgOpt.value = "__NEW__";
    newProgOpt.textContent = "➕ Create New Program...";
    uploadProgramSelect.appendChild(newProgOpt);
    
    // Set default select value
    uploadProgramSelect.value = "General Contests";
    uploadProgramNewGroup.style.display = "none";
    uploadProgramNewInput.value = "";
    
    // Show modal
    uploadConfigModal.classList.add("active");
  });

  // Toggle new program field visibility
  uploadProgramSelect.addEventListener("change", () => {
    if (uploadProgramSelect.value === "__NEW__") {
      uploadProgramNewGroup.style.display = "flex";
      uploadProgramNewInput.focus();
    } else {
      uploadProgramNewGroup.style.display = "none";
    }
  });

  // Helper to close upload modal
  function closeUploadConfigModal() {
    uploadConfigModal.classList.remove("active");
    fileInput.value = "";
    currentUploadFile = null;
  }

  // Bind close buttons
  uploadConfigClose.addEventListener("click", closeUploadConfigModal);
  uploadConfigCancel.addEventListener("click", closeUploadConfigModal);

  // Handle upload submit
  uploadConfigSubmit.addEventListener("click", async () => {
    if (!currentUploadFile) return;
    
    const cleanContestName = uploadContestNameInput.value.trim();
    if (!cleanContestName) {
      alert("Contest name cannot be empty.");
      return;
    }
    
    let programName = uploadProgramSelect.value;
    if (programName === "__NEW__") {
      programName = uploadProgramNewInput.value.trim();
      if (!programName) {
        alert("Please enter the name of the new program.");
        return;
      }
    }
    
    const cleanProgramName = programName || "General Contests";
    const costLimit = parseFloat(uploadCostLimitInput.value) || 0.50;
    
    // Close modal and start loading animation
    closeUploadConfigModal();
    
    uploadStatus.classList.remove("hidden");
    uploadStatus.textContent = "Uploading...";
    
    try {
      const text = await currentUploadFile.text();
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(currentUploadFile.name)}&contest_name=${encodeURIComponent(cleanContestName)}&program_name=${encodeURIComponent(cleanProgramName)}&cost_limit=${costLimit}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: text
      });
      
      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.message || "Failed to analyze.");
      }
      
      uploadStatus.textContent = "Started!";
      setTimeout(() => uploadStatus.classList.add("hidden"), 2000);
      
      // Save state to localStorage to recover on refresh
      localStorage.setItem("activeAnalysisKey", resData.contest_key);
      localStorage.setItem("activeAnalysisCostLimit", costLimit);
      localStorage.setItem("activeAnalysisName", cleanContestName);
      
      // Start tracking background progress
      trackAnalysisProgress(resData.contest_key, costLimit, cleanContestName);
    } catch (err) {
      console.error(err);
      alert(`Upload Failed: ${err.message}`);
      uploadStatus.classList.add("hidden");
    }
  });

  // Handle abort click
  widgetAbortBtn.addEventListener("click", async () => {
    if (!activeContestKeyRunning) return;
    
    widgetAbortBtn.disabled = true;
    widgetAbortBtn.innerHTML = `
      <span class="material-icons-round" style="font-size: 16px; animation: spin 1.5s infinite linear;">sync</span>
      Stopping...
    `;
    
    try {
      const res = await fetch(`/api/abort-analysis?contest_key=${encodeURIComponent(activeContestKeyRunning)}`, {
        method: "POST"
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch (err) {
      console.error("Failed to abort analysis:", err);
      widgetAbortBtn.disabled = false;
      widgetAbortBtn.innerHTML = `
        <span class="material-icons-round" style="font-size: 16px;">stop</span>
        Stop & Save Progress
      `;
    }
  });

  // Initial load
  loadContestsList();

  // Recover running analysis widget on page load if active
  const cachedKey = localStorage.getItem("activeAnalysisKey");
  if (cachedKey) {
    const cachedCostLimit = parseFloat(localStorage.getItem("activeAnalysisCostLimit")) || 0.50;
    const cachedName = localStorage.getItem("activeAnalysisName") || "Contest";
    trackAnalysisProgress(cachedKey, cachedCostLimit, cachedName);
  }

  // Tab Navigation
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));
      
      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(`tab-${targetTab}`).classList.add("active");
      
      // Load progress tracker if selected
      if (targetTab === "progress") {
        loadProgressData(programSelector.value || "All");
      }
    });
  });

  // Init Dashboard
  function initDashboard() {
    if (!appData) return;

    // Set header metadata
    const metaProg = document.getElementById("meta-program-name");
    if (metaProg) metaProg.textContent = appData.metadata.program_name || "General Contests";
    
    const metaContest = document.getElementById("meta-contest-name");
    if (metaContest) metaContest.textContent = appData.metadata.contest_name || appData.metadata.contest_key || "N/A";
    
    const metaFile = document.getElementById("meta-file");
    if (metaFile) metaFile.textContent = appData.metadata.source_file;
    
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
      timelineLines.forEach((lineBlock, idx) => {
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
        
        let codeButtonHTML = "";
        if (q.attempts && q.attempts[idx]) {
          codeButtonHTML = `
            <button class="btn-sm btn-outline view-attempt-code" data-qid="${qid}" data-attempt-idx="${idx}" style="display:flex; align-items:center; gap:4px; padding:4px 8px; font-size:0.75rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); color:var(--text-secondary); border-radius:var(--border-radius-sm); cursor:pointer;" title="View the code submitted in this attempt.">
              <span class="material-icons-round" style="font-size: 14px;">code</span>
              View Code
            </button>
          `;
        }

        timelineEventsHTML += `
          <div class="timeline-event-card ${eventColorClass}">
            <div class="timeline-event-header" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
              <div class="event-title ${titleColor}">
                <span class="material-icons-round" style="font-size: 16px;">${icon}</span>
                ${escapeHTML(header.split(" | ")[0])}: ${statusTitle}
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <div class="event-time">${escapeHTML(header.split(" | ")[2] || "")}</div>
                ${codeButtonHTML}
              </div>
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

    // Hook up individual attempt code viewers
    document.querySelectorAll(".view-attempt-code").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent accordion toggle
        const qid = btn.getAttribute("data-qid");
        const attemptIdx = parseInt(btn.getAttribute("data-attempt-idx"));
        openAttemptCodeViewer(email, qid, attemptIdx);
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

    // Hide the dynamic attempt tab
    const attemptTab = document.getElementById("modal-tab-attempt");
    attemptTab.style.display = "none";

    // Select "Best" code tab by default
    modalCompareTabs.forEach(t => t.classList.remove("active"));
    document.querySelector('.compare-tab[data-code="best"]').classList.add("active");

    modalTitle.innerHTML = `Code Analysis: Student ${escapeHTML(email)} | Problem #${qid}`;
    modal.classList.add("active");

    loadModalCode("best", q);
  }

  function openAttemptCodeViewer(email, qid, attemptIdx) {
    activeStudentEmail = email;
    activeQuestionId = qid;

    const s = appData.students[email];
    const q = s.attempts_details.find(d => String(d.question_id) === String(qid));
    if (!q) return;

    // Show the dynamic attempt tab
    const attemptTab = document.getElementById("modal-tab-attempt");
    attemptTab.style.display = "block";
    const attemptNum = q.attempts[attemptIdx].attempt_index;
    attemptTab.textContent = `Attempt ${attemptNum} Code`;
    attemptTab.setAttribute("data-attempt-idx", attemptIdx);

    // Make it active
    modalCompareTabs.forEach(t => t.classList.remove("active"));
    attemptTab.classList.add("active");

    modalTitle.innerHTML = `Code Analysis: Student ${escapeHTML(email)} | Problem #${qid}`;
    modal.classList.add("active");

    loadModalCode("attempt", q, attemptIdx);
  }

  function loadModalCode(tabType, q, attemptIdx = null) {
    modalCodeDisplay.classList.remove("hidden");
    modalDiffDisplay.classList.add("hidden");

    if (tabType === "best") {
      modalCodeDisplay.textContent = q.best_attempt_code || "# No submission code captured.";
    } else if (tabType === "first") {
      modalCodeDisplay.textContent = q.first_attempt_code || "# No submission code captured.";
    } else if (tabType === "attempt") {
      const idx = attemptIdx !== null ? attemptIdx : parseInt(document.getElementById("modal-tab-attempt").getAttribute("data-attempt-idx"));
      if (q.attempts && q.attempts[idx]) {
        modalCodeDisplay.textContent = q.attempts[idx].source_code || "# No submission code captured.";
      } else {
        modalCodeDisplay.textContent = "# No submission code captured.";
      }
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

  // Progress Tracker Logic
  async function loadProgressData(programName) {
    const listContainer = document.getElementById("progress-students-list");
    const gridBody = document.getElementById("progress-grid-body");
    const gridHeaders = document.getElementById("progress-grid-headers");
    const trendCards = document.getElementById("milestones-trend-cards");
    
    listContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">Loading progress...</div>';
    gridBody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-secondary);">Loading grid...</td></tr>';
    trendCards.innerHTML = '<div style="text-align: center; padding: 10px; color: var(--text-secondary);">Loading trends...</div>';
    
    try {
      const res = await fetch(`/api/progress?program=${encodeURIComponent(programName)}`);
      if (!res.ok) throw new Error("Failed to load progress data");
      progressData = await res.json();
      
      renderProgressTab();
    } catch (err) {
      console.error(err);
      listContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--accent-rose);">Failed to load progress.</div>';
      gridBody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--accent-rose);">Error loading data.</td></tr>';
      trendCards.innerHTML = '';
    }
  }

  function renderProgressTab() {
    if (!progressData) return;
    
    const listContainer = document.getElementById("progress-students-list");
    const gridBody = document.getElementById("progress-grid-body");
    const gridHeaders = document.getElementById("progress-grid-headers");
    const trendCards = document.getElementById("milestones-trend-cards");
    
    listContainer.innerHTML = "";
    gridBody.innerHTML = "";
    
    // Clear dynamic headers (remove everything after the first two columns)
    const headerCols = Array.from(gridHeaders.querySelectorAll("th"));
    headerCols.slice(2).forEach(col => col.remove());
    
    // Get list of sorted milestones
    const milestones = progressData.contests || [];
    document.getElementById("prog-stat-milestones").textContent = milestones.length;
    
    // Add dynamic milestone columns to the headers
    milestones.forEach((m, idx) => {
      const th = document.createElement("th");
      th.textContent = `M${idx + 1}`;
      th.title = m.contest_name || m.contest_key;
      th.style.textAlign = "center";
      gridHeaders.appendChild(th);
    });
    
    const studentsList = Object.values(progressData.students || {});
    document.getElementById("prog-stat-students").textContent = studentsList.length;
    
    if (studentsList.length === 0) {
      listContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-muted);">No student records found.</div>';
      gridBody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-secondary);">No student data available.</td></tr>';
      document.getElementById("prog-stat-solve-rate").textContent = "0%";
      document.getElementById("prog-stat-trend").textContent = "N/A";
      trendCards.innerHTML = "";
      return;
    }
    
    // Compute student stats
    const totalMilestonesQuestions = milestones.reduce((sum, m) => sum + (m.total_questions || 0), 0);
    
    const studentsWithScores = studentsList.map(s => {
      let solvedSum = 0;
      milestones.forEach(m => {
        const hist = s.history[m.contest_key];
        if (hist) {
          solvedSum += hist.solved_count || 0;
        }
      });
      
      const overallRate = totalMilestonesQuestions > 0 ? (solvedSum / totalMilestonesQuestions) : 0;
      return {
        ...s,
        solvedSum,
        overallRate
      };
    });
    
    // Sort students by solve rate descending
    studentsWithScores.sort((a, b) => b.overallRate - a.overallRate);
    
    // Populate Sidebar & Milestones Grid
    studentsWithScores.forEach(s => {
      // 1. Sidebar Item
      const item = document.createElement("div");
      item.className = "list-item";
      const pct = Math.round(s.overallRate * 100);
      const rateColor = pct > 75 ? "font-green" : (pct < 40 ? "font-rose" : "font-orange");
      
      item.innerHTML = `
        <div class="list-item-title">${escapeHTML(s.email)}</div>
        <div class="list-item-meta">
          <span>Milestones: ${Object.keys(s.history).length}/${milestones.length}</span>
          <span class="${rateColor}">Pass: ${s.solvedSum}/${totalMilestonesQuestions} (${pct}%)</span>
        </div>
      `;
      listContainer.appendChild(item);
      
      // 2. Grid Row
      const tr = document.createElement("tr");
      
      // Student column
      const tdEmail = document.createElement("td");
      tdEmail.innerHTML = `<strong>${escapeHTML(s.email)}</strong>`;
      tr.appendChild(tdEmail);
      
      // Overall progress column
      const tdProgress = document.createElement("td");
      tdProgress.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="${rateColor}" style="font-weight:600; min-width: 32px;">${pct}%</span>
          <div class="progress-bar-bg" style="width: 80px; height: 6px;">
            <div class="progress-bar-fill ${pct > 75 ? 'green' : (pct < 40 ? 'rose' : 'orange')}" style="width: ${pct}%"></div>
          </div>
          <span style="font-size:0.75rem; color:var(--text-secondary);">${s.solvedSum}/${totalMilestonesQuestions}</span>
        </div>
      `;
      tr.appendChild(tdProgress);
      
      // Milestone columns
      milestones.forEach(m => {
        const tdM = document.createElement("td");
        tdM.style.textAlign = "center";
        
        const hist = s.history[m.contest_key];
        if (hist && hist.attempted_count > 0) {
          const mPct = m.total_questions > 0 ? Math.round((hist.solved_count / m.total_questions) * 100) : 0;
          let badgeClass = "badge-rose";
          if (mPct === 100) badgeClass = "badge-green";
          else if (mPct >= 50) badgeClass = "badge-cyan";
          else if (mPct > 0) badgeClass = "badge-orange";
          
          tdM.innerHTML = `<span class="milestone-badge ${badgeClass}">${hist.solved_count}/${m.total_questions}</span>`;
        } else {
          tdM.innerHTML = `<span class="milestone-badge badge-gray">-</span>`;
        }
        tr.appendChild(tdM);
      });
      
      gridBody.appendChild(tr);
    });
    
    // Cohort overall statistics
    const cohortSolveRate = totalMilestonesQuestions * studentsList.length > 0 
      ? Math.round((studentsWithScores.reduce((sum, s) => sum + s.solvedSum, 0) / (totalMilestonesQuestions * studentsList.length)) * 100)
      : 0;
    document.getElementById("prog-stat-solve-rate").textContent = `${cohortSolveRate}%`;
    
    // Compute Milestone Cohort Performance Trends
    trendCards.innerHTML = "";
    let prevRate = null;
    let lastTrendText = "Stable";
    
    milestones.forEach((m, idx) => {
      let milestoneSolved = 0;
      let studentsInMilestone = 0;
      
      studentsList.forEach(s => {
        const hist = s.history[m.contest_key];
        if (hist && hist.attempted_count > 0) {
          milestoneSolved += hist.solved_count || 0;
          studentsInMilestone++;
        }
      });
      
      const possibleSolved = m.total_questions * studentsInMilestone;
      const milestoneRate = possibleSolved > 0 ? Math.round((milestoneSolved / possibleSolved) * 100) : 0;
      
      let trendIndicator = "";
      if (prevRate !== null) {
        const diff = milestoneRate - prevRate;
        if (diff > 0) {
          trendIndicator = `<span class="trend-up" style="color:var(--accent-green); display:flex; align-items:center; gap:2px; font-weight:600; font-size:0.8rem;"><span class="material-icons-round" style="font-size:14px;">trending_up</span>+${diff}%</span>`;
          lastTrendText = "Improving";
        } else if (diff < 0) {
          trendIndicator = `<span class="trend-down" style="color:var(--accent-rose); display:flex; align-items:center; gap:2px; font-weight:600; font-size:0.8rem;"><span class="material-icons-round" style="font-size:14px;">trending_down</span>${diff}%</span>`;
          lastTrendText = "Declining";
        } else {
          trendIndicator = `<span class="trend-flat" style="color:var(--text-secondary); display:flex; align-items:center; gap:2px; font-weight:600; font-size:0.8rem;"><span class="material-icons-round" style="font-size:14px;">trending_flat</span>0%</span>`;
        }
      }
      prevRate = milestoneRate;
      
      const card = document.createElement("div");
      card.className = "milestone-trend-card glass";
      card.style.minWidth = "190px";
      card.style.flex = "1";
      card.style.padding = "16px";
      card.style.borderRadius = "var(--border-radius-md)";
      card.style.background = "rgba(255, 255, 255, 0.01)";
      card.style.border = "1px solid var(--panel-border)";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.gap = "8px";
      
      card.innerHTML = `
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Milestone ${idx + 1}</div>
        <div style="font-size: 0.95rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary);" title="${escapeHTML(m.contest_name || m.contest_key)}">${escapeHTML(m.contest_name || m.contest_key)}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
          <span style="font-size: 1.6rem; font-weight: 800; color: var(--accent-cyan);">${milestoneRate}%</span>
          ${trendIndicator}
        </div>
        <div class="progress-bar-bg" style="height: 4px;">
          <div class="progress-bar-fill cyan" style="width: ${milestoneRate}%"></div>
        </div>
        <div style="font-size: 0.7rem; color: var(--text-muted);">${studentsInMilestone} active students</div>
      `;
      trendCards.appendChild(card);
    });
    
    document.getElementById("prog-stat-trend").textContent = lastTrendText;
  }

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
