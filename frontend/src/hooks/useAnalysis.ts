import { useMutation } from '@tanstack/react-query';
import { analyzeDocument } from '../api/analysis';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'sonner';
import type { FundingStage } from '../types';

// Toggle this to use mock data during development
const USE_MOCK_DATA = false;

export function useAnalysis() {
  const { setAnalysisData, setView, startSession } = useAppStore();

  return useMutation({
    mutationFn: async ({ file, stage }: { file: File; stage: FundingStage }) => {
      // Set loading view immediately
      setView('loading');

      if (USE_MOCK_DATA) {
        // Use mock data for development
        const { mockAnalysisData } = await import('../data/mockAnalysis');

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        return {
          ...mockAnalysisData,
          metadata: {
            ...mockAnalysisData.metadata,
            stage,
            analyzedAt: new Date().toISOString(),
          },
        };
      }

      // Real API call
      return analyzeDocument(file, stage);
    },
    onSuccess: (data) => {
      setAnalysisData(data);
      setView('analysis');
      startSession();
    },
    onError: (error: Error) => {
      setView('entry'); // Return to entry screen on error
      toast.error(error.message || 'Analysis failed. Please try again.');
    },
  });
}
