import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface TimerBarProps {
  isRunning: boolean;
  formattedElapsed: string;
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  isRunning,
  formattedElapsed,
  onStart,
  onStop,
  onCancel,
}) => {
  const { lang } = useLanguage();

  return (
    <div className="mb-3">
      {!isRunning ? (
        <button
          type="button"
          onClick={onStart}
          className="w-full py-2 px-3 flex items-center justify-center gap-2 rounded-xl text-xs font-extrabold bg-[var(--teal-tint)] border border-[var(--teal)] color-[var(--teal-dark)] transition-transform active:scale-98 shadow-sm hover:brightness-95"
        >
          <span>⏱️</span>
          <span>{lang === 'ar' ? 'بدء تايمر لنشاط جديد' : 'Start a timer for a new activity'}</span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 p-2 px-3 rounded-xl bg-[var(--amber-tint)] border border-[var(--amber)] shadow-sm">
          <div className="flex items-center gap-2 font-black text-[var(--amber)] text-sm">
            <span>⏱️</span>
            <span className="font-mono dir-ltr">{formattedElapsed}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onStop}
              className="py-1 px-3 rounded-lg text-xs font-bold bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)] transition-colors"
            >
              {lang === 'ar' ? 'إيقاف وتسجيل' : 'Stop & log'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              title={lang === 'ar' ? 'إلغاء' : 'Cancel'}
              className="p-1 px-2 rounded-lg text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--rose)] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};