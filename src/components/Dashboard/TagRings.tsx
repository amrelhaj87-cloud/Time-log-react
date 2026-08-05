import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { DistributionCounts } from '../../lib/distribution';

interface TagRingsProps {
  counts: DistributionCounts;
  totalSlots: number;
  onClick?: () => void;
}

const TAGS_CONFIG = [
  { code: 'E', color: 'var(--teal)' },
  { code: 'V', color: 'var(--amber)' },
  { code: 'R', color: 'var(--blue)' },
  { code: 'S', color: 'var(--rose)' },
  { code: 'SC', color: '#7C5CBF' },
  { code: 'SL', color: '#2E3A6B' },
];

export const TagRings: React.FC<TagRingsProps> = ({ counts, totalSlots, onClick }) => {
  const { lang } = useLanguage();
  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <div 
      className="grid grid-cols-6 gap-1 w-full bg-[var(--card)] border border-[var(--line)] rounded-[var(--radius)] p-2 shadow-xs cursor-pointer hover:border-[var(--teal)] transition-colors"
      onClick={onClick}
      title={lang === 'ar' ? 'اضغط لعرض الإحصائيات التفصيلية' : 'Click to view detailed stats'}
    >
      {TAGS_CONFIG.map(({ code, color }) => {
        const count = counts[code as keyof Omit<DistributionCounts, 'unassigned' | 'empty'>] || 0;
        const pct = totalSlots > 0 ? count / totalSlots : 0;
        const offset = circumference * (1 - Math.min(pct, 1));

        return (
          <div key={code} className="flex flex-col items-center gap-0.5 hover:-translate-y-0.5 transition-transform">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 36 36" className="-rotate-90">
                <circle cx="18" cy="18" r={radius} fill="none" stroke="var(--line)" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r={radius} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                />
              </svg>
              <span className="absolute text-[11px] font-black z-10" style={{ color }}>
                {count}
              </span>
            </div>
            <span className="text-[7px] font-bold text-[var(--ink-soft)] tracking-wider">
              {code}
            </span>
          </div>
        );
      })}
    </div>
  );
};