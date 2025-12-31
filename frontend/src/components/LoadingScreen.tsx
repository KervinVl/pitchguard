import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
  { label: 'Converting PDF to images', sublabel: 'Preparing slides for analysis...', duration: 5000 },
  { label: 'Analyzing deck with Claude Vision', sublabel: 'Identifying cognitive biases...', duration: 50000 },
  { label: 'Generating strategic questions', sublabel: 'Building due diligence framework...', duration: 15000 },
  { label: 'Finalizing insights', sublabel: 'Almost ready...', duration: 10000 },
];

export function LoadingScreen(): JSX.Element {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    // Set timeout for each stage based on its duration
    const timeout = setTimeout(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stages[currentStage].duration);

    return () => clearTimeout(timeout);
  }, [currentStage]);

  const progress = ((currentStage + 1) / stages.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-bg-primary">
      <div className="w-full max-w-xl flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-mono font-medium text-text-primary tracking-wider mb-2">
            ANALYZING PITCH DECK
          </h1>
          <p className="text-sm text-text-tertiary">
            This may take 60-90 seconds
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-gold"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>

          {/* Progress Percentage */}
          <motion.div
            className="absolute -top-8 right-0 text-xs font-mono text-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>

        {/* Stage Labels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-accent-gold"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <p className="text-base font-mono text-text-primary">
                {stages[currentStage].label}
              </p>
            </div>
            <p className="text-sm font-mono text-text-tertiary pl-11">
              {stages[currentStage].sublabel}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Stage Indicators */}
        <div className="flex justify-between px-1">
          {stages.map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  index <= currentStage
                    ? 'border-accent-gold bg-accent-gold'
                    : 'border-bg-tertiary bg-transparent'
                }`}
              />
              <span className="text-[10px] font-mono text-text-tertiary">
                {index + 1}/{stages.length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
