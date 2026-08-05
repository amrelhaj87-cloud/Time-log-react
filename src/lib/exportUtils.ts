import type { DayData } from '../types';

/**
 * تصدير بيانات الأيام بصيغة JSON كنسخة احتياطية
 */
export function exportToJSON(allDaysData: Record<string, DayData>) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allDaysData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `time-log-backup-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * تصدير البيانات بصيغة CSV لملفات Excel
 */
export function exportToCSV(dayData: DayData, dateStr: string) {
  let csvContent = "data:text/csv;charset=utf-8,Hour,Activity,Tag\n";
  
  if (dayData && dayData.hours) {
    Object.entries(dayData.hours).forEach(([hour, val]: [string, any]) => {
      const note = typeof val === 'string' ? val : val?.note || val?.text || '';
      const tag = typeof val === 'string' ? '' : val?.tag || '';
      csvContent += `${hour}:00,"${note.replace(/"/g, '""')}",${tag}\n`;
    });
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `time-log-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * طباعة التقرير اليومي
 */
export function printReport() {
  window.print();
}