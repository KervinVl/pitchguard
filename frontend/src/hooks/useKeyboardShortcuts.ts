import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateMarkdownReport, downloadMarkdown } from '../lib/exportReport';
import { toast } from 'sonner';

export function useKeyboardShortcuts(): void {
  const {
    view,
    analysisData,
    analysisSubView,
    setAnalysisSubView,
    closeDrawer,
    isDrawerOpen,
  } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Only in analysis view
      if (view !== 'analysis') return;

      // Escape - Close drawer
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
        e.preventDefault();
        return;
      }

      // Cmd/Ctrl + E - Export
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        if (analysisData) {
          try {
            const markdown = generateMarkdownReport(analysisData);
            const filename = `pitchguard-analysis-${analysisData.metadata.stage.toLowerCase()}-${Date.now()}.md`;
            downloadMarkdown(markdown, filename);
            toast.success('Report downloaded successfully');
          } catch (error) {
            toast.error('Failed to export report');
          }
        }
        return;
      }

      // L - Toggle Ledger view
      if (e.key === 'l' && !isDrawerOpen) {
        e.preventDefault();
        setAnalysisSubView(analysisSubView === 'pdf' ? 'ledger' : 'pdf');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    view,
    analysisData,
    analysisSubView,
    setAnalysisSubView,
    closeDrawer,
    isDrawerOpen,
  ]);
}
