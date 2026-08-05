// ===== Language & Theme =====
export type Lang = "ar" | "en";

// ===== Tag System =====
// E = Earning, V = Vision & Planning, R = Recovery & Rest,
// S = Service & Giving, SC = Self-Care & Health, SL = Sleep, "" = Unassigned
export type TagCode = "E" | "V" | "R" | "S" | "SC" | "SL" | "";

export interface TagDefinition {
  code: TagCode;
  fullTitle: Record<Lang, string>;
  desc: Record<Lang, string>;
}

// ===== Hour keys (24 hours, starting from 5am) =====
export type HourKey =
  | "5am" | "6am" | "7am" | "8am" | "9am" | "10am" | "11am"
  | "12pm" | "1pm" | "2pm" | "3pm" | "4pm" | "5pm"
  | "6pm" | "7pm" | "8pm" | "9pm" | "10pm"
  | "11pm" | "12am" | "1am" | "2am" | "3am" | "4am";

export type PeriodId = "morning" | "noon" | "evening" | "night";

export interface HourPeriod {
  id: PeriodId;
  icon: string;
  keys: HourKey[];
  label: Record<Lang, string>;
}

// ===== Per-hour data =====
export interface HourData {
  tag: TagCode;
  note: string;
  // Priorities/quads or other per-hour flags can extend this later
}

// ===== Priorities (quads) for a day =====
export interface DayPriority {
  id: string;
  text: string;
  done: boolean;
  tag?: TagCode | string;
}

// ===== Per-day data =====
export interface DayData {
  hours: Record<HourKey, HourData>;
  priorities: DayPriority[];
}

// ===== Per-week data (as stored in Firestore / localStorage) =====
export interface WeekData {
  weekKey: string; // ISO date of the Monday of the week
  days: Record<string, DayData>; // keyed by ISO date string (yyyy-mm-dd)
}

// ===== Distribution (tag totals for a period) =====
export type Distribution = Record<TagCode | "unassigned" | "empty", number>;

// ===== User settings (persisted) =====
export interface UserSettings {
  lang: Lang;
  isDarkMode: boolean;
  isCompact: boolean;
  userBirthDate: string;
  ageDisplayOpt: "days" | "years";
  isDevToolsEnabled: boolean;
  isCalSyncEnabled: boolean;
  dismissedSuggestions: Record<string, boolean>;
}

// ===== Auth =====
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
