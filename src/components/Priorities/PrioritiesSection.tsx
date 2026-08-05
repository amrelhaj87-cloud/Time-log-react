import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { DayPriority, TagCode } from '../../types';

interface PrioritiesSectionProps {
  goldenGoal: { text: string; done: boolean; tag: TagCode };
  quadrants: Record<string, DayPriority[]>;
  onUpdateGoldenGoal: (updated: { text: string; done: boolean; tag: TagCode }) => void;
  onClearGoldenGoal: () => void;
  onChangePriority: (quadKey: string, index: number, updated: DayPriority) => void;
  onAddPriority: (quadKey: string) => void;
  onDeletePriority: (quadKey: string, index: number) => void;
  onPromoteToGolden: (quadKey: string, index: number) => void;
  onRollover: () => void;
}

const QUADS = [
  { key: 'q1', titleAr: '🔥 عاجل ومهم (مربع الإنجاز)', titleEn: '🔥 Urgent & Important', bgClass: 'bg-[var(--amber-tint)]/50 border-[var(--amber)]' },
  { key: 'q2', titleAr: '🎯 مهم وغير عاجل (مربع الجودة)', titleEn: '🎯 Important & Not Urgent', bgClass: 'bg-[var(--rose-tint)]/50 border-[var(--rose)]' },
  { key: 'q3', titleAr: '⚡ عاجل وغير مهم (مربع الخداع)', titleEn: '⚡ Urgent & Not Important', bgClass: 'bg-[var(--blue-tint)]/50 border-[var(--blue)]' },
  { key: 'q4', titleAr: '🌱 غير عاجل وغير مهم (مربع الضياع)', titleEn: '🌱 Not Urgent & Not Important', bgClass: 'bg-[var(--sage-tint)]/50 border-[var(--sage)]' },
];

const TAG_COLORS: Record<string, string> = {
  E: 'var(--teal)', V: 'var(--amber)', R: 'var(--blue)', S: 'var(--rose)', SC: '#7C5CBF', SL: '#2E3A6B',
};

export const PrioritiesSection: React.FC<PrioritiesSectionProps> = ({
  goldenGoal,
  quadrants,
  onUpdateGoldenGoal,
  onClearGoldenGoal,
  onChangePriority,
  onAddPriority,
  onDeletePriority,
  onPromoteToGolden,
  onRollover,
}) => {
  const { lang } = useLanguage();

  // حساب الأعداد والنسبة المئوية لإنجاز الأولويات
  const allPriorities = Object.values(quadrants).flat().filter((p) => p.text.trim() !== '');
  const totalPrioritiesCount = allPriorities.length + (goldenGoal.text.trim() !== '' ? 1 : 0);
  const completedCount =
    allPriorities.filter((p) => p.done).length + (goldenGoal.text.trim() !== '' && goldenGoal.done ? 1 : 0);

  const priorityPct =
    totalPrioritiesCount > 0 ? Math.round((completedCount / totalPrioritiesCount) * 100) : 0;

  const cycleTag = (currentTag: TagCode) => {
    const tags: TagCode[] = ['', 'E', 'V', 'R', 'S', 'SC', 'SL'];
    const idx = tags.indexOf(currentTag || '');
    return tags[(idx + 1) % tags.length];
  };

  return (
    <section className="bg-[var(--card)] border border-[var(--line)] rounded-[var(--radius)] p-3 shadow-xs dir-rtl">
      <h2 className="text-xl font-serif font-bold text-[var(--teal-dark)] text-center mb-3">
        {lang === 'ar' ? 'الأولويات' : 'Priorities'}
      </h2>

      {/* الهدف الذهبي */}
      <div className="p-3 bg-[var(--amber-tint)]/40 border-2 border-[var(--amber)] rounded-xl mb-3 shadow-xs">
        <div className="text-xs font-bold text-[var(--amber)] mb-1 flex items-center gap-1.5">
          <span>🌟</span>
          <span>{lang === 'ar' ? 'الهدف الذهبي لليوم (The One Thing)' : "Today's Golden Goal"}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={goldenGoal.done}
            onChange={(e) => onUpdateGoldenGoal({ ...goldenGoal, done: e.target.checked })}
            className="w-4 h-4 accent-[var(--amber)] cursor-pointer shrink-0"
          />

          <input
            type="text"
            value={goldenGoal.text}
            onChange={(e) => onUpdateGoldenGoal({ ...goldenGoal, text: e.target.value })}
            placeholder={
              lang === 'ar'
                ? 'أهم مهمة إذا أنجزتها يُعتبر يومك ناجحاً...'
                : 'The single most important task for today...'
            }
            className="flex-1 bg-transparent border-b border-[var(--amber)]/40 text-xs font-bold text-[var(--ink)] py-1 outline-none"
          />

          {/* زر التاق الموحد */}
          <button
            type="button"
            onClick={() => onUpdateGoldenGoal({ ...goldenGoal, tag: cycleTag(goldenGoal.tag) })}
            style={{
              borderColor: goldenGoal.tag ? TAG_COLORS[goldenGoal.tag] : 'var(--line)',
              color: goldenGoal.tag ? TAG_COLORS[goldenGoal.tag] : 'var(--ink-faint)',
            }}
            className="w-9 h-6 shrink-0 rounded-md border text-[10px] font-bold bg-[var(--card)] hover:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            {goldenGoal.tag || '—'}
          </button>

          <button
            type="button"
            onClick={onClearGoldenGoal}
            className="text-xs text-[var(--rose)] hover:font-bold cursor-pointer shrink-0"
            title={lang === 'ar' ? 'حذف الهدف الذهبي' : 'Clear Golden Goal'}
          >
            ✕
          </button>
        </div>
      </div>

      {/* شريط نسبة إنجاز الأولويات المئوي */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-2 mb-3">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--teal-dark)] mb-1">
          <span>
            {lang === 'ar'
              ? `إنجاز الأولويات: ${completedCount} / ${totalPrioritiesCount} (${priorityPct}%)`
              : `Priorities Done: ${completedCount} / ${totalPrioritiesCount} (${priorityPct}%)`}
          </span>
          <span>🎯 {priorityPct}%</span>
        </div>
        <div className="h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--teal)] rounded-full transition-all duration-300"
            style={{ width: `${priorityPct}%` }}
          />
        </div>
      </div>

      {/* المربعات الأربعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
        {QUADS.map((q) => {
          const items = quadrants[q.key] || [];

          return (
            <div key={q.key} className={`p-2.5 border rounded-xl flex flex-col gap-2 ${q.bgClass}`}>
              <div className="text-xs font-bold text-[var(--ink)]">
                {lang === 'ar' ? q.titleAr : q.titleEn}
              </div>

              <div className="flex flex-col gap-1.5">
                {items.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={(e) =>
                        onChangePriority(q.key, idx, { ...item, done: e.target.checked })
                      }
                      className="w-3.5 h-3.5 accent-[var(--teal)] cursor-pointer shrink-0"
                    />

                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) =>
                        onChangePriority(q.key, idx, { ...item, text: e.target.value })
                      }
                      placeholder={`${lang === 'ar' ? 'أولوية #' : 'Priority #'}${idx + 1}`}
                      className={`flex-1 bg-transparent border-b border-black/10 text-xs py-0.5 outline-none ${
                        item.done ? 'line-through text-[var(--ink-faint)]' : 'text-[var(--ink)]'
                      }`}
                    />

                    {/* زر التاق الموحد للأولويات */}
                    <button
                      type="button"
                      onClick={() =>
                        onChangePriority(q.key, idx, {
                          ...item,
                          tag: cycleTag((item.tag || '') as TagCode),
                        })
                      }
                      style={{
                        borderColor: item.tag ? TAG_COLORS[item.tag] : 'var(--line)',
                        color: item.tag ? TAG_COLORS[item.tag] : 'var(--ink-faint)',
                      }}
                      className="w-8 h-5 shrink-0 rounded border text-[9px] font-bold bg-[var(--card)] hover:scale-95 transition-all flex items-center justify-center cursor-pointer"
                    >
                      {item.tag || '—'}
                    </button>

                    {/* زر الترقية للهدف الذهبي */}
                    {(q.key === 'q1' || q.key === 'q2') && (
                      <button
                        type="button"
                        onClick={() => onPromoteToGolden(q.key, idx)}
                        className="text-xs hover:scale-125 transition-transform cursor-pointer shrink-0"
                        title={lang === 'ar' ? 'نقل للهدف الذهبي' : 'Promote to Golden Goal'}
                      >
                        🎯
                      </button>
                    )}

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeletePriority(q.key, idx)}
                        className="text-xs text-[var(--rose)] cursor-pointer shrink-0"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onAddPriority(q.key)}
                className="w-full py-1 text-[11px] font-semibold text-[var(--ink-soft)] bg-[var(--card)]/60 border border-dashed border-[var(--line)] rounded-lg hover:border-[var(--teal)] hover:text-[var(--teal-dark)] transition-colors cursor-pointer"
              >
                + {lang === 'ar' ? 'إضافة أولوية' : 'Add Priority'}
              </button>
            </div>
          );
        })}
      </div>

      {/* زر ترحيل المهام غير المنجزة */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onRollover}
          className="py-1.5 px-4 bg-[var(--teal-tint)] border border-[var(--teal)] text-[var(--teal-dark)] text-xs font-bold rounded-xl hover:bg-[var(--teal)] hover:text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <span>➡️</span>
          <span>{lang === 'ar' ? 'ترحيل المهام غير المنجزة للغد' : 'Rollover Unfinished Tasks'}</span>
        </button>
      </div>
    </section>
  );
};