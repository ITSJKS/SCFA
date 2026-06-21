import React from 'react';
import { TrendingUp, Users, Award, LineChart, ChevronRight, TrendingDown, RefreshCw } from 'lucide-react';

export default function ProgressTracker({ progressData, onSelectStudent, selectedSection = 'All', sectionsMetadata = {} }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!progressData) return null;

  const milestones = progressData.contests || [];
  const studentsList = Object.values(progressData.students || {});

  // Filter student list by selected section first
  const sectionFilteredStudents = studentsList.filter(s => {
    if (selectedSection === 'All') return true;
    
    // Check if student belongs to selectedSection in any of their contest histories
    return Object.values(s.history || {}).some(h => String(h.assignment_id) === String(selectedSection));
  });

  // Stats calculations based on section-filtered students
  const totalMilestonesQuestions = milestones.reduce((sum, m) => sum + (m.total_questions || 0), 0);

  const studentsWithScores = sectionFilteredStudents.map(s => {
    let scoreSum = 0;
    let count = 0;
    milestones.forEach(m => {
      const hist = s.history[m.contest_key];
      if (hist && hist.score_pct !== null && hist.score_pct !== undefined) {
        scoreSum += hist.score_pct;
        count++;
      }
    });
    const overallRate = count > 0 ? (scoreSum / count) / 100 : 0;
    return {
      ...s,
      solvedSum: Math.round(overallRate * 100), // overall score average
      overallRate
    };
  });

  // Sort students by overall rate descending
  studentsWithScores.sort((a, b) => b.overallRate - a.overallRate);

  const cohortSolveRate = studentsWithScores.length > 0
    ? Math.round(studentsWithScores.reduce((sum, s) => sum + s.overallRate, 0) / studentsWithScores.length * 100)
    : 0;

  // Render Milestone Trend cards and compute trend status based on section-filtered students
  let prevRate = null;
  let lastTrendText = 'Stable';

  const trendCards = milestones.map((m, idx) => {
    let scoreSum = 0;
    let studentsInMilestone = 0;

    sectionFilteredStudents.forEach(s => {
      const hist = s.history[m.contest_key];
      if (hist && hist.score_pct !== null && hist.score_pct !== undefined) {
        scoreSum += hist.score_pct;
        studentsInMilestone++;
      }
    });

    const milestoneRate = studentsInMilestone > 0 ? Math.round(scoreSum / studentsInMilestone) : 0;

    let trendDiff = 0;
    let trendDirection = 'flat'; // 'up', 'down', 'flat'

    if (prevRate !== null) {
      trendDiff = milestoneRate - prevRate;
      if (trendDiff > 0) {
        trendDirection = 'up';
        lastTrendText = 'Improving';
      } else if (trendDiff < 0) {
        trendDirection = 'down';
        lastTrendText = 'Declining';
      }
    }
    prevRate = milestoneRate;

    return {
      contestKey: m.contest_key,
      contestName: m.contest_name || m.contest_key,
      milestoneIndex: idx + 1,
      rate: milestoneRate,
      diff: trendDiff,
      direction: trendDirection,
      studentsCount: studentsInMilestone
    };
  });

  // Filter students by search query for rendering
  const searchFilteredStudents = studentsWithScores.filter(s => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return s.email.toLowerCase().includes(query) || (s.user_id && String(s.user_id).toLowerCase().includes(query));
  });

  const getMilestoneBadgeClass = (solved, total) => {
    if (total === 0) return 'text-textMuted bg-white/[0.02] border-panelBorder';
    const pct = (solved / total) * 100;
    if (pct === 100) return 'text-accentGreen bg-accentGreen/5 border-accentGreen/15';
    if (pct >= 50) return 'text-accentCyan bg-accentCyan/5 border-accentCyan/15';
    if (pct > 0) return 'text-accentOrange bg-accentOrange/5 border-accentOrange/15';
    return 'text-accentRose bg-accentRose/5 border-accentRose/15';
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      {/* 1. Metrics Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Milestones */}
        <div className="glass-panel p-4 rounded-xl border border-panelBorder flex items-center gap-3.5 hover:shadow-glowPurple transition-all">
          <div className="p-2 bg-accentPurple/10 rounded-lg text-accentPurple flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Total Milestones</span>
            <span className="text-xl font-bold text-textPrimary tracking-tight mt-0.5 leading-none">{milestones.length}</span>
          </div>
        </div>

        {/* Active Students */}
        <div className="glass-panel p-4 rounded-xl border border-panelBorder flex items-center gap-3.5 hover:shadow-glow transition-all">
          <div className="p-2 bg-accentCyan/10 rounded-lg text-accentCyan flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Active Students</span>
            <span className="text-xl font-bold text-textPrimary tracking-tight mt-0.5 leading-none">{studentsList.length}</span>
          </div>
        </div>

        {/* Cohort Solve Rate */}
        <div className="glass-panel p-4 rounded-xl border border-panelBorder flex items-center gap-3.5 hover:shadow-glow transition-all">
          <div className="p-2 bg-accentGreen/10 rounded-lg text-accentGreen flex items-center justify-center flex-shrink-0">
            <LineChart className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Cohort Avg Score</span>
            <span className="text-xl font-bold text-textPrimary tracking-tight mt-0.5 leading-none">{cohortSolveRate}%</span>
          </div>
        </div>

        {/* Milestone Trend */}
        <div className="glass-panel p-4 rounded-xl border border-panelBorder flex items-center gap-3.5 hover:shadow-glow transition-all">
          <div className="p-2 bg-accentOrange/10 rounded-lg text-accentOrange flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Milestone Trend</span>
            <span className="text-xl font-bold text-textPrimary tracking-tight mt-0.5 leading-none">{lastTrendText}</span>
          </div>
        </div>
      </div>

      {/* 2. Layout Panes */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar: Cohort Rankings */}
        <div className="w-full lg:w-80 flex flex-col glass-panel border border-panelBorder rounded-xl overflow-hidden h-[240px] lg:h-[520px] flex-shrink-0">
          <div className="p-3 border-b border-panelBorder bg-headerBg/20">
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Cohort Students</h3>
            <p className="text-[11px] text-textMuted font-medium mt-0.5">Ranked by overall solve rate</p>
          </div>
          <div className="p-2 border-b border-panelBorder/30 bg-bgSurfaceInput/10">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full px-2.5 py-1.5 text-xs bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-md text-textPrimary outline-none transition-all placeholder:text-textMuted font-medium"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 select-none">
            {searchFilteredStudents.length === 0 ? (
              <div className="text-center text-xs text-textMuted py-8">No matching students found.</div>
            ) : (
              searchFilteredStudents.map((s) => {
                const pct = Math.round(s.overallRate * 100);
                const rateColor = pct > 75 ? 'text-accentGreen' : (pct < 40 ? 'text-accentRose' : 'text-accentOrange');

                return (
                  <div
                    key={s.email}
                    onClick={() => onSelectStudent(s.email)}
                    title={s.email}
                    className="flex flex-col gap-1 p-2.5 rounded-lg border border-transparent hover:bg-bgSurfaceHover hover:border-panelBorder/20 cursor-pointer transition-all duration-150"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold truncate text-textPrimary">{s.email}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-textMuted" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-textSecondary">
                      <span>Milestones: {Object.keys(s.history).length}/{milestones.length}</span>
                      <span className="font-semibold">
                        Avg Score: <span className={rateColor}>{s.solvedSum}%</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Body: Completion Grid & Trend Analysis */}
        <div className="flex-1 flex flex-col gap-5 overflow-hidden">
          {/* Milestone Grid Card */}
          <div className="glass-panel p-4.5 rounded-xl border border-panelBorder overflow-hidden flex flex-col gap-3.5">
            <h2 className="text-xs font-bold text-textPrimary uppercase tracking-wider border-b border-panelBorder/20 pb-2.5">Program Milestone Completion Grid</h2>
            
            <div className="overflow-x-auto overflow-y-auto max-h-[300px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-panelBorder text-textSecondary text-[10px] font-bold uppercase tracking-wider">
                    <th className="pb-2.5 pr-3 sticky left-0 bg-panelBgSolid z-10">Student</th>
                    <th className="pb-2.5 pr-3 min-w-[140px]">Overall Average</th>
                    {milestones.map((m, idx) => {
                      const compactName = m.contest_name && m.contest_name.length > 18 
                        ? m.contest_name.substring(0, 15) + '...' 
                        : (m.contest_name || m.contest_key);
                      return (
                        <th 
                          key={m.contest_key} 
                          className="pb-2.5 text-center min-w-[120px] max-w-[160px] truncate"
                          title={m.contest_name || m.contest_key}
                        >
                          {compactName}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-panelBorder/40">
                  {searchFilteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={2 + milestones.length} className="py-6 text-center text-textMuted text-xs">
                        No milestone details available.
                      </td>
                    </tr>
                  ) : (
                    searchFilteredStudents.map((s) => {
                      const pct = Math.round(s.overallRate * 100);
                      const rateColor = pct > 75 ? 'text-accentGreen' : (pct < 40 ? 'text-accentRose' : 'text-accentOrange');

                      return (
                        <tr key={s.email} className="hover:bg-bgSurfaceHover transition-colors">
                          {/* Student Column */}
                          <td className="py-2 pr-3 font-semibold text-textPrimary truncate max-w-[150px] sticky left-0 bg-panelBgSolid z-10" title={s.email}>
                            {s.email}
                          </td>
                          {/* Progress Column */}
                          <td className="py-2 pr-3">
                            <div className="flex items-center gap-2 text-xs font-mono text-textSecondary">
                              <span className={`w-7 font-bold ${rateColor}`}>{pct}%</span>
                              <div className="w-14 h-1.5 bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/10">
                                <div
                                  className={`h-full rounded-full ${
                                    pct >= 70 ? 'bg-accentGreen' : pct < 40 ? 'bg-accentRose' : 'bg-accentOrange'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          {/* Milestones Solved Ratio Badges */}
                          {milestones.map((m) => {
                            const hist = s.history[m.contest_key];
                            if (hist && hist.score_pct !== null && hist.score_pct !== undefined) {
                              const scoreVal = hist.score_pct;
                              const badgeStyle = scoreVal >= 70 
                                ? 'text-accentGreen bg-accentGreen/10 border border-accentGreen/30 px-2 py-0.5 rounded font-bold font-mono' 
                                : (scoreVal < 40 
                                    ? 'text-accentRose bg-accentRose/5 border-accentRose/10 font-semibold font-mono' 
                                    : 'text-accentOrange bg-accentOrange/5 border-accentOrange/10 font-semibold font-mono');
                              
                              const displayVal = m.is_mock ? scoreVal : `${scoreVal}%`;
                              return (
                                <td key={m.contest_key} className="py-2 text-center">
                                  <span className={`inline-block text-[10px] ${badgeStyle}`}>
                                    {displayVal}
                                  </span>
                                </td>
                              );
                            }
                            return (
                              <td key={m.contest_key} className="py-2 text-center">
                                <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-panelBorder/20 text-textMuted bg-bgSurfaceInput">
                                  -
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Trends Horizontal scroll */}
          <div className="glass-panel p-4.5 rounded-xl border border-panelBorder flex flex-col gap-3.5">
            <h2 className="text-xs font-bold text-textPrimary uppercase tracking-wider border-b border-panelBorder/20 pb-2">Milestone Cohort Performance Trends</h2>
            <div className="flex gap-4 overflow-x-auto pb-1 scroll-smooth">
              {trendCards.map((c) => (
                <div
                  key={c.contestKey}
                  className="flex flex-col gap-2 p-3 rounded-lg border border-panelBorder/60 bg-white/[0.01] min-w-[170px] flex-1"
                >
                  <span className="text-[9px] font-bold text-textMuted uppercase tracking-wider">Milestone {c.milestoneIndex}</span>
                  <h4 className="text-[11px] font-semibold text-textPrimary truncate" title={c.contestName}>
                    {c.contestName}
                  </h4>
                  
                  <div className="flex justify-between items-end mt-1">
                    <span className="text-lg font-bold text-accentCyan leading-none">{c.rate}%</span>
                    {c.direction === 'up' && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-accentGreen">
                        <TrendingUp className="w-3 h-3" />+{c.diff}%
                      </span>
                    )}
                    {c.direction === 'down' && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-accentRose">
                        <TrendingDown className="w-3 h-3" />{c.diff}%
                      </span>
                    )}
                    {c.direction === 'flat' && c.milestoneIndex > 1 && (
                      <span className="text-[10px] font-bold text-textMuted">0%</span>
                    )}
                  </div>

                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accentCyan rounded-full" style={{ width: `${c.rate}%` }} />
                  </div>
                  
                  <span className="text-[9px] text-textMuted font-medium">{c.studentsCount} active students</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
