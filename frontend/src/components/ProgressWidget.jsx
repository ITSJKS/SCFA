import React from 'react';
import { Loader2, StopCircle, Lock } from 'lucide-react';

export default function ProgressWidget({
  visible,
  contestName,
  status,
  processedCount,
  totalStudents,
  costUsd,
  costLimit,
  promptTokens,
  completionTokens,
  onAbort,
  isSingleStudent = false
}) {
  if (!visible) return null;

  const progressPct = totalStudents > 0 ? (processedCount / totalStudents) * 100 : 0;
  const isApproachingLimit = !isSingleStudent && costLimit && costUsd >= costLimit * 0.9;
  const isFinished = status === 'completed' || status === 'aborted' || status === 'failed';

  return (
    <div className="fixed bottom-6 right-6 w-80 glass-panel shadow-2xl rounded-xl border border-panelBorder overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-headerBg px-4 py-3 flex items-center justify-between border-b border-panelBorder">
        <div className="flex items-center gap-2">
          {isFinished ? (
            <span className="w-2.5 h-2.5 rounded-full bg-accentGreen animate-pulse" />
          ) : (
            <Loader2 className="w-4 h-4 text-accentPurple animate-spin" />
          )}
          <h4 className="font-semibold text-sm text-textPrimary">
            {isSingleStudent ? 'Analyzing Student...' : isFinished ? 'Analysis Complete' : 'Running AI Critique...'}
          </h4>
        </div>
        <span 
          className="text-xs text-textMuted font-medium truncate max-w-[120px]" 
          title={contestName}
        >
          {contestName}
        </span>
      </div>

      {/* Body */}
      <div className="p-4.5 flex flex-col gap-3.5 bg-panelBgSolid border-t border-panelBorder">
        {/* Progress Text */}
        <div className="flex justify-between text-sm text-textSecondary">
          <span>{isSingleStudent ? 'Status:' : 'Students Processed:'}</span>
          <span className="font-bold text-textPrimary">
            {isSingleStudent ? (status === 'completed' ? 'Completed' : 'Running critique') : `${processedCount} / ${totalStudents}`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/20">
          <div 
            className="h-full bg-gradient-to-r from-accentPurple to-accentCyan transition-all duration-300 ease-out"
            style={{ width: `${isSingleStudent && status !== 'completed' ? 50 : progressPct}%` }}
          />
        </div>

        {/* Cost Metrics Panel */}
        <div className="grid grid-cols-2 gap-2 bg-bgSurfaceInput p-3 rounded-lg border border-panelBorder/40">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">OpenAI Cost</span>
            <span className={`text-base font-extrabold tracking-tight ${isApproachingLimit ? 'text-accentRose' : 'text-accentCyan'}`}>
              ${costUsd.toFixed(4)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-right border-l border-panelBorder/20 pl-2">
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Cost Limit</span>
            <span className="text-base font-extrabold text-textSecondary">
              {isSingleStudent ? 'N/A' : `$${costLimit.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Tokens Stats */}
        <div className="flex justify-between text-xs text-textMuted font-mono">
          <span>In: {promptTokens.toLocaleString()} tkn</span>
          <span>Out: {completionTokens.toLocaleString()} tkn</span>
        </div>

        {/* Action Button */}
        {isSingleStudent ? (
          <button 
            disabled 
            className="w-full py-2.5 flex items-center justify-center gap-1.5 bg-bgSurfaceInput border border-panelBorder text-textMuted text-sm font-bold rounded-lg cursor-not-allowed"
          >
            <Lock className="w-3.5 h-3.5" />
            Cannot Abort Single Student
          </button>
        ) : (
          <button
            onClick={onAbort}
            disabled={isFinished || status === 'aborting'}
            className={`w-full py-2.5 flex items-center justify-center gap-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${
              isFinished
                ? 'bg-bgSurfaceInput border border-panelBorder text-textMuted cursor-not-allowed'
                : status === 'aborting'
                ? 'bg-accentRose/5 border border-accentRose/20 text-accentRose/70 animate-pulse cursor-wait'
                : 'bg-accentRose/10 hover:bg-accentRose border border-accentRose/25 hover:border-accentRose hover:text-darkBg text-accentRose hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]'
            }`}
          >
            <StopCircle className="w-4 h-4" />
            {status === 'aborting' ? 'Stopping...' : isFinished ? 'Saved' : 'Stop & Save Progress'}
          </button>
        )}
      </div>
    </div>
  );
}
