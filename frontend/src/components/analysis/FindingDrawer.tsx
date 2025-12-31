import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

const severityColors = {
  CRITICAL: 'text-severity-critical',
  CONCERN: 'text-severity-concern',
  WATCH: 'text-severity-watch',
};

export function FindingDrawer(): JSX.Element {
  const { selectedFinding, isDrawerOpen, closeDrawer } = useAppStore();

  if (!selectedFinding || !isDrawerOpen) return <></>;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-[420px] bg-bg-secondary border-l border-bg-tertiary z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase text-accent-gold">
                  {selectedFinding.category}
                </span>
                <span className="text-[11px] font-mono text-text-tertiary">
                  Slide {selectedFinding.slide}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-text-primary">
                {selectedFinding.title}
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-bg-tertiary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bias Tag */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-2 py-1 text-xs bg-bg-tertiary text-text-secondary rounded">
              {selectedFinding.biasTag}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm font-mono leading-relaxed text-text-primary">
              {selectedFinding.description}
            </p>
          </div>

          {/* Strategic Questions */}
          <div>
            <h3 className="text-xs font-medium text-text-secondary uppercase mb-3">
              Strategic Questions
            </h3>
            <ul className="space-y-3">
              {selectedFinding.strategicQuestions.map((question, idx) => (
                <li
                  key={idx}
                  className="text-sm font-mono leading-relaxed p-3 rounded border border-bg-tertiary"
                >
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
