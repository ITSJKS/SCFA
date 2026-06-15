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
  isSingleStudent = false,
  dryRun = false
}) {
  if (!visible) return null;

  const progressPct = totalStudents > 0 ? (processedCount / totalStudents) * 100 : 0;
  const isApproachingLimit = !isSingleStudent && costLimit && costUsd >= costLimit * 0.9;
  const isFinished = status === 'completed' || status === 'aborted' || status === 'failed';

  return (
    <div className="fixed bottom-6 right-6 w-80 glass-panel shadow-2xl rounded-xl border border-panelBorder overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="bg-headerBg px-3.5 py-2.5 flex items-center justify-between border-b border-panelBorder">
        <div className="flex items-center gap-2">
          {isFinished ? (
            <span className="w-2 h-2 rounded-full bg-accentGreen animate-pulse" />
          ) : (
            <Loader2 className="w-3.5 h-3.5 text-accentPurple animate-spin" />
          )}
          <h4 className="font-semibold text-xs text-textPrimary">
            {isSingleStudent 
              ? 'Analyzing Student...' 
              : status === 'queued'
                ? 'In Queue (Waiting)...'
                : isFinished 
                  ? 'Analysis Complete' 
                  : dryRun 
                    ? 'Parsing & Preparing Submissions...' 
                    : 'Running AI Critique...'}
          </h4>
        </div>
        <span 
          className="text-[10px] text-textMuted font-medium truncate max-w-[120px]" 
          title={contestName}
        >
          {contestName}
        </span>
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col gap-3 bg-panelBgSolid">
        {/* Progress Text */}
        <div className="flex justify-between text-xs text-textSecondary">
          <span>{isSingleStudent ? 'Status:' : 'Students Processed:'}</span>
          <span className="font-semibold text-textPrimary">
            {isSingleStudent ? (status === 'completed' ? 'Completed' : 'Running critique') : `${processedCount} / ${totalStudents}`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-bgSurfaceInput rounded-full overflow-hidden border border-panelBorder/10">
          <div 
            className="h-full bg-gradient-to-r from-accentPurple to-accentCyan transition-all duration-300 ease-out"
            style={{ width: `${isSingleStudent && status !== 'completed' ? 50 : progressPct}%` }}
          />
        </div>

        {/* Cost Metrics Panel */}
        <div className="grid grid-cols-2 gap-2 bg-bgSurfaceInput p-2.5 rounded-lg border border-panelBorder/20">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-textMuted font-bold uppercase tracking-wider">
              {dryRun ? 'Mode' : 'OpenAI Cost'}
            </span>
            <span className={`text-sm font-bold tracking-tight ${isApproachingLimit ? 'text-accentRose' : 'text-accentCyan'}`}>
              {dryRun ? 'Local Dry-Run' : `$${costUsd.toFixed(4)}`}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-right border-l border-panelBorder/10 pl-2">
            <span className="text-[9px] text-textMuted font-bold uppercase tracking-wider">
              {dryRun ? 'AI Critique' : 'Cost Limit'}
            </span>
            <span className="text-sm font-bold text-textSecondary">
              {dryRun ? 'Disabled' : (isSingleStudent ? 'N/A' : `$${costLimit.toFixed(2)}`)}
            </span>
          </div>
        </div>

        {/* Tokens Stats */}
        <div className="flex justify-between text-[10px] text-textMuted font-mono">
          <span>{dryRun ? '' : `In: ${promptTokens.toLocaleString()} tkn`}</span>
          <span>{dryRun ? '' : `Out: ${completionTokens.toLocaleString()} tkn`}</span>
        </div>

        {/* Action Button */}
        {isSingleStudent ? (
          <button 
            disabled 
            className="w-full py-1.5 flex items-center justify-center gap-1.5 bg-bgSurfaceInput border border-panelBorder text-textMuted text-xs font-semibold rounded-lg cursor-not-allowed"
          >
            <Lock className="w-3 h-3" />
            <span>Cannot Abort Single Student</span>
          </button>
        ) : (
          <button
            onClick={onAbort}
            disabled={isFinished || status === 'aborting'}
            className={`w-full py-1.5 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
              isFinished
                ? 'bg-bgSurfaceInput border border-panelBorder text-textMuted cursor-not-allowed'
                : status === 'aborting'
                ? 'bg-accentRose/5 border border-accentRose/20 text-accentRose/70 animate-pulse cursor-wait'
                : 'bg-accentRose/10 hover:bg-accentRose border border-accentRose/20 hover:border-accentRose hover:text-darkBg text-accentRose'
            }`}
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span>{status === 'aborting' ? 'Stopping...' : isFinished ? 'Saved' : 'Stop & Save Progress'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
