export function createGoogleCalendarUrl(title: string, details?: string): string {
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const textParam = `&text=${encodeURIComponent(title)}`;
  const detailsParam = details ? `&details=${encodeURIComponent(details)}` : '';
  
  // ضبط الوقت الافتراضي لساعة قادمة
  const now = new Date();
  const start = new Date(now.getTime() + 60 * 60 * 1000);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const formatIso = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const datesParam = `&dates=${formatIso(start)}/${formatIso(end)}`;

  return `${baseUrl}${textParam}${detailsParam}${datesParam}`;
}