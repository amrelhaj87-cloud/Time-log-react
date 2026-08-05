import { useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { useTimer } from './hooks/useTimer';
import { useDistribution } from './hooks/useDistribution';

// المكونات
import { Header } from './components/Header';
import { TagRings } from './components/Dashboard/TagRings';
import { HoursSection } from './components/Hours/HoursSection';
import { TimerBar } from './components/Hours/TimerBar';
import { PrioritiesSection } from './components/Priorities/PrioritiesSection';
import { TimerModal } from './components/Modals/TimerModal';
import { StatsModal } from './components/Modals/StatsModal';
import { Footer } from './components/Common/Footer';

// الـ Types
import type { DayPriority, TagCode } from './types';

export function App() {
  const { lang } = useLanguage();
  const { isDarkMode } = useTheme();

  // 1. التايمر والإحصائيات Hooks
  const {
    isRunning,
    formattedElapsed,
    startTimer,
    stopTimer,
    cancelTimer,
  } = useTimer();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [saveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { dayStats, weekStats, monthStats, daysInMonth } = useDistribution(currentDate);

  // 2. حالات المودالات (التايمر والإحصائيات)
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [pendingTimeRange, setPendingTimeRange] = useState<{ start: Date; end: Date } | null>(null);

  // 3. حالة الهدف الذهبي والأولويات
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
    <div className={`wrap max-w-[860px] mx-auto p-3 min-h-screen ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 1. الهيدر الرئيسي */}
      <Header
        currentDate={currentDate}
        onPickDate={setCurrentDate}
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact(!isCompact)}
        saveStatus={saveStatus}
        ringFilled={dayStats.loggedTotal}
        ringTotal={dayStats.totalSlots}
      />

      {/* 2. حلقات التاقات (Phase 4) */}
      {!isCompact && (
        <div className="mb-3">
          <TagRings
            counts={dayStats.counts}
            totalSlots={dayStats.totalSlots}
            onClick={() => setIsStatsModalOpen(true)}
          />
        </div>
      )}

      {/* 3. قسم الساعات + التايمر (Phase 2 & 3) */}
      <section className="bg-[var(--card)] border border-[var(--line)] rounded-[var(--radius)] p-3 mb-3 shadow-xs">
        <TimerBar
          isRunning={isRunning}
          formattedElapsed={formattedElapsed}
          onStart={startTimer}
          onStop={handleStopTimer}
          onCancel={cancelTimer}
        />

        <HoursSection />
      </section>

      {/* 4. قسم الأولويات والهدف الذهبي (Phase 3) */}
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

      {/* 5. الفوتر */}
      <Footer />

      {/* 6. المودالات (التايمر + الإحصائيات) */}
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
    </div>
  );
}

export default App;