import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { HoursList } from "./HoursList";

export function HoursSection() {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <section className="rounded-2xl border border-line bg-card p-3.5 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-line">
        <h2 className="font-brand text-xl font-bold text-teal-dark">{t.hoursTitle}</h2>
        <button
          type="button"
          onClick={() => setIsCollapsed((c) => !c)}
          className="text-xs font-semibold text-teal-dark hover:underline flex items-center gap-1"
        >
          <span>{isCollapsed ? "⯆" : "⯅"}</span>
          <span>{isCollapsed ? t.expandHours : t.collapseHours}</span>
        </button>
      </div>

      {!isCollapsed && <HoursList />}
    </section>
  );
}