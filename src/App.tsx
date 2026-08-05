import React, { useState } from 'react';
import { useTimer } from './hooks/useTimer';
import { TimerBar } from './components/Hours/TimerBar';
import { TimerModal } from './components/Modals/TimerModal';
import { PrioritiesSection } from './components/Priorities/PrioritiesSection';
// استيراد بقية المكونات والـ Context الموجودة عندك...

export function App() {
  // 1. استدعاء التايمر
  const {
    isRunning,
    formattedElapsed,
    startTimer,
    stopTimer,
    cancelTimer,
  } = useTimer();

  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [pendingTimeRange, setPendingTimeRange] = useState<{ start: Date; end: Date } | null>(null);

  // 2. معالجة إيقاف التايمر وفتح المودال
  const handleStopTimer = () => {
    const range = stopTimer();
    if (range) {
      setPendingTimeRange(range);
      setIsTimerModalOpen(true);
    }
  };

  // 3. حفظ النشاط من المودال للساعات
  const handleSaveTimerActivity = (text: string, start: Date, end: Date) => {
    // هنا بتضيف المنطق الخاص بوضع النص داخل الساعات المناسبة
    console.log('Activity saved:', text, start, end);
  };

  return (
    <div className="wrap max-w-[860px] mx-auto p-3">
      {/* 1. قسم الساعات ويحتوي على TimerBar */}
      <section className="card">
        <TimerBar
          isRunning={isRunning}
          formattedElapsed={formattedElapsed}
          onStart={startTimer}
          onStop={handleStopTimer}
          onCancel={cancelTimer}
        />
        
        {/* HoursList بيجي هنا */}
      </section>

      {/* 2. قسم الأولويات والهدف الذهبي */}
      <PrioritiesSection
        goldenGoal={/* من الـ state عندك */}
        quadrants={/* من الـ state عندك */}
        onUpdateGoldenGoal={/* function */}
        onClearGoldenGoal={/* function */}
        onChangePriority={/* function */}
        onAddPriority={/* function */}
        onDeletePriority={/* function */}
        onPromoteToGolden={/* function */}
        onRollover={/* function */}
      />

      {/* 3. مودال التايمر */}
      <TimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        timeRange={pendingTimeRange}
        onSave={handleSaveTimerActivity}
      />
    </div>
  );
}