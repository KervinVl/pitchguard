import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatTimer } from '../lib/utils';

export function useTimer(): string {
  const sessionStartTime = useAppStore((state) => state.sessionStartTime);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!sessionStartTime) {
      setElapsed(0);
      return;
    }

    // Update immediately
    setElapsed(Date.now() - sessionStartTime);

    // Update every second
    const interval = setInterval(() => {
      setElapsed(Date.now() - sessionStartTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  return formatTimer(elapsed);
}
