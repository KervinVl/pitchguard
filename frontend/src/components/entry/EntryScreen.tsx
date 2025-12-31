import { StageSelector } from './StageSelector';
import { UploadZone } from './UploadZone';
import { useAppStore } from '../../store/useAppStore';
import { useAnalysis } from '../../hooks/useAnalysis';
import { cn } from '../../lib/utils';

export function EntryScreen(): JSX.Element {
  const { selectedStage, uploadedFile } = useAppStore();
  const { mutate: analyzeFile, isPending } = useAnalysis();

  const canAnalyze = selectedStage !== null && uploadedFile !== null && !isPending;

  const handleAnalyze = (): void => {
    if (!canAnalyze || !selectedStage || !uploadedFile) return;

    analyzeFile({ file: uploadedFile, stage: selectedStage });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            PITCHGUARD
          </h1>
          <p className="text-sm text-text-secondary">
            Venture Capital audit tool powered by AI
          </p>
        </div>

        {/* Stage Selector */}
        <StageSelector />

        {/* Upload Zone */}
        <div className="w-full">
          <UploadZone />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={cn(
            'h-12 px-8 rounded-md border text-sm font-medium',
            'transition-all',
            canAnalyze
              ? 'border-bg-tertiary hover:border-text-secondary bg-transparent text-text-primary cursor-pointer'
              : 'border-bg-tertiary bg-transparent text-text-tertiary cursor-not-allowed opacity-50'
          )}
        >
          {isPending ? 'Analyzing...' : 'Analyze Deck'}
        </button>

        {/* Privacy Notice */}
        <p className="text-xs font-mono text-text-tertiary text-center">
          Files are processed locally and deleted immediately after analysis.
        </p>
      </div>
    </div>
  );
}
