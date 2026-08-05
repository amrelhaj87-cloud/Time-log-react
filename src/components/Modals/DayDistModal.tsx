import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface DayDistModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  loggedTotal: number;
  totalSlots: number;
  tagCounts: Record<string, number>;
}

const TAG_COLORS: Record<string, string> = {
  E: 'var(--teal)',
  V: 'var(--amber)',
  R: 'var(--blue)',
  S: 'var(--rose)',
  SC: '#7C5CBF',
  SL: '#2E3A6B',
  unassigned: '#9A968C',
  empty: '#DDD5C6',
};

export const DayDistModal: React.FC<DayDistModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  loggedTotal,
  totalSlots = 24,
  tagCounts,
}) => {
  const { lang } = useLanguage();
  if (!isOpen) return null;

  const emptyCount = Math.max(0, totalSlots - loggedTotal);
  const categories = [
    { key: 'empty', labelAr: 'بدون تسجيل', labelEn: 'No Log', count: emptyCount },
    { key: 'unassigned', labelAr: 'بدون بند', labelEn: 'Unassigned', count: tagCounts.unassigned || 0 },
    { key: 'SL', labelAr: 'SL', labelEn: 'SL', count: tagCounts.SL || 0 },
    { key: 'SC', labelAr: 'SC', labelEn: 'SC', count: tagCounts.SC || 0 },
    { key: 'S', labelAr: 'S', labelEn: 'S', count: tagCounts.S || 0 },
    { key: 'R', labelAr: 'R', labelEn: 'R', count: tagCounts.R || 0 },
    { key: 'V', labelAr: 'V', labelEn: 'V', count: tagCounts.V || 0 },
    { key: 'E', labelAr: 'E', labelEn: 'E', count: tagCounts.E || 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs dir-rtl">
      <div className="max-w-[420px] w-full p-4 bg-[var(--card)] rounded-2xl border border-[var(--line)] shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--line)]">
          <h3 className="font-bold text-base text-[var(--teal-dark)] flex items-center gap-2">
            <span>📊</span>
            <span>
              {lang === 'ar'
                ? `توزيع اليوم الكامل (24 ساعة) - ${dateStr}`
                : `Full Day Distribution - ${dateStr}`}
            </span>
          </h3>
          <button onClick={onClose} className="text-xl text-[var(--ink-soft)] cursor-pointer">
            &times;
          </button>
        </div>

        {/* الرسم البياني اليدوي الدائري */}
        <div className="flex flex-col items-center my-4">
          <div className="relative w-44 h-44 flex items-center justify-center border-8 border-[var(--line)] rounded-full">
            <div className="text-center">
              <span className="text-2xl font-black text-[var(--teal-dark)]">{loggedTotal}</span>
              <span className="text-xs text-[var(--ink-faint)]"> / {totalSlots}</span>
              <div className="text-[10px] text-[var(--ink-soft)]">{lang === 'ar' ? 'ساعة' : 'hrs'}</div>
            </div>
          </div>
        </div>

        {/* النسبة المئوية والتفاصيل */}
        <div className="flex flex-col gap-1.5 text-xs font-bold">
          {categories.map((c) => {
            const pct = ((c.count / totalSlots) * 100).toFixed(1);
            return (
              <div key={c.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: TAG_COLORS[c.key] }}
                  ></span>
                  <span>{lang === 'ar' ? c.labelAr : c.labelEn}</span>
                </div>
                <span className="text-[var(--ink-soft)]">
                  {c.count}h ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};