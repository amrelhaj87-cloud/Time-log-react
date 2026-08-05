import { useState, useEffect } from 'react';

export function useLiveClock(lang: 'ar' | 'en') {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      let ampm = '';

      if (lang === 'ar') {
        ampm = hours >= 12 ? 'م' : 'ص';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        setTimeStr(`${String(hours).padStart(2, '0')}:${minutes} ${ampm}`);
      } else {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        setTimeStr(`${String(hours).padStart(2, '0')}:${minutes} ${ampm}`);
      }
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  return timeStr;
}