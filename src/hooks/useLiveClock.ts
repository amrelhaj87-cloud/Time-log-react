import { useEffect, useState } from "react";
import type { Lang } from "../types";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Returns the current time as "HH:MM" (24h) updated every second. */
export function useLiveClock(): string {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  });

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(`${pad2(now.getHours())}:${pad2(now.getMinutes())}`);
    }, 1000 * 15); // refresh every 15s is plenty for a minute-resolution clock
    return () => clearInterval(id);
  }, []);

  return time;
}

/** Formats a Date as a localized header date string, e.g. "الأربعاء، 5 أغسطس". */
export function formatHeaderDate(date: Date, lang: Lang, dayNames: string[], monthNames: string[]): string {
  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const day = date.getDate();
  return lang === "ar" ? `${dayName}، ${day} ${monthName}` : `${dayName}, ${monthName} ${day}`;
}
