import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { TagCode } from '../../types';

interface TagPickerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: TagCode) => void;
  currentTag?: TagCode;
}

const TAG_ITEMS: { code: TagCode; labelAr: string; labelEn: string; color: string; bg: string }[] = [
  { code: 'E', labelAr: 'Earning (الكسب)', labelEn: 'Earning', color: 'var(--teal)', bg: 'var(--teal-tint)' },
  { code: 'V', labelAr: 'Vision (الرؤية)', labelEn: 'Vision', color: 'var(--amber)', bg: 'var(--amber-tint)' },
  { code: 'R', labelAr: 'Recovery (التعافي)', labelEn: 'Recovery', color: 'var(--blue)', bg: 'var(--blue-tint)' },
  { code: 'S', labelAr: 'Service (الخدمة)', labelEn: 'Service', color: 'var(--rose)', bg: 'var(--rose-tint)' },
  { code: 'SC', labelAr: 'Self-Care (رعاية)', labelEn: 'Self-Care', color: '#7C5CBF', bg: '#EFEAF8' },
  { code: 'SL', labelAr: 'Sleep (نوم)', labelEn: 'Sleep', color: '#2E3A6B', bg: '#E4E6EF' },
  { code: '', labelAr: 'إلغاء التصنيف', labelEn: 'Unassign', color: 'var(--ink-faint)', bg: 'var(--card)' },
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-xs dir-rtl"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-3.5 shadow-2xl max-w-[320px] w-full mx-4 flex flex-col gap-2 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs font-bold text-[var(--teal-dark)] text-center pb-1.5 border-b border-[var(--line)]">
          {lang === 'ar' ? 'اختر تصنيف النشاط:' : 'Select Category Tag:'}
        </div>

        <div className="grid grid-cols-2 gap-2 my-1">
          {TAG_ITEMS.map((item) => {
            const isSelected = currentTag === item.code;
            return (
              <button
                key={item.code || 'none'}
                type="button"
                onClick={() => {
                  onSelect(item.code);
                  onClose();
                }}
                style={{
                  color: item.color,
                  backgroundColor: item.bg,
                  borderColor: isSelected ? item.color : 'transparent',
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-between hover:scale-102 ${
                  isSelected ? 'ring-2 ring-offset-1 font-black shadow-xs' : ''
                }`}
              >
                <span>{item.code || '—'}</span>
                <span className="text-[10px] opacity-80">
                  {lang === 'ar' ? item.labelAr.split(' ')[0] : item.labelEn}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-1.5 text-xs text-[var(--ink-soft)] bg-[var(--line)]/40 hover:bg-[var(--line)] rounded-xl font-bold cursor-pointer transition-colors"
        >
          {lang === 'ar' ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </div>
  );
};