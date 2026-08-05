import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface WeekStripProps {
  currentDate: Date;
  onSelectDate: (d: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export const WeekStrip: React.FC<WeekStripProps> = ({
  currentDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onToday,
}) => {
  const { lang } = useLanguage();

  // حساب يوم الاثنين للأسبوع الحالي
  const getMonday = (d: Date) => {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    const day = dt.getDay();
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(dt.setDate(diff));
  };

  const monday = getMonday(currentDate);
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return dt;
  });

  const dayNamesAr = ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد'];
  const dayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const isSameDay = (d1: Date, d2: Date) =>
    d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-2.5 mb-3 shadow-xs">
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          onClick={onPrevWeek}
          className="p-1 px-2.5 rounded-lg border border-[var(--line)] text-xs font-bold text-[var(--teal-dark)] hover:bg-[var(--teal-tint)] cursor-pointer"
        >
          {lang === 'ar' ? '⯈' : '⯇'}
        </button>

        <button
          onClick={onToday}
          className="py-1 px-3 bg-[var(--teal)] text-white text-xs font-bold rounded-lg hover:bg-[var(--teal-dark)] cursor-pointer transition-colors"
        >
          {lang === 'ar' ? 'اليوم' : 'Today'}
        </button>

        <button
          onClick={onNextWeek}
          className="p-1 px-2.5 rounded-lg border border-[var(--line)] text-xs font-bold text-[var(--teal-dark)] hover:bg-[var(--teal-tint)] cursor-pointer"
        >
          {lang === 'ar' ? '⯇' : '⯈'}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((d, idx) => {
          const selected = isSameDay(d, currentDate);
          const isToday = isSameDay(d, new Date());

          return (
            <button
              key={d.toISOString()}
              onClick={() => onSelectDate(d)}
              className={`p-1.5 rounded-xl border flex flex-col items-center transition-all cursor-pointer ${
                selected
                  ? 'bg-[var(--amber-tint)] border-[var(--amber)] font-bold text-[var(--teal-dark)] shadow-xs'
                  : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--teal)]'
              } ${isToday && !selected ? 'ring-1 ring-[var(--teal)]' : ''}`}
            >
              <span className="text-[10px] text-[var(--ink-faint)]">
                {lang === 'ar' ? dayNamesAr[idx] : dayNamesEn[idx]}
              </span>
              <span className="text-sm font-black my-0.5">{d.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};