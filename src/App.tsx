import { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { useTimer } from './hooks/useTimer';
import { useDistribution } from './hooks/useDistribution';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useFirebaseSync } from './hooks/useFirebaseSync';

// المكونات
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { Header } from './components/Header';
import { TagRings } from './components/Dashboard/TagRings';
import { HoursSection } from './components/Hours/HoursSection';
import { TimerBar } from './components/Hours/TimerBar';
import { PrioritiesSection } from './components/Priorities/PrioritiesSection';
import { TimerModal } from './components/Modals/TimerModal';
import { StatsModal } from './components/Modals/StatsModal';
import { AuthModal } from './components/Modals/AuthModal';
import { ExportModal } from './components/Modals/ExportModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { Footer } from './components/Common/Footer';

// الـ Types
import type { DayPriority, TagCode } from './types';

function AppContent() {
  const { lang } = useLanguage();
  const { isDarkMode } = useTheme();

  // 1. حسابات Firebase والمزامنة (Phase 5)
  const {
    user,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    logout,
    resetPassword,
  } = useFirebaseAuth();

  const { syncDayToCloud } = useFirebaseSync(user);

  // 2. التايمر والإحصائيات Hooks
  const {
    isRunning,
    formattedElapsed,
    startTimer,
    stopTimer,
    cancelTimer,
  } = useTimer();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { dayStats, weekStats, monthStats, daysInMonth } = useDistribution(currentDate);

  // 3. حالات المودالات (التايمر + الإحصائيات + Auth + Export + Settings)
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [pendingTimeRange, setPendingTimeRange] = useState<{ start: Date; end: Date } | null>(null);

  // 4. حالة الهدف الذهبي والأولويات
  const [goldenGoal, setGoldenGoal] = useState<{ text: string; done: boolean; tag: TagCode }>({
    text: '',
    done: false,
    tag: '',
  });

  const [quadrants, setQuadrants] = useState<Record<string, DayPriority[]>>({
    q1: [{ id: '1', text: '', done: false, tag: '' }],
    q2: [{ id: '2', text: '', done: false, tag: '' }],
    q3: [{ id: '3', text: '', done: false, tag: '' }],
    q4: [{ id: '4', text: '', done: false, tag: '' }],
  });

  // مزامنة البيانات تلقائياً مع السحاب عند تعديل أي شيء
  const dateStr = currentDate.toISOString().split('T')[0];
  useEffect(() => {
    if (user) {
      setSaveStatus('saving');
      const payload = { goldenGoal, quadrants };
      syncDayToCloud(dateStr, payload)
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('error'));
    }
  }, [goldenGoal, quadrants, currentDate, user, syncDayToCloud, dateStr]);

  // معالجة إيقاف التايمر
  const handleStopTimer = () => {
    const range = stopTimer();
    if (range) {
      setPendingTimeRange(range);
      setIsTimerModalOpen(true);
    }
  };

  const handleSaveTimerActivity = (text: string, start: Date, end: Date) => {
    console.log('Saved activity:', text, start, end);
  };

  // دوال الأولويات والهدف الذهبي
  const handleUpdateGoldenGoal = (updated: { text: string; done: boolean; tag: TagCode }) => {
    setGoldenGoal(updated);
  };

  const handleClearGoldenGoal = () => {
    setGoldenGoal({ text: '', done: false, tag: '' });
  };

  const handleChangePriority = (quadKey: string, index: number, updated: DayPriority) => {
    setQuadrants((prev) => ({
      ...prev,
      [quadKey]: prev[quadKey].map((item, idx) => (idx === index ? updated : item)),
    }));
  };

  const handleAddPriority = (quadKey: string) => {
    setQuadrants((prev) => ({
      ...prev,
      [quadKey]: [
        ...prev[quadKey],
        { id: String(Date.now()), text: '', done: false, tag: '' },
      ],
    }));
  };

  const handleDeletePriority = (quadKey: string, index: number) => {
    if (quadrants[quadKey].length <= 1) return;
    setQuadrants((prev) => ({
      ...prev,
      [quadKey]: prev[quadKey].filter((_, idx) => idx !== index),
    }));
  };

  const handlePromoteToGolden = (quadKey: string, index: number) => {
    const item = quadrants[quadKey][index];
    if (!item || !item.text.trim()) return;

    if (goldenGoal.text.trim() !== '') {
      alert(
        lang === 'ar'
          ? 'الهدف الذهبي غير فارغ! يرجى إفراغه أولاً أو إنجازه.'
          : 'Golden Goal is not empty! Please clear it first.'
      );
      return;
    }

    setGoldenGoal({ text: item.text, done: false, tag: (item.tag || '') as TagCode });
    handleDeletePriority(quadKey, index);
  };

  const handleRollover = () => {
    alert(
      lang === 'ar'
        ? 'تم ترحيل المهام غير المنجزة إلى الغد بنجاح!'
        : 'Rolled over unfinished tasks to tomorrow!'
    );
  };

  return (
    <div className={`wrap max-w-[860px] mx-auto p-2 sm:p-4 min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 1. الشريط العلوي للحسابات والأدوات الإضافية (Auth + Export + Settings) */}
      <div className="flex justify-between items-center mb-2 px-1 text-xs gap-2">
        {user ? (
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="font-bold text-[var(--teal-dark)] truncate">
              {user.displayName || user.email}
            </span>
            <button
              onClick={logout}
              className="text-[10px] text-[var(--rose)] hover:underline cursor-pointer shrink-0"
            >
              ({lang === 'ar' ? 'خروج' : 'Logout'})
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--teal-tint)] border border-[var(--teal)] text-[var(--teal-dark)] font-bold text-[11px] hover:bg-[var(--teal)] hover:text-white transition-colors cursor-pointer"
          >
            <span>🔑</span>
            <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign in'}</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] font-bold text-[11px] hover:border-[var(--teal)] transition-colors cursor-pointer"
          >
            <span>✨</span>
            <span className="hidden sm:inline">{lang === 'ar' ? 'التحليل والتصدير' : 'AI & Export'}</span>
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] font-bold text-[11px] hover:border-[var(--teal)] transition-colors cursor-pointer"
            title={lang === 'ar' ? 'الإعدادات وحاسبة العمر' : 'Settings & Age Calculator'}
          >
            <span>⚙️</span>
          </button>
        </div>
      </div>

      {/* 2. الهيدر الرئيسي */}
      <Header
        currentDate={currentDate}
        onPickDate={setCurrentDate}
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact(!isCompact)}
        saveStatus={saveStatus}
        ringFilled={dayStats.loggedTotal}
        ringTotal={dayStats.totalSlots}
      />

      {/* 3. حلقات التاقات (Phase 4) */}
      {!isCompact && (
        <div className="mb-3">
          <TagRings
            counts={dayStats.counts}
            totalSlots={dayStats.totalSlots}
            onClick={() => setIsStatsModalOpen(true)}
          />
        </div>
      )}

      {/* 4. قسم الساعات + التايمر (Phase 2 & 3) */}
      <section className="bg-[var(--card)] border border-[var(--line)] rounded-[var(--radius)] p-2.5 sm:p-3 mb-3 shadow-xs">
        <TimerBar
          isRunning={isRunning}
          formattedElapsed={formattedElapsed}
          onStart={startTimer}
          onStop={handleStopTimer}
          onCancel={cancelTimer}
        />

        <HoursSection />
      </section>

      {/* 5. قسم الأولويات والهدف الذهبي (Phase 3) */}
      <PrioritiesSection
        goldenGoal={goldenGoal}
        quadrants={quadrants}
        onUpdateGoldenGoal={handleUpdateGoldenGoal}
        onClearGoldenGoal={handleClearGoldenGoal}
        onChangePriority={handleChangePriority}
        onAddPriority={handleAddPriority}
        onDeletePriority={handleDeletePriority}
        onPromoteToGolden={handlePromoteToGolden}
        onRollover={handleRollover}
      />

      {/* 6. الفوتر */}
      <Footer />

      {/* 7. المودالات الكاملة */}
      <TimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        timeRange={pendingTimeRange}
        onSave={handleSaveTimerActivity}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        weekStats={weekStats}
        monthStats={monthStats}
        daysInMonth={daysInMonth}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGoogleLogin={loginWithGoogle}
        onEmailLogin={loginWithEmail}
        onEmailSignUp={signUpWithEmail}
        onResetPassword={resetPassword}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentDateStr={dateStr}
        currentDayData={undefined}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;