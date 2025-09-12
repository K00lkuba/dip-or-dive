import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer(initialSeconds: number, opts?: { onComplete?: () => void; tickMs?: number }) {
  const { onComplete, tickMs = 200 } = opts ?? {};
  const [secondsLeft, setSecondsLeft] = useState<number>(Math.max(0, Math.floor(initialSeconds)));
  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    if (running || secondsLeft <= 0) return;
    setRunning(true);
  }, [running, secondsLeft]);

  const pause = useCallback(() => {
    setRunning(false);
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    clearTimer();
    setRunning(false);
    setSecondsLeft(Math.max(0, Math.floor(newSeconds ?? initialSeconds)));
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) {
      clearTimer();
      return;
    }
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - tickMs / 1000;
        if (next <= 0) {
          clearTimer();
          setRunning(false);
          if (onComplete) onComplete();
          return 0;
        }
        return Number(next.toFixed(2));
      });
    }, tickMs);
    return clearTimer;
  }, [running, tickMs, onComplete]);

  return {
    secondsLeft,
    running,
    start,
    pause,
    reset,
    setSecondsLeft, // escape hatch for edge cases
  };
}


