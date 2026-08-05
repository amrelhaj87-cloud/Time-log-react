export interface AgeDetails {
  years: number;
  months: number;
  days: number;
  totalWeeksLived: number;
  totalDaysLived: number;
}

export function calculateAgeDetails(birthDateStr: string): AgeDetails | null {
  if (!birthDateStr) return null;

  const birth = new Date(birthDateStr);
  const now = new Date();

  if (isNaN(birth.getTime()) || birth > now) return null;

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffTime = Math.abs(now.getTime() - birth.getTime());
  const totalDaysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeksLived = Math.floor(totalDaysLived / 7);

  return {
    years,
    months,
    days,
    totalWeeksLived,
    totalDaysLived,
  };
}