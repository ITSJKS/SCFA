import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, Code, Users, Sun, Moon, TrendingUp, CloudUpload, Sparkles, 
  Settings, CheckCircle, AlertTriangle, Play, HelpCircle, X, Trash2, LogOut, Key
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import ContestDashboard from './components/ContestDashboard';
import StudentPortal from './components/StudentPortal';
import ProgressTracker from './components/ProgressTracker';
import CodeCompareModal from './components/CodeCompareModal';
import ProgressWidget from './components/ProgressWidget';
import ProblemExplorer from './components/ProblemExplorer';

export default function App() {
  // Navigation & Dropdown State
  const [contestsList, setContestsList] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [activeContestKey, setActiveContestKey] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Theme state: 'dark' (glowing dark) or 'light' (clean light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('scfa-theme') || 'dark';
  });

  // Active Data State
  const [appData, setAppData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [activeStudentEmail, setActiveStudentEmail] = useState(null);

  // Search & Filter State (passed to student portal sidebar)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Single Student Analysis Loading
  const [isSingleAnalyzing, setIsSingleAnalyzing] = useState(false);

  // Modal State for Code Compare
  const [codeModal, setCodeModal] = useState({
    isOpen: false,
    title: '',
    firstCode: '',
    bestCode: '',
    timelineSummary: '',
    selectedAttemptCode: null,
    selectedAttemptNumber: null
  });

  // Modal State for File Upload & Contest Configuration
  const [uploadModal, setUploadModal] = useState({
    isOpen: false,
    fileName: '',
    fileText: '',
    contestName: '',
    programSelect: 'General Contests',
    newProgramName: '',
    costLimit: 0.50
  });

  // Toast / Status Message State
  const [toast, setToast] = useState(null);

  // Background Progress Widget State
  const [widget, setWidget] = useState({
    visible: false,
    contestKey: '',
    contestName: '',
    status: 'idle',
    processedCount: 0,
    totalStudents: 0,
    costUsd: 0.0,
    costLimit: 0.50,
    promptTokens: 0,
    completionTokens: 0,
    isSingleStudent: false
  });

  // RBAC and Custom API Key State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('scfa-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [openaiKey, setOpenaiKey] = useState(() => {
    return localStorage.getItem('scfa-openai-key') || '';
  });
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [runAiUpload, setRunAiUpload] = useState(true);

  // Login Form State
  const [loginRole, setLoginRole] = useState('faculty');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const pollIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Authenticated fetch wrapper that attaches Bearer token and custom OpenAI API key
  const authenticatedFetch = async (url, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    if (openaiKey) {
      headers['X-OpenAI-API-Key'] = openaiKey;
    }
    
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      // Auto logout on token expiration
      setUser(null);
      localStorage.removeItem('scfa-user');
      showToast('Session expired. Please log in again.', 'warning');
    }
    return res;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: loginRole, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed.');
      }
      const newUser = { role: data.role, token: data.token };
      setUser(newUser);
      localStorage.setItem('scfa-user', JSON.stringify(newUser));
      showToast('Signed in successfully.', 'success');
      setLoginPassword('');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scfa-user');
    showToast('Signed out successfully.', 'info');
  };

  // Sync theme class to document element and body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    
    document.body.className = theme === 'light' ? 'theme-light' : 'theme-dark';
    localStorage.setItem('scfa-theme', theme);
  }, [theme]);


  // Show a message toast helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch contests and restore status polling when user logs in
  useEffect(() => {
    if (!user) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }
    
    fetchContests();
    
    // Recover background analysis widget from localStorage if page refreshed
    const recoveredKey = localStorage.getItem('activeAnalysisKey');
    if (recoveredKey) {
      const recoveredCostLimit = parseFloat(localStorage.getItem('activeAnalysisCostLimit')) || 0.50;
      const recoveredName = localStorage.getItem('activeAnalysisName') || 'Contest';
      startStatusPolling(recoveredKey, recoveredCostLimit, recoveredName);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [user]);

  // Fetch contests helper
  const fetchContests = async (selectKey = null) => {
    try {
      const res = await authenticatedFetch('/api/contests');
      if (!res.ok) throw new Error();
      const list = await res.json();
      setContestsList(list);

      // Determine what contest to select
      if (selectKey) {
        setActiveContestKey(selectKey);
      } else if (list.length > 0) {
        // Auto-select latest contest
        setActiveContestKey(list[0].key);
      }
    } catch (err) {
      console.error('Failed to load contests list:', err);
      showToast('Error loading contests list from server', 'error');
    }
  };

  // Load contest summary.json details when contest key changes
  useEffect(() => {
    if (!activeContestKey) {
      setAppData(null);
      return;
    }
    loadContestDetails(activeContestKey);
  }, [activeContestKey]);

  const loadContestDetails = async (key) => {
    try {
      const res = await authenticatedFetch(`/api/contests/${key}/summary`);
      if (!res.ok) throw new Error('Contest report not found');
      const data = await res.json();
      setAppData(data);
      setActiveStudentEmail(null); // Reset active student
    } catch (err) {
      console.error('Error fetching contest details:', err);
      showToast('No parsed data exists for this contest. Run AI Critique first.', 'warning');
      setAppData(null);
    }
  };

  // Fetch progress data when tab changes to "progress"
  useEffect(() => {
    if (activeTab === 'progress') {
      loadCohortProgress();
    }
  }, [activeTab, selectedProgram]);

  const loadCohortProgress = async () => {
    try {
      const res = await authenticatedFetch(`/api/progress?program=${encodeURIComponent(selectedProgram)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProgressData(data);
    } catch (err) {
      console.error('Failed to load program cohort progress:', err);
      showToast('Error loading progression milestones', 'error');
    }
  };

  // Polling background analysis task status
  const startStatusPolling = (contestKey, costLimit, contestName) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    setWidget({
      visible: true,
      contestKey,
      contestName,
      status: 'pending',
      processedCount: 0,
      totalStudents: 0,
      costUsd: 0.0,
      costLimit,
      promptTokens: 0,
      completionTokens: 0,
      isSingleStudent: false
    });

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await authenticatedFetch(`/api/analysis-status?contest_key=${encodeURIComponent(contestKey)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        setWidget(prev => ({
          ...prev,
          status: data.status,
          processedCount: data.processed_students || 0,
          totalStudents: data.total_students || 0,
          costUsd: data.cost_usd || 0.0,
          promptTokens: data.prompt_tokens || 0,
          completionTokens: data.completion_tokens || 0
        }));

        if (data.status === 'completed' || data.status === 'aborted' || data.status === 'failed') {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          
          localStorage.removeItem('activeAnalysisKey');
          localStorage.removeItem('activeAnalysisCostLimit');
          localStorage.removeItem('activeAnalysisName');

          if (data.status === 'completed') {
            showToast('AI analysis completed successfully!', 'success');
          } else if (data.status === 'aborted') {
            showToast('AI analysis stopped. Current progress saved.', 'info');
          } else {
            showToast(`AI critique failed: ${data.error || 'Server error'}`, 'error');
          }

          // Reload contests & select
          await fetchContests(contestKey);
          await loadContestDetails(contestKey);

          // Hide widget after 4 seconds
          setTimeout(() => {
            setWidget(prev => ({ ...prev, visible: false }));
          }, 4000);
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }
    }, 1000);
  };

  // Start full contest reanalysis
  const handleRunAICritique = async () => {
    if (!activeContestKey) {
      alert('No contest selected.');
      return;
    }
    const limitStr = prompt('Enter OpenAI cost threshold limit in USD for this analysis:', '0.50');
    if (limitStr === null) return;
    const limit = parseFloat(limitStr) || 0.50;

    const activeContestName = contestsList.find(c => c.key === activeContestKey)?.contest_name || 'Contest';
    const confirmRun = confirm(`Are you sure you want to run AI Critique on "${activeContestName}" with a cost limit of $${limit.toFixed(2)}?`);
    if (!confirmRun) return;

    try {
      const res = await authenticatedFetch(`/api/reanalyze?contest_key=${encodeURIComponent(activeContestKey)}&cost_limit=${limit}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'API request failed');

      // Save progress to recover on refresh
      localStorage.setItem('activeAnalysisKey', activeContestKey);
      localStorage.setItem('activeAnalysisCostLimit', limit);
      localStorage.setItem('activeAnalysisName', activeContestName);

      startStatusPolling(activeContestKey, limit, activeContestName);
    } catch (err) {
      console.error(err);
      alert(`AI Critique Failed: ${err.message}`);
    }
  };

  // Abort running analysis
  const handleAbortAnalysis = async () => {
    if (!widget.contestKey) return;
    setWidget(prev => ({ ...prev, status: 'aborting' }));

    try {
      const res = await authenticatedFetch(`/api/abort-analysis?contest_key=${encodeURIComponent(widget.contestKey)}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch (err) {
      console.error('Failed to abort:', err);
      showToast('Failed to abort analysis', 'error');
      setWidget(prev => ({ ...prev, status: 'running' }));
    }
  };

  // Delete contest permanently (Admin only)
  const handleDeleteContest = async () => {
    if (!activeContestKey) {
      alert('No contest selected.');
      return;
    }
    const activeContestName = contestsList.find(c => c.key === activeContestKey)?.contest_name || 'Contest';
    const confirmDelete = confirm(`Are you sure you want to permanently delete "${activeContestName}"?\nThis will delete the raw contest submissions and all AI analysis reports. This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const res = await authenticatedFetch(`/api/contests/${activeContestKey}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to delete contest.');

      showToast('Contest successfully deleted.', 'success');
      setActiveContestKey('');
      setAppData(null);
      await fetchContests();
    } catch (err) {
      console.error(err);
      alert(`Deletion Failed: ${err.message}`);
    }
  };

  // Run AI critique on a single student
  const handleRunSingleStudentAI = async (email) => {
    if (!activeContestKey || !email) return;

    if (user && user.role === 'faculty' && !openaiKey) {
      showToast('Please configure your OpenAI API Key in Settings first (key icon in header).', 'warning');
      return;
    }

    setIsSingleAnalyzing(true);
    setWidget({
      visible: true,
      contestKey: email,
      contestName: email,
      status: 'running',
      processedCount: 0,
      totalStudents: 1,
      costUsd: 0.0,
      costLimit: 0,
      promptTokens: 0,
      completionTokens: 0,
      isSingleStudent: true
    });

    try {
      const res = await authenticatedFetch(`/api/analyze-student?contest_key=${encodeURIComponent(activeContestKey)}&email=${encodeURIComponent(email)}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'API call failed');

      // Update widget stats
      setWidget(prev => ({
        ...prev,
        status: 'completed',
        costUsd: data.cost_usd,
        promptTokens: data.prompt_tokens,
        completionTokens: data.completion_tokens
      }));

      // Update local appData cache to display feedback instantly
      if (appData) {
        const updatedStudents = {
          ...appData.students,
          [email]: data.student_data
        };
        
        // Update total cost in metadata
        const updatedMetadata = {
          ...appData.metadata,
          accumulated_openai_cost_usd: (appData.metadata.accumulated_openai_cost_usd || 0.0) + data.cost_usd,
          prompt_tokens: (appData.metadata.prompt_tokens || 0) + data.prompt_tokens,
          completion_tokens: (appData.metadata.completion_tokens || 0) + data.completion_tokens,
          openai_api_used: true
        };

        setAppData({
          ...appData,
          metadata: updatedMetadata,
          students: updatedStudents
        });
      }

      showToast(`Successfully analyzed student ${email}!`, 'success');
      setTimeout(() => setWidget(prev => ({ ...prev, visible: false })), 4000);
    } catch (err) {
      console.error(err);
      showToast(`Critique failed: ${err.message}`, 'error');
      setWidget(prev => ({ ...prev, visible: false }));
    } finally {
      setIsSingleAnalyzing(false);
    }
  };

  const handleSaveStudentFeedback = async (email, feedbackText) => {
    if (!activeContestKey || !email) return false;
    try {
      const res = await authenticatedFetch(`/api/contests/${encodeURIComponent(activeContestKey)}/students/${encodeURIComponent(email)}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback_text: feedbackText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to save feedback.');

      // Update local appData cache to display custom feedback instantly
      if (appData) {
        const updatedStudents = {
          ...appData.students,
          [email]: {
            ...appData.students[email],
            custom_feedback: feedbackText
          }
        };

        setAppData({
          ...appData,
          students: updatedStudents
        });
      }

      showToast('Custom feedback notes saved successfully.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast(`Failed to save feedback: ${err.message}`, 'error');
      return false;
    }
  };

  // Handle Upload File Selecting
  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    const text = await file.text();

    const defaultName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();

    // Fetch existing programs
    const programsList = [...new Set(contestsList.map(c => c.program_name || 'General Contests'))];
    if (!programsList.includes('General Contests')) {
      programsList.push('General Contests');
    }
    programsList.sort();

    // Configure initial AI analysis checkbox state:
    // Disabled/unchecked for faculty if they don't have a custom API key.
    if (user && user.role === 'faculty') {
      setRunAiUpload(!!openaiKey);
    } else {
      setRunAiUpload(true);
    }

    setUploadModal({
      isOpen: true,
      fileName: file.name,
      fileText: text,
      contestName: defaultName,
      programSelect: 'General Contests',
      newProgramName: '',
      costLimit: 0.50
    });
  };

  // Submit Upload Config and File
  const handleUploadSubmit = async () => {
    const { fileText, fileName, contestName, programSelect, newProgramName, costLimit } = uploadModal;
    
    const cleanContestName = contestName.trim();
    if (!cleanContestName) {
      alert('Contest name cannot be empty.');
      return;
    }

    let targetProgram = programSelect;
    if (programSelect === '__NEW__') {
      targetProgram = newProgramName.trim();
      if (!targetProgram) {
        alert('Please enter a name for the new Program.');
        return;
      }
    }

    // Close Modal
    setUploadModal(prev => ({ ...prev, isOpen: false }));
    showToast('Uploading and parsing contest file...', 'info');

    try {
      // Stream file upload
      const res = await authenticatedFetch(`/api/upload?filename=${encodeURIComponent(fileName)}&contest_name=${encodeURIComponent(cleanContestName)}&program_name=${encodeURIComponent(targetProgram)}&cost_limit=${costLimit}&run_ai=${runAiUpload}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: fileText
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'File upload failed');

      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (runAiUpload) {
        showToast('Started background AI critique!', 'success');
      } else {
        showToast('Uploaded and parsed local contest metrics successfully!', 'success');
      }

      // Setup state for recovered widget
      localStorage.setItem('activeAnalysisKey', data.contest_key);
      localStorage.setItem('activeAnalysisCostLimit', costLimit);
      localStorage.setItem('activeAnalysisName', cleanContestName);

      startStatusPolling(data.contest_key, costLimit, cleanContestName);
    } catch (err) {
      console.error(err);
      alert(`Upload Failed: ${err.message}`);
    }
  };

  // Modal Code View Triggers
  const handleOpenCodeViewer = (email, qid) => {
    const s = appData.students[email];
    const q = s?.attempts_details?.find(d => String(d.question_id) === String(qid));
    if (!q) return;

    setCodeModal({
      isOpen: true,
      title: `Code Analysis: Student ${email} | Problem #${qid}`,
      firstCode: q.first_attempt_code,
      bestCode: q.best_attempt_code,
      timelineSummary: q.timeline_summary,
      selectedAttemptCode: null,
      selectedAttemptNumber: null
    });
  };

  const handleOpenAttemptCodeViewer = (email, qid, attemptIdx) => {
    const s = appData.students[email];
    const q = s?.attempts_details?.find(d => String(d.question_id) === String(qid));
    if (!q) return;

    const attempt = q.attempts?.[attemptIdx];
    setCodeModal({
      isOpen: true,
      title: `Code Analysis: Student ${email} | Problem #${qid}`,
      firstCode: q.first_attempt_code,
      bestCode: q.best_attempt_code,
      timelineSummary: q.timeline_summary,
      selectedAttemptCode: attempt?.source_code || '',
      selectedAttemptNumber: attempt?.attempt_index || attemptIdx + 1
    });
  };

  // Helper dropdown list arrays
  const uniquePrograms = ['All', ...new Set(contestsList.map(c => c.program_name || 'General Contests'))];
  const filteredContests = contestsList.filter(c => {
    if (selectedProgram === 'All') return true;
    return (c.program_name || 'General Contests') === selectedProgram;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-darkBg text-textPrimary px-4 relative">
        <div className="absolute inset-0 bg-gradientGlow opacity-5 blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-panelBgSolid border border-panelBorder rounded-2xl shadow-2xl overflow-hidden glass-panel p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center gap-2.5 text-center">
            {/* Logo */}
            <div className="relative w-16 h-16 flex items-center justify-center bg-panelBg rounded-2xl border border-panelBorder shadow-glow">
              <div className="absolute inset-0 bg-gradientGlow rounded-2xl opacity-20 blur-xs animate-pulse" />
              <svg className="w-9 h-9 text-accentCyan z-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-cyan)" />
                    <stop offset="100%" stopColor="var(--accent-purple)" />
                  </linearGradient>
                </defs>
                <path d="M16 2L30 10V22L16 30L2 22V10L16 2Z" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 8L25 13V19L16 24L7 19V13L16 8Z" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeDasharray="2 2" className="opacity-60" />
                <circle cx="16" cy="16" r="2.5" fill="var(--accent-green)" className="animate-pulse" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-black bg-gradientGlow bg-clip-text text-transparent mt-2">
              SCFA Portal Access
            </h1>
            <p className="text-sm text-textSecondary font-semibold">Coding Feedback Analyzer Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Role Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Select Role</label>
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value)}
                className="w-full bg-bgSurfaceInput border border-panelBorder rounded-lg px-3.5 py-2.5 text-sm text-textPrimary font-bold outline-none focus:border-accentCyan transition-all"
              >
                <option value="faculty" className="bg-panelBgSolid text-textPrimary">Faculty (Read & Upload)</option>
                <option value="admin" className="bg-panelBgSolid text-textPrimary">Admin (Full Control)</option>
              </select>
            </div>

            {/* Passcode input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Passcode</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter passcode"
                required
                className="w-full bg-bgSurfaceInput border border-panelBorder rounded-lg px-3.5 py-2.5 text-sm text-textPrimary outline-none focus:border-accentCyan transition-all text-textPrimary placeholder:text-textMuted"
              />
            </div>

            {loginError && (
              <div className="text-xs text-accentRose font-bold bg-accentRose/5 border border-accentRose/20 p-2.5 rounded-lg flex items-center gap-1.5 animate-bounce">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-gradientGlow hover:opacity-95 text-darkBg text-sm font-black rounded-lg transition-all duration-200 cursor-pointer shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast Notifier */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl border glass-panel shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-5 duration-300">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-accentGreen" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-accentRose" />
          ) : (
            <HelpCircle className="w-5 h-5 text-accentCyan" />
          )}
          <span className="text-sm font-semibold text-textPrimary">{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-headerBg border-b border-panelBorder sticky top-0 z-40 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Custom Glowing SVG Logo - Crazy Good */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 flex items-center justify-center bg-panelBg rounded-xl border border-panelBorder shadow-glow transition-all duration-300">
            <div className="absolute inset-0 bg-gradientGlow rounded-xl opacity-20 blur-xs animate-pulse" />
            <svg className="w-7 h-7 text-accentCyan z-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-cyan)" />
                  <stop offset="100%" stopColor="var(--accent-purple)" />
                </linearGradient>
              </defs>
              <path d="M16 2L30 10V22L16 30L2 22V10L16 2Z" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8L25 13V19L16 24L7 19V13L16 8Z" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeDasharray="2 2" className="opacity-60" />
              <path d="M12 13L9 16L12 19" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 13L23 16L20 19" stroke="var(--accent-purple)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="16" r="2.5" fill="var(--accent-green)" className="animate-pulse" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tight bg-gradientGlow bg-clip-text text-transparent">
              SCFA Portal
            </h1>
            <p className="text-xs text-textSecondary font-semibold">Coding Feedback Analyzer</p>
          </div>
        </div>

        {/* Dropdowns, Switcher & upload controls */}
        <div className="flex items-center gap-3.5 flex-wrap flex-1 justify-start ml-4">
          {/* Program Select */}
          <div className="flex items-center gap-2.5 bg-bgSurfaceInput border border-panelBorder rounded-lg px-3.5 py-2.5 focus-within:border-accentCyan focus-within:shadow-[0_0_8px_rgba(0,242,254,0.15)] transition-all">
            <span className="text-[11px] font-extrabold text-textMuted uppercase tracking-wider">Program:</span>
            <select
              value={selectedProgram}
              onChange={(e) => {
                setSelectedProgram(e.target.value);
                const firstProgContest = contestsList.find(c => (c.program_name || 'General Contests') === e.target.value || e.target.value === 'All');
                if (firstProgContest) setActiveContestKey(firstProgContest.key);
              }}
              className="bg-transparent text-sm text-textPrimary font-bold outline-none cursor-pointer pr-1"
            >
              {uniquePrograms.map(p => (
                <option key={p} value={p} className="bg-panelBgSolid text-textPrimary">
                  {p === 'All' ? 'All Programs' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Contest Select */}
          <div className="flex items-center gap-2.5 bg-bgSurfaceInput border border-panelBorder rounded-lg px-3.5 py-2.5 focus-within:border-accentCyan focus-within:shadow-[0_0_8px_rgba(0,242,254,0.15)] transition-all">
            <span className="text-[11px] font-extrabold text-textMuted uppercase tracking-wider">Contest:</span>
            <select
              value={activeContestKey}
              onChange={(e) => setActiveContestKey(e.target.value)}
              disabled={filteredContests.length === 0}
              className="bg-transparent text-sm text-textPrimary font-bold outline-none cursor-pointer pr-1"
            >
              {filteredContests.length === 0 ? (
                <option value="" className="bg-panelBgSolid text-textPrimary">No contests loaded</option>
              ) : (
                filteredContests.map(c => (
                  <option key={c.key} value={c.key} className="bg-panelBgSolid text-textPrimary">
                    {c.contest_name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Delete Contest (Admin only) */}
          {user?.role === 'admin' && activeContestKey && (
            <button
              onClick={handleDeleteContest}
              className="p-2.5 bg-accentRose/10 hover:bg-accentRose border border-accentRose/20 hover:border-accentRose hover:text-darkBg text-accentRose rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              title="Delete this contest permanently"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Theme Mode Switcher Toggle */}
          <div className="flex items-center bg-bgSurfaceInput border border-panelBorder rounded-lg p-1">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-extrabold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-accentPurple text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Light Mode: Clean Dashboard"
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-extrabold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gradientGlow text-darkBg shadow-glow'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Dark Mode: Glowing Dark Dashboard"
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </button>
          </div>

          {/* Upload */}
          <button 
            onClick={handleUploadClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-accentCyan/10 hover:bg-accentCyan border border-accentCyan/25 hover:border-accentCyan hover:text-darkBg text-accentCyan text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer"
          >
            <CloudUpload className="w-4.5 h-4.5" />
            <span>Upload JSON</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Run Critique (Admin only) */}
          {user?.role === 'admin' && (
            <button
              onClick={handleRunAICritique}
              disabled={!activeContestKey || (widget.visible && widget.status !== 'completed' && widget.status !== 'aborted')}
              className="flex items-center gap-1.5 px-4 py-2 bg-accentPurple/10 hover:bg-accentPurple border border-accentPurple/25 hover:border-accentPurple hover:text-darkBg text-accentPurple text-sm font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Re-run contest analysis with full OpenAI GPT-4o-mini AI Critique"
            >
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              <span>Run AI Critique</span>
            </button>
          )}
        </div>

        {/* Global Metadata metrics */}
        <div className="flex items-center gap-3.5 text-sm flex-wrap">
          <div className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3.5 py-2 font-medium">
            <span className="text-textSecondary">Students:</span> <span className="font-bold text-textPrimary">{appData?.metadata?.total_students || '-'}</span>
          </div>
          <div className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3.5 py-2 font-medium">
            <span className="text-textSecondary">Submissions:</span> <span className="font-bold text-textPrimary">{appData?.metadata?.total_submissions || '-'}</span>
          </div>
          {appData && (
            <div className={`flex items-center gap-1.5 border px-3.5 py-2 rounded-lg font-extrabold ${
              appData.metadata?.openai_api_used 
                ? 'text-accentGreen bg-accentGreen/5 border-accentGreen/25'
                : 'text-accentOrange bg-accentOrange/5 border-accentOrange/25'
            }`}>
              {appData.metadata?.openai_api_used ? 'AI Feedback Active' : 'Local Metrics Only'}
            </div>
          )}

          {/* Custom OpenAI Key config button */}
          <button
            onClick={() => setKeyModalOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg font-extrabold transition-colors cursor-pointer ${
              openaiKey 
                ? 'text-accentCyan bg-accentCyan/5 border-accentCyan/25 hover:bg-accentCyan/15'
                : 'text-textSecondary bg-bgSurfaceInput border-panelBorder hover:border-textSecondary'
            }`}
            title={openaiKey ? 'Change custom OpenAI API Key' : 'Configure custom OpenAI API Key'}
          >
            <Key className="w-4 h-4 animate-pulse" />
            <span>{openaiKey ? 'Key Set' : 'Configure API Key'}</span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 bg-bgSurfaceInput border border-panelBorder rounded-lg px-3.5 py-2">
            <span className="text-textSecondary font-semibold capitalize">{user.role}</span>
            <span className="text-panelBorder">|</span>
            <button
              onClick={handleLogout}
              className="text-accentRose hover:text-accentRose/80 font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Log out of SCFA"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <nav className="flex bg-headerBg border-b border-panelBorder px-6 gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-4.5 text-[15px] font-bold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-accentCyan text-accentCyan'
              : 'border-transparent text-textSecondary hover:text-textPrimary'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`flex items-center gap-2 px-5 py-4.5 text-[15px] font-bold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer ${
            activeTab === 'problems'
              ? 'border-accentCyan text-accentCyan'
              : 'border-transparent text-textSecondary hover:text-textPrimary'
          }`}
        >
          <Code className="w-5 h-5" />
          <span>Problem Explorer</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-5 py-4.5 text-[15px] font-bold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer ${
            activeTab === 'students'
              ? 'border-accentCyan text-accentCyan'
              : 'border-transparent text-textSecondary hover:text-textPrimary'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Student Portal</span>
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-2 px-5 py-4.5 text-[15px] font-bold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer ${
            activeTab === 'progress'
              ? 'border-accentCyan text-accentCyan'
              : 'border-transparent text-textSecondary hover:text-textPrimary'
          }`}
        >
          <TrendingUp className="w-4.5 h-4.5" />
          <span>Progress Tracker</span>
        </button>
      </nav>

      {/* Tab Panels */}
      <main className="flex-1 p-6 max-w-[1400px] w-full mx-auto">
        {!activeContestKey && activeTab !== 'progress' ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center text-textSecondary select-none">
            <CloudUpload className="w-16 h-16 text-accentCyan/30 mb-4 animate-bounce" />
            <h2 className="text-xl font-black text-textPrimary">No Contest Loaded</h2>
            <p className="text-sm text-textMuted max-w-sm mt-1.5">
              Please upload student contest submission JSON files or select an existing contest from the header dropdown to begin!
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <ContestDashboard 
                problemsData={appData?.problems} 
                metadata={appData?.metadata} 
              />
            )}

            {activeTab === 'problems' && (
              <ProblemExplorer 
                problemsData={appData?.problems} 
              />
            )}

            {activeTab === 'students' && (
              <div className="flex flex-col lg:flex-row gap-6 h-[72vh]">
                <Sidebar
                  students={appData?.students}
                  selectedStudentEmail={activeStudentEmail}
                  onSelectStudent={setActiveStudentEmail}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterType={filterType}
                  setFilterType={setFilterType}
                />
                <div className="flex-1 overflow-y-auto h-full pr-1">
                  <StudentPortal
                    student={activeStudentEmail ? appData?.students[activeStudentEmail] : null}
                    email={activeStudentEmail}
                    role={user.role}
                    contestKey={activeContestKey}
                    onSaveFeedback={handleSaveStudentFeedback}
                    onRunSingleAI={handleRunSingleStudentAI}
                    isSingleAnalyzing={isSingleAnalyzing}
                    onViewCode={handleOpenCodeViewer}
                    onViewAttemptCode={handleOpenAttemptCodeViewer}
                  />
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <ProgressTracker 
                progressData={progressData}
                onSelectStudent={(email) => {
                  setActiveStudentEmail(email);
                  setActiveTab('students');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Status widget */}
      <ProgressWidget
        visible={widget.visible}
        contestName={widget.contestName}
        status={widget.status}
        processedCount={widget.processedCount}
        totalStudents={widget.totalStudents}
        costUsd={widget.costUsd}
        costLimit={widget.costLimit}
        promptTokens={widget.promptTokens}
        completionTokens={widget.completionTokens}
        onAbort={handleAbortAnalysis}
        isSingleStudent={widget.isSingleStudent}
      />

      {/* Code Viewer Modal */}
      <CodeCompareModal
        isOpen={codeModal.isOpen}
        onClose={() => setCodeModal(prev => ({ ...prev, isOpen: false }))}
        title={codeModal.title}
        firstCode={codeModal.firstCode}
        bestCode={codeModal.bestCode}
        timelineSummary={codeModal.timelineSummary}
        selectedAttemptCode={codeModal.selectedAttemptCode}
        selectedAttemptNumber={codeModal.selectedAttemptNumber}
      />

      {/* Upload Settings Modal */}
      {uploadModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-panelBgSolid border border-panelBorder rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-headerBg px-6 py-4 flex justify-between items-center border-b border-panelBorder">
              <h2 className="text-base font-extrabold text-textPrimary uppercase tracking-wider">Upload & Group Contest</h2>
              <button 
                onClick={() => setUploadModal(prev => ({ ...prev, isOpen: false }))}
                className="text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div className="bg-bgSurfaceInput border border-panelBorder p-3 rounded-lg text-sm leading-normal">
                <span className="font-bold text-textSecondary">Selected File:</span>{' '}
                <span className="font-mono text-textPrimary break-all">{uploadModal.fileName}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">Contest Name</label>
                <input
                  type="text"
                  value={uploadModal.contestName}
                  onChange={(e) => setUploadModal(prev => ({ ...prev, contestName: e.target.value }))}
                  placeholder="e.g. Placement Contest 5"
                  className="w-full px-3 py-2.5 text-sm bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">Program / Cohort Group</label>
                <select
                  value={uploadModal.programSelect}
                  onChange={(e) => setUploadModal(prev => ({ ...prev, programSelect: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary outline-none cursor-pointer transition-all"
                >
                  {uniquePrograms.filter(p => p !== 'All').map(p => (
                    <option key={p} value={p} className="bg-panelBgSolid text-textPrimary">{p}</option>
                  ))}
                  {!uniquePrograms.includes('General Contests') && <option value="General Contests" className="bg-panelBgSolid text-textPrimary">General Contests</option>}
                  <option value="__NEW__" className="bg-panelBgSolid text-textPrimary">➕ Create New Program...</option>
                </select>
              </div>

              {uploadModal.programSelect === '__NEW__' && (
                <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-150">
                  <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">New Program Name</label>
                  <input
                    type="text"
                    value={uploadModal.newProgramName}
                    onChange={(e) => setUploadModal(prev => ({ ...prev, newProgramName: e.target.value }))}
                    placeholder="e.g. Winter Bootcamp 2026"
                    className="w-full px-3 py-2.5 text-sm bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary outline-none transition-all"
                  />
                </div>
              )}

              {/* Checkbox: Run AI Critique */}
              <div className="flex flex-col gap-2 bg-bgSurfaceInput border border-panelBorder p-3.5 rounded-lg">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={runAiUpload}
                    disabled={user.role === 'faculty' && !openaiKey}
                    onChange={(e) => setRunAiUpload(e.target.checked)}
                    className="w-4 h-4 rounded text-accentCyan focus:ring-accentCyan border-panelBorder cursor-pointer accent-accentCyan disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className={`text-sm font-extrabold ${user.role === 'faculty' && !openaiKey ? 'text-textMuted' : 'text-textPrimary'}`}>
                    Run AI Critique on Upload
                  </span>
                </label>
                {user.role === 'faculty' && !openaiKey && (
                  <p className="text-[11px] text-accentOrange leading-normal font-semibold">
                    ⚠️ You must configure your personal OpenAI API Key in Settings (key icon in header) to run AI critiques. Uploading will run in <strong>dry-run mode</strong> (local metrics calculation only).
                  </p>
                )}
                {user.role === 'admin' && (
                  <p className="text-[11px] text-textMuted leading-normal font-semibold">
                    Admin analysis will run using the server's global OpenAI API key.
                  </p>
                )}
              </div>

              {runAiUpload && (
                <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-150">
                  <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">AI Cost Threshold Limit (USD)</label>
                  <div className="flex items-center gap-3 bg-bgSurfaceInput border border-panelBorder p-3 rounded-lg">
                    <span className="text-sm font-semibold text-accentCyan">$</span>
                    <input
                      type="number"
                      value={uploadModal.costLimit}
                      onChange={(e) => setUploadModal(prev => ({ ...prev, costLimit: parseFloat(e.target.value) || 0.50 }))}
                      step="0.05"
                      min="0.01"
                      className="w-20 bg-bgSurfaceActive border border-panelBorder px-2.5 py-1.5 text-sm rounded outline-none text-textPrimary font-mono font-bold focus:border-accentCyan"
                    />
                    <span className="text-[10px] text-textMuted leading-normal">
                      Analysis pauses and saves checkpoint when OpenAI API costs exceed this amount.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-headerBg px-6 py-4 border-t border-panelBorder flex justify-end gap-3.5">
              <button
                onClick={() => setUploadModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-panelBorder text-textSecondary hover:text-textPrimary rounded-lg text-sm font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                className="flex items-center gap-1.5 px-4 py-2 bg-accentCyan hover:bg-accentCyan/80 text-darkBg rounded-lg text-sm font-bold shadow-glow transition-all cursor-pointer"
              >
                <BarChart2 className="w-4.5 h-4.5" />
                <span>Start Analysis</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OpenAI API Key Configuration Modal */}
      {keyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-panelBgSolid border border-panelBorder rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-headerBg px-6 py-4 flex justify-between items-center border-b border-panelBorder">
              <h2 className="text-base font-extrabold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-5 h-5 text-accentCyan animate-pulse" />
                <span>Configure OpenAI API Key</span>
              </h2>
              <button 
                onClick={() => setKeyModalOpen(false)}
                className="text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <p className="text-xs text-textSecondary leading-relaxed bg-bgSurfaceInput border border-panelBorder/30 p-3.5 rounded-xl">
                Enter your personal OpenAI API Key below. It is stored <strong>locally in your browser</strong> (<code className="font-mono bg-bgSurfaceActive px-1 py-0.5 rounded border border-panelBorder/20 text-accentCyan">localStorage</code>) and is sent directly in request headers. It is never stored on the server's disk.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-textMuted uppercase tracking-wider">OpenAI API Key (sk-...)</label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    setOpenaiKey(val);
                  }}
                  placeholder="sk-proj-..."
                  className="w-full px-3.5 py-2.5 text-sm bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary outline-none transition-all font-mono placeholder:text-textMuted text-textPrimary"
                />
              </div>
            </div>

            <div className="bg-headerBg px-6 py-4 border-t border-panelBorder flex justify-between items-center gap-3.5">
              <button
                onClick={() => {
                  setOpenaiKey('');
                  localStorage.removeItem('scfa-openai-key');
                  showToast('Custom API Key removed. Using server default.', 'info');
                  setKeyModalOpen(false);
                }}
                className="px-3 py-2 border border-accentRose/30 hover:border-accentRose hover:bg-accentRose/5 text-accentRose rounded-lg text-xs font-bold transition-colors cursor-pointer"
                disabled={!openaiKey}
              >
                Clear Key
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setKeyModalOpen(false)}
                  className="px-4 py-2 border border-panelBorder text-textSecondary hover:text-textPrimary rounded-lg text-sm font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('scfa-openai-key', openaiKey);
                    showToast(openaiKey ? 'Custom API Key configured.' : 'Custom API Key removed.', 'success');
                    setKeyModalOpen(false);
                  }}
                  className="px-4 py-2 bg-accentCyan hover:bg-accentCyan/80 text-darkBg rounded-lg text-sm font-bold shadow-glow transition-all cursor-pointer"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
