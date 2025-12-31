import { Sigma } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export function LeftSidebar(): JSX.Element {
  const { analysisSubView, setAnalysisSubView, analysisData, currentSlide, setCurrentSlide } =
    useAppStore();

  const slideCount = analysisData?.metadata.slideCount || 0;
  const isLedgerView = analysisSubView === 'ledger';

  const toggleView = (): void => {
    setAnalysisSubView(analysisSubView === 'pdf' ? 'ledger' : 'pdf');
  };

  return (
    <aside className="w-15 border-r border-bg-tertiary flex flex-col h-full">
      <div className="flex-shrink-0 flex flex-col items-center py-4">
        {/* Sigma Toggle Button */}
        <button
          onClick={toggleView}
          className={cn(
            'w-12 h-12 flex flex-col items-center justify-center gap-0.5',
            'border rounded-md transition-colors',
            isLedgerView
              ? 'border-accent-gold text-accent-gold'
              : 'border-bg-tertiary text-text-secondary hover:border-text-secondary'
          )}
        >
          <Sigma className="w-5 h-5" />
          <span className="text-[10px] font-mono">FULL</span>
        </button>
      </div>

      {/* Slide Numbers (always visible, scrollable) */}
      {slideCount > 0 && (
        <div className="flex-1 overflow-y-auto px-3.5 pb-4 scrollbar-hide">
          <div className="flex flex-col gap-1 mt-6">
            {Array.from({ length: slideCount }, (_, i) => i + 1).map((slide) => (
              <button
                key={slide}
                onClick={() => {
                  setCurrentSlide(slide);
                  if (isLedgerView) {
                    setAnalysisSubView('pdf');
                  }
                }}
                className={cn(
                  'w-8 h-8 flex items-center justify-center',
                  'text-xs font-mono rounded transition-colors',
                  currentSlide === slide
                    ? 'bg-bg-secondary text-text-primary'
                    : 'text-text-tertiary hover:bg-bg-secondary hover:text-text-secondary'
                )}
              >
                {slide}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
