import { HOUR_TO_24, HOURS } from "./constants";
import type { DayData, HourData, HourKey } from "../types";

/** Convert Date object to YYYY-MM-DD string */
export function toISODate(d: Date): string {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Get Monday of the week for a given date */
export function getMonday(d: Date): Date {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  const day = dt.getDay();
  const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(dt.setDate(diff));
}

/** Get array of 7 Date objects (Mon -> Sun) for a week */
export function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return dt;
  });
}

/** Add/subtract days from a date */
export function addDays(d: Date, n: number): Date {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt;
}

/** Generate empty DayData object */
export function createEmptyDayData(): DayData {
  const hours = {} as Record<HourKey, HourData>;
  HOURS.forEach((k) => {
    hours[k] = { tag: "", note: "" };
  });
  return {
    hours,
    priorities: [],
  };
}

/** Get current HourKey based on system time */
export function getCurrentHourKey(): HourKey {
  const h = new Date().getHours();
  const found = Object.entries(HOUR_TO_24).find(([_, val]) => val === h);
  return (found ? found[0] : "5am") as HourKey;
}