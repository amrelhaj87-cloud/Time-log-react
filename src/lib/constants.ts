import type {
  HourKey,
  HourPeriod,
  Lang,
  TagCode,
  TagDefinition,
} from "../types";

// ===== 24 HOURS CONFIGURATION (STARTING FROM 5AM) =====
export const HOURS: HourKey[] = [
  "5am", "6am", "7am", "8am", "9am", "10am", "11am",
  "12pm", "1pm", "2pm", "3pm", "4pm", "5pm",
  "6pm", "7pm", "8pm", "9pm", "10pm",
  "11pm", "12am", "1am", "2am", "3am", "4am",
];

export const HOUR_LABELS: Record<Lang, Record<HourKey, string>> = {
  ar: {
    "5am": "05 ص", "6am": "06 ص", "7am": "07 ص", "8am": "08 ص",
    "9am": "09 ص", "10am": "10 ص", "11am": "11 ص", "12pm": "12 م",
    "1pm": "01 م", "2pm": "02 م", "3pm": "03 م", "4pm": "04 م",
    "5pm": "05 م", "6pm": "06 م", "7pm": "07 م", "8pm": "08 م",
    "9pm": "09 م", "10pm": "10 م", "11pm": "11 م", "12am": "12 ص",
    "1am": "01 ص", "2am": "02 ص", "3am": "03 ص", "4am": "04 ص",
  },
  en: {
    "5am": "05 AM", "6am": "06 AM", "7am": "07 AM", "8am": "08 AM",
    "9am": "09 AM", "10am": "10 AM", "11am": "11 AM", "12pm": "12 PM",
    "1pm": "01 PM", "2pm": "02 PM", "3pm": "03 PM", "4pm": "04 PM",
    "5pm": "05 PM", "6pm": "06 PM", "7pm": "07 PM", "8pm": "08 PM",
    "9pm": "09 PM", "10pm": "10 PM", "11pm": "11 PM", "12am": "12 AM",
    "1am": "01 AM", "2am": "02 AM", "3am": "03 AM", "4am": "04 AM",
  },
};

export const HOUR_TO_24: Record<HourKey, number> = {
  "5am": 5, "6am": 6, "7am": 7, "8am": 8, "9am": 9, "10am": 10, "11am": 11,
  "12pm": 12, "1pm": 13, "2pm": 14, "3pm": 15, "4pm": 16, "5pm": 17,
  "6pm": 18, "7pm": 19, "8pm": 20, "9pm": 21, "10pm": 22,
  "11pm": 23, "12am": 0, "1am": 1, "2am": 2, "3am": 3, "4am": 4,
};

// ===== MERGED PERIODS: 4 periods only =====
export const HOUR_PERIODS: HourPeriod[] = [
  { id: "morning", icon: "🌅", keys: ["5am", "6am", "7am", "8am", "9am", "10am", "11am"], label: { ar: "الصبح", en: "Morning" } },
  { id: "noon", icon: "☀️", keys: ["12pm", "1pm", "2pm", "3pm", "4pm", "5pm"], label: { ar: "الظهر", en: "Noon" } },
  { id: "evening", icon: "🌆", keys: ["6pm", "7pm", "8pm", "9pm", "10pm"], label: { ar: "المساء", en: "Evening" } },
  { id: "night", icon: "🌙", keys: ["11pm", "12am", "1am", "2am", "3am", "4am"], label: { ar: "الليل", en: "Night" } },
];

export const DAY_NAMES: Record<Lang, string[]> = {
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

export const DAY_ABBR_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_NAMES: Record<Lang, string[]> = {
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

// ===== TAGS =====
export const TAGS: Record<TagCode, TagDefinition> = {
  "": { code: "", fullTitle: { ar: "بدون تصنيف", en: "Unassigned" }, desc: { ar: "نشاط غير مصنف", en: "Unassigned activity" } },
  E: { code: "E", fullTitle: { ar: "Earning (الكسب)", en: "Earning" }, desc: { ar: "توليد الدخل المباشر والعمل المدفوع", en: "Direct income and paid work" } },
  V: { code: "V", fullTitle: { ar: "Vision (الرؤية والتخطيط)", en: "Vision & Planning" }, desc: { ar: "التخطيط الاستراتيجي وتطوير الذات والرؤية المستقبلية", en: "Strategic planning and personal growth" } },
  R: { code: "R", fullTitle: { ar: "Recovery (التعافي والترويح)", en: "Recovery & Rest" }, desc: { ar: "الراحة والاستجمام والأنشطة الاجتماعية والترفيهية", en: "Rest, social activities, and recreation" } },
  S: { code: "S", fullTitle: { ar: "Service (الخدمة والعطاء)", en: "Service & Giving" }, desc: { ar: "خدمة الآخرين والتطوع والالتزامات المجتمعية", en: "Volunteering and community service" } },
  SC: { code: "SC", fullTitle: { ar: "Self-Care (الرعاية الذاتية)", en: "Self-Care & Health" }, desc: { ar: "الرياضة والتغذية والصحة النفسية", en: "Exercise, nutrition, and mental health" } },
  SL: { code: "SL", fullTitle: { ar: "Sleep (نوم)", en: "Sleep" }, desc: { ar: "وقت نوم طبيعي وراحة ليلية", en: "Natural sleep and night rest" } },
};

// Tag colors reference Tailwind-mapped CSS variables (see index.css @theme)
export const TAG_COLORS: Record<Exclude<TagCode, "">, string> = {
  E: "var(--color-teal)",
  V: "var(--color-amber)",
  R: "var(--color-blue)",
  S: "var(--color-rose)",
  SC: "var(--color-sc)",
  SL: "var(--color-sl)",
};

export const DIST_COLORS: Record<TagCode | "unassigned" | "empty", string> = {
  E: "var(--color-teal)",
  V: "var(--color-amber)",
  R: "var(--color-blue)",
  S: "var(--color-rose)",
  SC: "var(--color-sc)",
  SL: "var(--color-sl)",
  "": "var(--color-ink-faint)",
  unassigned: "var(--color-ink-faint)",
  empty: "var(--color-line)",
};

export const TAG_ORDER: TagCode[] = ["E", "V", "R", "S", "SC", "SL", ""];

export const SLEEP_ALLOWED_KEYS: HourKey[] = [
  "10pm", "11pm", "12am", "1am", "2am", "3am", "4am", "5am", "6am",
];
