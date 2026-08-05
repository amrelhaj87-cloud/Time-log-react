import { useMemo } from 'react';
import { calculateDayDistribution, calculateRangeDistribution } from '../lib/distribution';
import type { DayData } from '../types';

export function useDistribution(currentDate: Date) {
  return useMemo(() => {
    const todayStr = currentDate.toISOString().split('T')[0];
    
    // 1. إحصائيات اليوم
    const savedToday = localStorage.getItem(`day:${todayStr}`);
    const todayData: DayData | undefined = savedToday ? JSON.parse(savedToday) : undefined;
    const dayStats = calculateDayDistribution(todayData);

    // دالة مساعدة لجلب أيام متتالية
    const getDaysData = (startDate: Date, daysCount: number) => {
      const data: Record<string, DayData> = {};
      for (let i = 0; i < daysCount; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        const saved = localStorage.getItem(`day:${dStr}`);
        if (saved) data[dStr] = JSON.parse(saved);
      }
      return data;
    };

    // 2. إحصائيات الأسبوع (من الإثنين للأحد)
    const dayOfWeek = currentDate.getDay();
    const diffToMonday = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(currentDate);
    weekStart.setDate(diffToMonday);
    const weekData = getDaysData(weekStart, 7);
    const weekStats = calculateRangeDistribution(weekData);

    // 3. إحصائيات الشهر
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const monthData = getDaysData(monthStart, daysInMonth);
    const monthStats = calculateRangeDistribution(monthData);

    return { dayStats, weekStats, monthStats, daysInMonth };
  }, [currentDate]);
}