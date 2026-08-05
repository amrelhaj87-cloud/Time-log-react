import type { DayData } from '../types';

export interface DistributionCounts {
  E: number;
  V: number;
  R: number;
  S: number;
  SC: number;
  SL: number;
  unassigned: number;
  empty: number;
}

export interface DistributionResult {
  counts: DistributionCounts;
  totalSlots: number;
  loggedTotal: number;
}

/**
 * حساب توزيع التاقات لليوم الواحد (24 ساعة)
 */
export function calculateDayDistribution(dayData?: DayData): DistributionResult {
  const counts: DistributionCounts = {
    E: 0,
    V: 0,
    R: 0,
    S: 0,
    SC: 0,
    SL: 0,
    unassigned: 0,
    empty: 0,
  };

  if (!dayData || !dayData.hours) {
    return { counts, totalSlots: 24, loggedTotal: 0 };
  }

  let loggedTotal = 0;

  Object.values(dayData.hours).forEach((hour: any) => {
    const noteContent = typeof hour === 'string' ? hour : hour?.note || hour?.text || '';
    const tag = typeof hour === 'string' ? '' : hour?.tag || '';

    if (noteContent.trim() !== '') {
      loggedTotal++;
      if (tag && tag !== '' && tag in counts) {
        const validKey = tag as keyof DistributionCounts;
        counts[validKey] = counts[validKey] + 1;
      } else {
        counts.unassigned = counts.unassigned + 1;
      }
    } else {
      counts.empty = counts.empty + 1;
    }
  });

  return {
    counts,
    totalSlots: 24,
    loggedTotal,
  };
}

/**
 * حساب التجميع والإحصائيات لمجموعة أيام (أسبوع أو شهر)
 */
export function calculateRangeDistribution(days: Record<string, DayData>): DistributionResult {
  const aggregated: DistributionCounts = {
    E: 0,
    V: 0,
    R: 0,
    S: 0,
    SC: 0,
    SL: 0,
    unassigned: 0,
    empty: 0,
  };

  const dayEntries = Object.values(days);
  const totalSlots = dayEntries.length * 24;
  let loggedTotal = 0;

  dayEntries.forEach((dayData) => {
    const dayRes = calculateDayDistribution(dayData);
    loggedTotal += dayRes.loggedTotal;

    const keys: (keyof DistributionCounts)[] = [
      'E',
      'V',
      'R',
      'S',
      'SC',
      'SL',
      'unassigned',
      'empty',
    ];

    keys.forEach((key) => {
      aggregated[key] += dayRes.counts[key];
    });
  });

  return {
    counts: aggregated,
    totalSlots: totalSlots || 24,
    loggedTotal,
  };
}