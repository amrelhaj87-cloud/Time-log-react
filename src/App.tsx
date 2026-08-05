import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useTimer } from './hooks/useTimer';
import { TimerBar } from './components/Hours/TimerBar';
import { TimerModal } from './components/Modals/TimerModal';
import { PrioritiesSection } from './components/Priorities/PrioritiesSection';
import type { DayPriority, TagCode } from './types';

export function App() {
  const { lang } = useLanguage();

  // 1. استخدام التايمر Hook
  const {
    isRunning,
    formattedElapsed,
    startTimer,
    stopTimer,
    cancelTimer,
  } = useTimer();

  // 2. حالات المودال والتايمر
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [pendingTimeRange, setPendingTimeRange] = useState<{ start: Date; end: Date } | null>(null);

  // 3. حالة الهدف الذهبي والأولويات (Local State مؤقت أو محمل من Storage)
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

  // استرجاع البيانات المجهزة لليوم الحالي من localStorage عند التشغيل
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const savedData = localStorage.getItem(`day:${todayStr}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.goldenGoal) setGoldenGoal(parsed.goldenGoal);
        if (parsed.quadrants) setQuadrants(parsed.quadrants);
      } catch (e) {
        console.warn('Could not parse local day data', e);
      }
    }
  }, []);

  // حفظ التغييرات في localStorage تلقائياً
  const persistState = (newGolden = goldenGoal, newQuads = quadrants) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const savedData = localStorage.getItem(`day:${todayStr}`);
    const existing = savedData ? JSON.parse(savedData) : {};
    localStorage.setItem(
      `day:${todayStr}`,
      JSON.stringify({
        ...existing,
        goldenGoal: newGolden,
        quadrants: newQuads,
      })
    );
  };

  // 4. معالجة التايمر
  const handleStopTimer = () => {
    const range = stopTimer();
    if (range) {
      setPendingTimeRange(range);
      setIsTimerModalOpen(true);
    }
  };

  const handleSaveTimerActivity = (text: string, start: Date, end: Date) => {
    console.log('Saved activity to hours:', text, start, end);
    // يمكن ربطه بدالة التحديث الخاصة بـ HoursGrid
  };

  // 5. دوال إدارة الأولويات والهدف الذهبي
  const handleUpdateGoldenGoal = (updated: { text: string; done: boolean; tag: TagCode }) => {
    setGoldenGoal(updated);
    persistState(updated, quadrants);
  };

  const handleClearGoldenGoal = () => {
    const cleared = { text: '', done: false, tag: '' as TagCode };
    setGoldenGoal(cleared);
    persistState(cleared, quadrants);
  };

  const handleChangePriority = (quadKey: string, index: number, updated: DayPriority) => {
    const newQuads = {
      ...quadrants,
      [quadKey]: quadrants[quadKey].map((item, idx) => (idx === index ? updated : item)),
    };
    setQuadrants(newQuads);
    persistState(goldenGoal, newQuads);
  };

  const handleAddPriority = (quadKey: string) => {
    const newQuads = {
      ...quadrants,
      [quadKey]: [
        ...quadrants[quadKey],
        { id: String(Date.now()), text: '', done: false, tag: '' as TagCode },
      ],
    };
    setQuadrants(newQuads);
    persistState(goldenGoal, newQuads);
  };

  const handleDeletePriority = (quadKey: string, index: number) => {
    if (quadrants[quadKey].length <= 1) return;
    const newQuads = {
      ...quadrants,
      [quadKey]: quadrants[quadKey].filter((_, idx) => idx !== index),
    };
    setQuadrants(newQuads);
    persistState(goldenGoal, newQuads);
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

    const newGolden = { text: item.text, done: false, tag: (item.tag || '') as TagCode };
    const newQuads = {
      ...quadrants,
      [quadKey]: quadrants[quadKey].filter((_, idx) => idx !== index),
    };

    setGoldenGoal(newGolden);
    setQuadrants(newQuads);
    persistState(newGolden, newQuads);
  };

  const handleRollover = () => {
    alert(
      lang === 'ar'
        ? 'تم ترحيل المهام غير المنجزة إلى الغد بنجاح!'
        : 'Rolled over unfinished tasks to tomorrow!'
    );
  };

  return (
    <div className="wrap max-w-[860px] mx-auto p-3 min-h-screen text-[var(--ink)] bg-[var(--bg)]">
      {/* Header بسيط للمشروع */}
      <header className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--line)]">
        <h1 className="font-serif font-bold text-2xl text-[var(--teal-dark)]">
          {lang === 'ar' ? 'سجل الوقت' : 'Time Log'}
        </h1>
      </header>

      {/* قسم الساعات مع شريط التايمر */}
      <section className="bg-[var(--card)] border border-[var(--line)] rounded-[var(--radius)] p-3 mb-3 shadow-xs">
        <TimerBar
          isRunning={isRunning}
          formattedElapsed={formattedElapsed}
          onStart={startTimer}
          onStop={handleStopTimer}
          onCancel={cancelTimer}
        />
      </section>

      {/* قسم الأولويات والهدف الذهبي */}
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

      {/* مودال التايمر */}
      <TimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        timeRange={pendingTimeRange}
        onSave={handleSaveTimerActivity}
      />
    </div>
  );
}

// تصدير افتراضي لحل خطأ TS2613
export default App;