import React from 'react';
import { Users, Terminal, CheckCircle2, TrendingUp, Code, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';

export default function ContestDashboard({ problemsData, metadata, students = {}, sectionsMetadata = {} }) {
  // Aggregate stats
  const totalStudents = metadata?.total_students || 0;
  const totalSubmissions = metadata?.total_submissions || 0;

  let totalSolved = 0;
  let successRatesSum = 0;
  let validProblemsCount = 0;
  const globalStatuses = {};
  let totalStatusCount = 0;

  const problemsList = Object.values(problemsData || {});

  const totalQuestions = problemsList.length;

  // Compute section statistics
  const getSectionStats = () => {
    const sectionMap = {};
    Object.values(students || {}).forEach(s => {
      const secId = s.assignment_id ? String(s.assignment_id) : 'Unassigned';
      if (!sectionMap[secId]) {
        sectionMap[secId] = {
          id: secId,
          name: sectionsMetadata[secId] || (secId === 'Unassigned' ? 'Unassigned' : `Section ${secId}`),
          activeStudents: 0,
          solvedSum: 0,
          attemptsSum: 0,
          attemptsCount: 0
        };
      }
      const sec = sectionMap[secId];
      sec.activeStudents += 1;
      sec.solvedSum += s.solved_count || 0;
      
      (s.attempts_details || []).forEach(d => {
        if (d.solved) {
          sec.attemptsSum += d.best_attempt_index || 1;
          sec.attemptsCount += 1;
        }
      });
    });

    return Object.values(sectionMap).map(sec => {
      const avgSolved = sec.activeStudents > 0 ? (sec.solvedSum / sec.activeStudents) : 0;
      const possibleSolved = sec.activeStudents * totalQuestions;
      const solveRate = possibleSolved > 0 ? Math.round((sec.solvedSum / possibleSolved) * 100) : 0;
      const avgAttempts = sec.attemptsCount > 0 ? (sec.attemptsSum / sec.attemptsCount) : 0;

      return {
        id: sec.id,
        name: sec.name,
        activeStudents: sec.activeStudents,
        avgSolved: Math.round(avgSolved * 10) / 10,
        solveRate,
        avgAttempts: Math.round(avgAttempts * 10) / 10
      };
    });
  };

  const sectionStats = getSectionStats();
  const showSectionComparison = sectionStats.length > 1;

  // Sorting state
  const [sortBy, setSortBy] = React.useState('solveRate');
  const [sortOrder, setSortOrder] = React.useState('desc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedSectionStats = [...sectionStats].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  problemsList.forEach((p) => {
    totalSolved += p.passed_students || 0;
    successRatesSum += p.success_rate_percent || 0;
    validProblemsCount++;

    // Aggregate status counts
    Object.entries(p.status_distribution || {}).forEach(([name, count]) => {
      globalStatuses[name] = (globalStatuses[name] || 0) + count;
      totalStatusCount += count;
    });
  });

  const avgSuccessRate = validProblemsCount > 0 ? Math.round(successRatesSum / validProblemsCount) : 0;

  // Render status bar helper
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
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      {/* 1. Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="glass-panel p-4 rounded-xl border border-panelBorder flex items-center gap-3.5 hover:shadow-glow transition-all">
          <div className="p-2 bg-accentCyan/10 rounded-lg text-accentCyan flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Total Students</span>
            <span className="text-xl font-bold text-textPrimary tracking-tight mt-0.5 leading-none">{totalStudents}</span>
          </div>
        </div>

        {/* Total Submissions */}
        <div className="glass-panel p-4 rounded-xl border border-panelBorder flex items-center gap-3.5 hover:shadow-glowPurple transition-all">
          <div className="p-2 bg-accentPurple/10 rounded-lg text-accentPurple flex items-center justify-center flex-shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Total Submissions</span>
            <span className="text-xl font-bold text-textPrimary tracking-tight mt-0.5 leading-none">{totalSubmissions}</span>
          </div>
        </div>

        {/* Solved Submissions */}
        <div className="glass-panel p-4 rounded-xl border border-panelBorder flex items-center gap-3.5 hover:shadow-glow transition-all">
          <div className="p-2 bg-accentGreen/10 rounded-lg text-accentGreen flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Solved Problems</span>
            <span className="text-xl font-bold text-textPrimary tracking-tight mt-0.5 leading-none">{totalSolved}</span>
          </div>
        </div>

        {/* Avg. Success Rate */}
        <div className="glass-panel p-4 rounded-xl border border-panelBorder flex items-center gap-3.5 hover:shadow-glow transition-all">
          <div className="p-2 bg-accentOrange/10 rounded-lg text-accentOrange flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Avg. Success Rate</span>
            <span className="text-xl font-bold text-textPrimary tracking-tight mt-0.5 leading-none">{avgSuccessRate}%</span>
          </div>
        </div>
      </div>

      {/* 2. Main Overview Charts / Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Problems Summary Table (Left 2 columns) */}
        <div className="glass-panel p-4.5 rounded-xl border border-panelBorder lg:col-span-2 flex flex-col gap-3.5">
          <div className="flex items-center gap-2 border-b border-panelBorder/30 pb-2">
            <Code className="w-4 h-4 text-accentCyan" />
            <h2 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Problem Success Distribution</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-panelBorder text-textSecondary text-[10px] font-bold uppercase tracking-wider">
                  <th className="pb-2 pr-2">Question ID</th>
                  <th className="pb-2 pr-2">Title</th>
                  <th className="pb-2 pr-2 text-right">Attempts</th>
                  <th className="pb-2 pr-2 text-right">Success Rate</th>
                  <th className="pb-2 pr-2 text-right">Avg. Attempts</th>
                  <th className="pb-2 text-right min-w-[120px]">Success Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panelBorder/40">
                {problemsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-textMuted text-xs">
                      No problem data found.
                    </td>
                  </tr>
                ) : (
                  problemsList.map((p) => {
                    const successRatio = `${p.passed_students}/${p.unique_students}`;
                    const successPct = p.success_rate_percent || 0;
                    const successColorClass =
                      successPct > 75
                        ? 'text-accentGreen'
                        : successPct < 40
                        ? 'text-accentRose'
                        : 'text-accentOrange';

                    return (
                      <tr key={p.question_id} className="hover:bg-bgSurfaceHover transition-colors">
                        <td className="py-2.5 pr-2 font-semibold font-mono text-textSecondary">
                          #{p.question_id}
                        </td>
                        <td className="py-2.5 pr-2 font-semibold text-textPrimary truncate max-w-[180px]" title={p.title}>
                          {p.title}
                        </td>
                        <td className="py-2.5 pr-2 font-mono text-right text-textSecondary">
                          {p.total_attempts}
                        </td>
                        <td className={`py-2.5 pr-2 font-bold font-mono text-right ${successColorClass}`}>
                          {successPct}%
                        </td>
                        <td className="py-2.5 pr-2 font-mono text-right text-textSecondary">
                          {p.avg_attempts_to_pass || 'N/A'}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center justify-end gap-2 text-[10px] text-textSecondary font-mono">
                            <span className="w-10 text-right">{successRatio}</span>
                            <div className="w-16 h-1.5 bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/10">
                              <div
                                className={`h-full rounded-full ${
                                  successPct > 75
                                    ? 'bg-accentGreen'
                                    : successPct < 40
                                    ? 'bg-accentRose'
                                    : 'bg-accentOrange'
                                }`}
                                style={{ width: `${successPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Submission Status Distribution (Right 1 column) */}
        <div className="glass-panel p-4.5 rounded-xl border border-panelBorder flex flex-col gap-3.5">
          <div className="flex items-center gap-2 border-b border-panelBorder/30 pb-2">
            <AlertCircle className="w-4 h-4 text-accentPurple" />
            <h2 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Global Status Distribution</h2>
          </div>

          <div className="flex flex-col gap-4 flex-1 justify-center py-2">
            {totalStatusCount === 0 ? (
              <div className="text-center text-textMuted text-xs">No status reports available.</div>
            ) : (
              Object.entries(globalStatuses)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => {
                  const pct = Math.round((count / totalStatusCount) * 100);
                  const progressColor = getStatusColorClass(name);
                  const textColor = getStatusTextColorClass(name);

                  return (
                    <div key={name} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-textSecondary truncate max-w-[150px]" title={name}>{name}</span>
                        <span className={`font-mono ${textColor}`}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/10">
                        <div
                          className={`h-full rounded-full ${progressColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* 3. Section Performance Comparison (Full-Width Card) */}
      {showSectionComparison && (
        <div className="glass-panel p-4.5 rounded-xl border border-panelBorder flex flex-col gap-3.5 hover:shadow-glow transition-all duration-200">
          <div className="flex items-center justify-between border-b border-panelBorder/30 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accentCyan" />
              <h2 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Section Performance Comparison</h2>
            </div>
            <span className="text-[10px] text-textMuted font-semibold">
              Comparing details of all {sectionStats.length} discovered sections
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-panelBorder text-textSecondary text-[10px] font-bold uppercase tracking-wider select-none">
                  <th 
                    className="pb-2.5 pr-2 cursor-pointer hover:text-textPrimary transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    Section Name {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th 
                    className="pb-2.5 pr-2 text-right cursor-pointer hover:text-textPrimary transition-colors"
                    onClick={() => handleSort('activeStudents')}
                  >
                    Active Students {sortBy === 'activeStudents' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th 
                    className="pb-2.5 pr-2 text-right cursor-pointer hover:text-textPrimary transition-colors"
                    onClick={() => handleSort('avgSolved')}
                  >
                    Avg. Solved Problems {sortBy === 'avgSolved' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th 
                    className="pb-2.5 pr-2 text-right cursor-pointer hover:text-textPrimary transition-colors"
                    onClick={() => handleSort('solveRate')}
                  >
                    Solve Rate (%) {sortBy === 'solveRate' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th 
                    className="pb-2.5 pr-2 text-right cursor-pointer hover:text-textPrimary transition-colors"
                    onClick={() => handleSort('avgAttempts')}
                  >
                    Avg. Attempts / Solved {sortBy === 'avgAttempts' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th className="pb-2.5 text-right min-w-[120px]">Visual Solve Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panelBorder/40">
                {sortedSectionStats.map((sec) => {
                  const rateColorClass =
                    sec.solveRate > 75
                      ? 'text-accentGreen'
                      : sec.solveRate < 40
                      ? 'text-accentRose'
                      : 'text-accentOrange';

                  return (
                    <tr key={sec.id} className="hover:bg-bgSurfaceHover transition-colors">
                      <td className="py-2.5 pr-2 font-semibold text-textPrimary">
                        {sec.name}
                      </td>
                      <td className="py-2.5 pr-2 font-mono text-right text-textSecondary">
                        {sec.activeStudents}
                      </td>
                      <td className="py-2.5 pr-2 font-mono text-right text-textSecondary">
                        {sec.avgSolved} / {totalQuestions}
                      </td>
                      <td className={`py-2.5 pr-2 font-bold font-mono text-right ${rateColorClass}`}>
                        {sec.solveRate}%
                      </td>
                      <td className="py-2.5 pr-2 font-mono text-right text-textSecondary">
                        {sec.avgAttempts}
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center justify-end gap-2 text-[10px] text-textSecondary font-mono">
                          <div className="w-24 h-1.5 bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/10">
                            <div
                              className={`h-full rounded-full ${
                                sec.solveRate > 75
                                  ? 'bg-accentGreen'
                                  : sec.solveRate < 40
                                  ? 'bg-accentRose'
                                  : 'bg-accentOrange'
                              }`}
                              style={{ width: `${sec.solveRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
