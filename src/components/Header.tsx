import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLiveClock } from '../hooks/useLiveClock';
import { calculateAgeDetails } from '../lib/ageCalculator';

interface HeaderProps {
  currentDate: Date;
  onPickDate: (d: Date) => void;
  isCompact: boolean;
  onToggleCompact: () => void;
  ringFilled: number;
  ringTotal: number;
  onOpenStatsModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAuthModal: () => void;
  user: any;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onPickDate,
  isCompact,
  onToggleCompact,
  ringFilled,
  ringTotal,
  onOpenStatsModal,
  onOpenSettingsModal,
  onOpenAuthModal,
  user,
  onLogout,
}) => {
  const { lang } = useLanguage();
  const liveClockStr = useLiveClock(lang);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // حساب العمر
  const birthDateStr = localStorage.getItem('user_birth_date') || '';
  const ageData = calculateAgeDetails(birthDateStr);
  const ageDisplayOpt = localStorage.getItem('age_display_opt') || 'years';

  const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = lang === 'ar' ? dayNamesAr[currentDate.getDay()] : dayNamesEn[currentDate.getDay()];
  const monthName = lang === 'ar' ? monthNamesAr[currentDate.getMonth()] : monthNamesEn[currentDate.getMonth()];
  const dateStrFormatted = `${dayName}، ${currentDate.getDate()} ${monthName} ${currentDate.getFullYear()}`;

  return (
    <header className="flex flex-col gap-2 mb-3 dir-rtl">
      {/* 1. السطر العلوي: الشعار + زر 0/24 + التاريخ مع الساعة الحية */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold font-serif text-[var(--teal-dark)] tracking-wide">
          {lang === 'ar' ? 'سجل الوقت' : 'Time Log'}
        </h1>

        <div className="flex items-center gap-2">
          {/* زر التوزيع 0/24 الدايري */}
          <button
            onClick={onOpenStatsModal}
            className="flex items-center gap-1.5 py-1 px-3 bg-[var(--card)] border border-[var(--teal)] rounded-full text-xs font-black text-[var(--teal-dark)] shadow-xs hover:bg-[var(--teal-tint)] transition-all cursor-pointer"
            title={lang === 'ar' ? 'توزيع اليوم الكامل 24 ساعة' : '24-Hour Distribution'}
          >
            <span>{ringFilled}/{ringTotal}</span>
            <span className="w-3 h-3 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin-slow"></span>
          </button>

          {/* التاريخ والساعة الحية بنظام 12 ساعة */}
          <div className="relative">
            <button
              onClick={() => {
                const input = document.getElementById('header-date-input');
                if (input) input.click();
              }}
              className="flex items-center gap-2 py-1 px-3 bg-[var(--card)] border border-[var(--line)] rounded-xl text-xs font-extrabold text-[var(--teal-dark)] hover:border-[var(--teal)] cursor-pointer"
            >
              <span>{dateStrFormatted}</span>
              <span className="text-[var(--amber)] font-black">{liveClockStr}</span>
              <span className="text-[10px] text-[var(--ink-faint)]">▼</span>
            </button>
            <input
              id="header-date-input"
              type="date"
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              value={currentDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) onPickDate(new Date(e.target.value + 'T00:00:00'));
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. السطر الثاني: شريط العمر + زر العرض المدمج + القائمة المدمجة (دخول + إعدادات) */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        {/* شريط شارة العمر إذا تم إدخال الميلاد */}
        {ageData ? (
          <div className="py-1 px-3 bg-[var(--rose-tint)] border border-[var(--rose)] rounded-full text-xs font-bold text-[var(--rose)] flex items-center gap-1">
            <span className="text-[10px] text-[var(--ink-soft)]">
              {ageDisplayOpt === 'days'
                ? lang === 'ar' ? 'العمر بالأيام' : 'Age in days'
                : lang === 'ar' ? 'العمر بالسنين' : 'Age in years'}
            </span>
            <span className="font-black text-[var(--teal-dark)]">
              {ageDisplayOpt === 'days'
                ? ageData.totalDaysLived.toLocaleString()
                : (ageData.totalDaysLived / 365.25).toFixed(1)}
            </span>
            <span className="text-[10px] text-[var(--ink-soft)]">
              {ageDisplayOpt === 'days' ? (lang === 'ar' ? 'يوم' : 'd') : (lang === 'ar' ? 'سنة' : 'y')}
            </span>
          </div>
        ) : <div />}

        <div className="flex items-center gap-2">
          {/* زر العرض المدمج / التفصيلي */}
          <button
            onClick={onToggleCompact}
            className="flex items-center gap-1 py-1 px-2.5 bg-[var(--card)] border border-[var(--line)] rounded-xl text-xs font-bold text-[var(--ink)] hover:border-[var(--teal)] cursor-pointer"
          >
            <span>{isCompact ? '▲' : '▼'}</span>
            <span>{isCompact ? (lang === 'ar' ? 'عرض مدمج' : 'Compact View') : (lang === 'ar' ? 'عرض تفصيلي' : 'Detailed View')}</span>
          </button>

          {/* القائمة المدمجة لـ (تسجيل الدخول / الحساب + الإعدادات) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 py-1 px-3 bg-[var(--teal-tint)] border border-[var(--teal)] rounded-xl text-xs font-bold text-[var(--teal-dark)] hover:bg-[var(--teal)] hover:text-white transition-colors cursor-pointer"
            >
              <span>🔑</span>
              <span>{user ? (user.displayName || user.email.split('@')[0]) : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign in')}</span>
              <span className="text-[9px]">▼</span>
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 mt-1 w-44 bg-[var(--card)] border border-[var(--line)] rounded-xl shadow-xl z-50 p-1 flex flex-col gap-1 text-xs font-bold">
                {!user ? (
                  <button
                    onClick={() => { setIsMenuOpen(false); onOpenAuthModal(); }}
                    className="w-full text-right p-2 rounded-lg hover:bg-[var(--teal-tint)] text-[var(--teal-dark)] flex items-center justify-between cursor-pointer"
                  >
                    <span>🔑 {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsMenuOpen(false); onLogout(); }}
                    className="w-full text-right p-2 rounded-lg hover:bg-[var(--rose-tint)] text-[var(--rose)] flex items-center justify-between cursor-pointer"
                  >
                    <span>🚪 {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                  </button>
                )}

                <div className="h-px bg-[var(--line)] my-0.5"></div>

                <button
                  onClick={() => { setIsMenuOpen(false); onOpenSettingsModal(); }}
                  className="w-full text-right p-2 rounded-lg hover:bg-[var(--teal-tint)] text-[var(--ink)] flex items-center justify-between cursor-pointer"
                >
                  <span>⚙️ {lang === 'ar' ? 'الإعدادات والدعم' : 'Settings'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};