import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps): JSX.Element {
  return (
    <div className="p-4 rounded-lg border border-bg-tertiary bg-bg-secondary">
      {/* Question ID */}
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono text-text-tertiary mt-0.5">
          {question.id}
        </span>
        <p className="flex-1 text-sm text-text-primary leading-relaxed">
          {question.text}
        </p>
      </div>
    </div>
  );
}
