import { useState, useEffect, useCallback } from "react";
import type { DayData, HourKey, TagCode } from "../types";
import { createEmptyDayData, getMonday, toISODate } from "../lib/utils";
import { HOURS } from "../lib/constants";

export function useAppData() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedWeek, setSelectedWeek] = useState<Date>(() => getMonday(new Date()));
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [daysByDate, setDaysByDate] = useState<Record<string, DayData>>({});

  const isoKey = toISODate(currentDate);

  // Load from localStorage on date change
  useEffect(() => {
    const saved = localStorage.getItem(`day:${isoKey}`);
    if (saved) {
      try {
        setDaysByDate((prev) => ({ ...prev, [isoKey]: JSON.parse(saved) }));
      } catch (e) {
        console.error("Error reading localStorage:", e);
      }
    } else {
      setDaysByDate((prev) => {
        if (prev[isoKey]) return prev;
        return { ...prev, [isoKey]: createEmptyDayData() };
      });
    }
  }, [isoKey]);

  const currentDayData = daysByDate[isoKey] || createEmptyDayData();

  // Update hour note & tag
  const updateHour = useCallback(
    (hourKey: HourKey, tag: TagCode, note: string) => {
      setSaveStatus("saving");
      setDaysByDate((prev) => {
        const day = prev[isoKey] || createEmptyDayData();
        const updatedDay: DayData = {
          ...day,
          hours: {
            ...day.hours,
            [hourKey]: { tag, note },
          },
        };
        localStorage.setItem(`day:${isoKey}`, JSON.stringify(updatedDay));
        return { ...prev, [isoKey]: updatedDay };
      });

      setTimeout(() => setSaveStatus("saved"), 300);
      setTimeout(() => setSaveStatus("idle"), 1500);
    },
    [isoKey]
  );

  // Copy current hour note and tag to the next hour
  const copyToNextHour = useCallback(
    (currentHourKey: HourKey) => {
      const idx = HOURS.indexOf(currentHourKey);
      if (idx === -1 || idx >= HOURS.length - 1) return;
      const nextHourKey = HOURS[idx + 1];

      const day = daysByDate[isoKey] || createEmptyDayData();
      const currentSlot = day.hours[currentHourKey];
      if (!currentSlot) return;

      updateHour(nextHourKey, currentSlot.tag, currentSlot.note);
    },
    [daysByDate, isoKey, updateHour]
  );

  return {
    currentDate,
    setCurrentDate,
    selectedWeek,
    setSelectedWeek,
    isoKey,
    currentDayData,
    updateHour,
    copyToNextHour,
    saveStatus,
  };
}