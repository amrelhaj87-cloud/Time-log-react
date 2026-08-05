import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TagCode } from '../../types';
import { TagPickerPopover } from '../Hours/TagPickerPopover';

interface GoldenGoalProps {
  goal: { text: string; done: boolean; tag: TagCode };
  onChange: (updated: { text: string; done: boolean; tag: TagCode }) => void;
  onClear: () => void;
}

export const GoldenGoal: React.FC<GoldenGoalProps> = ({ goal, onChange, onClear }) => {
  const { lang } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-[rgba(201,123,46,0.12)] to-[rgba(248,236,220,0.4)] border-2 border-[var(--amber)] rounded-xl p-3 mb-3 shadow-xs">
      <div className="text-xs font-extrabold text-[var(--amber)] mb-1 flex items-center gap-1.5">
        <span>🌟</span>
        <span>{lang === 'ar' ? 'الهدف الذهبي لليوم (The One Thing)' : "Today's Golden Goal (The One Thing)"}</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={goal.done}
          onChange={(e) => onChange({ ...goal, done: e.target.checked })}
          className="w-4 h-4 accent-[var(--amber)] cursor-pointer shrink-0"
        />
        <input
          type="text"
          value={goal.text}
          onChange={(e) => onChange({ ...goal, text: e.target.value })}
          placeholder={
            lang === 'ar'
              ? 'أهم مهمة إذا أنجزتها يُعتبر يومك ناجحاً...'
              : 'The single most important task for today...'
          }
          className="flex-1 bg-transparent border-b-2 border-[var(--amber)]/30 text-xs font-bold text-[var(--ink)] p-1 outline-none focus:border-[var(--amber)]"
        />

        <TagPickerPopover
          small
          selectedTag={goal.tag}
          onSelectTag={(code) => onChange({ ...goal, tag: code })}
        />

        <button
          type="button"
          onClick={onClear}
          title={lang === 'ar' ? 'حذف الهدف الذهبي' : 'Delete Golden Goal'}
          className="text-[var(--rose)] text-sm px-1 hover:opacity-80"
        >
          ✕
        </button>
      </div>
    </div>
  );
};