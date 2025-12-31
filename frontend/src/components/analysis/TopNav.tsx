import { Download, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { generatePDF } from '../export/PDFReport';
import { toast } from 'sonner';

export function TopNav(): JSX.Element {
  const { analysisData, resetSession } = useAppStore();

  const handleNewAnalysis = (): void => {
    if (confirm('Start new analysis? Current session will be lost.')) {
      resetSession();
    }
  };

  const handleExport = (): void => {
    if (!analysisData) {
      toast.error('No analysis data to export');
      return;
    }

    try {
      generatePDF(analysisData);
      toast.success('Preparing PDF report for print...');
    } catch (error) {
      toast.error('Failed to export report');
      console.error('Export error:', error);
    }
  };

  return (
    <nav className="h-12 border-b border-bg-tertiary flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-sm font-medium text-text-primary">
          PitchGuard <span className="text-text-tertiary">//</span> Analysis
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* New Analysis */}
        <button
          onClick={handleNewAnalysis}
          className="flex items-center gap-2 h-8 px-3 text-sm border border-bg-tertiary rounded-md hover:border-text-secondary transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Analysis</span>
        </button>

        {/* Export Report */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 h-8 px-3 text-sm border border-bg-tertiary rounded-md hover:border-text-secondary transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
    </nav>
  );
}
