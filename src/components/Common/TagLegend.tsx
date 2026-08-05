import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const TagLegend: React.FC = () => {
  const { lang } = useLanguage();
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const tags = [
    { code: 'E', labelAr: 'Earning (الكسب)', labelEn: 'Earning', descAr: 'توليد الدخل المباشر والعمل المدفوع', descEn: 'Direct income and paid work', border: 'border-[var(--teal)] text-[var(--teal)] bg-[var(--teal-tint)]' },
    { code: 'V', labelAr: 'Vision (الرؤية والتخطيط)', labelEn: 'Vision & Planning', descAr: 'التخطيط الاستراتيجي وتطوير الذات والرؤية المستقبلية', descEn: 'Strategic planning and personal growth', border: 'border-[var(--amber)] text-[var(--amber)] bg-[var(--amber-tint)]' },
    { code: 'R', labelAr: 'Recovery (التعافي والترويح)', labelEn: 'Recovery & Rest', descAr: 'الراحة والاستجمام والأنشطة الاجتماعية', descEn: 'Rest, social activities, and recreation', border: 'border-[var(--blue)] text-[var(--blue)] bg-[var(--blue-tint)]' },
    { code: 'S', labelAr: 'Service (الخدمة والعطاء)', labelEn: 'Service & Giving', descAr: 'خدمة الآخرين والتطوع والالتزامات المجتمعية', descEn: 'Volunteering and community service', border: 'border-[var(--rose)] text-[var(--rose)] bg-[var(--rose-tint)]' },
    { code: 'SC', labelAr: 'Self-Care (الرعاية الذاتية)', labelEn: 'Self-Care & Health', descAr: 'الرياضة والتغذية والصحة النفسية', descEn: 'Exercise, nutrition, and mental health', border: 'border-[#7C5CBF] text-[#7C5CBF] bg-[#EFEAF8]' },
    { code: 'SL', labelAr: 'Sleep (نوم)', labelEn: 'Sleep', descAr: 'وقت نوم طبيعي وراحة ليلية', descEn: 'Natural sleep and night rest', border: 'border-[#2E3A6B] text-[#2E3A6B] bg-[#E4E6EF]' },
  ];

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-3 my-3 text-center dir-rtl">
      <div className="text-xs font-bold text-[var(--teal-dark)] mb-2">
        {lang === 'ar' ? 'التصنيفات:' : 'Tag Categories:'}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((t) => (
          <div key={t.code} className="relative">
            <button
              onClick={() => setActiveCode(activeCode === t.code ? null : t.code)}
              className={`py-1 px-3 rounded-xl border text-xs font-bold cursor-pointer ${t.border}`}
            >
              {lang === 'ar' ? t.labelAr : t.labelEn}
            </button>

            {activeCode === t.code && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--ink)] text-white text-[10px] rounded-lg shadow-lg z-20">
                {lang === 'ar' ? t.descAr : t.descEn}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};