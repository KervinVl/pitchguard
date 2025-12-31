import { TopNav } from './TopNav';
import { LeftSidebar } from './LeftSidebar';
import { PDFViewer } from './PDFViewer';
import { FindingDrawer } from './FindingDrawer';
import { InsightsLedger } from '../ledger/InsightsLedger';
import { useAppStore } from '../../store/useAppStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export function AnalysisWorkspace(): JSX.Element {
  const analysisSubView = useAppStore((state) => state.analysisSubView);
  useKeyboardShortcuts();

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Area */}
        {analysisSubView === 'pdf' ? (
          <PDFViewer />
        ) : (
          <InsightsLedger />
        )}
      </div>

      {/* Finding Drawer */}
      <FindingDrawer />
    </div>
  );
}
