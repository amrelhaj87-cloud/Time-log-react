import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { calculateAgeDetails } from '../../lib/ageCalculator';
import { ContactSection } from '../Common/ContactSection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { lang, setLang } = useLanguage();
  const themeContext = useTheme() as any;
  const isDarkMode = themeContext.isDarkMode;

  // دعم التبديل السلس للمظهر
  const handleToggleTheme = () => {
    if (typeof themeContext.toggleDarkMode === 'function') {
      themeContext.toggleDarkMode();
    } else if (typeof themeContext.toggleTheme === 'function') {
      themeContext.toggleTheme();
    } else if (typeof themeContext.setIsDarkMode === 'function') {
      themeContext.setIsDarkMode(!isDarkMode);
    }
  };

  const [birthDate, setBirthDate] = useState<string>(() => {
    return localStorage.getItem('user_birth_date') || '';
  });

  useEffect(() => {
    if (birthDate) {
      localStorage.setItem('user_birth_date', birthDate);
    }
  }, [birthDate]);

  if (!isOpen) return null;

  const ageData = calculateAgeDetails(birthDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs dir-rtl">
      <div className="max-w-[480px] w-full p-4 bg-[var(--card)] rounded-2xl border border-[var(--line)] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--line)]">
          <h3 className="font-bold text-lg text-[var(--teal-dark)] flex items-center gap-2">
            <span>⚙️</span>
            <span>{lang === 'ar' ? 'الإعدادات والدعم الفني' : 'Settings & Support'}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-xl text-[var(--ink-soft)] hover:text-[var(--rose)] cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* 1. تفضيلات الواجهة والمظهر */}
        <div className="mb-4 flex flex-col gap-3 pb-3 border-b border-[var(--line)]">
          <div className="text-xs font-bold text-[var(--teal-dark)]">🎨 {lang === 'ar' ? 'التفضيلات' : 'Preferences'}</div>
          
          <div className="flex justify-between items-center bg-[var(--card)] p-2 rounded-xl border border-[var(--line)] text-xs">
            <span>{lang === 'ar' ? 'اللغة / Language' : 'Language'}</span>
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="py-1 px-3 bg-[var(--teal-tint)] border border-[var(--teal)] text-[var(--teal-dark)] font-bold rounded-lg cursor-pointer"
            >
              {lang === 'ar' ? 'English 🌐' : 'العربية 🌐'}
            </button>
          </div>

          <div className="flex justify-between items-center bg-[var(--card)] p-2 rounded-xl border border-[var(--line)] text-xs">
            <span>{lang === 'ar' ? 'المظهر / Theme' : 'Theme'}</span>
            <button
              onClick={handleToggleTheme}
              className="py-1 px-3 bg-[var(--line)] text-[var(--ink)] font-bold rounded-lg cursor-pointer"
            >
              {isDarkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>

        {/* 2. حاسبة العمر والتأمل */}
        <div className="flex flex-col gap-2 pb-3">
          <div className="text-xs font-bold text-[var(--teal-dark)]">🎂 {lang === 'ar' ? 'حاسبة العمر والتأمل' : 'Age & Life Calculator'}</div>
          <div className="text-[11px] text-[var(--ink-faint)]">
            {lang === 'ar' ? 'أدخل تاريخ ميلادك لحساب عمرك بدقة والأسابيع التي عشتها:' : 'Enter birth date to view your exact age:'}
          </div>
          
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 text-xs rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] outline-none"
          />

          {ageData && (
            <div className="mt-2 p-3 bg-[var(--teal-tint)] border border-[var(--teal)] rounded-xl flex flex-col gap-2 text-xs">
              <div className="font-bold text-[var(--teal-dark)] text-center">
                🎉 {lang === 'ar' ? `عمرك: ${ageData.years} سنة و ${ageData.months} شهر و ${ageData.days} يوم` : `Age: ${ageData.years}y, ${ageData.months}m, ${ageData.days}d`}
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold mt-1">
                <div className="bg-[var(--card)] p-2 rounded-lg border border-[var(--line)]">
                  <div className="text-[var(--ink-faint)]">{lang === 'ar' ? 'إجمالي الأيام' : 'Total Days'}</div>
                  <div className="text-sm font-black text-[var(--teal-dark)]">{ageData.totalDaysLived.toLocaleString()}</div>
                </div>
                <div className="bg-[var(--card)] p-2 rounded-lg border border-[var(--line)]">
                  <div className="text-[var(--ink-faint)]">{lang === 'ar' ? 'إجمالي الأسابيع' : 'Total Weeks'}</div>
                  <div className="text-sm font-black text-[var(--amber)]">{ageData.totalWeeksLived.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. قسم التواصل والدعم الفني (EmailJS) */}
        <ContactSection />
      </div>
    </div>
  );
};