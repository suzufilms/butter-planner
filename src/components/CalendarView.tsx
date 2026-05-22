import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ScheduleEvent, ViewType, Priority, Language, ThemeMode } from '../types';
import { getDynamicColorStyles } from '../utils/colorUtils';
import {
  formatDate,
  formatDayOfWeek,
  formatDayOfWeekFull,
  getDaysInMonth,
  getDaysInWeek,
  getIsToday,
  getIsSameDay,
} from '../utils/dateUtils';

interface CalendarViewProps {
  currentDate: Date;
  viewType: ViewType;
  events: ScheduleEvent[];
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: ScheduleEvent) => void;
  onAddEventClick: (dateStr: string) => void;
  language: Language;
  theme?: ThemeMode;
}

export default function CalendarView({
  currentDate,
  viewType,
  events,
  onDateSelect,
  onEventSelect,
  onAddEventClick,
  language = 'ko',
  theme = 'butter'
}: CalendarViewProps) {
  const isButter = theme === 'butter';

  // Priority color map for visual accents: aligning with current chosen theme
  const priorityStyles = isButter
    ? {
        low: {
          bg: 'bg-[#FFFDF4]/95 hover:bg-[#FAF5EA] border-[#F4E5D1]/80 shadow-3xs text-[#7A6031]',
          text: 'text-[#7A6031]',
          dot: 'bg-[#CCBA95]',
          badge: 'bg-[#FFFDF4] text-[#7A6031] border-[#F4E5D1]'
        },
        medium: {
          bg: 'bg-[#FEF9EA] hover:bg-[#FDF2D5] border-[#F2C553]/25 shadow-3xs text-[#5C4D2E]',
          text: 'text-[#5C4D2E]',
          dot: 'bg-[#F2C553]',
          badge: 'bg-[#FEF9EA] text-[#5C4D2E] border-[#F2C553]/40'
        },
        high: {
          bg: 'bg-[#5C4D2E] hover:bg-[#4C3F24] border-[#5C4D2E] text-[#FFFDF6] shadow-3xs',
          text: 'text-[#FFFDF6]',
          dot: 'bg-[#F6D375]',
          badge: 'bg-[#5C4D2E] text-[#FFFDF6] border-[#5C4D2E]'
        }
      }
    : {
        low: {
          bg: 'bg-neutral-50/90 hover:bg-[#F2F2F7] border-neutral-200/60 shadow-3xs text-neutral-600',
          text: 'text-neutral-600',
          dot: 'bg-neutral-400',
          badge: 'bg-neutral-50 text-neutral-600 border border-neutral-200'
        },
        medium: {
          bg: 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 shadow-3xs text-neutral-800',
          text: 'text-neutral-800',
          dot: 'bg-neutral-400',
          badge: 'bg-neutral-100 text-neutral-800 border border-neutral-200'
        },
        high: {
          bg: 'bg-[#262626] hover:bg-[#404040] border-[#262626] text-white shadow-3xs',
          text: 'text-white',
          dot: 'bg-white',
          badge: 'bg-[#262626] text-white border border-[#262626]'
        }
      };

  // Helper inside month rendering to retrieve events on specific day
  const getEventsForDate = (date: Date): ScheduleEvent[] => {
    const formattedDate = formatDate(date);
    return events
      .filter((e) => e.date === formattedDate)
      .sort((a, b) => {
        const timeA = a.timeStart || '00:00';
        const timeB = b.timeStart || '00:00';
        return timeA.localeCompare(timeB);
      });
  };

  // -- 1. Render Monthly Calendar View --
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = getDaysInMonth(year, month);
    const weekdays = language === 'ja'
      ? ['日', '月', '火', '水', '木', '金', '土']
      : language === 'en'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['일', '월', '화', '수', '목', '금', '토'];

    const headersClass = isButter
      ? "grid grid-cols-7 border-b border-[#FFFDF8] bg-white rounded-t-xl overflow-hidden"
      : "grid grid-cols-7 border-b border-neutral-200/40 bg-[#FAFAFA]/70 rounded-t-xl overflow-hidden";

    const weekdayTextClass = isButter ? "text-[#615A4C]" : "text-neutral-500";

    const containerGridBgClass = isButter ? "bg-[#FFFDF8] gap-[1px]" : "bg-neutral-200/35 gap-[1px]";

    const selectedDayBgClass = isButter ? "bg-[#FFFDF8]/55" : "bg-neutral-100/70";

    return (
      <div className="flex flex-col h-full">
        {/* Weekday headers */}
        <div className={headersClass}>
          {weekdays.map((day, idx) => (
            <div
              key={idx}
              className={`py-3 text-center text-[12px] font-bold tracking-tight ${
                idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : weekdayTextClass
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className={`grid grid-cols-7 flex-1 min-h-[420px] ${containerGridBgClass}`}>
          {days.map((day, index) => {
            const isToday = getIsToday(day);
            const isCurrentMonth = day.getMonth() === month && day.getFullYear() === year;
            const dayEvents = getEventsForDate(day);
            const isSelected = getIsSameDay(day, currentDate);

            const textMonthClass = !isCurrentMonth 
              ? 'text-neutral-300 bg-neutral-50/25' 
              : (isButter ? 'text-[#61533F]' : 'text-[#1B1B1F]');

            const selectionBgClass = isSelected ? selectedDayBgClass : '';

            // Today circle styling
            const todayCircleClass = isToday
               ? (isButter 
                 ? 'bg-[#FFFDF4] text-[#61533F] border border-neutral-250 font-extrabold scale-105 shadow-3xs' 
                 : 'bg-[#262626] text-white font-extrabold scale-105 shadow-3xs')
               : isSelected
               ? (isButter 
                 ? 'bg-[#FFFDF4] text-[#61533F] border border-neutral-200 font-extrabold' 
                 : 'bg-neutral-200 text-neutral-900 border border-neutral-350 font-extrabold')
               : '';

            return (
              <div
                key={index}
                onClick={() => onDateSelect(day)}
                className={`flex flex-col bg-white p-2 min-h-[90px] xl:min-h-[110px] transition-all relative group cursor-pointer ${textMonthClass} ${selectionBgClass}`}
                id={`month-cell-${formatDate(day)}`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[11.5px] font-bold w-6 h-6 flex items-center justify-center rounded-full transition-transform ${todayCircleClass}`}
                  >
                    {day.getDate()}
                  </span>

                  {/* Desktop Quick Add Plus Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateSelect(day);
                      onAddEventClick(formatDate(day));
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-all cursor-pointer"
                    title={language === 'ja' ? '予定追加' : language === 'en' ? 'Add Event' : '일정 추가'}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Day Events Stack */}
                <div className="flex-1 space-y-1 overflow-y-auto pr-0.5 max-h-[75px] scrollbar-none">
                  {dayEvents.slice(0, 3).map((event) => {
                    const dynColor = getDynamicColorStyles(event.color, isButter);
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventSelect(event);
                        }}
                        style={{
                          backgroundColor: dynColor.bg,
                          borderColor: dynColor.border,
                          color: dynColor.text
                        }}
                        className="px-1.5 py-0.5 text-[10.5px] font-bold rounded-md border leading-tight truncate transition-transform hover:scale-102 cursor-pointer"
                        title={`${event.timeStart || ''} ${event.title}`}
                        id={`event-pill-${event.id}`}
                      >
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dynColor.dot }} />
                          {event.timeStart && <span className="opacity-75 font-normal text-[8.5px]">{event.timeStart}</span>}
                          {event.category && <span className="opacity-80 font-black text-[9px] truncate">[{event.category}]</span>}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    );
                  })}

                  {dayEvents.length > 3 && (
                    <div className={`text-[9.5px] font-extrabold pl-1 ml-0.5 ${isButter ? 'text-[#998B71]' : 'text-neutral-400'}`}>
                      {language === 'ja' 
                        ? `他 ${dayEvents.length - 3}件` 
                        : language === 'en' 
                        ? `+ ${dayEvents.length - 3} more` 
                        : `+ ${dayEvents.length - 3}개 더보기`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // -- 2. Render Weekly View --
  const renderWeekView = () => {
    const days = getDaysInWeek(currentDate);

    const labelsMap = {
      ko: { noEvents: '일정 없음', addEvent: '일정 추가' },
      ja: { noEvents: '予定なし', addEvent: '予定追加' },
      en: { noEvents: 'No events', addEvent: 'Add event' }
    };

    const containerBorderClass = isButter
      ? "flex flex-col h-full overflow-hidden bg-white rounded-3xl border border-[#F4E5D1]/30"
      : "flex flex-col h-full overflow-hidden bg-white rounded-3xl border border-neutral-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.015)]";

    const weekdayBgClass = isButter
      ? "grid grid-cols-7 border-b border-[#F4E5D1]/30 bg-[#FFFDF6]/50 divide-x divide-[#F4E5D1]/20"
      : "grid grid-cols-7 border-b border-neutral-200/40 bg-[#FAFAFA] divide-x divide-neutral-200/35";

    const labelHeaderTextColor = isButter ? "text-[#998B71]" : "text-neutral-400";

    const gridDivisionClass = isButter
      ? "grid grid-cols-7 flex-1 min-h-0 divide-x divide-[#F4E5D1]/20 bg-neutral-50/10"
      : "grid grid-cols-7 flex-1 min-h-0 divide-x divide-neutral-200/35 bg-neutral-50/10";

    return (
      <div className={containerBorderClass}>
        {/* Header containing days of the week */}
        <div className={weekdayBgClass}>
          {days.map((day, idx) => {
            const isToday = getIsToday(day);
            const isSelected = getIsSameDay(day, currentDate);

            const textNumStyle = isToday
              ? (isButter 
                ? 'bg-[#FFFDF4] text-[#61533F] border border-neutral-250 font-extrabold ring-2 ring-neutral-200 shadow-3xs' 
                : 'bg-[#262626] text-white font-extrabold ring-2 ring-neutral-200/40 shadow-3xs')
              : isSelected
              ? (isButter 
                ? 'bg-[#FFFDF4] text-[#61533F] border border-neutral-200 font-bold' 
                : 'bg-neutral-200 text-neutral-900 border border-neutral-350 font-bold')
              : (isButter ? 'text-[#61533F]' : 'text-[#1B1B1F]');

            return (
              <div
                key={idx}
                onClick={() => onDateSelect(day)}
                className={`py-3 text-center cursor-pointer transition ${
                  isSelected 
                    ? (isButter ? 'bg-[#FFFDF8] border border-[#FFFDF8]' : 'bg-neutral-100') 
                    : 'hover:bg-neutral-50/50'
                }`}
                id={`week-col-head-${formatDate(day)}`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${labelHeaderTextColor}`}>
                  {formatDayOfWeek(day, language)}
                </p>
                <p className={`text-[15px] font-extrabold inline-flex items-center justify-center w-8 h-8 rounded-full ${textNumStyle}`}>
                  {day.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* 7 Columns Stack */}
        <div className={gridDivisionClass}>
          {days.map((day, colIdx) => {
            const dayEvents = getEventsForDate(day);
            const isSelected = getIsSameDay(day, currentDate);
            const selectedColBg = isSelected 
              ? (isButter ? 'bg-[#FFFDF8]/50' : 'bg-neutral-100/50') 
              : '';

            return (
              <div
                key={colIdx}
                onClick={() => onDateSelect(day)}
                className={`flex flex-col p-2 space-y-2 h-full overflow-y-auto scrollbar-none ${selectedColBg}`}
                id={`week-col-cell-${formatDate(day)}`}
              >
                {/* Columns Quick add button */}
                <div className="flex items-center justify-between mb-0.5 opacity-0 hover:opacity-100 group">
                  <span className={`text-[9.5px] font-bold uppercase ${isButter ? 'text-[#998B71]' : 'text-neutral-400'}`}>
                    {labelsMap[language].addEvent}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateSelect(day);
                      onAddEventClick(formatDate(day));
                    }}
                    className={`p-1 rounded-full hover:bg-white border transition cursor-pointer ${
                      isButter ? 'hover:border-[#FFFDF8] text-[#998B71]' : 'hover:border-[#262626] text-neutral-400'
                    }`}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {dayEvents.length === 0 ? null : (
                  <div className="space-y-1.5 flex-1">
                    {dayEvents.map((event) => {
                      const dynColor = getDynamicColorStyles(event.color, isButter);
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventSelect(event);
                          }}
                          style={{
                            backgroundColor: dynColor.bg,
                            borderColor: dynColor.border,
                            color: dynColor.text
                          }}
                          className="p-2.5 rounded-2xl border transition-all hover:translate-y-[-1px] hover:shadow-3xs cursor-pointer text-left flex flex-col gap-1.5"
                        >
                          <div className="flex items-start justify-between gap-1 leading-tight">
                            <span className="text-[11.5px] font-bold tracking-tight leading-snug line-clamp-2">
                              {event.category && <span className="opacity-90 font-black text-[9.5px] mr-1">[{event.category}]</span>}
                              {event.title}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: dynColor.dot }} />
                          </div>

                          {event.timeStart && (
                            <span className="text-[9px] font-bold flex items-center gap-1 opacity-75">
                              <Clock size={9} />
                              {event.timeStart}{event.timeEnd && ` ~ ${event.timeEnd}`}
                            </span>
                          )}

                          {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-0.5 mt-0.5">
                              {event.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`px-1 py-0.2 text-[8px] font-bold rounded border ${
                                    isButter ? 'bg-white/80 text-[#998B71] border-[#F4E5D1]/30' : 'bg-white/70 text-neutral-500 border-neutral-200/30'
                                  }`}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // -- 3. Render Daily View (Timeline & 15m Tracker) --
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);

    const getEventForHourFiveMin = (hour: number, slotIndex: number, dayEvents: ScheduleEvent[]): ScheduleEvent | null => {
      const slotMinutesStart = slotIndex * 5;
      const slotMinutesEnd = slotMinutesStart + 5;
      
      for (const ev of dayEvents) {
        if (!ev.timeStart) continue;
        
        const [sH, sM] = ev.timeStart.split(':').map(Number);
        const sMin = sH * 60 + sM;
        
        let eMin = sMin + 60; // default to 1hr if end isn't there
        if (ev.timeEnd) {
          const [eH, eM] = ev.timeEnd.split(':').map(Number);
          eMin = eH * 60 + eM;
        }
        
        const checkStart = hour * 60 + slotMinutesStart;
        const checkEnd = hour * 60 + slotMinutesEnd;
        
        if (sMin < checkEnd && eMin > checkStart) {
          return ev;
        }
      }
      return null;
    };

    const isToday = getIsToday(currentDate);
    const mNum = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dNum = String(currentDate.getDate()).padStart(2, '0');
    const dayOfWeekStr = formatDayOfWeekFull(currentDate, language);

    const descMap = {
      ko: `오늘 예정된 일정이 총 ${dayEvents.length}개 있습니다.`,
      ja: `今日の予定が合計 ${dayEvents.length}件あります。`,
      en: `Total of ${dayEvents.length} scheduled items today.`
    };

    const addBtnText = {
      ko: '일정 추가',
      ja: '予定追加',
      en: 'Add Event'
    };

    // Dynamically retrieve only categories set by the user themselves
    const userCategories = Array.from(
      new Set(events.map(e => e.category?.trim()).filter(Boolean))
    ) as string[];

    const categoryInfo = userCategories.map(cat => {
      const associatedEvent = events.find(e => e.category?.trim() === cat);
      const colorStyle = getDynamicColorStyles(associatedEvent?.color || 'gray', isButter);
      return {
        label: cat,
        colorStyle
      };
    });

    const containerBorderClass = isButter
      ? "flex flex-col h-full bg-[#FFFDF8] rounded-3xl border border-[#FFFDF8] overflow-hidden"
      : "flex flex-col h-full bg-[#FAFAFA] rounded-3xl border border-neutral-200/50 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.015)]";

    const headerTextHeadingClass = isButter ? "text-[#61533F]" : "text-neutral-900";
    const headerTextSubClass = isButter ? "text-[#BAAF99]" : "text-neutral-400";

    const addButtonClass = isButter
      ? "flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-white hover:bg-[#FFFDF8] text-[#61533F] border border-[#FFFDF8] rounded-xl text-[13px] font-bold transition shadow-2xs self-start sm:self-auto cursor-pointer"
      : "flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-[#262626] hover:bg-[#404040] text-white rounded-xl text-[13px] font-bold transition shadow-2xs self-start sm:self-auto cursor-pointer";

    const legendPanelClass = isButter
      ? "px-6 py-2.5 bg-[#FFFDF8] border-b border-[#FFFDF8] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10.5px] font-bold text-[#BAAF99]"
      : "px-6 py-2.5 bg-neutral-50/70 border-b border-neutral-200/40 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10.5px] font-bold text-neutral-600";

    const splitDividerClass = isButter
      ? "flex-1 flex flex-col md:flex-row min-h-[500px] divide-y md:divide-y-0 md:divide-x divide-[#FFFDF8] overflow-hidden"
      : "flex-1 flex flex-col md:flex-row min-h-[500px] divide-y md:divide-y-0 md:divide-x divide-neutral-200/35 overflow-hidden";

    const sidebarPanelClass = isButter
      ? "w-full md:w-72 bg-[#FFFDF8]/35 p-5 overflow-y-auto space-y-4"
      : "w-full md:w-72 bg-neutral-50/60 p-5 overflow-y-auto space-y-4";

    return (
      <div className={containerBorderClass}>
        {/* Header Section */}
        <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95">
          <div>
            <h3 className={`text-[26px] font-extrabold tracking-tight leading-none ${headerTextHeadingClass}`}>
              {mNum}.{dNum}{' '}
              <span className={`text-[17px] font-bold ml-2 ${headerTextSubClass}`}>
                {dayOfWeekStr}
              </span>
            </h3>
            <p className={`text-[11px] mt-2 font-bold leading-none ${headerTextSubClass}`}>
              {descMap[language]}
            </p>
          </div>

          <button
            onClick={() => onAddEventClick(formatDate(currentDate))}
            className={addButtonClass}
            id="day-view-add-event-btn"
          >
            <Plus size={14} />
            <span>{addBtnText[language]}</span>
          </button>
        </div>

        {/* Legend color trackers map */}
        <div className={legendPanelClass}>
          <span className={`text-[9.5px] uppercase tracking-wider font-extrabold ${isButter ? 'text-[#BAAF99]' : 'text-neutral-400'}`}>CATEGORIES:</span>
          {categoryInfo.length === 0 ? (
            <span className="text-neutral-450 italic text-[10px] font-medium ml-1">
              {language === 'ko' ? '설정된 카테고리가 없습니다.' : language === 'ja' ? '設定されたカテゴリーがありません。' : 'No set categories yet.'}
            </span>
          ) : (
            categoryInfo.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-white/70 px-2 py-0.5 rounded-md border border-neutral-200/20 shadow-3xs text-[10.5px]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.colorStyle.solid || cat.colorStyle.dot }} />
                <span>{cat.label}</span>
              </div>
            ))
          )}
        </div>

        {/* Big Layout split: Left 5m timeline tracking grid, Right compact side column */}
        <div className={splitDividerClass}>
          {/* Detailed Gantt 5-minute Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 max-h-[72vh] scrollbar-thin space-y-1.5">
            {Array.from({ length: 24 }).map((_, h) => {
              const slots: (ScheduleEvent | null)[] = [];
              for (let s = 0; s < 12; s++) {
                slots.push(getEventForHourFiveMin(h, s, dayEvents));
              }

              interface FiveMinBlock {
                event: ScheduleEvent | null;
                startSlot: number;
                span: number;
              }

              const blocks: FiveMinBlock[] = [];
              let currentId: string | null = null;
              let startSlot = 0;
              let span = 0;

              for (let s = 0; s < 12; s++) {
                const ev = slots[s];
                const evId = ev ? ev.id : 'empty';
                if (s === 0) {
                  currentId = evId;
                  startSlot = 0;
                  span = 1;
                } else if (evId === currentId) {
                  span++;
                } else {
                  blocks.push({ event: slots[startSlot], startSlot, span });
                  currentId = evId;
                  startSlot = s;
                  span = 1;
                }
              }
              blocks.push({ event: slots[startSlot], startSlot, span });

              const amPm = h >= 12 ? 'PM' : 'AM';
              const hourNumber = h === 0 ? 12 : h > 12 ? h - 12 : h;

              return (
                <div key={h} className="relative group flex items-stretch min-h-[52px]">
                  {/* Left Column: Hour tag */}
                  <div className="w-16 shrink-0 flex items-center justify-end pr-3 gap-0.5 select-none font-mono leading-none">
                    <span className={`text-[12.5px] font-black ${isButter ? 'text-[#61533F]' : 'text-neutral-800'}`}>
                      {hourNumber}
                    </span>
                    <span className={`text-[8.5px] font-bold ${isButter ? 'text-[#BAAF99]' : 'text-neutral-400'}`}>
                      {amPm}
                    </span>
                  </div>

                  {/* Right Column: 12-slot 5m grid blocks */}
                  <div className="grid grid-cols-12 gap-1 flex-1">
                    {blocks.map((block, idx) => {
                      if (!block.event) {
                        const startMin = block.startSlot * 5;
                        const cellEmptyClass = isButter
                          ? "border border-[#FFFDF8] bg-white/40 hover:bg-[#FFFDF8]/50 hover:border-[#FFFDF8] rounded-xl transition-all flex items-center justify-center cursor-pointer group/cell"
                          : "border border-neutral-200/40 bg-white/40 hover:bg-neutral-100 hover:border-[#262626]/40 rounded-xl transition-all flex items-center justify-center cursor-pointer group/cell";

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onAddEventClick(formatDate(currentDate))}
                            style={{ gridColumn: `span ${block.span} / span ${block.span}` }}
                            className={cellEmptyClass}
                            title={`${String(h).padStart(2, '0')}:${String(startMin).padStart(2, '0')} - 일정 추가`}
                          >
                            <span className="text-[8.5px] font-mono text-neutral-400 opacity-0 group-hover/cell:opacity-100 transition-opacity font-bold">
                              +{String(h).padStart(2, '0')}:{String(startMin).padStart(2, '0')}
                            </span>
                          </button>
                        );
                      }

                      const dynColor = getDynamicColorStyles(block.event.color, isButter);

                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -1, scale: 1.005 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventSelect(block.event!);
                          }}
                          style={{
                            backgroundColor: dynColor.bg,
                            borderColor: dynColor.border,
                            color: dynColor.text,
                            gridColumn: `span ${block.span} / span ${block.span}`
                          }}
                          className="p-2.5 rounded-xl border flex flex-col justify-between leading-tight cursor-pointer shadow-3xs overflow-hidden transition-all text-left hover:brightness-95"
                          id={`slot-5min-${block.event.id}`}
                        >
                          <div className="flex items-center justify-between gap-1.5 leading-none">
                            <span className="text-[12px] font-black truncate tracking-tight">
                              {block.event.category && <span className="opacity-95 font-extrabold text-[9px] mr-1">[{block.event.category}]</span>}
                              {block.event.title}
                            </span>
                            <span
                              className="text-[8.5px] font-extrabold px-1 py-0.5 rounded font-mono shrink-0"
                              style={{ backgroundColor: dynColor.badgeBg, color: dynColor.text }}
                            >
                              {block.span * 5}m
                            </span>
                          </div>

                          {block.span >= 4 && block.event.description && (
                            <p className="text-[10px] opacity-85 truncate font-bold mt-1 leading-snug">
                              {block.event.description}
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* List of untimed/all-day events sidebar */}
          <div className={sidebarPanelClass}>
            <h5 className={`text-[10px] font-extrabold tracking-wider uppercase mb-2 ${isButter ? 'text-[#BAAF99]' : 'text-neutral-450'}`}>
              {language === 'ja' ? '重要予定' : language === 'en' ? 'IMPORTANT EVENTS' : '중요 일정'}
            </h5>

            {dayEvents.filter(e => !e.timeStart).length === 0 && dayEvents.length > 0 && (
              <div className={`text-[11px] italic text-center py-6 font-semibold ${isButter ? 'text-[#BAAF99]' : 'text-neutral-400'}`}>
                {language === 'ja' ? 'すべての予定가時間指定されています。' : language === 'en' ? 'All events have specific slot assignments.' : '모든 일정이 지정 시간에 예약되어 있습니다.'}
              </div>
            )}

            {dayEvents.length === 0 && (
              <div className={`text-[11px] italic text-center py-12 font-bold ${isButter ? 'text-[#BAAF99]/80' : 'text-neutral-400/80'}`}>
                {language === 'ja' ? '今日登録された予定はありません。' : language === 'en' ? 'No events scheduled for today.' : '오늘 등록된 일정이 없습니다.'}
              </div>
            )}

            {dayEvents.map(event => {
              if (event.timeStart) return null;
              
              const dynColor = getDynamicColorStyles(event.color, isButter);

              return (
                <div
                  key={event.id}
                  onClick={() => onEventSelect(event)}
                  style={{ borderColor: dynColor.border }}
                  className="p-3.5 bg-white hover:bg-[#FEF9EA]/20 border rounded-2xl shadow-3xs cursor-pointer flex flex-col gap-2 relative group transition"
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[12.5px] font-extrabold pr-2 leading-tight ${isButter ? 'text-[#61533F]' : 'text-neutral-850'}`}>
                      {event.category && <span className="opacity-90 font-black text-[10px] mr-1">[{event.category}]</span>}
                      {event.title}
                    </span>
                    <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: dynColor.dot }} />
                  </div>

                  {event.description && (
                    <p className={`text-[10px] leading-normal line-clamp-2 font-semibold ${isButter ? 'text-[#A38E68]' : 'text-neutral-500'}`}>
                      {event.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-1 mt-1">
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold border rounded ${
                      isButter ? 'bg-[#FFFDF4] border-[#F4E5D1]/85 text-[#A38E68]' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                    }`}>
                      {event.priority.toUpperCase()}
                    </span>

                    {event.tags && event.tags.length > 0 && (
                      <div className="flex gap-1.5">
                        {event.tags.map((tag) => (
                          <span key={tag} className={`text-[9.5px] font-extrabold ${isButter ? 'text-[#998B71]' : 'text-neutral-400'}`}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 h-full flex flex-col">
      {viewType === 'month' && renderMonthView()}
      {viewType === 'week' && renderWeekView()}
      {viewType === 'day' && renderDayView()}
    </div>
  );
}
