import { useAppStore } from './store/useAppStore';
import { EntryScreen } from './components/entry/EntryScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { AnalysisWorkspace } from './components/analysis/AnalysisWorkspace';
import { Toaster } from 'sonner';

function App(): JSX.Element {
  const view = useAppStore((state) => state.view);

  return (
    <>
      {view === 'entry' && <EntryScreen />}
      {view === 'loading' && <LoadingScreen />}
      {view === 'analysis' && <AnalysisWorkspace />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </>
  );
}

export default App;
