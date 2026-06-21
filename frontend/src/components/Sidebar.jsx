import React from 'react';
import { Search, Filter, Sparkles, ArrowUpDown, TrendingUp } from 'lucide-react';

export default function Sidebar({
  students,
  selectedStudentEmail,
  onSelectStudent,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  isMock = false
}) {
  const [sortBy, setSortBy] = React.useState('name-asc');
  
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterChange = (e) => setFilterType(e.target.value);

  const handleSortClick = (metric) => {
    let currentMetric = 'name';
    let isAsc = true;
    
    if (sortBy.startsWith('name')) {
      currentMetric = 'name';
      isAsc = sortBy.endsWith('asc');
    } else if (sortBy.startsWith('score')) {
      currentMetric = 'score';
      isAsc = sortBy.endsWith('asc');
    } else if (sortBy.startsWith('comms')) {
      currentMetric = 'comms';
      isAsc = sortBy.endsWith('asc');
    } else if (sortBy.startsWith('attempts')) {
      currentMetric = 'attempts';
      isAsc = sortBy.endsWith('asc');
    } else if (sortBy.startsWith('solved')) {
      currentMetric = 'solved';
      isAsc = sortBy.endsWith('asc');
    } else if (sortBy.startsWith('subs')) {
      currentMetric = 'subs';
      isAsc = sortBy.endsWith('asc');
    }
    
    if (currentMetric === metric) {
      setSortBy(`${metric}-${isAsc ? 'desc' : 'asc'}`);
    } else {
      // Default to desc for metrics, asc for name/email
      const defaultDir = metric === 'name' ? 'asc' : 'desc';
      setSortBy(`${metric}-${defaultDir}`);
    }
  };

  const renderSortButton = (metric, label) => {
    let active = false;
    let isAsc = false;
    if (sortBy.startsWith(metric)) {
      active = true;
      isAsc = sortBy.endsWith('asc');
    }
    
    return (
      <button
        key={metric}
        type="button"
        onClick={() => handleSortClick(metric)}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all duration-150 ${
          active
            ? 'bg-accentCyan/10 border-accentCyan/40 text-accentCyan shadow-sm shadow-accentCyan/5'
            : 'bg-bgSurfaceInput border-panelBorder hover:bg-bgSurfaceHover hover:border-panelBorder/60 text-textSecondary hover:text-textPrimary'
        }`}
      >
        <span>{label}</span>
        {active && (
          <span className="text-[10px] leading-none">
            {isAsc ? '▲' : '▼'}
          </span>
        )}
      </button>
    );
  };

  // Convert student object to array, apply filters, and sort
  const studentList = Object.entries(students || {})
    .filter(([email, s]) => {
      // 1. Search Query Match
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = email.toLowerCase().includes(query) || String(s.user_id).includes(query);
      if (!matchSearch) return false;

      // 2. Dropdown Filter Match
      if (isMock) {
        const effRating = s.latest_rating !== null && s.latest_rating !== undefined ? s.latest_rating : s.best_rating;
        const comms = s.latest_communication_score;
        if (filterType === 'high-rating') {
          return effRating !== null && effRating !== undefined && effRating >= 70;
        }
        if (filterType === 'low-rating') {
          return effRating !== null && effRating !== undefined && effRating < 50;
        }
        if (filterType === 'high-comms') {
          return comms !== null && comms !== undefined && comms >= 4.0;
        }
        if (filterType === 'low-comms') {
          return comms !== null && comms !== undefined && comms < 3.0;
        }
        return true;
      } else {
        if (filterType === 'solved-all') {
          const totalQ = s.total_questions || s.attempted_count;
          return s.solved_count === totalQ && totalQ > 0;
        }
        if (filterType === 'struggling') {
          const totalQ = s.total_questions || s.attempted_count;
          const passRate = totalQ > 0 ? (s.solved_count / totalQ) : 0;
          return passRate < 0.5 && totalQ > 0;
        }
        if (filterType === 'high-attempts') {
          return s.total_submissions > 15;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const [emailA, sA] = a;
      const [emailB, sB] = b;
      
      const isAsc = sortBy.endsWith('-asc') || sortBy.endsWith('asc');
      
      if (sortBy.startsWith('name')) {
        return isAsc ? emailA.localeCompare(emailB) : emailB.localeCompare(emailA);
      }
      
      if (isMock) {
        if (sortBy.startsWith('score')) {
          const rA = sA.latest_rating !== null && sA.latest_rating !== undefined ? sA.latest_rating : (sA.best_rating !== null ? sA.best_rating : -1);
          const rB = sB.latest_rating !== null && sB.latest_rating !== undefined ? sB.latest_rating : (sB.best_rating !== null ? sB.best_rating : -1);
          if (rA === rB) return emailA.localeCompare(emailB);
          return isAsc ? rA - rB : rB - rA;
        }
        if (sortBy.startsWith('comms')) {
          const cA = sA.latest_communication_score !== null && sA.latest_communication_score !== undefined ? sA.latest_communication_score : -1;
          const cB = sB.latest_communication_score !== null && sB.latest_communication_score !== undefined ? sB.latest_communication_score : -1;
          if (cA === cB) return emailA.localeCompare(emailB);
          return isAsc ? cA - cB : cB - cA;
        }
        if (sortBy.startsWith('attempts')) {
          const attA = sA.attempts?.length || 0;
          const attB = sB.attempts?.length || 0;
          if (attA === attB) return emailA.localeCompare(emailB);
          return isAsc ? attA - attB : attB - attA;
        }
      } else {
        if (sortBy.startsWith('solved')) {
          const sA_val = sA.solved_count || 0;
          const sB_val = sB.solved_count || 0;
          if (sA_val === sB_val) return emailA.localeCompare(emailB);
          return isAsc ? sA_val - sB_val : sB_val - sA_val;
        }
        if (sortBy.startsWith('subs')) {
          const subA = sA.total_submissions || 0;
          const subB = sB.total_submissions || 0;
          if (subA === subB) return emailA.localeCompare(emailB);
          return isAsc ? subA - subB : subB - subA;
        }
      }
      return emailA.localeCompare(emailB);
    });

  return (
    <div className="w-full lg:w-80 flex flex-col h-[320px] lg:h-full glass-panel border border-panelBorder rounded-xl overflow-hidden flex-shrink-0">
      {/* Search & Actions Bar */}
      <div className="p-2.5 border-b border-panelBorder bg-headerBg/10 flex flex-col gap-2">
        {/* Row 1: Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-textMuted absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-8 pr-2.5 py-1 text-[11px] bg-bgSurfaceInput border border-panelBorder focus:border-accentCyan rounded-md text-textPrimary placeholder:text-textMuted outline-none transition-all duration-150"
          />
        </div>

        {/* Row 2: Combined Filters & Sort */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          {/* Filter pills */}
          <div className="flex gap-1 py-0.5">
            {isMock ? (
              <>
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-accentCyan/10 border-accentCyan/30 text-accentCyan'
                      : 'bg-transparent border-transparent text-textMuted hover:text-textSecondary'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('high-rating')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    filterType === 'high-rating'
                      ? 'bg-accentGreen/10 border-accentGreen/30 text-accentGreen'
                      : 'bg-transparent border-transparent text-textMuted hover:text-textSecondary'
                  }`}
                  title="Score >= 70"
                >
                  Elite
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('low-rating')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    filterType === 'low-rating'
                      ? 'bg-accentRose/10 border-accentRose/30 text-accentRose'
                      : 'bg-transparent border-transparent text-textMuted hover:text-textSecondary'
                  }`}
                  title="Score < 50"
                >
                  Struggling
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-accentCyan/10 border-accentCyan/30 text-accentCyan'
                      : 'bg-transparent border-transparent text-textMuted hover:text-textSecondary'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('solved-all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    filterType === 'solved-all'
                      ? 'bg-accentGreen/10 border-accentGreen/30 text-accentGreen'
                      : 'bg-transparent border-transparent text-textMuted hover:text-textSecondary'
                  }`}
                  title="Solved all questions"
                >
                  Solved
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('struggling')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    filterType === 'struggling'
                      ? 'bg-accentRose/10 border-accentRose/30 text-accentRose'
                      : 'bg-transparent border-transparent text-textMuted hover:text-textSecondary'
                  }`}
                  title="Less than 50% pass rate"
                >
                  Alert
                </button>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-textMuted font-bold uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bgSurfaceInput border border-panelBorder hover:border-panelBorder/80 text-[10px] font-bold text-textSecondary hover:text-textPrimary py-0.5 px-1 rounded-md outline-none cursor-pointer transition-colors max-w-[95px]"
            >
              {isMock ? (
                <>
                  <option value="name-asc" className="bg-panelBgSolid text-textPrimary">Name A-Z</option>
                  <option value="name-desc" className="bg-panelBgSolid text-textPrimary">Name Z-A</option>
                  <option value="score-desc" className="bg-panelBgSolid text-textPrimary">Score High</option>
                  <option value="score-asc" className="bg-panelBgSolid text-textPrimary">Score Low</option>
                  <option value="comms-desc" className="bg-panelBgSolid text-textPrimary">Comms High</option>
                  <option value="attempts-desc" className="bg-panelBgSolid text-textPrimary">Attempts</option>
                </>
              ) : (
                <>
                  <option value="name-asc" className="bg-panelBgSolid text-textPrimary">Email A-Z</option>
                  <option value="name-desc" className="bg-panelBgSolid text-textPrimary">Email Z-A</option>
                  <option value="solved-desc" className="bg-panelBgSolid text-textPrimary">Solved High</option>
                  <option value="solved-asc" className="bg-panelBgSolid text-textPrimary">Solved Low</option>
                  <option value="subs-desc" className="bg-panelBgSolid text-textPrimary">Attempts</option>
                </>
              )}
            </select>
          </div>
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
            const totalQ = s.total_questions || s.attempted_count || 1;
            const solvedRatio = `${s.solved_count}/${totalQ}`;
            const pct = Math.round((s.solved_count / totalQ) * 100);
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
                    {isMock ? (
                      (() => {
                        const effRating = s.latest_rating !== null && s.latest_rating !== undefined ? s.latest_rating : s.best_rating;
                        const hasScore = effRating !== null && effRating !== undefined;
                        const ratingColor = hasScore 
                          ? (effRating >= 70 ? 'text-accentGreen bg-accentGreen/10 border border-accentGreen/20 px-1 py-0.5 rounded text-[10px]' : (effRating < 50 ? 'text-accentRose' : 'text-accentOrange')) 
                          : 'text-textMuted';
                        const scoreDisplay = s.latest_rating !== null && s.latest_rating !== undefined 
                          ? s.latest_rating 
                          : (s.best_rating !== null && s.best_rating !== undefined ? `${s.best_rating} (Best)` : 'N/A');
                          
                        return (
                          <>
                            Score: <span className={`font-semibold font-mono ${ratingColor}`}>
                              {scoreDisplay}
                            </span>
                          </>
                        );
                      })()
                    ) : (
                      <>
                        Solved: <span className={`font-semibold ${rateColor}`}>{solvedRatio}</span> ({s.total_submissions} subs)
                      </>
                    )}
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
