import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useLiveClock, formatHeaderDate } from "../hooks/useLiveClock";
import { DAY_NAMES, MONTH_NAMES } from "../lib/constants";

interface HeaderProps {
  currentDate: Date;
  onPickDate: (date: Date) => void;
  isCompact: boolean;
  onToggleCompact: () => void;
  ringFilled: number;
  ringTotal: number;
  saveStatus?: "idle" | "saving" | "saved" | "error";
}

export function Header({
  currentDate,
  onPickDate,
  isCompact,
  onToggleCompact,
  ringFilled,
  ringTotal,
  saveStatus = "idle",
}: HeaderProps) {
  const { lang, t, toggleLang } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const clock = useLiveClock();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const headerDateText = formatHeaderDate(currentDate, lang, DAY_NAMES[lang], MONTH_NAMES[lang]);
  const ringPct = ringTotal > 0 ? Math.min(1, ringFilled / ringTotal) : 0;
  const ringRadius = 13;
  const ringCirc = 2 * Math.PI * ringRadius;

  return (
    <header className="flex items-center justify-between gap-1.5 flex-wrap mb-2.5">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="font-brand text-2xl font-bold text-teal-dark">{t.brand}</div>
      </div>

      {/* Center: date / clock / mini ring */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-card px-2.5 py-1 text-sm font-semibold text-ink hover:border-teal transition-colors"
          title={lang === "ar" ? "انقر لاختيار تاريخ" : "Click to pick a date"}
        >
          <span>{headerDateText}</span>
          <span className="text-ink-faint tabular-nums" dir="ltr">{clock}</span>
          <span className="text-ink-faint text-xs">⯆</span>
        </button>
        <input
          ref={dateInputRef}
          type="date"
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          value={toISODate(currentDate)}
          onChange={(e) => {
            if (e.target.value) onPickDate(new Date(e.target.value));
          }}
        />

        <div
          className="relative flex items-center justify-center w-8 h-8 rounded-full"
          title={lang === "ar" ? "توزيع اليوم" : "Day distribution"}
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r={ringRadius} fill="none" stroke="var(--line)" strokeWidth="3" />
            <circle
              cx="16"
              cy="16"
              r={ringRadius}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={ringCirc}
              strokeDashoffset={ringCirc * (1 - ringPct)}
              transform="rotate(-90 16 16)"
            />
          </svg>
          <span className="absolute text-[8px] font-bold text-ink-soft tabular-nums">
            {ringFilled}/{ringTotal}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleCompact}
          className="flex items-center gap-1 rounded-lg border border-line bg-card px-2 py-1 text-xs font-semibold text-ink-soft hover:border-teal transition-colors"
        >
          <span>{isCompact ? "⯆" : "⯅"}</span>
          <span>{isCompact ? t.compactBtn : t.expandedBtn}</span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1 rounded-lg border border-teal bg-teal-tint px-2 py-1 text-xs font-semibold text-teal-dark"
          >
            <span>{t.loginBtn}</span>
            <span className="text-[9px]">⯆</span>
          </button>

          {menuOpen && (
            <div className="absolute end-0 mt-1 w-56 rounded-xl border border-line bg-card shadow-lg z-20 overflow-hidden text-sm">
              <button
                type="button"
                className="w-full text-start px-3 py-2 hover:bg-teal-tint transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                🔑 {t.loginBtn}
              </button>
              <div className="border-t border-line" />
              <button
                type="button"
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-teal-tint transition-colors"
              >
                <span>{isDarkMode ? (lang === "ar" ? "الوضع النهارى" : "Light Mode") : (lang === "ar" ? "الوضع الليلي" : "Dark Mode")}</span>
                <span>{isDarkMode ? "☀️" : "🌙"}</span>
              </button>
              <button
                type="button"
                onClick={toggleLang}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-teal-tint transition-colors"
              >
                <span>{lang === "ar" ? "اللغة" : "Language"}</span>
                <span className="font-extrabold text-teal-dark">{t.langBtn}</span>
              </button>
            </div>
          )}
        </div>

        {saveStatus !== "idle" && (
          <span className="text-[11px] text-ink-faint">
            {saveStatus === "saving" ? t.saving : saveStatus === "saved" ? t.saved : t.saveError}
          </span>
        )}
      </div>
    </header>
  );
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
