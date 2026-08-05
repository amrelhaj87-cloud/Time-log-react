import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { TagCode } from '../../types';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeRange: { start: Date; end: Date } | null;
  onSave: (text: string, start: Date, end: Date, tag: TagCode) => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  timeRange,
  onSave,
}) => {
  const { lang } = useLanguage();
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagCode>('');

  if (!isOpen || !timeRange) return null;

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text, timeRange.start, timeRange.end, selectedTag);
    setText('');
    setSelectedTag('');
    onClose();
  };

  const tags: TagCode[] = ['', 'E', 'V', 'R', 'S', 'SC', 'SL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs dir-rtl">
      <div className="max-w-[420px] w-full p-4 bg-[var(--card)] rounded-2xl border border-[var(--line)] shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--line)]">
          <h3 className="font-bold text-base text-[var(--teal-dark)] flex items-center gap-2">
            <span>⏱️</span>
            <span>{lang === 'ar' ? 'اكتب اللي حصل' : 'What happened?'}</span>
          </h3>
          <button onClick={onClose} className="text-xl text-[var(--ink-soft)] hover:text-[var(--rose)] cursor-pointer">
            &times;
          </button>
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={lang === 'ar' ? 'مثلاً: اشتغلت على تقرير العمل...' : 'e.g., Worked on project report...'}
          className="w-full p-2.5 text-xs rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] outline-none mb-3"
          autoFocus
        />

        {/* اختيار التاق قبل الإنزال في الساعات */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-[var(--teal-dark)] mb-1.5">
            {lang === 'ar' ? 'اختر تصنيف النشاط:' : 'Select Category Tag:'}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(t)}
                className={`py-1 px-3 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                  selectedTag === t
                    ? 'bg-[var(--teal)] text-white border-[var(--teal)]'
                    : 'bg-[var(--card)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                {t || (lang === 'ar' ? 'بدون' : 'None')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-[var(--teal)] text-white text-xs font-bold rounded-xl hover:bg-[var(--teal-dark)] cursor-pointer"
          >
            {lang === 'ar' ? 'حفظ في الساعات 💾' : 'Save to Hours 💾'}
          </button>
        </div>
      </div>
    </div>
  );
};