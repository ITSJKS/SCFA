import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';

export default function Sidebar({
  students,
  selectedStudentEmail,
  onSelectStudent,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType
}) {
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterChange = (e) => setFilterType(e.target.value);

  // Convert student object to array, apply filters, and sort
  const studentList = Object.entries(students || {})
    .filter(([email, s]) => {
      // 1. Search Query Match
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = email.toLowerCase().includes(query) || String(s.user_id).includes(query);
      if (!matchSearch) return false;

      // 2. Dropdown Filter Match
      if (filterType === 'solved-all') {
        return s.solved_count === s.attempted_count && s.attempted_count > 0;
      }
      if (filterType === 'struggling') {
        const passRate = s.attempted_count > 0 ? (s.solved_count / s.attempted_count) : 0;
        return passRate < 0.5 && s.attempted_count > 0;
      }
      if (filterType === 'high-attempts') {
        return s.total_submissions > 15;
      }
      return true;
    })
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="w-85 flex flex-col h-full glass-panel border border-panelBorder rounded-xl overflow-hidden flex-shrink-0">
      {/* Sidebar Header / Filters */}
      <div className="p-4 border-b border-panelBorder bg-headerBg/40 flex flex-col gap-3.5">
        {/* Search */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-textMuted absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search email or ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 text-[15px] bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary placeholder:text-textMuted outline-none transition-all duration-150 focus:shadow-[0_0_8px_rgba(0,242,254,0.15)]"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2.5 px-0.5">
          <Filter className="w-4 h-4 text-textSecondary" />
          <span className="text-sm text-textSecondary font-bold uppercase tracking-wider">Filter:</span>
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="flex-1 bg-bgSurfaceInput border border-panelBorder text-sm text-textPrimary py-1.5 px-2.5 rounded-md outline-none cursor-pointer hover:border-panelBorder/80 transition-colors"
          >
            <option value="all" className="bg-panelBgSolid text-textPrimary">All Students</option>
            <option value="solved-all" className="bg-panelBgSolid text-textPrimary">Solved All</option>
            <option value="struggling" className="bg-panelBgSolid text-textPrimary">Struggling (&lt;50% Pass)</option>
            <option value="high-attempts" className="bg-panelBgSolid text-textPrimary">High Attempts (&gt;15)</option>
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2 select-none">
        {studentList.length === 0 ? (
          <div className="text-center text-sm text-textMuted py-10">
            No students found matching filters.
          </div>
        ) : (
          studentList.map(([email, s]) => {
            const isSelected = email === selectedStudentEmail;
            const solvedRatio = `${s.solved_count}/${s.attempted_count}`;
            const pct = s.attempted_count > 0 ? Math.round((s.solved_count / s.attempted_count) * 100) : 0;
            const rateColor = pct > 75 ? 'text-accentGreen' : (pct < 40 ? 'text-accentRose' : 'text-accentOrange');

            return (
              <div
                key={email}
                onClick={() => onSelectStudent(email)}
                className={`group flex flex-col gap-1.5 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-accentCyan/10 border-accentCyan/40 shadow-[0_0_12px_rgba(0,242,254,0.08)]'
                    : 'bg-transparent border-transparent hover:bg-bgSurfaceHover hover:border-panelBorder/30'
                }`}
              >
                {/* Email and Badge */}
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[16px] font-bold truncate leading-tight ${isSelected ? 'text-accentCyan' : 'text-textPrimary group-hover:text-textPrimary'}`}>
                    {email}
                  </span>
                  {s.ai_critique_completed && (
                    <span 
                      className="flex items-center gap-0.5 bg-gradient-to-r from-accentPurple to-accentCyan text-[9px] font-extrabold text-white px-2 py-0.5 rounded shadow-sm flex-shrink-0"
                      title="AI Critique Feedback Active"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      AI
                    </span>
                  )}
                </div>

                {/* Sub Metadata */}
                <div className="flex items-center justify-between text-sm text-textSecondary">
                  <span className="font-semibold text-textMuted">ID: {s.user_id}</span>
                  <span className="font-medium">
                    Solved: <span className={`font-bold ${rateColor}`}>{solvedRatio}</span> ({s.total_submissions} subs)
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
