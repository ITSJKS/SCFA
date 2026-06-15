import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, Lightbulb, 
  ChevronDown, ChevronUp, Code, Clock, BrainCircuit, AlertOctagon, HelpCircle 
} from 'lucide-react';

export default function StudentPortal({
  student,
  email,
  role,
  contestKey,
  onSaveFeedback,
  onRunSingleAI,
  isSingleAnalyzing,
  onViewCode,
  onViewAttemptCode,
  isLoading = false
}) {
  const [openAccordions, setOpenAccordions] = useState({});
  const [notesText, setNotesText] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    if (student) {
      setNotesText(student.custom_feedback || '');
    }
  }, [student, email]);

  const handleSaveNotes = async () => {
    if (!onSaveFeedback) return;
    setIsSavingNotes(true);
    await onSaveFeedback(email, notesText);
    setIsSavingNotes(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[55vh] text-center p-8 glass-panel rounded-xl border border-panelBorder">
        <div className="w-10 h-10 border-2 border-accentCyan border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-base font-bold text-textPrimary">Loading Student Data…</h3>
        <p className="text-xs text-textSecondary mt-1">{email}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[55vh] text-center p-8 glass-panel rounded-xl border border-panelBorder select-none">
        <UsersPlaceholder />
        <h3 className="text-lg font-black text-textPrimary mt-4">No Student Selected</h3>
        <p className="text-sm text-textSecondary max-w-sm mt-1.5 leading-relaxed">
          Please select a student from the sidebar directory to view their personalized AI critiques, timeline logs, and source code submissions.
        </p>
      </div>
    );
  }

  const toggleAccordion = (qid) => {
    setOpenAccordions(prev => ({
      ...prev,
      [qid]: !prev[qid]
    }));
  };

  const getTimelineEventStyles = (header) => {
    if (header.includes('Accepted')) {
      return {
        cardBg: 'bg-accentGreen/5 border-accentGreen/15 hover:bg-accentGreen/10',
        titleColor: 'text-accentGreen',
        statusTitle: 'Accepted',
        icon: CheckCircle2
      };
    }
    if (header.includes('Time Limit')) {
      return {
        cardBg: 'bg-accentOrange/5 border-accentOrange/15 hover:bg-accentOrange/10',
        titleColor: 'text-accentOrange',
        statusTitle: 'Time Limit Exceeded',
        icon: Clock
      };
    }
    if (header.includes('Error') || header.includes('Compile')) {
      return {
        cardBg: 'bg-accentPurple/5 border-accentPurple/15 hover:bg-accentPurple/10',
        titleColor: 'text-accentPurple',
        statusTitle: 'Runtime/Compilation Error',
        icon: AlertOctagon
      };
    }
    return {
      cardBg: 'bg-accentRose/5 border-accentRose/15 hover:bg-accentRose/10',
      titleColor: 'text-accentRose',
      statusTitle: 'Wrong Answer',
      icon: AlertTriangle
    };
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      {/* Profile Header */}
      <div className="glass-panel p-4.5 rounded-xl border border-panelBorder flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-base font-bold text-textPrimary tracking-tight truncate max-w-full" title={email}>{email}</h2>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-textSecondary">
            <span className="font-semibold text-textMuted">User ID: {student.user_id}</span>
            <span className="text-panelBorder font-light">•</span>
            <span className="font-medium">Submissions: {student.total_submissions}</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 flex-shrink-0">
          {(role === 'admin' || role === 'faculty') && (
            <button
              onClick={() => onRunSingleAI(email)}
              disabled={isSingleAnalyzing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isSingleAnalyzing
                  ? 'bg-accentCyan/5 border-accentCyan/20 text-accentCyan cursor-wait animate-pulse'
                  : 'bg-accentCyan/10 hover:bg-accentCyan border-accentCyan/20 hover:border-accentCyan hover:text-darkBg text-accentCyan'
              }`}
              title="Re-run AI Critique for this student using GPT-4o-mini"
            >
              <BrainCircuit className={`w-4 h-4 ${isSingleAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isSingleAnalyzing ? 'Analyzing...' : 'Run AI Feedback'}</span>
            </button>
          )}

          <div className="bg-bgSurfaceInput border border-panelBorder/80 px-3 py-1.5 rounded-lg text-xs font-semibold text-textPrimary uppercase tracking-wider">
            Contest Score: {student.solved_count} / {student.attempted_count} Solved
          </div>
        </div>
      </div>

      {/* AI Diagnostic Critiques Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Strengths */}
        <div className="glass-panel p-4.5 rounded-xl border border-panelBorder flex flex-col gap-3">
          <h3 className="text-xs font-bold text-accentGreen flex items-center gap-2 border-b border-panelBorder/20 pb-2.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4.5 h-4.5" /> Strengths
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs text-textSecondary leading-relaxed">
            {student.feedback?.strengths?.length > 0 ? (
              student.feedback.strengths.map((str, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-accentGreen font-bold mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-textMuted italic list-none">No strengths analyzed.</li>
            )}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel p-4.5 rounded-xl border border-panelBorder flex flex-col gap-3">
          <h3 className="text-xs font-bold text-accentOrange flex items-center gap-2 border-b border-panelBorder/20 pb-2.5 uppercase tracking-wider">
            <AlertTriangle className="w-4.5 h-4.5" /> Weaknesses
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs text-textSecondary leading-relaxed">
            {student.feedback?.weaknesses?.length > 0 ? (
              student.feedback.weaknesses.map((wk, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-accentOrange font-bold mt-0.5">•</span>
                  <span>{wk}</span>
                </li>
              ))
            ) : (
              <li className="text-textMuted italic list-none">No weaknesses compiled.</li>
            )}
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className="glass-panel p-4.5 rounded-xl border border-panelBorder flex flex-col gap-3">
          <h3 className="text-xs font-bold text-accentPurple flex items-center gap-2 border-b border-panelBorder/20 pb-2.5 uppercase tracking-wider">
            <Lightbulb className="w-4.5 h-4.5" /> AI Recommendations
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs text-textSecondary leading-relaxed">
            {student.feedback?.recommendations?.length > 0 ? (
              student.feedback.recommendations.map((rc, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-accentPurple font-bold mt-0.5">•</span>
                  <span>{rc}</span>
                </li>
              ))
            ) : (
              <li className="text-textMuted italic list-none">No recommendations compiled.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Faculty Evaluator Notes */}
      <div className="glass-panel p-4.5 rounded-xl border border-panelBorder flex flex-col gap-3.5">
        <h3 className="text-xs font-bold text-accentCyan flex items-center gap-2 border-b border-panelBorder/20 pb-2 uppercase tracking-wider">
          <BrainCircuit className="w-4.5 h-4.5" /> Faculty Evaluator Notes
        </h3>
        <div className="flex flex-col gap-2.5">
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Type custom feedback, performance overrides, or private guidance notes for this student here..."
            className="w-full h-20 bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg p-3 text-xs text-textPrimary placeholder:text-textMuted outline-none transition-all resize-none font-medium"
          />
          <div className="flex justify-end items-center gap-3">
            {isSavingNotes && (
              <span className="text-[10px] text-textMuted font-medium animate-pulse">Saving notes...</span>
            )}
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes || notesText === (student.custom_feedback || '')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer ${
                notesText === (student.custom_feedback || '')
                  ? 'bg-panelBorder/10 border-panelBorder/20 text-textMuted cursor-not-allowed'
                  : 'bg-accentCyan/10 hover:bg-accentCyan border-accentCyan/20 hover:border-accentCyan hover:text-darkBg text-accentCyan'
              }`}
            >
              <span>Save Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accordion List for Attempts details */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider border-b border-panelBorder/20 pb-2">
          Question Analysis & Code History
        </h3>

        {student.attempts_details?.length === 0 ? (
          <p className="text-center text-textMuted text-xs py-6">No submissions made during this contest.</p>
        ) : (
          student.attempts_details.map((q) => {
            const qid = String(q.question_id);
            const isOpen = !!openAccordions[qid];
            const isSolved = q.solved;

            const qFeedback = student.feedback?.question_feedback?.[qid] || {
              summary: 'No detailed critique compiled for this problem.',
              critique: 'Review attempts history details for code transitions.',
              score_rating: 'N/A'
            };

            const ratingColor = 
              qFeedback.score_rating === 'Excellent' || qFeedback.score_rating === 'Completed'
                ? 'text-accentGreen bg-accentGreen/5 border-accentGreen/10'
                : 'text-accentRose bg-accentRose/5 border-accentRose/10';

            return (
              <div 
                key={qid} 
                className={`glass-panel border rounded-xl overflow-hidden transition-all duration-150 ${
                  isOpen ? 'border-panelBorder/60 bg-white/[0.01]' : 'border-panelBorder'
                }`}
              >
                {/* Accordion Header */}
                <div 
                  onClick={() => toggleAccordion(qid)}
                  className="px-4.5 py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-bgSurfaceHover transition-colors select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-xs font-bold text-textPrimary">
                      #{qid} - {q.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isSolved 
                        ? 'text-accentGreen bg-accentGreen/5 border-accentGreen/10' 
                        : 'text-accentRose bg-accentRose/5 border-accentRose/10'
                    }`}>
                      {isSolved ? 'Passed' : 'Failed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-textSecondary">
                    <span>Attempts: {q.total_attempts}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ratingColor}`}>
                      {qFeedback.score_rating}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="px-4.5 pb-4.5 pt-1 border-t border-panelBorder/30 bg-darkBg/10 flex flex-col gap-4">
                    {/* Problem AI Critique Card */}
                    <div className="bg-accentCyan/[0.01] border-l-2 border-accentCyan p-4.5 rounded-r-lg flex flex-col gap-1 shadow-inner">
                      <span className="text-[9px] font-bold text-textMuted uppercase tracking-wider">AI Code Critique</span>
                      <p className="text-xs font-semibold text-textPrimary leading-normal">{qFeedback.summary}</p>
                      <p className="text-[11px] text-textSecondary leading-normal italic mt-1">{qFeedback.critique}</p>
                    </div>

                    {/* View Code Actions */}
                    <div className="flex justify-between items-center border-b border-panelBorder/20 pb-2">
                      <h5 className="text-[10px] font-bold text-textPrimary uppercase tracking-wider">Code Progression Timeline</h5>
                      <button 
                        onClick={() => onViewCode(email, qid)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-accentCyan/10 hover:bg-accentCyan border border-accentCyan/20 hover:border-accentCyan hover:text-darkBg text-accentCyan text-xs font-semibold rounded-lg transition-all cursor-pointer h-7"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>Compare Code</span>
                      </button>
                    </div>

                    {/* Event Timeline Cards */}
                    <div className="flex flex-col gap-3.5 pl-3.5 border-l border-panelBorder/40">
                      {q.timeline_summary.split('\n\n').map((lineBlock, idx) => {
                        if (!lineBlock.trim()) return null;
                        const lines = lineBlock.split('\n');
                        const header = lines[0];
                        const diffDesc = lines.slice(1).join('\n');

                        const isAttempt1 = header.includes('Attempt 1 |') || header.includes('Attempt 1 ');
                        const styles = getTimelineEventStyles(header);
                        const EventIcon = styles.icon;

                        return (
                          <div 
                            key={idx} 
                            className={`p-3.5 border rounded-lg flex flex-col gap-2.5 transition-colors relative ${styles.cardBg}`}
                          >
                            {/* Dot indicator on Timeline Axis */}
                            <span className="absolute -left-[20px] top-4.5 w-2 h-2 rounded-full bg-panelBorder border border-darkBg" />

                            <div className="flex items-center justify-between gap-3">
                              <div className={`flex items-center gap-1 text-xs font-semibold ${styles.titleColor}`}>
                                <EventIcon className="w-3.5 h-3.5" />
                                <span>{header.split(' | ')[0]}: {styles.statusTitle}</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] text-textMuted font-semibold">
                                  {header.split(' | ')[2] || ''}
                                </span>
                                {q.attempts?.[idx] && (
                                  <button
                                    onClick={() => onViewAttemptCode(email, qid, idx)}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-bgSurfaceInput border border-panelBorder hover:border-textSecondary text-textSecondary hover:text-textPrimary text-[10px] font-semibold rounded transition-colors cursor-pointer"
                                    title="View this submission code"
                                  >
                                    <Code className="w-3 h-3" />
                                    <span>View Code</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Attempt 1 Code or diff description */}
                            <div className="text-xs">
                              {isAttempt1 && q.first_attempt_code ? (
                                <div className="border border-panelBorder rounded-lg overflow-hidden mt-0.5 shadow-sm">
                                  <div className="bg-bgSurfaceInput px-2.5 py-1 text-[10px] text-textMuted border-b border-panelBorder font-bold">Initial Source Code</div>
                                  <pre className="p-2.5 bg-[#070a13] max-h-48 overflow-y-auto leading-relaxed text-textSecondary font-mono text-[11px] border-t border-panelBorder/20">
                                    <code>{q.first_attempt_code}</code>
                                  </pre>
                                </div>
                              ) : (
                                <p className="text-textSecondary leading-normal whitespace-pre-wrap font-sans italic pl-0.5 text-[11px]">{diffDesc}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function UsersPlaceholder() {
  return (
    <svg className="w-14 h-14 text-accentCyan/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
