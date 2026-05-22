/**
 * Simple, robust Date helper functions for calendar grid calculation.
 * All computations use local timezone of the browser.
 */

import { Language } from '../types';

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatMonthYear(date: Date, lang: Language = 'ko'): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  if (lang === 'ja') {
    return `${year}年 ${month}月`;
  }
  if (lang === 'en') {
    const monthsEN = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthsEN[date.getMonth()]} ${year}`;
  }
  return `${year}년 ${month}월`;
}

export function formatDayOfWeek(date: Date, lang: Language = 'ko'): string {
  const daysKO = ['일', '월', '화', '수', '목', '금', '토'];
  const daysJA = ['日', '月', '火', '水', '木', '金', '土'];
  const daysEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (lang === 'ja') return daysJA[date.getDay()];
  if (lang === 'en') return daysEN[date.getDay()];
  return daysKO[date.getDay()];
}

export function formatDayOfWeekFull(date: Date, lang: Language = 'ko'): string {
  const daysKO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const daysJA = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  const daysEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (lang === 'ja') return daysJA[date.getDay()];
  if (lang === 'en') return daysEN[date.getDay()];
  return daysKO[date.getDay()];
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  
  // First day of current month
  const firstDay = new Date(year, month, 1);
  // Last day of current month
  const lastDay = new Date(year, month + 1, 0);
  
  // Backfill from previous month to align with Sunday (0)
  const py = firstDay.getDay(); // 0 is Sunday, 1 is Monday ...
  for (let i = py; i > 0; i--) {
    days.push(new Date(year, month, 1 - i));
  }
  
  // Add all days of current month
  const totalDays = lastDay.getDate();
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }
  
  // Fill remaining days from next month to form standard 6-week view (42 cells)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

export function getDaysInWeek(baseDate: Date): Date[] {
  const days: Date[] = [];
  const currentDay = baseDate.getDay(); // 0-6
  
  // Calculate Sunday of the current week
  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - currentDay);
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push(d);
  }
  
  return days;
}

export function getIsToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

export function getIsSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
}

export function generateHours(): string[] {
  const hours: string[] = [];
  for (let i = 6; i < 24; i++) { // From 6 AM to 11 PM represents active schedule hours
    hours.push(String(i).padStart(2, '0') + ':00');
  }
  return hours;
}

export function generateQuarterHours(): string[] {
  const slots: string[] = [];
  for (let h = 6; h < 24; h++) { // Full active day sequence from 6 AM to midnight
    const hr = String(h).padStart(2, '0');
    for (const m of ['00', '15', '30', '45']) {
      slots.push(`${hr}:${m}`);
    }
  }
  return slots;
}

export function isTimeInSlotRange(timeStr: string | undefined, slotStr: string): boolean {
  if (!timeStr) return false;
  
  const [tH, tM] = timeStr.split(':').map(Number);
  const [sH, sM] = slotStr.split(':').map(Number);
  
  if (isNaN(tH) || isNaN(tM) || isNaN(sH) || isNaN(sM)) return false;
  
  const timeMin = tH * 60 + tM;
  const slotMin = sH * 60 + sM;
  
  // High accuracy match: event starts in this specific 15-minute interval
  return timeMin >= slotMin && timeMin < slotMin + 15;
}
