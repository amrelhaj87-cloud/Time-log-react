import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { TagCode } from '../../types';

interface TagPickerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: TagCode) => void;
  currentTag: TagCode;
  anchorRect: DOMRect | null;
}

const TAG_LIST: { code: TagCode; titleAr: string; titleEn: string; color: string; bg: string }[] = [
  { code: 'E', titleAr: 'Earning (الكسب)', titleEn: 'Earning', color: 'var(--teal)', bg: 'var(--teal-tint)' },
  { code: 'V', titleAr: 'Vision (الرؤية)', titleEn: 'Vision', color: 'var(--amber)', bg: 'var(--amber-tint)' },
  { code: 'R', titleAr: 'Recovery (التعافي)', titleEn: 'Recovery', color: 'var(--blue)', bg: 'var(--blue-tint)' },
  { code: 'S', titleAr: 'Service (الخدمة)', titleEn: 'Service', color: 'var(--rose)', bg: 'var(--rose-tint)' },
  { code: 'SC', titleAr: 'Self-Care (رعاية)', titleEn: 'Self-Care', color: '#7C5CBF', bg: '#EFEAF8' },
  { code: 'SL', titleAr: 'Sleep (نوم)', titleEn: 'Sleep', color: '#2E3A6B', bg: '#E4E6EF' },
  { code: '', titleAr: 'بدون تصنيف', titleEn: 'Unassigned', color: 'var(--ink-faint)', bg: 'var(--card)' },
];

export const TagPickerMenu: React.FC<TagPickerMenuProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentTag,
}) => {
  const { lang } = useLanguage();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-3 shadow-2xl grid grid-cols-4 sm:grid-cols-7 gap-1.5 min-w-[260px] dir-rtl animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {TAG_LIST.map((t) => (
          <button
            key={t.code || 'none'}
            type="button"
            onClick={() => {
              onSelect(t.code);
              onClose();
            }}
            style={{ color: t.color, backgroundColor: t.bg }}
            className={`p-2 rounded-xl border text-xs font-black text-center transition-all cursor-pointer hover:scale-105 ${
              currentTag === t.code ? 'ring-2 ring-[var(--teal-dark)] font-black' : 'border-[var(--line)]'
            }`}
            title={lang === 'ar' ? t.titleAr : t.titleEn}
          >
            {t.code || '—'}
          </button>
        ))}
      </div>
    </div>
  );
};