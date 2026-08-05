import { addDays, getMonday } from "../../lib/utils";
import { useAppDataContext } from "../../context/AppDataContext";
import { useLanguage } from "../../context/LanguageContext";

export function WeekNavigator() {
  const { selectedWeek, setSelectedWeek, setCurrentDate } = useAppDataContext();
  const { t, lang } = useLanguage();

  const handlePrevWeek = () => {
    const prev = addDays(selectedWeek, -7);
    setSelectedWeek(prev);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = addDays(selectedWeek, 7);
    setSelectedWeek(next);
    setCurrentDate(next);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedWeek(getMonday(today));
    setCurrentDate(today);
  };

  return (
    <div className="flex items-center justify-between gap-2 mb-2 px-1">
      <button
        type="button"
        onClick={handlePrevWeek}
        className="px-2 py-1 text-xs border border-line rounded-lg hover:bg-teal-tint text-teal-dark font-bold"
      >
        {lang === "ar" ? "⯈" : "⯇"}
      </button>

      <button
        type="button"
        onClick={handleToday}
        className="px-3 py-1 text-xs bg-teal text-white font-bold rounded-lg hover:bg-teal-dark transition-colors"
      >
        {t.today}
      </button>

      <button
        type="button"
        onClick={handleNextWeek}
        className="px-2 py-1 text-xs border border-line rounded-lg hover:bg-teal-tint text-teal-dark font-bold"
      >
        {lang === "ar" ? "⯇" : "⯈"}
      </button>
    </div>
  );
}