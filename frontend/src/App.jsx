import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, Code, Users, Sun, Moon, TrendingUp, CloudUpload, Sparkles, 
  Settings, CheckCircle, AlertTriangle, Play, HelpCircle, X, Trash2, LogOut, Key,
  Database, Download, Upload, Mail
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import ContestDashboard from './components/ContestDashboard';
import StudentPortal from './components/StudentPortal';
import ProgressTracker from './components/ProgressTracker';
import CodeCompareModal from './components/CodeCompareModal';
import ProgressWidget from './components/ProgressWidget';
import ProblemExplorer from './components/ProblemExplorer';
import EmailFeedbackHub from './components/EmailFeedbackHub';

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
  const [activeStudentDetail, setActiveStudentDetail] = useState(null); // Full detail (diffs+feedback) loaded on demand
  const [studentDetailLoading, setStudentDetailLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('All');
  const [sectionsMetadata, setSectionsMetadata] = useState({});
  const [settingsTab, setSettingsTab] = useState('api_key');
  const [draftSectionsMetadata, setDraftSectionsMetadata] = useState({});

  useEffect(() => {
    setActiveStudentEmail(null);
    setActiveStudentDetail(null);
  }, [selectedSection]);

  // Fetch full student detail (diffs + AI feedback) on-demand when a student is selected
  useEffect(() => {
    if (!activeStudentEmail || !activeContestKey) {
      setActiveStudentDetail(null);
      return;
    }
    let cancelled = false;
    setStudentDetailLoading(true);
    setActiveStudentDetail(null);
    authenticatedFetch(`/api/contests/${activeContestKey}/students/${encodeURIComponent(activeStudentEmail)}`)
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => { if (!cancelled) { setActiveStudentDetail(data); setStudentDetailLoading(false); } })
      .catch(() => { if (!cancelled) { setStudentDetailLoading(false); } });
    return () => { cancelled = true; };
  }, [activeStudentEmail, activeContestKey]);


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
    problemsFileName: '',
    problemsFileText: '',
    contestName: '',
    programSelect: 'General Contests',
    newProgramName: '',
    costLimit: 0.50,
    uploadType: 'oa',
    isUpdateMode: false,
    selectedContestKey: ''
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
    isSingleStudent: false,
    dryRun: false
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
  const fileInputBackupRef = useRef(null);
  const latestRequestedContestKeyRef = useRef('');

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

  const handleExportBackup = async () => {
    try {
      showToast('Preparing backup zip...', 'info');
      const res = await authenticatedFetch('/api/backup/export');
      if (!res.ok) {
        throw new Error('Failed to export backup from server.');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scfa_backup_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Backup downloaded successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to export backup.', 'error');
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      showToast('Uploading and restoring backup...', 'info');
      const res = await fetch('/api/backup/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to import backup.');
      }
      showToast('Backup restored successfully! Refreshing data...', 'success');
      fetchContests();
      setKeyModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to import backup.', 'error');
    } finally {
      if (fileInputBackupRef.current) {
        fileInputBackupRef.current.value = '';
      }
    }
  };

  const fetchSectionsMetadata = async () => {
    try {
      const res = await authenticatedFetch('/api/sections/metadata');
      if (res.ok) {
        const data = await res.json();
        setSectionsMetadata(data);
      }
    } catch (err) {
      console.error('Failed to load sections metadata:', err);
    }
  };

  const handleSaveSectionsMetadata = async () => {
    try {
      const res = await authenticatedFetch('/api/sections/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftSectionsMetadata)
      });
      if (res.ok) {
        setSectionsMetadata(draftSectionsMetadata);
        showToast('Section aliases saved and synced successfully.', 'success');
        setKeyModalOpen(false);
      } else {
        throw new Error('Failed to save section mappings.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving section mappings.', 'error');
    }
  };

  useEffect(() => {
    if (keyModalOpen) {
      setDraftSectionsMetadata({ ...sectionsMetadata });
      setSettingsTab('api_key');
    }
  }, [keyModalOpen, sectionsMetadata]);

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
    fetchSectionsMetadata();
    
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
    latestRequestedContestKeyRef.current = key;
    setSelectedSection('All'); // Reset section filter when switching contests
    try {
      const res = await authenticatedFetch(`/api/contests/${key}/summary`);
      if (!res.ok) throw new Error('Contest report not found');
      const data = await res.json();
      if (latestRequestedContestKeyRef.current === key) {
        // Normalize problem metadata into each student's attempts_details
        const problemsMeta = data.problems_metadata || data.problems || {};
        if (data.students && Object.keys(problemsMeta).length > 0) {
          Object.values(data.students).forEach(student => {
            // Build set of question IDs this student has attempted
            const attemptedQids = new Set(
              (student.attempts_details || []).map(d => String(d.question_id))
            );
            // 1. Normalise problem_title -> title on existing attempts
            (student.attempts_details || []).forEach(detail => {
              const qid = String(detail.question_id);
              const meta = problemsMeta[qid] || {};
              if (!detail.title && (detail.problem_title || meta.title)) {
                detail.title = detail.problem_title || meta.title;
              }
              if (!detail.optimal_approach && meta.optimal_approach) {
                detail.optimal_approach = meta.optimal_approach;
              }
              if (!detail.problem_description && meta.description) {
                detail.problem_description = meta.description;
              }
              if (!detail.problem_constraints && meta.constraints) {
                detail.problem_constraints = meta.constraints;
              }
              if (!detail.resources && meta.resources) {
                detail.resources = meta.resources;
              }
            });
            // 2. Inject stubs for unattempted problems
            if (!student.attempts_details) student.attempts_details = [];
            Object.entries(problemsMeta).forEach(([qid, meta]) => {
              if (!attemptedQids.has(String(qid))) {
                student.attempts_details.push({
                  question_id: parseInt(qid),
                  title: meta.title || `Problem #${qid}`,
                  total_attempts: 0,
                  solved: false,
                  best_tests_passed: 0,
                  total_test_cases: 0,
                  best_attempt_index: 0,
                  timeline_summary: '',
                  first_attempt_code: null,
                  final_attempt_code: null,
                  optimal_approach: meta.optimal_approach || '',
                  problem_description: meta.description || '',
                  problem_constraints: meta.constraints || '',
                  resources: meta.resources || '',
                  _unattempted: true
                });
              }
            });
            // Sort: attempted first, then unattempted, both by question_id
            student.attempts_details.sort((a, b) => {
              if (a._unattempted !== b._unattempted) return a._unattempted ? 1 : -1;
              return a.question_id - b.question_id;
            });
          });
        }
        setAppData(data);
        setActiveStudentEmail(null); // Reset active student
        if (data.metadata?.is_mock && activeTab === 'problems') {
          setActiveTab('overview');
        }
      }
    } catch (err) {
      console.error('Error fetching contest details:', err);
      if (latestRequestedContestKeyRef.current === key) {
        showToast('No parsed data exists for this contest. Run AI Critique first.', 'warning');
        setAppData(null);
      }
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

  const getFilteredAppData = () => {
    if (!appData) return null;
    
    if (appData.metadata && appData.metadata.is_mock) {
      if (selectedSection === 'All') return appData;
      const filteredStudents = {};
      Object.entries(appData.students || {}).forEach(([email, s]) => {
        const secId = s.assignment_id ? String(s.assignment_id) : 'Unassigned';
        if (secId === String(selectedSection)) {
          filteredStudents[email] = s;
        }
      });
      return {
        ...appData,
        students: filteredStudents
      };
    }

    if (selectedSection === 'All') return appData;

    const filteredStudents = {};
    Object.entries(appData.students || {}).forEach(([email, s]) => {
      const secId = s.assignment_id ? String(s.assignment_id) : 'Unassigned';
      if (secId === String(selectedSection)) {
        filteredStudents[email] = s;
      }
    });

    const studentsList = Object.values(filteredStudents);
    const totalStudents = studentsList.length;
    let totalSubmissions = 0;
    studentsList.forEach(s => {
      totalSubmissions += s.total_submissions || 0;
    });

    const filteredProblems = {};
    Object.entries(appData.problems || {}).forEach(([qid, origP]) => {
      filteredProblems[qid] = {
        question_id: qid,
        title: origP.title,
        description: origP.description,
        total_attempts: 0,
        unique_students: 0,
        passed_students: 0,
        success_rate_percent: 0,
        avg_attempts_to_pass: 0,
        status_distribution: {}
      };
    });

    studentsList.forEach(s => {
      (s.attempts_details || []).forEach(detail => {
        const qid = String(detail.question_id);
        const p = filteredProblems[qid];
        if (p) {
          p.unique_students += 1;
          p.total_attempts += detail.total_attempts || 0;
          if (detail.solved) {
            p.passed_students += 1;
          }
          (detail.attempts_history || []).forEach(historyItem => {
            const status = historyItem.status_name || 'Unknown';
            p.status_distribution[status] = (p.status_distribution[status] || 0) + 1;
          });
        }
      });
    });

    Object.keys(filteredProblems).forEach(qid => {
      const p = filteredProblems[qid];
      if (p.unique_students > 0) {
        p.success_rate_percent = Math.round((p.passed_students / p.unique_students) * 100);
      } else {
        p.success_rate_percent = 0;
      }

      let solvedCount = 0;
      let attemptsSum = 0;
      studentsList.forEach(s => {
        const detail = (s.attempts_details || []).find(d => String(d.question_id) === qid);
        if (detail && detail.solved) {
          solvedCount += 1;
          attemptsSum += detail.best_attempt_index || 1;
        }
      });
      p.avg_attempts_to_pass = solvedCount > 0 ? Math.round((attemptsSum / solvedCount) * 10) / 10 : 0;
    });

    return {
      ...appData,
      metadata: {
        ...appData.metadata,
        total_students: totalStudents,
        total_submissions: totalSubmissions
      },
      problems: filteredProblems,
      students: filteredStudents
    };
  };

  const filteredAppData = getFilteredAppData();
  const isMock = filteredAppData?.metadata?.is_mock || false;

  const getDiscoveredAssignmentIds = () => {
    const ids = new Set();
    if (appData && appData.metadata && appData.metadata.assignment_ids) {
      appData.metadata.assignment_ids.forEach(id => {
        if (id) ids.add(String(id));
      });
    }
    if (appData && appData.students) {
      Object.values(appData.students).forEach(s => {
        if (s.assignment_id) ids.add(String(s.assignment_id));
      });
    }
    if (progressData && progressData.students) {
      Object.values(progressData.students).forEach(s => {
        Object.values(s.history || {}).forEach(h => {
          if (h.assignment_id) ids.add(String(h.assignment_id));
        });
      });
    }
    Object.keys(sectionsMetadata || {}).forEach(id => {
      if (id) ids.add(String(id));
    });
    return Array.from(ids);
  };

  const discoveredIds = getDiscoveredAssignmentIds();

  const getCurrentContextAssignmentIds = () => {
    const ids = new Set();
    if (activeTab === 'progress') {
      if (progressData && progressData.students) {
        Object.values(progressData.students).forEach(s => {
          Object.values(s.history || {}).forEach(h => {
            if (h.assignment_id) ids.add(String(h.assignment_id));
          });
        });
      }
    } else {
      if (appData && appData.students) {
        Object.values(appData.students).forEach(s => {
          if (s.assignment_id) ids.add(String(s.assignment_id));
        });
      }
      if (appData && appData.metadata && appData.metadata.assignment_ids) {
        appData.metadata.assignment_ids.forEach(id => {
          if (id) ids.add(String(id));
        });
      }
    }
    return Array.from(ids);
  };

  const currentContextIds = getCurrentContextAssignmentIds();

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
      isSingleStudent: false,
      dryRun: false
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
          completionTokens: data.completion_tokens || 0,
          dryRun: !!data.dry_run
        }));

        if (data.status === 'idle') {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          
          localStorage.removeItem('activeAnalysisKey');
          localStorage.removeItem('activeAnalysisCostLimit');
          localStorage.removeItem('activeAnalysisName');

          setWidget(prev => ({ ...prev, visible: false }));
          return;
        }

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

      // Update activeStudentDetail instantly if this is the student currently selected
      if (activeStudentEmail === email) {
        setActiveStudentDetail(data.student_data);
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

      // Update activeStudentDetail instantly if this is the student currently selected
      if (activeStudentEmail === email && activeStudentDetail) {
        setActiveStudentDetail({
          ...activeStudentDetail,
          custom_feedback: feedbackText
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

    const isMockFile = file.name.toLowerCase().includes('mock');
    setUploadModal({
      isOpen: true,
      fileName: file.name,
      fileText: text,
      problemsFileName: '',
      problemsFileText: '',
      contestName: defaultName,
      defaultContestName: defaultName,
      programSelect: selectedProgram !== 'All' ? selectedProgram : 'General Contests',
      newProgramName: '',
      costLimit: 0.50,
      isUpdateMode: false,
      selectedContestKey: '',
      uploadType: isMockFile ? 'mock' : 'oa'
    });
  };

  // Submit Upload Config and File
  const handleUploadSubmit = async () => {
    const { fileText, fileName, contestName, programSelect, newProgramName, costLimit, problemsFileText, problemsFileName, uploadType } = uploadModal;
    
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
    showToast('Uploading and processing file...', 'info');

    try {
      if (uploadType === 'mock') {
        const res = await authenticatedFetch(`/api/upload?filename=${encodeURIComponent(fileName)}&contest_name=${encodeURIComponent(cleanContestName)}&program_name=${encodeURIComponent(targetProgram)}&is_mock=true`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: fileText
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Mock file upload failed');

        if (fileInputRef.current) fileInputRef.current.value = '';
        showToast('Uploaded and processed AI Mock results successfully!', 'success');
        
        await loadContestsList();
        setActiveContestKey(data.contest_key);
        return;
      }

      // 1. If problems details file is loaded, upload it first
      if (problemsFileText) {
        const pRes = await authenticatedFetch(`/api/upload?filename=${encodeURIComponent(problemsFileName)}&contest_name=${encodeURIComponent(cleanContestName)}&is_problems=true`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: problemsFileText
        });
        const pData = await pRes.json();
        if (!pData.success) throw new Error(pData.message || 'Problems metadata upload failed');
      }

      // 2. Stream contest file upload
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
    // Use activeStudentDetail — the full on-demand record that contains source code
    const s = activeStudentDetail || appData?.students?.[email];
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
    // Use activeStudentDetail — the full on-demand record that contains source code
    const s = activeStudentDetail || appData?.students?.[email];
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
      <div className="flex items-center justify-center min-h-screen bg-darkBg text-textPrimary px-4 relative overflow-hidden">
        {/* Floating Theme Switcher */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center bg-bgSurfaceInput border border-panelBorder rounded-lg p-0.5 h-8">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-panelBgSolid text-accentPurple shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-panelBgSolid text-accentCyan shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-accentPurple/5 to-accentCyan/5 opacity-30 blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-panelBgSolid border border-panelBorder rounded-2xl shadow-2xl overflow-hidden glass-panel p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center gap-2.5 text-center">
            {/* Logo */}
            <div className="relative w-16 h-16 flex items-center justify-center bg-panelBg rounded-2xl border border-panelBorder shadow-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-accentCyan/20 to-accentPurple/20 rounded-2xl opacity-25 blur-xs animate-pulse" />
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
            
            <h1 className="text-2xl font-black bg-gradient-to-r from-accentCyan to-accentPurple bg-clip-text text-transparent mt-2">
              SCFA Portal Access
            </h1>
            <p className="text-sm text-textSecondary font-semibold">Coding Feedback Analyzer Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Role Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Select Role</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-textMuted">
                  <Users className="w-4 h-4" />
                </span>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  className="w-full bg-bgSurfaceInput border border-panelBorder rounded-lg pl-9 pr-10 py-2.5 text-sm text-textPrimary font-semibold outline-none focus:border-accentCyan focus:ring-1 focus:ring-accentCyan/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="faculty" className="bg-panelBgSolid text-textPrimary">Faculty (Read & Upload)</option>
                  <option value="admin" className="bg-panelBgSolid text-textPrimary">Admin (Full Control)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-textMuted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Passcode input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Passcode</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-textMuted">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter passcode"
                  required
                  className="w-full bg-bgSurfaceInput border border-panelBorder rounded-lg pl-9 pr-3 py-2.5 text-sm text-textPrimary outline-none focus:border-accentCyan focus:ring-1 focus:ring-accentCyan/20 transition-all placeholder:text-textMuted"
                />
              </div>
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
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-accentCyan to-accentPurple text-white text-sm font-bold rounded-lg hover:opacity-95 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
      <header className="bg-headerBg border-b border-panelBorder sticky top-0 z-40 px-4 py-2.5 flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between xl:py-3 xl:px-6">
        {/* Logo, Brand Title & Mobile Actions */}
        <div className="flex items-center justify-between gap-3 w-full xl:w-auto flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center bg-panelBg rounded-lg border border-panelBorder shadow-glow transition-all duration-300">
              <div className="absolute inset-0 bg-gradientGlow rounded-lg opacity-10 blur-xs" />
              <svg className="w-5 h-5 text-accentCyan z-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <h1 className="text-xs font-bold tracking-tight text-textPrimary leading-none">
                SCFA Portal
              </h1>
              <span className="text-[9px] text-textMuted font-medium mt-0.5">Coding Feedback Analyzer</span>
            </div>
          </div>

          {/* Mobile-Only Actions */}
          <div className="flex xl:hidden items-center gap-1.5">
            {/* Mobile Theme switcher */}
            <div className="flex items-center bg-bgSurfaceInput border border-panelBorder rounded-lg p-0.5 h-7">
              <button
                onClick={() => setTheme('light')}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  theme === 'light' ? 'bg-panelBgSolid text-accentPurple shadow-sm' : 'text-textSecondary'
                }`}
                title="Light Mode"
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  theme === 'dark' ? 'bg-panelBgSolid text-accentCyan shadow-sm' : 'text-textSecondary'
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3 h-3" />
              </button>
            </div>

            {/* Mobile Account config group */}
            <div className="flex items-center gap-1 bg-bgSurfaceInput border border-panelBorder rounded-lg px-2 py-0.5 h-7">
              <button
                onClick={() => setKeyModalOpen(true)}
                className={`p-0.5 rounded transition-colors cursor-pointer ${
                  openaiKey ? 'text-accentCyan' : 'text-textSecondary'
                }`}
                title="Configure OpenAI Key"
              >
                <Key className="w-3 h-3" />
              </button>
              <span className="text-panelBorder text-[10px]">|</span>
              <button
                onClick={handleLogout}
                className="p-0.5 text-accentRose transition-colors cursor-pointer flex items-center justify-center"
                title="Sign Out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Group: Dropdowns & Action Buttons */}
        <div className="flex items-center gap-2 flex-nowrap flex-1 w-full xl:w-auto xl:ml-4 overflow-x-auto">
          {/* Program Select */}
          <div className="flex items-center gap-1.5 bg-bgSurfaceInput border border-panelBorder rounded-lg px-2 py-1 transition-all shrink-0">
            <span className="text-[9px] font-semibold text-textMuted uppercase tracking-wider whitespace-nowrap">Prog</span>
            <select
              value={selectedProgram}
              onChange={(e) => {
                setSelectedProgram(e.target.value);
                const firstProgContest = contestsList.find(c => (c.program_name || 'General Contests') === e.target.value || e.target.value === 'All');
                if (firstProgContest) setActiveContestKey(firstProgContest.key);
              }}
              className="bg-transparent text-[11px] text-textPrimary font-semibold outline-none cursor-pointer pr-1 max-w-[120px]"
            >
              {uniquePrograms.map(p => (
                <option key={p} value={p} className="bg-panelBgSolid text-textPrimary">
                  {p === 'All' ? 'All' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Contest Select */}
          <div className="flex items-center gap-1.5 bg-bgSurfaceInput border border-panelBorder rounded-lg px-2 py-1 transition-all shrink-0">
            <span className="text-[9px] font-semibold text-textMuted uppercase tracking-wider whitespace-nowrap">Contest</span>
            <select
              value={activeContestKey}
              onChange={(e) => setActiveContestKey(e.target.value)}
              disabled={filteredContests.length === 0}
              className="bg-transparent text-[11px] text-textPrimary font-semibold outline-none cursor-pointer pr-1 max-w-[140px]"
            >
              {filteredContests.length === 0 ? (
                <option value="" className="bg-panelBgSolid text-textPrimary">No contests</option>
              ) : (
                filteredContests.map(c => (
                  <option key={c.key} value={c.key} className="bg-panelBgSolid text-textPrimary">
                    {c.contest_name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Section Select */}
          {currentContextIds.length > 1 && (
            <div className="flex items-center gap-1 bg-bgSurfaceInput border border-panelBorder rounded-lg px-1.5 py-1 shrink-0 animate-in fade-in zoom-in-95 duration-200">
              <span className="text-[9px] font-semibold text-textMuted uppercase tracking-wider whitespace-nowrap">Sec</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-transparent text-[11px] text-textPrimary font-semibold outline-none cursor-pointer pr-0.5 max-w-[80px]"
              >
                <option value="All" className="bg-panelBgSolid text-textPrimary">All</option>
                {currentContextIds.map(id => (
                  <option key={id} value={id} className="bg-panelBgSolid text-textPrimary">
                    {sectionsMetadata[id] || `Sec ${id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Delete Contest (Admin only) */}
          {user?.role === 'admin' && activeContestKey && (
            <button
              onClick={handleDeleteContest}
              className="p-1.5 bg-accentRose/10 hover:bg-accentRose border border-accentRose/20 hover:border-accentRose hover:text-darkBg text-accentRose rounded-lg transition-colors cursor-pointer flex items-center justify-center h-7"
              title="Delete contest"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {/* Upload Button */}
          <button 
            onClick={handleUploadClick}
            className="flex items-center gap-1 px-2.5 py-1 bg-accentCyan/10 hover:bg-accentCyan border border-accentCyan/20 hover:border-accentCyan hover:text-darkBg text-accentCyan text-[11px] font-semibold rounded-lg transition-all cursor-pointer h-7"
          >
            <CloudUpload className="w-3 h-3" />
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
              className="flex items-center gap-1 px-2.5 py-1 bg-accentPurple/10 hover:bg-accentPurple border border-accentPurple/20 hover:border-accentPurple hover:text-darkBg text-accentPurple text-[11px] font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer h-7"
              title="Re-run AI Critique"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run AI Critique</span>
            </button>
          )}
        </div>

        {/* Global Metadata metrics and account controls (Desktop only - hidden on mobile) */}
        <div className="hidden xl:flex items-center gap-2.5 text-xs flex-wrap flex-shrink-0">
          {/* Quick Metrics */}
          <div className="flex items-center bg-bgSurfaceInput border border-panelBorder rounded-lg px-2 py-1 gap-2 font-medium text-[10px]">
            <span className="text-textSecondary">Students: <span className="font-semibold text-textPrimary">{appData?.metadata?.total_students || '-'}</span></span>
            <span className="text-panelBorder">|</span>
            <span className="text-textSecondary">Submissions: <span className="font-semibold text-textPrimary">{appData?.metadata?.total_submissions || '-'}</span></span>
          </div>

          {appData && (
            <div className={`text-[9px] font-bold px-1.5 py-1 rounded-lg border ${
              appData.metadata?.openai_api_used 
                ? 'text-accentGreen bg-accentGreen/5 border-accentGreen/15'
                : 'text-accentOrange bg-accentOrange/5 border-accentOrange/15'
            }`}>
              {appData.metadata?.openai_api_used ? 'AI Active' : 'Local Only'}
            </div>
          )}

          {/* Theme Mode Switcher Toggle */}
          <div className="flex items-center bg-bgSurfaceInput border border-panelBorder rounded-lg p-0.5 h-8">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-panelBgSolid text-accentPurple shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-panelBgSolid text-accentCyan shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Navigation tabs */}
      <nav className="flex items-center justify-between bg-headerBg border-b border-panelBorder px-6 flex-shrink-0">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer flex-shrink-0 ${
              activeTab === 'overview'
                ? 'border-accentCyan text-accentCyan'
                : 'border-transparent text-textSecondary hover:text-textPrimary'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Overview</span>
          </button>
          {!isMock && (
            <button
              onClick={() => setActiveTab('problems')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer flex-shrink-0 ${
                activeTab === 'problems'
                  ? 'border-accentCyan text-accentCyan'
                  : 'border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Problem Explorer</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer flex-shrink-0 ${
              activeTab === 'students'
                ? 'border-accentCyan text-accentCyan'
                : 'border-transparent text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Portal</span>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer flex-shrink-0 ${
              activeTab === 'progress'
                ? 'border-accentCyan text-accentCyan'
                : 'border-transparent text-textSecondary hover:text-textPrimary'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Progress Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer flex-shrink-0 ${
              activeTab === 'email'
                ? 'border-accentCyan text-accentCyan'
                : 'border-transparent text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Feedback</span>
          </button>
        </div>

        {/* User Profile & Key config consolidated group (Desktop only) */}
        <div className="hidden xl:flex items-center gap-2 bg-bgSurfaceInput border border-panelBorder rounded-lg px-2.5 py-1 h-8 my-1.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-accentPurple' : 'bg-accentCyan'}`} />
            <span className="text-textPrimary font-semibold capitalize text-[10px]">{user.role}</span>
          </div>
          <span className="text-panelBorder">|</span>
          
          <button
            onClick={() => setKeyModalOpen(true)}
            className={`p-1 rounded hover:bg-bgSurfaceActive transition-colors cursor-pointer ${
              openaiKey ? 'text-accentCyan' : 'text-textSecondary hover:text-textPrimary'
            }`}
            title="Configure OpenAI API Key"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
          
          <span className="text-panelBorder">|</span>
          
          <button
            onClick={handleLogout}
            className="p-1 text-accentRose hover:bg-accentRose/10 rounded transition-colors cursor-pointer flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
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
                problemsData={filteredAppData?.problems} 
                metadata={filteredAppData?.metadata} 
                students={appData?.students}
                sectionsMetadata={sectionsMetadata}
                isMock={isMock}
              />
            )}

            {activeTab === 'problems' && !isMock && (
              <ProblemExplorer 
                problemsData={filteredAppData?.problems} 
              />
            )}

            {activeTab === 'students' && (
              <div className="flex flex-col lg:flex-row gap-6 h-[72vh]">
                <Sidebar
                  students={filteredAppData?.students}
                  selectedStudentEmail={activeStudentEmail}
                  onSelectStudent={setActiveStudentEmail}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  isMock={isMock}
                />
                <div className="flex-1 overflow-y-auto h-full pr-1">
                  <StudentPortal
                    student={activeStudentDetail}
                    email={activeStudentEmail}
                    role={user.role}
                    contestKey={activeContestKey}
                    onSaveFeedback={handleSaveStudentFeedback}
                    onRunSingleAI={handleRunSingleStudentAI}
                    isSingleAnalyzing={isSingleAnalyzing}
                    onViewCode={handleOpenCodeViewer}
                    onViewAttemptCode={handleOpenAttemptCodeViewer}
                    isLoading={studentDetailLoading}
                    isMock={isMock}
                  />
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <ProgressTracker 
                progressData={progressData}
                selectedSection={selectedSection}
                sectionsMetadata={sectionsMetadata}
                onSelectStudent={(email) => {
                  setActiveStudentEmail(email);
                  setActiveTab('students');
                }}
              />
            )}

            {activeTab === 'email' && (
              <EmailFeedbackHub 
                activeContestKey={activeContestKey}
                appData={appData}
                authenticatedFetch={authenticatedFetch}
                showToast={showToast}
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
        dryRun={widget.dryRun}
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
                <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">Assessment Type</label>
                <select
                  value={uploadModal.uploadType}
                  onChange={(e) => setUploadModal(prev => ({ ...prev, uploadType: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary outline-none cursor-pointer transition-all"
                >
                  <option value="oa" className="bg-panelBgSolid text-textPrimary">📝 Online Assessment (OA) Submissions</option>
                  <option value="mock" className="bg-panelBgSolid text-textPrimary">🤖 AI Mock Interview Results</option>
                </select>
              </div>

              <div className="flex gap-4 p-1 bg-bgSurfaceInput border border-panelBorder rounded-lg">
                <button
                  type="button"
                  onClick={() => setUploadModal(prev => ({ 
                    ...prev, 
                    isUpdateMode: false,
                    contestName: prev.defaultContestName || ''
                  }))}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded-md uppercase tracking-wider transition-all cursor-pointer ${!uploadModal.isUpdateMode ? 'bg-accentCyan text-darkBg shadow-md' : 'text-textSecondary hover:text-textPrimary'}`}
                >
                  🆕 Create New
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const firstContest = contestsList[0];
                    setUploadModal(prev => ({ 
                      ...prev, 
                      isUpdateMode: true,
                      selectedContestKey: firstContest ? firstContest.contest_key : '',
                      contestName: firstContest ? firstContest.contest_name : '',
                      programSelect: firstContest ? (firstContest.program_name || 'General Contests') : 'General Contests'
                    }));
                  }}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded-md uppercase tracking-wider transition-all cursor-pointer ${uploadModal.isUpdateMode ? 'bg-accentCyan text-darkBg shadow-md' : 'text-textSecondary hover:text-textPrimary'}`}
                >
                  🔄 Update Existing
                </button>
              </div>

              {uploadModal.isUpdateMode ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">Select to Update</label>
                  <select
                    value={uploadModal.selectedContestKey}
                    onChange={(e) => {
                      const selected = contestsList.find(c => c.contest_key === e.target.value);
                      if (selected) {
                        setUploadModal(prev => ({
                          ...prev,
                          selectedContestKey: selected.contest_key,
                          contestName: selected.contest_name,
                          programSelect: selected.program_name || 'General Contests'
                        }));
                      }
                    }}
                    className="w-full px-3 py-2.5 text-sm bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary outline-none cursor-pointer transition-all"
                  >
                    {contestsList.filter(c => (uploadModal.uploadType === 'mock' ? c.is_mock : !c.is_mock)).map(c => (
                      <option key={c.contest_key} value={c.contest_key} className="bg-panelBgSolid text-textPrimary">
                        {c.contest_name} ({c.program_name || 'General Contests'})
                      </option>
                    ))}
                    {contestsList.filter(c => (uploadModal.uploadType === 'mock' ? c.is_mock : !c.is_mock)).length === 0 && (
                      <option value="" disabled className="bg-panelBgSolid text-textMuted">No existing matches found</option>
                    )}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    value={uploadModal.contestName}
                    onChange={(e) => setUploadModal(prev => ({ ...prev, contestName: e.target.value }))}
                    placeholder="e.g. Placement Contest 5"
                    className="w-full px-3 py-2.5 text-sm bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary outline-none transition-all"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">Program / Cohort Group</label>
                <select
                  value={uploadModal.programSelect}
                  disabled={uploadModal.isUpdateMode}
                  onChange={(e) => setUploadModal(prev => ({ ...prev, programSelect: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary outline-none cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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

              {/* Optional Problems Details File */}
              {uploadModal.uploadType === 'oa' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-textSecondary uppercase tracking-wider">
                    Optional: Problems Details JSON (problem.json)
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={async (e) => {
                      if (e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const text = await file.text();
                        setUploadModal(prev => ({
                          ...prev,
                          problemsFileName: file.name,
                          problemsFileText: text
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-bgSurfaceInput border border-panelBorder hover:border-textSecondary rounded-lg text-textPrimary outline-none cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-extrabold file:uppercase file:bg-accentCyan/20 file:text-accentCyan hover:file:bg-accentCyan/30 file:cursor-pointer transition-all"
                  />
                  {uploadModal.problemsFileName && (
                    <span className="text-[10px] text-accentCyan font-mono mt-0.5 break-all">
                      📎 Loaded: {uploadModal.problemsFileName}
                    </span>
                  )}
                </div>
              )}

              {/* Checkbox: Run AI Critique */}
              {uploadModal.uploadType === 'oa' && (
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
              )}

              {uploadModal.uploadType === 'oa' && runAiUpload && (
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

      {/* System Settings & Backup Modal */}
      {keyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-panelBgSolid border border-panelBorder rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-headerBg px-6 py-4 flex justify-between items-center border-b border-panelBorder">
              <h2 className="text-base font-extrabold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-5 h-5 text-accentCyan animate-spin-slow" />
                <span>System Settings</span>
              </h2>
              <button 
                onClick={() => setKeyModalOpen(false)}
                className="text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {user?.role === 'admin' && (
              <div className="flex border-b border-panelBorder bg-headerBg/40">
                <button
                  onClick={() => setSettingsTab('api_key')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    settingsTab === 'api_key'
                      ? 'border-accentCyan text-accentCyan bg-bgSurfaceActive/20'
                      : 'border-transparent text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceHover/10'
                  }`}
                >
                  General & Backup
                </button>
                <button
                  onClick={() => setSettingsTab('sections')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    settingsTab === 'sections'
                      ? 'border-accentCyan text-accentCyan bg-bgSurfaceActive/20'
                      : 'border-transparent text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceHover/10'
                  }`}
                >
                  Configure Sections
                </button>
              </div>
            )}
            
            {(settingsTab === 'api_key' || user?.role !== 'admin') ? (
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

                {/* Data Backup & Restore Section */}
                <div className="border-t border-panelBorder/40 pt-4 mt-2 flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-accentCyan" />
                    <span>Data Backup & Restore</span>
                  </h3>
                  <p className="text-[11px] text-textMuted leading-normal">
                    Export all contest submissions and generated reports to a local ZIP file, or upload a previously exported ZIP backup to restore data.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportBackup}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-accentCyan/10 hover:bg-accentCyan/25 border border-accentCyan/20 text-accentCyan rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Backup</span>
                    </button>

                    <button
                      onClick={() => fileInputBackupRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-accentPurple/10 hover:bg-accentPurple/25 border border-accentPurple/20 text-accentPurple rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import Backup</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputBackupRef}
                      onChange={handleImportBackup}
                      accept=".zip"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 flex flex-col gap-4 max-h-[350px] overflow-y-auto animate-in fade-in duration-200">
                <p className="text-xs text-textSecondary leading-relaxed bg-bgSurfaceInput border border-panelBorder/30 p-3.5 rounded-xl">
                  Map assignment IDs from your contest files to readable Section names (e.g. <strong>Section A</strong>). These alias names will appear throughout the dashboard.
                </p>
                
                {discoveredIds.length === 0 ? (
                  <div className="text-center text-xs text-textMuted py-8">
                    No assignment IDs discovered yet. Upload a contest file containing assignment IDs first.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {discoveredIds.map(id => (
                      <div key={id} className="flex items-center gap-3 bg-bgSurfaceInput border border-panelBorder/30 p-2.5 rounded-lg">
                        <div className="flex flex-col min-w-[80px]">
                          <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">ID</span>
                          <span className="text-xs font-mono text-textPrimary font-bold">{id}</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Section Name / Alias</span>
                          <input
                            type="text"
                            value={draftSectionsMetadata[id] || ''}
                            placeholder={`Section Alias for ${id}`}
                            onChange={(e) => {
                              setDraftSectionsMetadata(prev => ({
                                ...prev,
                                [id]: e.target.value
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-bgSurfaceActive border border-panelBorder focus:border-accentCyan rounded text-textPrimary outline-none transition-all font-semibold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-headerBg px-6 py-4 border-t border-panelBorder flex justify-between items-center gap-3.5">
              <button
                onClick={() => {
                  setOpenaiKey('');
                  localStorage.removeItem('scfa-openai-key');
                  showToast('Custom API Key removed. Using server default.', 'info');
                  setKeyModalOpen(false);
                }}
                className="px-3 py-2 border border-accentRose/30 hover:border-accentRose hover:bg-accentRose/5 text-accentRose rounded-lg text-xs font-bold transition-colors cursor-pointer"
                disabled={settingsTab === 'sections' || !openaiKey}
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
                    if (settingsTab === 'sections' && user?.role === 'admin') {
                      handleSaveSectionsMetadata();
                    } else {
                      localStorage.setItem('scfa-openai-key', openaiKey);
                      showToast(openaiKey ? 'Custom API Key configured.' : 'Custom API Key removed.', 'success');
                      setKeyModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 bg-accentCyan hover:bg-accentCyan/80 text-darkBg rounded-lg text-sm font-bold shadow-glow transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
