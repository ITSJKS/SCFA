import React, { useState, useEffect } from 'react';
import { X, Code, Sparkles, BookOpen } from 'lucide-react';

export default function CodeCompareModal({
  isOpen,
  onClose,
  title,
  firstCode,
  bestCode,
  timelineSummary,
  selectedAttemptCode,
  selectedAttemptNumber
}) {
  const [activeTab, setActiveTab] = useState('best');

  // Sync active tab when selectedAttemptNumber changes
  useEffect(() => {
    if (selectedAttemptNumber !== null && selectedAttemptNumber !== undefined) {
      setActiveTab('attempt');
    } else {
      setActiveTab('best');
    }
  }, [selectedAttemptNumber, isOpen]);

  if (!isOpen) return null;

  const getCodeToDisplay = () => {
    switch (activeTab) {
      case 'first':
        return firstCode || '# No source code captured for first attempt.';
      case 'best':
        return bestCode || '# No source code captured for best attempt.';
      case 'attempt':
        return selectedAttemptCode || `# No source code captured for Attempt ${selectedAttemptNumber}.`;
      default:
        return '';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl h-[85vh] bg-panelBgSolid rounded-2xl flex flex-col border border-panelBorder shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-headerBg px-4.5 py-3 flex justify-between items-center border-b border-panelBorder">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-accentCyan/10 rounded-lg text-accentCyan flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-textPrimary truncate max-w-[650px]" title={title}>
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-bgSurfaceHover text-textSecondary hover:text-textPrimary rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-headerBg border-b border-panelBorder px-4.5 gap-1.5 pt-1">
          <button
            onClick={() => setActiveTab('best')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer ${
              activeTab === 'best'
                ? 'border-accentCyan text-accentCyan'
                : 'border-transparent text-textSecondary hover:text-textPrimary'
            }`}
          >
            Best/Final Code
          </button>
          <button
            onClick={() => setActiveTab('first')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer ${
              activeTab === 'first'
                ? 'border-accentCyan text-accentCyan'
                : 'border-transparent text-textSecondary hover:text-textPrimary'
            }`}
          >
            First Code
          </button>
          
          {selectedAttemptNumber !== null && (
            <button
              onClick={() => setActiveTab('attempt')}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer ${
                activeTab === 'attempt'
                  ? 'border-accentCyan text-accentCyan'
                  : 'border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              Attempt {selectedAttemptNumber} Code
            </button>
          )}

          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 cursor-pointer ${
              activeTab === 'diff'
                ? 'border-accentCyan text-accentCyan'
                : 'border-transparent text-textSecondary hover:text-textPrimary'
            }`}
          >
            Attempt Diffs
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto bg-[#070a13] p-4.5 text-xs font-mono text-[#cbd5e1] leading-relaxed border-t border-panelBorder/30">
          {activeTab === 'diff' ? (
            <div className="max-w-4xl mx-auto flex flex-col gap-3.5">
              <div className="flex items-center gap-2 text-accentCyan border-b border-panelBorder/20 pb-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-bold text-xs uppercase tracking-wider">Attempt Debugging Progression Narrative</h3>
              </div>
              <p className="text-[11px] text-textSecondary leading-normal font-sans italic">
                Below is a log of changes between attempts, calculated locally by checking lines modified, added, and deleted.
              </p>
              <pre className="whitespace-pre-wrap font-mono text-xs text-textSecondary bg-bgSurfaceInput p-3.5 rounded-lg border border-panelBorder/20 overflow-x-auto leading-relaxed">
                {timelineSummary || 'No attempt progression timeline available.'}
              </pre>
            </div>
          ) : (
            <pre className="h-full overflow-auto text-left selection:bg-accentPurple/30 selection:text-white">
              <code className="block leading-relaxed whitespace-pre font-mono text-xs">
                {getCodeToDisplay()}
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
