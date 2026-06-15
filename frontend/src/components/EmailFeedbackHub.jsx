import React, { useState, useEffect, useRef } from 'react';
import { Mail, Settings, Send, Eye, Check, AlertCircle, Loader2, Users, CheckSquare, Square, RefreshCw, Lock } from 'lucide-react';

export default function EmailFeedbackHub({
  activeContestKey,
  appData,
  authenticatedFetch,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('composer'); // 'composer' or 'settings'
  
  // SMTP Config state
  const [smtpConfig, setSmtpConfig] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_use_tls: true,
    sender_email: '',
    sender_name: ''
  });
  
  // Template state
  const [template, setTemplate] = useState({
    subject_template: 'Personalized Coding Feedback: {contest_name}',
    body_prefix: 'Congratulations on completing the coding contest! We\'ve prepared a personalized feedback analysis to celebrate your achievements, highlight your coding strengths, and offer friendly guidance to help you conquer the next set of challenges. Happy coding!',
    body_suffix: 'Best regards,\nYour Programming Mentor',
    editorial_link: ''
  });
  
  // Selection state
  const [selectedEmails, setSelectedEmails] = useState([]);
  
  // Testing & Saving states
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isTestingConfig, setIsTestingConfig] = useState(false);
  
  // Sending state
  const [isSending, setIsSending] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState({
    status: 'idle',
    total_emails: 0,
    sent_emails: 0,
    failed_emails: [],
    error_message: null
  });
  
  // Preview state
  const [previewStudent, setPreviewStudent] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const pollIntervalRef = useRef(null);

  // Fetch SMTP Config on mount
  useEffect(() => {
    fetchSmtpConfig();
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Sync recipient selection list when appData changes
  useEffect(() => {
    if (appData?.students) {
      // Auto-select all students by default
      setSelectedEmails(Object.keys(appData.students));
    }
  }, [appData]);

  const fetchSmtpConfig = async () => {
    try {
      const res = await authenticatedFetch('/api/email/config');
      if (res.ok) {
        const data = await res.json();
        if (data.smtp_host) {
          setSmtpConfig(data);
        }
      }
    } catch (err) {
      console.error('Failed to load SMTP configuration:', err);
    }
  };

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSmtpConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'smtp_port' ? parseInt(value) || 0 : value)
    }));
  };

  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const res = await authenticatedFetch('/api/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });
      if (res.ok) {
        showToast('SMTP credentials saved successfully!', 'success');
        fetchSmtpConfig();
      } else {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to save configuration.');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConfig(true);
    try {
      const res = await authenticatedFetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
      } else {
        throw new Error(data.detail || 'Test connection failed.');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsTestingConfig(false);
    }
  };

  const toggleSelectEmail = (email) => {
    setSelectedEmails(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const toggleSelectAll = () => {
    if (!appData?.students) return;
    const all = Object.keys(appData.students);
    if (selectedEmails.length === all.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(all);
    }
  };

  const handlePreview = async (email) => {
    setPreviewStudent(email);
    setPreviewContent(null);
    setIsPreviewLoading(true);
    try {
      const params = new URLSearchParams({
        contest_key: activeContestKey,
        email: email,
        subject_template: template.subject_template,
        body_prefix: template.body_prefix,
        body_suffix: template.body_suffix,
        editorial_link: template.editorial_link
      });
      const res = await authenticatedFetch(`/api/email/preview?${params.toString()}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewContent(data);
      } else {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to generate preview.');
      }
    } catch (err) {
      showToast(err.message, 'error');
      setPreviewStudent(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSendEmails = async () => {
    if (selectedEmails.length === 0) {
      alert('Please select at least one student to email.');
      return;
    }
    const confirmSend = confirm(`Are you sure you want to send feedback emails to ${selectedEmails.length} students?`);
    if (!confirmSend) return;

    setIsSending(true);
    setDispatchStatus({
      status: 'sending',
      total_emails: selectedEmails.length,
      sent_emails: 0,
      failed_emails: [],
      error_message: null
    });

    try {
      const res = await authenticatedFetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contest_key: activeContestKey,
          emails: selectedEmails,
          subject_template: template.subject_template,
          body_prefix: template.body_prefix,
          body_suffix: template.body_suffix,
          editorial_link: template.editorial_link
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to start dispatch.');
      
      showToast('Bulk email dispatch started!', 'success');
      startPollingDispatch();
    } catch (err) {
      showToast(err.message, 'error');
      setIsSending(false);
    }
  };

  const startPollingDispatch = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await authenticatedFetch('/api/email/status');
        if (res.ok) {
          const data = await res.json();
          setDispatchStatus(data);
          
          if (data.status !== 'sending') {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
            setIsSending(false);
            if (data.status === 'completed') {
              showToast('All feedback emails sent successfully!', 'success');
            } else if (data.status === 'completed_with_errors') {
              showToast(`Email dispatch completed with ${data.failed_emails.length} errors.`, 'warning');
            } else if (data.status === 'failed') {
              showToast(`Email dispatch failed: ${data.error_message}`, 'error');
            }
          }
        }
      } catch (err) {
        console.error('Error polling email status:', err);
      }
    }, 1000);
  };

  const studentsList = appData?.students ? Object.values(appData.students) : [];
  const contestName = appData?.metadata?.contest_name || 'Active Contest';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="flex justify-between items-center bg-panelBg/10 p-4 rounded-xl border border-panelBorder">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accentPurple/10 text-accentPurple rounded-lg border border-accentPurple/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Bulk Email Feedback Center</h2>
            <p className="text-xs text-textMuted mt-0.5">Configure SMTP, draft critiques, and send formatted reports in bulk to students</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-bgSurfaceInput border border-panelBorder p-0.5 rounded-lg">
          <button
            onClick={() => setActiveTab('composer')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'composer'
                ? 'bg-panelBg text-textPrimary shadow-sm'
                : 'text-textMuted hover:text-textSecondary'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Compose & Dispatch
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'settings'
                ? 'bg-panelBg text-textPrimary shadow-sm'
                : 'text-textMuted hover:text-textSecondary'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> SMTP Settings
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      {activeTab === 'settings' ? (
        /* SMTP SETTINGS PANEL */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-5 rounded-xl border border-panelBorder flex flex-col gap-5">
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider border-b border-panelBorder/20 pb-3">SMTP Mail Configuration</h3>
            <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">SMTP Host</label>
                <input
                  type="text"
                  name="smtp_host"
                  value={smtpConfig.smtp_host}
                  onChange={handleConfigChange}
                  placeholder="smtp.gmail.com"
                  required
                  className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">SMTP Port</label>
                <input
                  type="number"
                  name="smtp_port"
                  value={smtpConfig.smtp_port}
                  onChange={handleConfigChange}
                  placeholder="587"
                  required
                  className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">SMTP Username</label>
                <input
                  type="text"
                  name="smtp_username"
                  value={smtpConfig.smtp_username}
                  onChange={handleConfigChange}
                  placeholder="example@gmail.com"
                  required
                  className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">SMTP Password</label>
                <input
                  type="password"
                  name="smtp_password"
                  value={smtpConfig.smtp_password}
                  onChange={handleConfigChange}
                  placeholder="App Password or credentials"
                  required
                  className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Sender Email Address</label>
                <input
                  type="email"
                  name="sender_email"
                  value={smtpConfig.sender_email}
                  onChange={handleConfigChange}
                  placeholder="example@gmail.com"
                  required
                  className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Sender Display Name</label>
                <input
                  type="text"
                  name="sender_name"
                  value={smtpConfig.sender_name}
                  onChange={handleConfigChange}
                  placeholder="Coding Contest Coach"
                  required
                  className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="smtp_use_tls"
                  name="smtp_use_tls"
                  checked={smtpConfig.smtp_use_tls}
                  onChange={handleConfigChange}
                  className="rounded border-panelBorder bg-bgSurfaceInput text-accentPurple focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="smtp_use_tls" className="text-xs text-textSecondary select-none">Use TLS/STARTTLS (recommended for Port 587/25. Uncheck for SSL Port 465)</label>
              </div>
              
              <div className="sm:col-span-2 flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-4 py-2 bg-accentPurple text-textPrimary hover:bg-accentPurple/90 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-accentPurple/10 disabled:opacity-50"
                >
                  {isSavingConfig ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save SMTP Settings
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConfig || !smtpConfig.smtp_host}
                  className="px-4 py-2 bg-bgSurfaceInput border border-panelBorder text-textSecondary hover:text-textPrimary hover:border-panelBorderSecondary rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isTestingConfig ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Test SMTP Connection
                </button>
              </div>
            </form>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-panelBorder flex flex-col gap-4">
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider border-b border-panelBorder/20 pb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-accentPurple" /> Setup Instructions
            </h3>
            <div className="text-xs text-textSecondary flex flex-col gap-3 leading-relaxed">
              <p>To ensure diagnostic emails can be sent to your student roster:</p>
              <ol className="list-decimal pl-4 flex flex-col gap-2">
                <li>
                  <strong>Gmail SMTP:</strong> Host: <code>smtp.gmail.com</code>, Port: <code>587</code>, TLS: Enabled.
                </li>
                <li>
                  <strong>Google App Passwords:</strong> Do NOT use your primary Google account password. Go to Google Account Settings &gt; Security &gt; App Passwords, generate a 16-character code, and paste it here.
                </li>
                <li>
                  <strong>Custom SMTP:</strong> If using a private academic mailserver, double-check your firewall allows outbound SMTP connections on the correct port.
                </li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        /* DISPATCH COMPOSER & RECIPIENTS PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Composer Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel p-5 rounded-xl border border-panelBorder flex flex-col gap-4">
              <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider border-b border-panelBorder/20 pb-3">Draft Template</h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Subject Template</label>
                  <input
                    type="text"
                    name="subject_template"
                    value={template.subject_template}
                    onChange={handleTemplateChange}
                    placeholder="DSA Feedback: {contest_name}"
                    className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50"
                  />
                  <span className="text-[9px] text-textMuted">Available tokens: <code>{'{contest_name}'}</code>, <code>{'{student_email}'}</code></span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Email Introduction (Greeting)</label>
                  <textarea
                    name="body_prefix"
                    value={template.body_prefix}
                    onChange={handleTemplateChange}
                    rows={4}
                    className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50 resize-none font-sans"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Contest Editorial Link (Optional)</label>
                  <input
                    type="text"
                    name="editorial_link"
                    value={template.editorial_link}
                    onChange={handleTemplateChange}
                    placeholder="https:// Newton School Contest Editorial Link"
                    className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Email Conclusion (Footer/Signature)</label>
                  <textarea
                    name="body_suffix"
                    value={template.body_suffix}
                    onChange={handleTemplateChange}
                    rows={3}
                    className="bg-bgSurfaceInput border border-panelBorder rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentPurple/50 resize-none font-sans"
                  />
                </div>
              </div>

              <div className="flex gap-3 border-t border-panelBorder/20 pt-4 mt-2">
                <button
                  type="button"
                  onClick={handleSendEmails}
                  disabled={isSending || selectedEmails.length === 0}
                  className="flex-1 py-2 bg-accentPurple text-textPrimary hover:bg-accentPurple/90 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-accentPurple/10 disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Send Bulk Emails ({selectedEmails.length})
                </button>
              </div>
            </div>

            {/* Background Dispatch Status widget */}
            {dispatchStatus.status !== 'idle' && (
              <div className="glass-panel p-5 rounded-xl border border-panelBorder flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-panelBorder/20 pb-2">
                  <h4 className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Dispatch Progress</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dispatchStatus.status === 'sending' 
                      ? 'bg-accentPurple/10 text-accentPurple animate-pulse'
                      : dispatchStatus.status === 'completed'
                      ? 'bg-accentGreen/10 text-accentGreen'
                      : 'bg-accentOrange/10 text-accentOrange'
                  }`}>
                    {dispatchStatus.status === 'sending' ? 'Sending...' : dispatchStatus.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-textSecondary">
                  <span>Emails Sent:</span>
                  <span className="font-bold text-textPrimary">
                    {dispatchStatus.sent_emails} / {dispatchStatus.total_emails}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/10">
                  <div 
                    className="h-full bg-gradient-to-r from-accentPurple to-accentCyan transition-all duration-300 ease-out"
                    style={{ width: `${dispatchStatus.total_emails > 0 ? (dispatchStatus.sent_emails / dispatchStatus.total_emails) * 100 : 0}%` }}
                  />
                </div>
                
                {/* Dispatch Errors */}
                {dispatchStatus.failed_emails.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-[9px] text-accentRose font-bold uppercase tracking-wider">Failed Email Logs ({dispatchStatus.failed_emails.length}):</span>
                    <div className="max-h-24 overflow-y-auto bg-bgSurfaceInput border border-panelBorder/50 rounded-lg p-2 flex flex-col gap-1.5 font-mono text-[9px] text-textSecondary">
                      {dispatchStatus.failed_emails.map((fail, i) => (
                        <div key={i} className="border-b border-panelBorder/10 pb-1 last:border-b-0">
                          <span className="text-accentRose font-bold">{fail.email}</span>: {fail.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Recipient Table */}
          <div className="lg:col-span-3 glass-panel p-5 rounded-xl border border-panelBorder flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-center border-b border-panelBorder/20 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accentPurple" />
                <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Recipient List</h3>
              </div>
              <span className="text-[10px] text-textMuted font-medium">{selectedEmails.length} of {studentsList.length} selected</span>
            </div>

            <div className="overflow-x-auto flex-1 max-h-[400px] overflow-y-auto border border-panelBorder/50 rounded-lg bg-panelBgSolid/20">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bgSurfaceInput text-textMuted font-semibold border-b border-panelBorder/50">
                    <th className="p-3 w-10 text-center">
                      <button onClick={toggleSelectAll} className="text-textMuted hover:text-textPrimary flex justify-center w-full">
                        {selectedEmails.length === studentsList.length ? (
                          <CheckSquare className="w-4 h-4 text-accentPurple" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-3">Student Email</th>
                    <th className="p-3 text-center">Solved</th>
                    <th className="p-3 text-center">AI Diagnostics</th>
                    <th className="p-3 text-center">Custom Notes</th>
                    <th className="p-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.length > 0 ? (
                    studentsList.map((student) => {
                      const isSelected = selectedEmails.includes(student.email);
                      const hasFeedback = !!student.feedback?.strengths?.length;
                      const hasCustomNotes = !!student.custom_feedback;
                      return (
                        <tr key={student.email} className="border-b border-panelBorder/10 hover:bg-bgSurfaceInput/20 transition-all">
                          <td className="p-3 text-center">
                            <button onClick={() => toggleSelectEmail(student.email)} className="text-textMuted hover:text-textPrimary flex justify-center w-full">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-accentPurple" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-3 font-medium text-textSecondary truncate max-w-[200px]" title={student.email}>
                            {student.email}
                          </td>
                          <td className="p-3 text-center font-bold text-textSecondary">
                            {student.solved_count} / {student.attempted_count}
                          </td>
                          <td className="p-3 text-center">
                            {hasFeedback ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-accentGreen/10 text-accentGreen text-[9px] font-bold">Ready</span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-bgSurfaceInput border border-panelBorder text-textMuted text-[9px]">Missing</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {hasCustomNotes ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-accentCyan/10 text-accentCyan text-[9px] font-bold">Included</span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-textMuted text-[9px]">—</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handlePreview(student.email)}
                              className="px-2 py-1 bg-bgSurfaceInput border border-panelBorder hover:border-panelBorderSecondary text-textSecondary hover:text-textPrimary rounded flex items-center gap-1 mx-auto text-[10px] font-semibold transition-all"
                            >
                              <Eye className="w-3 h-3" /> Preview
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-textMuted italic">No students found in contest.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Visual Email HTML Previewer Modal */}
      {previewStudent && (
        <div className="fixed inset-0 bg-darkBg/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-150">
          <div className="bg-panelBgSolid border border-panelBorder rounded-xl shadow-2xl max-w-3xl w-full h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-headerBg border-b border-panelBorder flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Email Diagnostic Preview</h4>
                <p className="text-[10px] text-textMuted mt-0.5">Previewing email payload for: <span className="font-mono text-textSecondary">{previewStudent}</span></p>
              </div>
              <button
                onClick={() => { setPreviewStudent(null); setPreviewContent(null); }}
                className="text-textMuted hover:text-textPrimary text-sm font-bold px-3 py-1 bg-bgSurfaceInput border border-panelBorder rounded-md transition-all"
              >
                Close Preview
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 p-4 bg-bgSurfaceInput overflow-hidden flex flex-col gap-3">
              {isPreviewLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-textMuted text-xs">
                  <Loader2 className="w-6 h-6 text-accentPurple animate-spin" />
                  Generating responsive HTML critique...
                </div>
              ) : previewContent ? (
                <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                  {/* Subject preview */}
                  <div className="bg-panelBgSolid border border-panelBorder rounded-lg p-2.5 text-xs text-textSecondary flex gap-2">
                    <span className="font-bold text-textPrimary">Subject:</span>
                    <span className="font-medium">{previewContent.subject}</span>
                  </div>
                  
                  {/* HTML iframe preview */}
                  <div className="flex-1 border border-panelBorder rounded-lg bg-white overflow-hidden shadow-inner">
                    <iframe
                      srcDoc={previewContent.html_content}
                      title="Email HTML Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-textMuted text-xs italic">
                  Preview generation failed. Please configure SMTP and check AI critiques.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
