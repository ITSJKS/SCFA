import React from 'react';
import { Users, Terminal, CheckCircle2, TrendingUp, Code, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';

export default function ContestDashboard({ problemsData, metadata }) {
  // Aggregate stats
  const totalStudents = metadata?.total_students || 0;
  const totalSubmissions = metadata?.total_submissions || 0;

  let totalSolved = 0;
  let successRatesSum = 0;
  let validProblemsCount = 0;
  const globalStatuses = {};
  let totalStatusCount = 0;

  const problemsList = Object.values(problemsData || {});

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
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 1. Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="glass-panel p-5.5 rounded-xl border border-panelBorder flex items-center gap-4.5 hover:shadow-[0_4px_20px_rgba(0,242,254,0.05)] transition-all">
          <div className="p-3.5 bg-accentCyan/10 rounded-lg text-accentCyan">
            <Users className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-textSecondary font-bold uppercase tracking-wider">Total Students</span>
            <span className="text-3xl font-extrabold text-textPrimary tracking-tight mt-0.5">{totalStudents}</span>
          </div>
        </div>

        {/* Total Submissions */}
        <div className="glass-panel p-5.5 rounded-xl border border-panelBorder flex items-center gap-4.5 hover:shadow-[0_4px_20px_rgba(157,78,221,0.05)] transition-all">
          <div className="p-3.5 bg-accentPurple/10 rounded-lg text-accentPurple">
            <Terminal className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-textSecondary font-bold uppercase tracking-wider">Total Submissions</span>
            <span className="text-3xl font-extrabold text-textPrimary tracking-tight mt-0.5">{totalSubmissions}</span>
          </div>
        </div>

        {/* Solved Submissions */}
        <div className="glass-panel p-5.5 rounded-xl border border-panelBorder flex items-center gap-4.5 hover:shadow-[0_4px_20px_rgba(16,185,129,0.05)] transition-all">
          <div className="p-3.5 bg-accentGreen/10 rounded-lg text-accentGreen">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-textSecondary font-bold uppercase tracking-wider">Solved Problems</span>
            <span className="text-3xl font-extrabold text-textPrimary tracking-tight mt-0.5">{totalSolved}</span>
          </div>
        </div>

        {/* Avg. Success Rate */}
        <div className="glass-panel p-5.5 rounded-xl border border-panelBorder flex items-center gap-4.5 hover:shadow-[0_4px_20px_rgba(245,158,11,0.05)] transition-all">
          <div className="p-3.5 bg-accentOrange/10 rounded-lg text-accentOrange">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-textSecondary font-bold uppercase tracking-wider">Avg. Success Rate</span>
            <span className="text-3xl font-extrabold text-textPrimary tracking-tight mt-0.5">{avgSuccessRate}%</span>
          </div>
        </div>
      </div>

      {/* 2. Main Overview Charts / Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problems Summary Table (Left 2 columns) */}
        <div className="glass-panel p-6 rounded-xl border border-panelBorder lg:col-span-2 flex flex-col gap-4.5">
          <div className="flex items-center gap-2 border-b border-panelBorder/30 pb-2.5">
            <Code className="w-5 h-5 text-accentCyan" />
            <h2 className="text-lg font-extrabold text-textPrimary uppercase tracking-wider">Problem Success Distribution</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[15px] border-collapse">
              <thead>
                <tr className="border-b border-panelBorder text-textSecondary text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-2">Question ID</th>
                  <th className="pb-3 pr-2">Title</th>
                  <th className="pb-3 pr-2">Attempts</th>
                  <th className="pb-3 pr-2">Success Rate</th>
                  <th className="pb-3 pr-2">Avg. Attempts</th>
                  <th className="pb-3">Success Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panelBorder/40">
                {problemsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-textMuted text-sm">
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
                        <td className="py-3.5 pr-2 font-semibold font-mono text-sm text-textSecondary">
                          #{p.question_id}
                        </td>
                        <td className="py-3.5 pr-2 font-bold text-textPrimary truncate max-w-[180px]" title={p.title}>
                          {p.title}
                        </td>
                        <td className="py-3.5 pr-2 font-mono text-sm text-textSecondary">
                          {p.total_attempts}
                        </td>
                        <td className={`py-3.5 pr-2 font-extrabold font-mono text-sm ${successColorClass}`}>
                          {successPct}%
                        </td>
                        <td className="py-3.5 pr-2 font-mono text-sm text-textSecondary">
                          {p.avg_attempts_to_pass || 'N/A'}
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2 text-xs text-textSecondary font-mono">
                            <span className="w-10 text-right text-sm">{successRatio}</span>
                            <div className="w-20 h-2 bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/20">
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
        <div className="glass-panel p-6 rounded-xl border border-panelBorder flex flex-col gap-4.5">
          <div className="flex items-center gap-2 border-b border-panelBorder/30 pb-2.5">
            <AlertCircle className="w-5 h-5 text-accentPurple" />
            <h2 className="text-lg font-extrabold text-textPrimary uppercase tracking-wider">Global Status Distribution</h2>
          </div>

          <div className="flex flex-col gap-5 flex-1 justify-center py-4">
            {totalStatusCount === 0 ? (
              <div className="text-center text-textMuted text-sm">No status reports available.</div>
            ) : (
              Object.entries(globalStatuses)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => {
                  const pct = Math.round((count / totalStatusCount) * 100);
                  const progressColor = getStatusColorClass(name);
                  const textColor = getStatusTextColorClass(name);

                  return (
                    <div key={name} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-textPrimary truncate max-w-[150px]" title={name}>{name}</span>
                        <span className={`font-mono ${textColor}`}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/20">
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
    </div>
  );
}
