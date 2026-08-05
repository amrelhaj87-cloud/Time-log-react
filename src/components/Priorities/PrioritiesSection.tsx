import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { GoldenGoal } from './GoldenGoal';
import { PriorityList } from './PriorityList';
import { DayPriority, TagCode } from '../../types';

interface PrioritiesSectionProps {
  goldenGoal: { text: string; done: boolean; tag: TagCode };
  quadrants: Record<string, DayPriority[]>;
  onUpdateGoldenGoal: (goal: { text: string; done: boolean; tag: TagCode }) => void;
  onClearGoldenGoal: () => void;
  onChangePriority: (quadKey: string, index: number, updated: DayPriority) => void;
  onAddPriority: (quadKey: string) => void;
  onDeletePriority: (quadKey: string, index: number) => void;
  onPromoteToGolden: (quadKey: string, index: number) => void;
  onRollover: () => void;
}

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

  // حساب نسبة المنجز من الأولويات والهدف الذهبي
  let total = 0;
  let done = 0;
  if (goldenGoal.text.trim()) {
    total++;
    if (goldenGoal.done) done++;
  }
  Object.values(quadrants).forEach((items) => {
    items.forEach((it) => {
      if (it.text.trim()) {
        total++;
        if (it.done) done++;
      }
    });
  });
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className="bg-[var(--card)] border border-[var(--line)] rounded-[var(--radius)] p-3 mb-3 shadow-xs">
      <h2 className="font-serif text-xl font-bold text-[var(--teal-dark)] text-center mb-2">
        {lang === 'ar' ? 'الأولويات' : 'Priorities'}
      </h2>

      {/* Golden Goal */}
      <GoldenGoal
        goal={goldenGoal}
        onChange={onUpdateGoldenGoal}
        onClear={onClearGoldenGoal}
      />

      {/* Progress Bar */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-2 mb-3">
        <div className="flex justify-between text-[10px] font-bold text-[var(--teal-dark)] mb-1">
          <span>
            {lang === 'ar'
              ? `إنجاز الأولويات: ${done} / ${total} (${pct}%)`
              : `Priorities Done: ${done} / ${total} (${pct}%)`}
          </span>
          <span>🎯 {pct}%</span>
        </div>
        <div className="h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--teal)] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Quadrants Grid */}
      <PriorityList
        quadrants={quadrants}
        onChangeItem={onChangePriority}
        onAddItem={onAddPriority}
        onDeleteItem={onDeletePriority}
        onPromoteToGolden={onPromoteToGolden}
      />

      {/* Rollover Button */}
      <div className="flex justify-center mt-2">
        <button
          type="button"
          onClick={onRollover}
          className="py-1.5 px-4 rounded-xl text-xs font-bold bg-[var(--teal-tint)] border border-[var(--teal)] text-[var(--teal-dark)] hover:bg-[var(--teal)] hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
        >
          <span>➡️</span>
          <span>
            {lang === 'ar'
              ? 'ترحيل المهام غير المنجزة للغد'
              : 'Rollover Unfinished Tasks to Tomorrow'}
          </span>
        </button>
      </div>
    </section>
  );
};