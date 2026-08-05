import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TagPickerMenu } from '../Common/TagPickerMenu';
import type { HourData, TagCode } from '../../types';

export interface HourRowProps {
  hourKey: string;
  hourLabel?: string;
  hourData?: HourData;
  onChangeText?: (key: string, note: string) => void;
  onChangeTag?: (key: string, tag: TagCode) => void;
  onCopyDown?: (key: string) => void;
  hasNextHour?: boolean;
  onUpdate?: (tag: TagCode, note: string) => void;
  onCopyNext?: () => void;
  isLastHour?: boolean;
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
  hasNextHour = true,
  onUpdate,
  onCopyNext,
  isLastHour = false,
}) => {
  const { lang } = useLanguage();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const currentNote = hourData?.note || '';
  const currentTag = (hourData?.tag || '') as TagCode;

  const handleSelectTag = (newTag: TagCode) => {
    if (onChangeTag) {
      onChangeTag(hourKey, newTag);
    } else if (onUpdate) {
      onUpdate(newTag, currentNote);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onChangeText) {
      onChangeText(hourKey, val);
    } else if (onUpdate) {
      onUpdate(currentTag, val);
    }
  };

  const handleCopy = () => {
    if (onCopyDown) {
      onCopyDown(hourKey);
    } else if (onCopyNext) {
      onCopyNext();
    }
  };

  const displayLabel = hourLabel || hourKey;
  const showCopyBtn = (hasNextHour && !isLastHour) && (!!onCopyDown || !!onCopyNext);

  return (
    <div className="flex items-center gap-1.5 py-1 px-1 border-b border-[var(--line)] hover:bg-[var(--teal-tint)]/40 transition-colors">
      <span className="w-11 shrink-0 text-xs font-semibold text-[var(--ink-soft)]">
        {displayLabel}
      </span>

      <input
        type="text"
        value={currentNote}
        onChange={handleNoteChange}
        placeholder={lang === 'ar' ? 'سجّل إيه اللي عملته...' : 'What did you accomplish...'}
        className="flex-1 min-w-0 bg-transparent border-b border-transparent focus:border-[var(--teal)] text-xs text-[var(--ink)] py-1 px-1 outline-none"
      />

      {/* زر التاق المنسدل التفاعلي */}
      <button
        type="button"
        onClick={() => setIsPickerOpen(true)}
        style={{
          borderColor: currentTag ? TAG_COLORS[currentTag] : 'var(--line)',
          color: currentTag ? TAG_COLORS[currentTag] : 'var(--ink-faint)',
        }}
        className="w-10 h-7 shrink-0 rounded-lg border text-[11px] font-bold bg-[var(--card)] hover:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
        title={currentTag || (lang === 'ar' ? 'اختر تصنيف' : 'Select tag')}
      >
        {currentTag || '—'}
      </button>

      {/* زر النسخ لأسفل بعد التاق */}
      {showCopyBtn && (
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 text-xs text-[var(--ink-faint)] hover:text-[var(--teal-dark)] hover:bg-[var(--teal-tint)] rounded transition-all cursor-pointer shrink-0"
          title={lang === 'ar' ? 'نسخ النص والتصنيف للساعة التالية ⬇️' : 'Copy to next hour ⬇️'}
        >
          ⬇️
        </button>
      )}

      {/* المنيو المنبثق لاختيار التصنيف */}
      <TagPickerMenu
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelectTag}
        currentTag={currentTag}
      />
    </div>
  );
};