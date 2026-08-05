import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DistributionRing } from '../Charts/DistributionRing';
import type { DistributionResult } from '../../lib/distribution';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekStats: DistributionResult;
  monthStats: DistributionResult;
  daysInMonth: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen, onClose, weekStats, monthStats, daysInMonth
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');

  if (!isOpen) return null;

  const stats = activeTab === 'week' ? weekStats : monthStats;
  const daysCount = activeTab === 'week' ? 7 : daysInMonth;
  const avgPerDay = (stats.loggedTotal / daysCount).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs dir-rtl">
      <div className="max-w-[500px] w-full p-4 bg-[var(--card)] rounded-2xl border border-[var(--line)] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--line)]">
          <h3 className="font-bold text-lg text-[var(--teal-dark)] flex items-center gap-2">
            <span>📊</span>
            <span>{lang === 'ar' ? 'إحصائيات وتوزيع الوقت' : 'Time Statistics & Distribution'}</span>
          </h3>
          <button onClick={onClose} className="text-xl text-[var(--ink-soft)] hover:text-[var(--rose)] cursor-pointer">
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-[var(--line)] pb-2">
          <button
            onClick={() => setActiveTab('week')}
            className={`flex-1 pb-1 text-[11px] font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'week' ? 'text-[var(--teal-dark)] border-[var(--teal)]' : 'text-[var(--ink-faint)] border-transparent'}`}
          >
            {lang === 'ar' ? 'إحصائيات الأسبوع' : 'Weekly Stats'}
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`flex-1 pb-1 text-[11px] font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'month' ? 'text-[var(--teal-dark)] border-[var(--teal)]' : 'text-[var(--ink-faint)] border-transparent'}`}
          >
            {lang === 'ar' ? 'إحصائيات الشهر' : 'Monthly Stats'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-center">
          <div className="bg-[var(--teal-tint)] p-2 rounded-xl border border-[var(--teal)]">
            <div className="text-[10px] font-bold text-[var(--teal-dark)]">{lang === 'ar' ? 'إجمالي الساعات' : 'Total Hours'}</div>
            <div className="text-lg font-black text-[var(--teal-dark)]">{stats.loggedTotal}h</div>
          </div>
          <div className="bg-[var(--amber-tint)] p-2 rounded-xl border border-[var(--amber)]">
            <div className="text-[10px] font-bold text-[var(--amber)]">{lang === 'ar' ? 'المعدل اليومي' : 'Daily Avg'}</div>
            <div className="text-lg font-black text-[var(--amber)]">{avgPerDay}h/d</div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-2 pt-2 border-t border-[var(--line)]">
          <div className="text-[11px] font-extrabold text-[var(--teal-dark)] text-center mb-2">
            📊 {lang === 'ar' ? `توزيع ${activeTab === 'week' ? 'الأسبوع' : 'الشهر'}` : `${activeTab === 'week' ? 'Week' : 'Month'} Distribution`}
          </div>
          <DistributionRing data={stats} size={160} />
        </div>
      </div>
    </div>
  );
};