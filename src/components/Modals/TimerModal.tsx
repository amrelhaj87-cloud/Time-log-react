import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeRange: { start: Date; end: Date } | null;
  onSave: (text: string, start: Date, end: Date) => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  timeRange,
  onSave,
}) => {
  const { lang } = useLanguage();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) setDescription('');
  }, [isOpen]);

  if (!isOpen || !timeRange) return null;

  const fmt = (d: Date) =>
    d.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleSave = () => {
    if (description.trim()) {
      onSave(description.trim(), timeRange.start, timeRange.end);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs dir-rtl">
      <div className="max-w-[420px] w-full p-4 bg-[var(--card)] rounded-2xl border border-[var(--line)] shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--line)]">
          <h3 className="font-bold text-lg text-[var(--teal-dark)] flex items-center gap-2">
            <span>⏱️</span>
            <span>{lang === 'ar' ? 'اكتب اللي حصل' : 'What happened?'}</span>
          </h3>
          <button onClick={onClose} className="text-xl text-[var(--ink-soft)] hover:text-[var(--rose)] cursor-pointer">
            &times;
          </button>
        </div>

        <div className="text-xs text-[var(--ink-soft)] my-2">
          {lang === 'ar'
            ? `من ${fmt(timeRange.start)} إلى ${fmt(timeRange.end)}`
            : `From ${fmt(timeRange.start)} to ${fmt(timeRange.end)}`}
        </div>

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder={lang === 'ar' ? 'مثلاً: اشتغلت على تقرير العمل' : 'e.g. Worked on project specs'}
          className="w-full p-2.5 rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] text-xs outline-none focus:border-[var(--teal)]"
          autoFocus
        />

        <div className="flex justify-end mt-3 gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="py-1.5 px-4 rounded-xl bg-[var(--teal)] text-white text-xs font-bold hover:bg-[var(--teal-dark)] transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'حفظ في الساعات' : 'Save to hours'}
          </button>
        </div>
      </div>
    </div>
  );
};