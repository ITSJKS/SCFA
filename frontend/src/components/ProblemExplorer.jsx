import React, { useState, useEffect } from 'react';
import { Code, Users, Terminal, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

export default function ProblemExplorer({ problemsData }) {
  const [selectedQid, setSelectedQid] = useState(null);
  const problemsList = Object.values(problemsData || {});

  // Reset selected question when problemsData changes
  useEffect(() => {
    if (problemsList.length > 0) {
      setSelectedQid(String(problemsList[0].question_id));
    } else {
      setSelectedQid(null);
    }
  }, [problemsData]);

  const p = selectedQid ? problemsData[selectedQid] : null;

  const getStatusColorClass = (name) => {
    if (name.includes('Accepted')) return 'bg-accentGreen';
    if (name.includes('Wrong')) return 'bg-accentRose';
    if (name.includes('Limit')) return 'bg-accentOrange';
    return 'bg-accentPurple';
  };

  const getStatusTextColorClass = (name) => {
    if (name.includes('Accepted')) return 'text-accentGreen';
    if (name.includes('Wrong')) return 'text-accentRose';
    if (name.includes('Limit')) return 'text-accentOrange';
    return 'text-accentPurple';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[72vh] animate-in fade-in duration-300">
      {/* Left Sidebar - Problem List */}
      <div className="w-full lg:w-80 flex flex-col glass-panel border border-panelBorder rounded-xl overflow-hidden h-full flex-shrink-0">
        <div className="p-4 border-b border-panelBorder bg-headerBg/40">
          <h3 className="text-base font-extrabold text-textPrimary">Problems List</h3>
          <p className="text-xs text-textSecondary mt-0.5">Select a problem to view details</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 select-none">
          {problemsList.length === 0 ? (
            <div className="text-center text-sm text-textMuted py-8">No problems loaded.</div>
          ) : (
            problemsList.map((item) => {
              const qid = String(item.question_id);
              const isActive = qid === selectedQid;

              return (
                <div
                  key={qid}
                  onClick={() => setSelectedQid(qid)}
                  className={`flex flex-col gap-1 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-accentCyan/10 border-accentCyan/40 shadow-[0_0_12px_rgba(0,242,254,0.08)]'
                      : 'bg-transparent border-transparent hover:bg-bgSurfaceHover hover:border-panelBorder/30'
                  }`}
                >
                  <span className={`text-[15px] font-bold truncate ${isActive ? 'text-accentCyan' : 'text-textPrimary'}`}>
                    #{item.question_id} - {item.title}
                  </span>
                  <div className="flex items-center justify-between text-sm text-textSecondary">
                    <span>Rate: {item.success_rate_percent}%</span>
                    <span>Attempts: {item.total_attempts}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane - Problem Detail */}
      <div className="flex-1 glass-panel border border-panelBorder rounded-xl p-6 overflow-y-auto h-full bg-darkBg/20">
        {!p ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-textSecondary">
            <Code className="w-14 h-14 text-accentCyan/20 mb-3" />
            <h3 className="text-lg font-extrabold text-textPrimary">No Problem Selected</h3>
            <p className="text-sm text-textMuted max-w-xs mt-1.5">Select a problem from the list to view its metrics and descriptions.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-start gap-4 border-b border-panelBorder/30 pb-4">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-black text-textPrimary tracking-tight">{p.title}</h2>
                <span className="text-xs font-bold text-accentCyan uppercase tracking-wider bg-accentCyan/5 border border-accentCyan/15 px-3 py-1 rounded-full w-fit">
                  Question ID: #{p.question_id}
                </span>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-bgSurfaceInput border border-panelBorder/40 p-4.5 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-textMuted font-bold uppercase tracking-wider">Success Rate</span>
                <span className={`text-2xl font-black ${
                  p.success_rate_percent > 75 
                    ? 'text-accentGreen' 
                    : p.success_rate_percent < 40 
                    ? 'text-accentRose' 
                    : 'text-accentOrange'
                }`}>
                  {p.success_rate_percent}%
                </span>
              </div>
              <div className="bg-bgSurfaceInput border border-panelBorder/40 p-4.5 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-textMuted font-bold uppercase tracking-wider">Total Attempts</span>
                <span className="text-2xl font-black text-textPrimary">{p.total_attempts}</span>
              </div>
              <div className="bg-bgSurfaceInput border border-panelBorder/40 p-4.5 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-textMuted font-bold uppercase tracking-wider">Unique Students</span>
                <span className="text-2xl font-black text-textPrimary">{p.unique_students}</span>
              </div>
              <div className="bg-bgSurfaceInput border border-panelBorder/40 p-4.5 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-textMuted font-bold uppercase tracking-wider">Avg Attempts to Pass</span>
                <span className="text-2xl font-black text-textPrimary">{p.avg_attempts_to_pass || 'N/A'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider border-b border-panelBorder/30 pb-2 flex items-center gap-1.5">
                <Code className="w-4.5 h-4.5 text-accentCyan" /> Problem Description (AI Inferred)
              </h3>
              <p className="text-[15px] text-textSecondary leading-relaxed bg-bgSurfaceInput border border-panelBorder/30 p-4.5 rounded-xl whitespace-pre-wrap font-sans">
                {p.description || 'No description available for this problem.'}
              </p>
            </div>

            {/* Submission Status distribution */}
            <div className="flex flex-col gap-3.5">
              <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider border-b border-panelBorder/30 pb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4.5 h-4.5 text-accentPurple" /> Submission Status Distribution
              </h3>
              <div className="flex flex-col gap-3.5">
                {Object.entries(p.status_distribution || {}).map(([name, count]) => {
                  const pct = Math.round((count / p.total_attempts) * 100);
                  const progressColor = getStatusColorClass(name);
                  const textColor = getStatusTextColorClass(name);

                  return (
                    <div key={name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-textSecondary">{name}</span>
                        <span className={`font-mono ${textColor}`}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/20">
                        <div
                          className={`h-full rounded-full ${progressColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
