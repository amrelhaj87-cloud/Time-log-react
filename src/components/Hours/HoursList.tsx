import { useState } from "react";
import { HOUR_PERIODS, HOURS } from "../../lib/constants";
import { useAppDataContext } from "../../context/AppDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { HourRow } from "./HourRow";
import type { PeriodId } from "../../types";

export function HoursList() {
  const { currentDayData, updateHour, copyToNextHour } = useAppDataContext();
  const { lang } = useLanguage();

  const [collapsedPeriods, setCollapsedPeriods] = useState<Record<PeriodId, boolean>>({
    morning: false,
    noon: false,
    evening: false,
    night: false,
  });

  const togglePeriod = (id: PeriodId) => {
    setCollapsedPeriods((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-2.5">
      {HOUR_PERIODS.map((period) => {
        const filledCount = period.keys.filter((k) => currentDayData.hours[k]?.note?.trim()).length;
        const isCollapsed = collapsedPeriods[period.id];

        return (
          <div key={period.id} className="rounded-xl border border-line overflow-hidden">
            <button
              type="button"
              onClick={() => togglePeriod(period.id)}
              className="w-full flex items-center justify-between gap-2 bg-teal-tint/50 px-3 py-2 text-xs font-bold text-teal-dark"
            >
              <span className="flex items-center gap-1.5">
                <span>{period.icon}</span>
                <span>{period.label[lang]}</span>
              </span>
              <span className="text-ink-soft text-[11px]">
                {filledCount}/{period.keys.length}
              </span>
              <span>{isCollapsed ? "⯆" : "⯅"}</span>
            </button>

            {!isCollapsed && (
              <div className="bg-card">
                {period.keys.map((key) => {
                  const idx = HOURS.indexOf(key);
                  const isLast = idx === HOURS.length - 1;
                  const data = currentDayData.hours[key] || { tag: "", note: "" };

                  return (
                    <HourRow
                      key={key}
                      hourKey={key}
                      hourData={data}
                      onUpdate={(tag, note) => updateHour(key, tag, note)}
                      onCopyNext={() => copyToNextHour(key)}
                      isLastHour={isLast}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}