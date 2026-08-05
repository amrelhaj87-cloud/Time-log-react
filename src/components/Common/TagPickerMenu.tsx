import React from 'react';
import type { TagCode } from '../../types';

interface TagPickerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: TagCode) => void;
  currentTag?: TagCode;
}

const TAG_ITEMS: { code: TagCode; color: string; bg: string }[] = [
  { code: 'E', color: 'var(--teal)', bg: 'var(--teal-tint)' },
  { code: 'V', color: 'var(--amber)', bg: 'var(--amber-tint)' },
  { code: 'R', color: 'var(--blue)', bg: 'var(--blue-tint)' },
  { code: 'S', color: 'var(--rose)', bg: 'var(--rose-tint)' },
  { code: 'SC', color: '#7C5CBF', bg: '#EFEAF8' },
  { code: 'SL', color: '#2E3A6B', bg: '#E4E6EF' },
  { code: '', color: 'var(--ink-soft)', bg: 'var(--card)' },
];

export const TagPickerMenu: React.FC<TagPickerMenuProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentTag,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-2.5 shadow-xl w-auto max-w-[210px] dir-rtl animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-4 gap-1.5 justify-items-center">
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
                  borderColor: isSelected ? item.color : 'var(--line)',
                }}
                className={`w-9 h-8 rounded-xl border text-xs font-black flex items-center justify-center transition-transform cursor-pointer hover:scale-110 ${
                  isSelected ? 'ring-2 ring-[var(--teal-dark)] font-black' : ''
                }`}
              >
                {item.code || '—'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};