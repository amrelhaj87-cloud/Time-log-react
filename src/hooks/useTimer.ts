import { useState, useEffect, useCallback } from 'react';

export function useTimer() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // استرجاع المؤقت إذا كان شغال مسبقاً من localStorage
  useEffect(() => {
    const savedStart = localStorage.getItem('activeTimerStart');
    if (savedStart) {
      const ts = parseInt(savedStart, 10);
      setStartTime(ts);
      setIsRunning(true);
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - ts) / 1000)));
    }
  }, []);

  // تحديث الثواني المنقضية كل ثانية
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning && startTime) {
      intervalId = setInterval(() => {
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  const startTimer = useCallback(() => {
    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);
    setElapsedSeconds(0);
    localStorage.setItem('activeTimerStart', String(now));
  }, []);

  const stopTimer = useCallback(() => {
    const now = Date.now();
    const range = startTime ? { start: new Date(startTime), end: new Date(now) } : null;
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    localStorage.removeItem('activeTimerStart');
    return range;
  }, [startTime]);

  const cancelTimer = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    localStorage.removeItem('activeTimerStart');
  }, []);

  const formatElapsed = useCallback(() => {
    const h = Math.floor(elapsedSeconds / 3600);
    const m = Math.floor((elapsedSeconds % 3600) / 60);
    const s = elapsedSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }, [elapsedSeconds]);

  return {
    isRunning,
    elapsedSeconds,
    formattedElapsed: formatElapsed(),
    startTimer,
    stopTimer,
    cancelTimer,
  };
}