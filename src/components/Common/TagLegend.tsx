import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface TagInfo {
  code: string;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  colorClass: string;
}

const TAG_DETAILS: TagInfo[] = [
  {
    code: 'E',
    labelAr: 'Earning (الكسب)',
    labelEn: 'Earning',
    descAr: 'توليد الدخل المباشر والعمل المدفوع',
    descEn: 'Direct income and paid work',
    colorClass: 'bg-[var(--teal-tint)] text-[var(--teal)] border-[var(--teal)]',
  },
  {
    code: 'V',
    labelAr: 'Vision (الرؤية والتخطيط)',
    labelEn: 'Vision & Planning',
    descAr: 'التخطيط الاستراتيجي وتطوير الذات والرؤية المستقبلية',
    descEn: 'Strategic planning and personal growth',
    colorClass: 'bg-[var(--amber-tint)] text-[var(--amber)] border-[var(--amber)]',
  },
  {
    code: 'R',
    labelAr: 'Recovery (التعافي والترويح)',
    labelEn: 'Recovery & Rest',
    descAr: 'الراحة والاستجمام والأنشطة الاجتماعية والترفيهية',
    descEn: 'Rest, social activities, and recreation',
    colorClass: 'bg-[var(--blue-tint)] text-[var(--blue)] border-[var(--blue)]',
  },
  {
    code: 'S',
    labelAr: 'Service (الخدمة والعطاء)',
    labelEn: 'Service & Giving',
    descAr: 'خدمة الآخرين والتطوع والالتزامات المجتمعية',
    descEn: 'Volunteering and community service',
    colorClass: 'bg-[var(--rose-tint)] text-[var(--rose)] border-[var(--rose)]',
  },
  {
    code: 'SC',
    labelAr: 'Self-Care (الرعاية الذاتية)',
    labelEn: 'Self-Care & Health',
    descAr: 'الرياضة والتغذية والصحة النفسية',
    descEn: 'Exercise, nutrition, and mental health',
    colorClass: 'bg-[#EFEAF8] text-[#7C5CBF] border-[#7C5CBF]',
  },
  {
    code: 'SL',
    labelAr: 'Sleep (نوم)',
    labelEn: 'Sleep',
    descAr: 'وقت نوم طبيعي وراحة ليلية',
    descEn: 'Natural sleep and night rest',
    colorClass: 'bg-[#E4E6EF] text-[#2E3A6B] border-[#2E3A6B]',
  },
];

export const TagLegend: React.FC = () => {
  const { lang } = useLanguage();
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const toggleTip = (code: string) => {
    setActiveCode(activeCode === code ? null : code);
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-3 my-3 shadow-xs text-center dir-rtl">
      <div className="text-xs font-bold text-[var(--teal-dark)] mb-2">
        {lang === 'ar' ? 'التصنيفات:' : 'Tag Categories:'}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {TAG_DETAILS.map((t) => {
          const isTipActive = activeCode === t.code;
          return (
            <div key={t.code} className="relative inline-block">
              <button
                type="button"
                onClick={() => toggleTip(t.code)}
                className={`py-1 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${t.colorClass} hover:-translate-y-0.5`}
              >
                {lang === 'ar' ? t.labelAr : t.labelEn}
              </button>

              {/* الشرح التفاعلي عند الضغط */}
              {isTipActive && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--ink)] text-[var(--card)] text-[10px] font-medium rounded-xl shadow-xl z-20 pointer-events-none leading-snug text-center">
                  {lang === 'ar' ? t.descAr : t.descEn}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--ink)]"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};