import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { exportToJSON, exportToCSV, printReport } from '../../lib/exportUtils';
import type { DayData, HourKey, HourData } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDateStr: string;
  currentDayData?: DayData;
}

const ALL_HOUR_KEYS: HourKey[] = [
  '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm',
  '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm',
  '9pm', '10pm', '11pm', '12am', '1am', '2am', '3am', '4am'
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currentDateStr,
  currentDayData,
}) => {
  const { lang } = useLanguage();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!isOpen) return null;

  const generateAiSummary = () => {
    setLoadingAi(true);
    setTimeout(() => {
      let loggedCount = 0;
      const tagsCount: Record<string, number> = {};

      if (currentDayData && currentDayData.hours) {
        Object.values(currentDayData.hours).forEach((h: any) => {
          const note = typeof h === 'string' ? h : h?.note || h?.text || '';
          const tag = typeof h === 'string' ? '' : h?.tag || '';
          if (note.trim()) {
            loggedCount++;
            if (tag) tagsCount[tag] = (tagsCount[tag] || 0) + 1;
          }
        });
      }

      if (loggedCount === 0) {
        setAiSummary(
          lang === 'ar'
            ? 'لم تقم بتسجيل أي ساعات لهذا اليوم بعد. ابدأ بتسجيل مهامك لتحصل على تحليل دقيق!'
            : 'No hours logged for today yet. Start logging to get an AI summary!'
        );
      } else {
        const topTag = Object.entries(tagsCount).sort((a, b) => b[1] - a[1])[0];
        setAiSummary(
          lang === 'ar'
            ? `📊 ملخص يومي ذكي:\n- لقد سجلت ${loggedCount} ساعة نشطة اليوم.\n- أكثر فئة استهلكت وقتك هي (${topTag ? topTag[0] : 'متنوع'}).\n- استمر في المحافظة على التوازن بين العمل والتعافي!`
            : `📊 Smart Daily Summary:\n- You logged ${loggedCount} active hours today.\n- Top category: (${topTag ? topTag[0] : 'Various'}).\n- Keep up the great balance!`
        );
      }
      setLoadingAi(false);
    }, 800);
  };

  const handleExportAllJSON = () => {
    const allData: Record<string, DayData> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('day:')) {
        const val = localStorage.getItem(key);
        if (val) allData[key.replace('day:', '')] = JSON.parse(val);
      }
    }
    exportToJSON(allData);
  };

  // إنشاء كائن افتراضي مطابق تماماً لـ DayData Type
  const emptyHours = ALL_HOUR_KEYS.reduce((acc, key) => {
    acc[key] = { note: '', tag: '' };
    return acc;
  }, {} as Record<HourKey, HourData>);

  const defaultDayData: DayData = {
    date: currentDateStr,
    hours: emptyHours,
    priorities: [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs dir-rtl">
      <div className="max-w-[480px] w-full p-4 bg-[var(--card)] rounded-2xl border border-[var(--line)] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--line)]">
          <h3 className="font-bold text-lg text-[var(--teal-dark)] flex items-center gap-2">
            <span>✨</span>
            <span>{lang === 'ar' ? 'الملخص الذكي والتصدير' : 'AI Summary & Export'}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-xl text-[var(--ink-soft)] hover:text-[var(--rose)] cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* قسم الملخص الذكي */}
        <div className="mb-4 p-3 bg-[var(--teal-tint)] border border-[var(--teal)] rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[var(--teal-dark)]">
              {lang === 'ar' ? '🤖 التحليل الذكي ليومك' : '🤖 AI Daily Insights'}
            </span>
            <button
              onClick={generateAiSummary}
              disabled={loadingAi}
              className="py-1 px-3 bg-[var(--teal)] text-white text-[11px] font-bold rounded-lg hover:bg-[var(--teal-dark)] cursor-pointer disabled:opacity-50"
            >
              {loadingAi
                ? lang === 'ar'
                  ? 'جاري التحليل...'
                  : 'Analyzing...'
                : lang === 'ar'
                ? 'توليد الملخص'
                : 'Generate'}
            </button>
          </div>
          {aiSummary && (
            <div className="text-xs text-[var(--ink)] whitespace-pre-line leading-relaxed bg-[var(--card)] p-2.5 rounded-lg border border-[var(--line)]">
              {aiSummary}
            </div>
          )}
        </div>

        {/* قسم خيارات التصدير */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--line)]">
          <div className="text-xs font-bold text-[var(--teal-dark)] mb-1">
            📤 {lang === 'ar' ? 'خيارات التصدير والطباعة' : 'Export & Print Options'}
          </div>

          <button
            onClick={() => exportToCSV(currentDayData || defaultDayData, currentDateStr)}
            className="w-full py-2 px-3 flex items-center justify-between bg-[var(--card)] border border-[var(--line)] rounded-xl text-xs font-bold text-[var(--ink)] hover:bg-[var(--line)]/30 cursor-pointer"
          >
            <span>📊 {lang === 'ar' ? 'تصدير يومي بصيغة CSV (Excel)' : 'Export Day as CSV'}</span>
            <span className="text-[10px] text-[var(--ink-faint)]">.csv</span>
          </button>

          <button
            onClick={handleExportAllJSON}
            className="w-full py-2 px-3 flex items-center justify-between bg-[var(--card)] border border-[var(--line)] rounded-xl text-xs font-bold text-[var(--ink)] hover:bg-[var(--line)]/30 cursor-pointer"
          >
            <span>💾 {lang === 'ar' ? 'تصدير نسخة احتياطية كاملة' : 'Export Full Backup (JSON)'}</span>
            <span className="text-[10px] text-[var(--ink-faint)]">.json</span>
          </button>

          <button
            onClick={printReport}
            className="w-full py-2 px-3 flex items-center justify-between bg-[var(--card)] border border-[var(--line)] rounded-xl text-xs font-bold text-[var(--ink)] hover:bg-[var(--line)]/30 cursor-pointer"
          >
            <span>🖨️ {lang === 'ar' ? 'طباعة التقرير اليومي / PDF' : 'Print / PDF Report'}</span>
            <span className="text-[10px] text-[var(--ink-faint)]">Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};