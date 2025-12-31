import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import type { Finding } from '../../types';

interface SmartPinProps {
  count: number;
  findings: Finding[];
}

export function SmartPin({ count, findings }: SmartPinProps): JSX.Element {
  const { selectedFinding, selectFinding, openDrawer, isDrawerOpen } = useAppStore();

  const isActive = findings.some(f => f.id === selectedFinding?.id) && isDrawerOpen;

  const handleClick = (): void => {
    if (isActive) {
      // Clicking active pin closes drawer
      selectFinding(null);
    } else {
      // Open drawer with first finding on this slide
      selectFinding(findings[0]);
      openDrawer();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border-2',
        'font-mono text-sm font-medium transition-all shadow-lg',
        isActive
          ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
          : 'border-bg-tertiary bg-bg-secondary/95 text-text-primary hover:border-text-secondary backdrop-blur-sm'
      )}
    >
      <AlertTriangle className="w-4 h-4" />
      <span className="font-bold">{count}</span>
      <span className="text-xs text-text-tertiary">
        {count === 1 ? 'finding' : 'findings'}
      </span>
    </motion.button>
  );
}
