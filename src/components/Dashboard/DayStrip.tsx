import { getWeekDays, toISODate } from "../../lib/utils";
import { DAY_ABBR_EN, HOURS } from "../../lib/constants";
import { useAppDataContext } from "../../context/AppDataContext";

export function DayStrip() {
  const { selectedWeek, currentDate, setCurrentDate, currentDayData } = useAppDataContext();
  const weekDays = getWeekDays(selectedWeek);
  const activeIso = toISODate(currentDate);

  return (
    <div className="grid grid-cols-7 gap-1 w-full">
      {weekDays.map((d) => {
        const iso = toISODate(d);
        const isActive = iso === activeIso;

        // Calculate completion percentage
        const filled = iso === activeIso ? HOURS.filter((k) => currentDayData.hours[k]?.note?.trim()).length : 0;
        const pct = Math.round((filled / HOURS.length) * 100);

        return (
          <button
            key={iso}
            type="button"
            onClick={() => setCurrentDate(d)}
            className={`p-1 text-center rounded-lg border transition-all ${
              isActive ? "border-teal bg-teal-tint font-bold" : "border-line bg-card hover:bg-teal-tint/40"
            }`}
          >
            <div className="text-[9px] text-ink-soft">{DAY_ABBR_EN[d.getDay()]}</div>
            <div className="text-xs font-bold text-ink">{d.getDate()}</div>
            <div className="h-1 bg-line rounded-full overflow-hidden mt-1">
              <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}