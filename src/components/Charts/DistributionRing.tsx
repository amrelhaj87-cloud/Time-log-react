import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { DistributionResult } from '../../lib/distribution';

interface DistributionRingProps {
  data: DistributionResult;
  size?: number;
}

const CATEGORIES = [
  { key: 'E', color: 'var(--teal)', label: { ar: 'الكسب (E)', en: 'Earning (E)' } },
  { key: 'V', color: 'var(--amber)', label: { ar: 'الرؤية (V)', en: 'Vision (V)' } },
  { key: 'R', color: 'var(--blue)', label: { ar: 'التعافي (R)', en: 'Recovery (R)' } },
  { key: 'S', color: 'var(--rose)', label: { ar: 'الخدمة (S)', en: 'Service (S)' } },
  { key: 'SC', color: '#7C5CBF', label: { ar: 'الرعاية (SC)', en: 'Self-Care (SC)' } },
  { key: 'SL', color: '#2E3A6B', label: { ar: 'النوم (SL)', en: 'Sleep (SL)' } },
  { key: 'unassigned', color: 'var(--ink-faint)', label: { ar: 'بدون بند', en: 'Unassigned' } },
  { key: 'empty', color: 'var(--line)', label: { ar: 'بدون تسجيل', en: 'No Log' } },
];

export const DistributionRing: React.FC<DistributionRingProps> = ({ data, size = 180 }) => {
  const { lang } = useLanguage();
  const radius = size * 0.38;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;
  const segments: React.ReactNode[] = [];
  const legendItems: React.ReactNode[] = [];

  CATEGORIES.forEach((cat) => {
    const count = data.counts[cat.key as keyof typeof data.counts] || 0;
    if (count === 0) return;

    const pct = data.totalSlots > 0 ? count / data.totalSlots : 0;
    const dashLen = pct * circumference;
    const displayPct = (pct * 100).toFixed(1);

    segments.push(
      <circle
        key={cat.key}
        cx={center} cy={center} r={radius}
        fill="none" stroke={cat.color} strokeWidth={size * 0.09}
        strokeDasharray={`${dashLen} ${circumference - dashLen}`}
        strokeDashoffset={-currentOffset}
        className="-rotate-90 origin-center"
      />
    );
    currentOffset += dashLen;

    legendItems.unshift(
      <div key={cat.key} className="flex items-center gap-2 text-[11px] font-semibold text-[var(--ink)]">
        <span className="w-3 h-3 rounded-sm border border-black/5 shrink-0" style={{ backgroundColor: cat.color }} />
        <span>{cat.label[lang === 'ar' ? 'ar' : 'en']}</span>
        <span className="text-[10px] text-[var(--ink-faint)]">{count}h ({displayPct}%)</span>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-2">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--line)" strokeWidth={size * 0.09} opacity={0.3} />
          {segments}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none leading-tight">
          <div className="text-[22px] font-black text-[var(--teal-dark)] dir-ltr">{data.loggedTotal}</div>
          <div className="text-[10px] font-bold text-[var(--ink-soft)]">/{data.totalSlots}</div>
          <div className="text-[9px] text-[var(--ink-faint)]">{lang === 'ar' ? 'ساعة' : 'hrs'}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 min-w-[130px]">
        {legendItems}
      </div>
    </div>
  );
};