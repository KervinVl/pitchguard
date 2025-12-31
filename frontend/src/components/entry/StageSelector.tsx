import { useAppStore } from '../../store/useAppStore';
import type { FundingStage } from '../../types';
import { cn } from '../../lib/utils';

const stages: FundingStage[] = ['Pre-Seed', 'Seed', 'Series A', 'Series B+'];

export function StageSelector(): JSX.Element {
  const { selectedStage, setSelectedStage } = useAppStore();

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="text-sm font-medium text-text-secondary">
        Funding Stage
      </label>
      <div className="flex gap-0 rounded-lg border border-bg-tertiary overflow-hidden">
        {stages.map((stage, index) => (
          <button
            key={stage}
            onClick={() => setSelectedStage(stage)}
            className={cn(
              'h-10 px-6 text-sm font-normal transition-colors',
              'hover:bg-bg-secondary/50',
              'border-r border-bg-tertiary last:border-r-0',
              selectedStage === stage
                ? 'bg-bg-secondary text-text-primary'
                : 'bg-transparent text-text-secondary',
              index === 0 && 'rounded-l-md',
              index === stages.length - 1 && 'rounded-r-md'
            )}
          >
            {stage}
          </button>
        ))}
      </div>
    </div>
  );
}
