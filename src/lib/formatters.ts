import type { Lang } from "../types";
import { DAY_NAMES, MONTH_NAMES } from "./constants";

export function formatFullDate(d: Date, lang: Lang): string {
  const dayName = DAY_NAMES[lang][d.getDay()];
  const monthName = MONTH_NAMES[lang][d.getMonth()];
  const year = d.getFullYear();
  const dateNum = d.getDate();
  return lang === "ar"
    ? `${dayName}، ${dateNum} ${monthName} ${year}`
    : `${dayName}, ${monthName} ${dateNum}, ${year}`;
}

export function formatShortDate(d: Date, lang: Lang): string {
  const dayName = DAY_NAMES[lang][d.getDay()];
  const dateNum = d.getDate();
  return `${dayName} ${dateNum}`;
}