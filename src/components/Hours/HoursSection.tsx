import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HourRow } from './HourRow';
import type { HourData, TagCode } from '../../types';

const HOUR_PERIODS = [
  {
    id: 'morning',
    icon: '🌅',
    labelAr: 'الصبح',
    labelEn: 'Morning',
    keys: ['5am', '6am', '7am', '8am', '9am', '10am', '11am'],
  },
  {
    id: 'noon',
    icon: '☀️',
    labelAr: 'الظهر',
    labelEn: 'Noon',
    keys: ['12pm', '1pm', '2pm', '3pm', '4pm', '5pm'],
  },
  {
    id: 'evening',
    icon: '🌆',
    labelAr: 'المساء',
    labelEn: 'Evening',
    keys: ['6pm', '7pm', '8pm', '9pm', '10pm'],
  },
  {
    id: 'night',
    icon: '🌙',
    labelAr: 'الليل',
    labelEn: 'Night',
    keys: ['11pm', '12am', '1am', '2am', '3am', '4am'],
  },
];

const HOUR_LABELS_AR: Record<string, string> = {
  '5am': '05 ص', '6am': '06 ص', '7am': '07 ص', '8am': '08 ص', '9am': '09 ص', '10am': '10 ص', '11am': '11 ص',
  '12pm': '12 م', '1pm': '01 م', '2pm': '02 م', '3pm': '03 م', '4pm': '04 م', '5pm': '05 م',
  '6pm': '06 م', '7pm': '07 م', '8pm': '08 م', '9pm': '09 م', '10pm': '10 م',
  '11pm': '11 م', '12am': '12 ص', '1am': '01 ص', '2am': '02 ص', '3am': '03 ص', '4am': '04 ص',
};

const HOUR_LABELS_EN: Record<string, string> = {
  '5am': '05 AM', '6am': '06 AM', '7am': '07 AM', '8am': '08 AM', '9am': '09 AM', '10am': '10 AM', '11am': '11 AM',
  '12pm': '12 PM', '1pm': '01 PM', '2pm': '02 PM', '3pm': '03 PM', '4pm': '04 PM', '5pm': '05 PM',
  '6pm': '06 PM', '7pm': '07 PM', '8pm': '08 PM', '9pm': '09 PM', '10pm': '10 PM',
  '11pm': '11 PM', '12am': '12 AM', '1am': '01 AM', '2am': '02 AM', '3am': '03 AM', '4am': '04 AM',
};

export const HoursSection: React.FC = () => {
  const { lang } = useLanguage();
  const [collapsedPeriods, setCollapsedPeriods] = useState<Record<string, boolean>>({});
  const [hoursData, setHoursData] = useState<Record<string, HourData>>({});

  const togglePeriod = (id: string) => {
    setCollapsedPeriods((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTextChange = (key: string, note: string) => {
    setHoursData((prev) => ({
      ...prev,
      [key]: { ...prev[key], note },
    }));
  };

  const handleTagChange = (key: string, tag: TagCode) => {
    setHoursData((prev) => ({
      ...prev,
      [key]: { ...prev[key], tag },
    }));
  };

  const handleCopyDown = (currentKey: string) => {
    const allKeys = HOUR_PERIODS.flatMap((p) => p.keys);
    const currentIndex = allKeys.indexOf(currentKey);
    if (currentIndex !== -1 && currentIndex < allKeys.length - 1) {
      const nextKey = allKeys[currentIndex + 1];
      const currentData = hoursData[currentKey] || { note: '', tag: '' };
      setHoursData((prev) => ({
        ...prev,
        [nextKey]: { ...currentData },
      }));
    }
  };

  // تعبئة ساعات الليل من 12am لـ 4am تلقائياً
  const handleMidnightSleepFill = () => {
    const nightKeys = ['12am', '1am', '2am', '3am', '4am'];
    const updated = { ...hoursData };
    nightKeys.forEach((key) => {
      updated[key] = { note: lang === 'ar' ? 'نوم' : 'Sleep', tag: 'SC' };
    });
    setHoursData(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      {HOUR_PERIODS.map((period) => {
        const isCollapsed = !!collapsedPeriods[period.id];
        const labels = lang === 'ar' ? HOUR_LABELS_AR : HOUR_LABELS_EN;
        const filledCount = period.keys.filter((k) => hoursData[k]?.note?.trim()).length;

        return (
          <div key={period.id} className="border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--card)]">
            <div
              onClick={() => togglePeriod(period.id)}
              className="flex items-center justify-between p-2.5 bg-[var(--teal-tint)]/60 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--teal-dark)]">
                <span>{period.icon}</span>
                <span>{lang === 'ar' ? period.labelAr : period.labelEn}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* زر تعبئة نوم الليل الخاص بـ Night */}
                {period.id === 'night' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMidnightSleepFill();
                    }}
                    className="py-0.5 px-2 bg-[var(--card)] border border-[var(--teal)] text-[var(--teal-dark)] text-[10px] font-bold rounded-lg hover:bg-[var(--teal)] hover:text-white transition-colors cursor-pointer"
                  >
                    🌙 {lang === 'ar' ? 'نوم' : 'Sleep'}
                  </button>
                )}

                <span className="text-[11px] font-bold text-[var(--ink-soft)]">
                  {filledCount}/{period.keys.length}
                </span>
                <span className="text-xs text-[var(--ink-faint)]">{isCollapsed ? '▼' : '▲'}</span>
              </div>
            </div>

            {!isCollapsed && (
              <div className="p-1 flex flex-col">
                {period.keys.map((key) => (
                  <HourRow
                    key={key}
                    hourKey={key}
                    hourLabel={labels[key]}
                    hourData={hoursData[key] || { note: '', tag: '' }}
                    onChangeText={handleTextChange}
                    onChangeTag={handleTagChange}
                    onCopyDown={handleCopyDown}
                    hasNextHour={key !== '4am'}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};