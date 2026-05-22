export type Priority = 'low' | 'medium' | 'high';
export type TrackingColor = string; // Support preset names or custom hex codes
export type Language = 'ko' | 'ja' | 'en';
export type TimeFormat = '12h' | '24h';
export type FontSize = 'sm' | 'md' | 'lg';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  timeStart?: string; // HH:MM
  timeEnd?: string; // HH:MM
  priority: Priority;
  tags: string[];
  color?: TrackingColor;
  category?: string; // Custom written-in category
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  tags: string[];
  dueDate?: string; // YYYY-MM-DD (optional connection to calendar)
}

export type ViewType = 'month' | 'week' | 'day';
export type ThemeMode = 'butter' | 'basic';

