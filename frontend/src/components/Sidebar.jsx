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
    <div className="w-full lg:w-80 flex flex-col h-[280px] lg:h-full glass-panel border border-panelBorder rounded-xl overflow-hidden flex-shrink-0">
      {/* Sidebar Header / Filters */}
      <div className="p-3 border-b border-panelBorder bg-headerBg/20 flex flex-col gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-textMuted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search email or ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-lg text-textPrimary placeholder:text-textMuted outline-none transition-all duration-150"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 px-0.5">
          <Filter className="w-3.5 h-3.5 text-textSecondary" />
          <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">Filter:</span>
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="flex-1 bg-bgSurfaceInput border border-panelBorder text-xs text-textPrimary py-1 px-2 rounded-md outline-none cursor-pointer hover:border-panelBorder/80 transition-colors"
          >
            <option value="all" className="bg-panelBgSolid text-textPrimary">All Students</option>
            <option value="solved-all" className="bg-panelBgSolid text-textPrimary">Solved All</option>
            <option value="struggling" className="bg-panelBgSolid text-textPrimary">Struggling (&lt;50% Pass)</option>
            <option value="high-attempts" className="bg-panelBgSolid text-textPrimary">High Attempts (&gt;15)</option>
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5 select-none">
        {studentList.length === 0 ? (
          <div className="text-center text-xs text-textMuted py-8">
            No students found.
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
                title={email}
                className={`group flex flex-col gap-1 p-2.5 rounded-lg border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-accentCyan/10 border-accentCyan/30 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-bgSurfaceHover hover:border-panelBorder/20'
                }`}
              >
                {/* Email and Badge */}
                <div className="flex items-center justify-between gap-2.5">
                  <span className={`text-xs font-semibold truncate leading-normal ${isSelected ? 'text-accentCyan' : 'text-textPrimary'}`}>
                    {email}
                  </span>
                  {s.ai_critique_completed && (
                    <span 
                      className="flex items-center gap-0.5 bg-gradient-to-r from-accentPurple to-accentCyan text-[9px] font-bold text-white px-1.5 py-0.5 rounded flex-shrink-0"
                      title="AI Critique Feedback Active"
                    >
                      <Sparkles className="w-2 h-2" />
                      AI
                    </span>
                  )}
                </div>

                {/* Sub Metadata */}
                <div className="flex items-center justify-between text-[11px] text-textSecondary">
                  <span className="text-textMuted font-medium">ID: {s.user_id}</span>
                  <span className="font-medium">
                    Solved: <span className={`font-semibold ${rateColor}`}>{solvedRatio}</span> ({s.total_submissions} subs)
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
