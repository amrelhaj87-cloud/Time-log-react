import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TagCode, DayPriority } from '../../types';
import { TagPickerPopover } from '../Hours/TagPickerPopover';

interface PriorityListProps {
  quadrants: Record<string, DayPriority[]>;
  onChangeItem: (quadKey: string, index: number, updated: DayPriority) => void;
  onAddItem: (quadKey: string) => void;
  onDeleteItem: (quadKey: string, index: number) => void;
  onPromoteToGolden: (quadKey: string, index: number) => void;
}

const QUAD_CONFIGS = [
  { key: 'q1', cls: 'bg-[var(--amber-tint)]', title: { ar: '🔥 عاجل ومهم (مربع الإنجاز)', en: '🔥 Urgent & Important' } },
  { key: 'q2', cls: 'bg-[var(--rose-tint)]', title: { ar: '🎯 مهم وغير عاجل (مربع الجودة والرؤية)', en: '🎯 Important & Not Urgent' } },
  { key: 'q3', cls: 'bg-[var(--blue-tint)]', title: { ar: '⚡ عاجل وغير مهم (مربع الخداع)', en: '⚡ Urgent & Not Important' } },
  { key: 'q4', cls: 'bg-[var(--sage-tint)]', title: { ar: '🌱 غير عاجل وغير مهم (مربع الضياع)', en: '🌱 Not Urgent & Not Important' } },
];

export const PriorityList: React.FC<PriorityListProps> = ({
  quadrants,
  onChangeItem,
  onAddItem,
  onDeleteItem,
  onPromoteToGolden,
}) => {
  const { lang } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
      {QUAD_CONFIGS.map((q) => {
        const items = quadrants[q.key] || [];
        const showPromote = q.key === 'q1' || q.key === 'q2';

        return (
          <div key={q.key} className={`rounded-xl p-2.5 border border-[var(--line)] ${q.cls}`}>
            <div className="text-xs font-bold mb-1.5 text-[var(--ink)]">
              {q.title[lang === 'ar' ? 'ar' : 'en']}
            </div>

            <div className="flex flex-col gap-1.5">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 ${item.done ? 'opacity-60 line-through' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => onChangeItem(q.key, idx, { ...item, done: e.target.checked })}
                    className="w-3.5 h-3.5 accent-[var(--teal)] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => onChangeItem(q.key, idx, { ...item, text: e.target.value })}
                    placeholder={`${lang === 'ar' ? 'أولوية #' : 'Priority #'}${idx + 1}`}
                    className="flex-1 bg-transparent border-b border-black/10 text-xs p-0.5 text-[var(--ink)] outline-none focus:border-[var(--ink)]"
                  />

                  <TagPickerPopover
                    small
                    selectedTag={item.tag as TagCode}
                    onSelectTag={(code) => onChangeItem(q.key, idx, { ...item, tag: code })}
                  />

                  {showPromote && (
                    <button
                      type="button"
                      onClick={() => onPromoteToGolden(q.key, idx)}
                      title={lang === 'ar' ? 'نقل للهدف الذهبي' : 'Promote to Golden Goal'}
                      className="text-xs text-[var(--amber)] hover:scale-110 transition-transform"
                    >
                      🎯
                    </button>
                  )}

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteItem(q.key, idx)}
                      className="text-[var(--rose)] text-sm px-1 opacity-70 hover:opacity-100"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onAddItem(q.key)}
              className="mt-2 w-full py-1 rounded-lg border border-dashed border-[var(--line)] bg-white/30 text-xs font-semibold text-[var(--ink-soft)] hover:bg-[var(--card)] transition-colors"
            >
              {lang === 'ar' ? '+ إضافة أولوية' : '+ Add Priority'}
            </button>
          </div>
        );
      })}
    </div>
  );
};