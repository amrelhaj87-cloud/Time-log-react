import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { HourData, TagCode } from '../../types';

interface HourRowProps {
  hourKey: string;
  hourLabel: string;
  hourData: HourData;
  onChangeText: (key: string, text: string) => void;
  onChangeTag: (key: string, tag: TagCode) => void;
  onCopyDown?: (key: string) => void;
  hasNextHour: boolean;
}

const TAG_COLORS: Record<string, string> = {
  E: 'var(--teal)',
  V: 'var(--amber)',
  R: 'var(--blue)',
  S: 'var(--rose)',
  SC: '#7C5CBF',
  SL: '#2E3A6B',
};

export const HourRow: React.FC<HourRowProps> = ({
  hourKey,
  hourLabel,
  hourData,
  onChangeText,
  onChangeTag,
  onCopyDown,
  hasNextHour,
}) => {
  const { lang } = useLanguage();

  const handleTagCycle = () => {
    const tags: TagCode[] = ['', 'E', 'V', 'R', 'S', 'SC', 'SL'];
    const currentIndex = tags.indexOf(hourData.tag || '');
    const nextTag = tags[(currentIndex + 1) % tags.length];
    onChangeTag(hourKey, nextTag);
  };

  return (
    <div className="flex items-center gap-1.5 py-1 px-1 border-b border-[var(--line)] hover:bg-[var(--teal-tint)]/40 transition-colors">
      {/* 1. التسمية */}
      <span className="w-11 shrink-0 text-xs font-semibold text-[var(--ink-soft)]">
        {hourLabel}
      </span>

      {/* 2. حقل الملاحظة */}
      <input
        type="text"
        value={hourData.note || ''}
        onChange={(e) => onChangeText(hourKey, e.target.value)}
        placeholder={lang === 'ar' ? 'سجّل إيه اللي عملته...' : 'What did you accomplish...'}
        className="flex-1 min-w-0 bg-transparent border-b border-transparent focus:border-[var(--teal)] text-xs text-[var(--ink)] py-1 px-1 outline-none"
      />

      {/* 3. زر التاقات التفاعلي */}
      <button
        type="button"
        onClick={handleTagCycle}
        style={{
          borderColor: hourData.tag ? TAG_COLORS[hourData.tag] : 'var(--line)',
          color: hourData.tag ? TAG_COLORS[hourData.tag] : 'var(--ink-faint)',
        }}
        className="w-10 h-7 shrink-0 rounded-lg border text-[11px] font-bold bg-[var(--card)] hover:scale-95 transition-all flex items-center justify-center cursor-pointer"
        title={hourData.tag || (lang === 'ar' ? 'بدون تصنيف' : 'Unassigned')}
      >
        {hourData.tag || '—'}
      </button>

      {/* 4. زر النسخ السريع لأسفل (تم نقله هنا ليكون بعد زر التاقات) */}
      {hasNextHour && onCopyDown && (
        <button
          type="button"
          onClick={() => onCopyDown(hourKey)}
          className="p-1 text-xs text-[var(--ink-faint)] hover:text-[var(--teal-dark)] hover:bg-[var(--teal-tint)] rounded transition-all cursor-pointer shrink-0"
          title={lang === 'ar' ? 'نسخ النص والتصنيف للساعة التالية ⬇️' : 'Copy to next hour ⬇️'}
        >
          ⬇️
        </button>
      )}
    </div>
  );
};