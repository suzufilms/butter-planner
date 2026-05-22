import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ListTodo, ChevronLeft, ChevronRight, Plus, RefreshCw, NotebookPen } from 'lucide-react';
import { ScheduleEvent, TodoItem, ViewType, Priority, Language, ThemeMode } from './types';
import CalendarView from './components/CalendarView';
import TodoSidebar from './components/TodoSidebar';
import EventDialog from './components/EventDialog';
import { formatDate, formatMonthYear } from './utils/dateUtils';

// Helper to set up elegant initial mock data based on current target date
const INITIAL_DATE = new Date('2026-05-22');

const INITIAL_EVENTS: ScheduleEvent[] = [
  {
    id: 'mock-1',
    title: '🍎 임원단 디자인 피드백 세션',
    category: '업무',
    description: '최소한의 요소로 최대의 사용성을 전달하는 애플 미니멀리즘 디자인 레이아웃 및 폰트 장평 감성 리뷰.',
    date: '2026-05-22',
    timeStart: '10:00',
    timeEnd: '12:00',
    priority: 'high',
    tags: ['디자인', '중요', '업무'],
    color: 'red'
  },
  {
    id: 'mock-2',
    title: '🏃‍♂️ 한강 저녁 러닝 크루',
    category: '운동',
    description: '반포대로 러닝 트랙 가벼운 5km 조깅 및 페이싱. 미풍 속 쿨다운 스트레칭.',
    date: '2026-05-22',
    timeStart: '19:30',
    timeEnd: '21:00',
    priority: 'medium',
    tags: ['운동', '개인'],
    color: 'blue'
  },
  {
    id: 'mock-3',
    title: '💼 가구 및 데스크 용품 서칭',
    category: '개인',
    description: '오피스 셋업 고도화를 위한 친환경 미니멀리즘 오크 데스크톱 시료 단가 조사 및 치수 측정.',
    date: '2026-05-23',
    timeStart: '14:00',
    timeEnd: '15:30',
    priority: 'low',
    tags: ['개인', '인테리어'],
    color: 'yellow'
  },
  {
    id: 'mock-4',
    title: '🥑 주간 신선식품 장보기',
    category: '장보기',
    description: '샐러드 소스, 아보카도, 귀리유 및 그릭 요거트 수급 계획',
    date: '2026-05-24',
    timeStart: '11:00',
    timeEnd: '12:00',
    priority: 'low',
    tags: ['장보기', '가족'],
    color: 'green'
  }
];

const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo-mock-1',
    title: '인덱스 폰트 간격 장평 조절 체크하기',
    completed: false,
    priority: 'high',
    tags: ['디자인', '일과'],
    dueDate: '2026-05-22'
  },
  {
    id: 'todo-mock-2',
    title: '매일 충분한 수분 보충 (2L 음용)',
    completed: true,
    priority: 'low',
    tags: ['습관', '운동']
  },
  {
    id: 'todo-mock-3',
    title: '다음 주 신규 아이디어 발표 PPT 마크업',
    completed: false,
    priority: 'medium',
    tags: ['업무'],
    dueDate: '2026-05-25'
  }
];

export default function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(INITIAL_DATE));
  const [viewType, setViewType] = useState<ViewType>('month');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  
  // Persistent Settings - Language: 'ko' | 'ja' | 'en'
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('apple_planner_language') as Language) || 'ko';
  });

  // Persistent Theme Mode: 'butter' | 'basic'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('apple_planner_theme') as ThemeMode) || 'butter';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('apple_planner_language', lang);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('apple_planner_theme', newTheme);
  };
  
  // Dialog controls
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [dialogPreTargetDate, setDialogPreTargetDate] = useState<string>(formatDate(INITIAL_DATE));

  // Responsive mobile toggle between Calendar and Todo list
  const [mobileTab, setMobileTab] = useState<'calendar' | 'todo'>('calendar');

  // Load from local storage or set initial mock data
  useEffect(() => {
    const cachedEvents = localStorage.getItem('apple_planner_events');
    const cachedTodos = localStorage.getItem('apple_planner_todos');

    if (cachedEvents) {
      setEvents(JSON.parse(cachedEvents));
    } else {
      setEvents(INITIAL_EVENTS);
      localStorage.setItem('apple_planner_events', JSON.stringify(INITIAL_EVENTS));
    }

    if (cachedTodos) {
      setTodos(JSON.parse(cachedTodos));
    } else {
      setTodos(INITIAL_TODOS);
      localStorage.setItem('apple_planner_todos', JSON.stringify(INITIAL_TODOS));
    }
  }, []);

  // Sync back to local storage on modification
  const saveEvents = (updatedEvents: ScheduleEvent[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('apple_planner_events', JSON.stringify(updatedEvents));
  };

  const saveTodos = (updatedTodos: TodoItem[]) => {
    setTodos(updatedTodos);
    localStorage.setItem('apple_planner_todos', JSON.stringify(updatedTodos));
  };

  // Navigations based on selected calendar view type
  const handlePrevDate = () => {
    const next = new Date(currentDate);
    if (viewType === 'month') {
      next.setMonth(currentDate.getMonth() - 1);
    } else if (viewType === 'week') {
      next.setDate(currentDate.getDate() - 7);
    } else {
      next.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const handleNextDate = () => {
    const next = new Date(currentDate);
    if (viewType === 'month') {
      next.setMonth(currentDate.getMonth() + 1);
    } else if (viewType === 'week') {
      next.setDate(currentDate.getDate() + 7);
    } else {
      next.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const handleJumpToToday = () => {
    setCurrentDate(new Date());
  };

  // Event handlers
  const handleAddNewEventOpen = (dateStr: string) => {
    setDialogPreTargetDate(dateStr);
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditEventOpen = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setDialogPreTargetDate(event.date);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = (savedEvent: ScheduleEvent) => {
    const exists = events.some(e => e.id === savedEvent.id);
    let nextEvents: ScheduleEvent[] = [];
    if (exists) {
      nextEvents = events.map(e => e.id === savedEvent.id ? savedEvent : e);
    } else {
      nextEvents = [...events, savedEvent];
    }
    saveEvents(nextEvents);
  };

  const handleDeleteEvent = (id: string) => {
    const nextEvents = events.filter(e => e.id !== id);
    saveEvents(nextEvents);
  };

  // Todo list handlers
  const handleAddTodoItem = (title: string, priority: Priority, tags: string[], dueDate?: string) => {
    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
      tags,
      dueDate
    };
    saveTodos([newItem, ...todos]);
  };

  const handleToggleTodoComplete = (id: string) => {
    const nextTodos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTodos(nextTodos);
  };

  const handleDeleteTodoItem = (id: string) => {
    const nextTodos = todos.filter(t => t.id !== id);
    saveTodos(nextTodos);
  };

  const MESSAGES = {
    ko: {
      butterTitle: 'butter planer',
      butterSubtitle: '부드럽고 꼼꼼한 하루 계획',
      basicTitle: 'butter planer',
      basicSubtitle: '정돈된 일상과 단순한 하루 기록',
      resetConfirm: '모든 데이터를 예시 데이터로 초기화할까요?',
      resetTooltip: '기록 초기화',
      butterThemeLabel: '버터 테마',
      basicThemeLabel: '기본 테마',
      month: '월간',
      week: '주간',
      day: '일간',
      addEvent: '일정 추가',
      calendarTab: '캘린더',
      todoTab: (count: number) => `할 일 (${count})`
    },
    ja: {
      butterTitle: 'butter planer',
      butterSubtitle: 'とろけるように滑らかな日程管理',
      basicTitle: 'butter planer',
      basicSubtitle: '整理された日常のスケジュール',
      resetConfirm: 'カレンダー의 記録を初期化して、デフォルトのサンプルデータに戻しますか？',
      resetTooltip: 'プランナー初期화',
      butterThemeLabel: 'バターテーマ',
      basicThemeLabel: 'デフォルトテーマ',
      month: '月間',
      week: '週間',
      day: '日間',
      addEvent: '予定追加',
      calendarTab: 'カレンダー',
      todoTab: (count: number) => `今日のやること (${count})`
    },
    en: {
      butterTitle: 'butter planer',
      butterSubtitle: 'Smooth & Creamy Routine Scheduler',
      basicTitle: 'butter planer',
      basicSubtitle: 'Organized and simple routine notes',
      resetConfirm: 'Would you like to reset all schedule and todo items to default samples?',
      resetTooltip: 'Reset Planner',
      butterThemeLabel: 'Butter Theme',
      basicThemeLabel: 'Default Theme',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      addEvent: 'Add Event',
      calendarTab: 'Calendar',
      todoTab: (count: number) => `Today's Tasks (${count})`
    }
  };

  const t = MESSAGES[language];
  const isButter = theme === 'butter';

  const handleResetToDefault = () => {
    if (window.confirm(t.resetConfirm)) {
      saveEvents(INITIAL_EVENTS);
      saveTodos(INITIAL_TODOS);
      setCurrentDate(new Date(INITIAL_DATE));
    }
  };

  // Dynamic values depending on selected theme
  const appTitle = isButter ? t.butterTitle : t.basicTitle;
  const appSubtitle = isButter ? t.butterSubtitle : t.basicSubtitle;

  const wrapperClass = isButter 
    ? "min-h-screen bg-[#FFFDF8] text-[#61533F] flex flex-col selection:bg-[#FFFDF8] selection:text-[#61533F]"
    : "min-h-screen bg-[#FAFAFA] text-neutral-850 flex flex-col selection:bg-neutral-200 selection:text-neutral-900";

  const headerClass = isButter
    ? "bg-white/90 backdrop-blur-md border-b border-[#FFFDF8] sticky top-0 z-40 px-6 py-4 flex flex-wrap gap-4 items-center justify-between"
    : "bg-white/95 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-40 px-6 py-4 flex flex-wrap gap-4 items-center justify-between shadow-2xs";

  const appNavCardClass = isButter
    ? "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-6 py-4 rounded-[24px] border border-[#FFFDF8] shadow-[0_2px_12px_rgba(0,0,0,0.01)]"
    : "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-6 py-4 rounded-[24px] border border-neutral-200/40 shadow-[0_2px_12px_rgba(0,0,0,0.015)]";

  const toggleGroupClass = isButter
    ? "inline-flex bg-[#FFFDF8] p-1 rounded-xl text-[13px] font-medium border border-[#FFFDF8]"
    : "inline-flex bg-neutral-100 p-1 rounded-xl text-[13px] font-medium border border-neutral-200/20";

  const toggleBtnActiveStyle = isButter
    ? "bg-white text-[#61533F] font-extrabold shadow-3xs border border-[#FFFDF8]"
    : "bg-white text-[#262626] font-extrabold shadow-3xs border border-neutral-200/50";

  const toggleBtnInactiveStyle = isButter
    ? "text-neutral-500 hover:text-[#61533F]"
    : "text-neutral-400 hover:text-neutral-850";

  const addEventFloatingStyle = isButter
    ? "flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#FFFDF8] text-[#61533F] rounded-xl text-[13px] font-bold border border-[#FFFDF8] transition shadow-2xs cursor-pointer"
    : "flex items-center gap-1.5 px-4 py-2 bg-[#262626] hover:bg-[#404040] text-white rounded-xl text-[13px] font-bold transition shadow-3xs cursor-pointer";

  const mobileTabsGroupClass = isButter
    ? "flex lg:hidden bg-[#FFFDF8] p-1 rounded-2xl border border-[#FFFDF8]"
    : "flex lg:hidden bg-neutral-150/40 p-1 rounded-2xl border border-neutral-200/40 shadow-3xs";

  const mobileTabActiveStyle = isButter
    ? "bg-white text-[#61533F] shadow-3xs border border-[#FFFDF8] font-bold"
    : "bg-white text-[#262626] shadow-3xs border border-neutral-200/50 font-bold";

  const mobileTabInactiveStyle = isButter ? "text-neutral-500" : "text-neutral-400";

  const calendarContainerClass = isButter
    ? "bg-white rounded-[28px] border border-[#FFFDF8] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.015)] h-full min-h-[500px] flex flex-col justify-between"
    : "bg-white rounded-[28px] border border-neutral-200/40 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.015)] h-full min-h-[500px] flex flex-col justify-between";

  const selectColorFocusClass = isButter ? "focus:border-[#FFFDF8]" : "focus:border-[#262626]";

  const resetBtnClass = isButter
    ? "p-1.5 hover:bg-[#FFFDF8] hover:text-[#61533F] rounded-full text-neutral-450 hover:rotate-12 transition-all cursor-pointer"
    : "p-1.5 hover:bg-neutral-100/75 hover:text-neutral-800 rounded-full text-neutral-400 hover:rotate-12 transition-all cursor-pointer";

  const languageContainerClass = isButter
    ? "flex bg-[#FFFDF8] rounded-2xl p-0.5 border border-[#FFFDF8] text-[11px] font-semibold text-neutral-500 items-center gap-1"
    : "flex bg-neutral-100 p-0.5 rounded-2xl border border-neutral-200 text-[11px] font-semibold text-neutral-500 items-center gap-1";

  const languageActiveStyle = isButter
    ? "bg-white text-[#61533F] shadow-3xs border border-[#FFFDF8]"
    : "bg-[#262626] text-white shadow-3xs";

  const languageInactiveStyle = isButter
    ? "text-neutral-500 hover:text-[#61533F]"
    : "text-neutral-500 hover:text-neutral-900";

  return (
    <div className={wrapperClass}>
      {/* Top Banner Header */}
      <header className={headerClass}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#FFFDF8] rounded-xl flex items-center justify-center border border-[#FFFDF8] shadow-3xs overflow-hidden shrink-0">
            <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="#FFFDF8" />
              <ellipse cx="18" cy="24" rx="11" ry="4" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
              <path d="M11 18 L15 13 L23 13 L19 18 Z" fill="#FFFFFF" opacity="0.95" />
              <path d="M19 18 L23 13 L25 15 L21 20 Z" fill="#FFFFFF" opacity="0.8" />
              <path d="M11 18 L19 18 L21 20 L13 20 Z" fill="#FFFFFF" opacity="0.88" />
              <path d="M11 18 L19 18 L23 13 M19 18 L21 20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
            </svg>
          </div>
          <div>
            <h1 className={`text-[17px] font-extrabold tracking-tight leading-tight ${isButter ? 'text-[#61533F]' : 'text-neutral-900'}`}>{appTitle}</h1>
            <p className={`text-[10px] font-bold ${isButter ? 'text-[#BAAF99]' : 'text-neutral-400'}`}>{appSubtitle}</p>
          </div>
        </div>

        {/* Global Toolbar and Toggles */}
        <div className="flex items-center gap-3">
          {/* Quick Clear Reset controller */}
          <button
            onClick={handleResetToDefault}
            className={resetBtnClass}
            title={t.resetTooltip}
          >
            <RefreshCw size={15} />
          </button>

          {/* Theme Switcher Toggle */}
          <div className={`flex p-0.5 rounded-2xl border text-[11px] font-semibold items-center gap-1 ${
            isButter ? 'bg-[#FFFDF8] border-[#FFFDF8]' : 'bg-neutral-100 border-neutral-200'
          }`}>
            {(['butter', 'basic'] as ThemeMode[]).map((thm) => {
              const active = theme === thm;
              const labels = {
                ko: thm === 'butter' ? '버터' : '기본',
                ja: thm === 'butter' ? 'バター' : '基本',
                en: thm === 'butter' ? 'Butter' : 'Basic'
              };
              const activeThemeBg = thm === 'butter' 
                ? 'bg-white border border-[#FFFDF8] text-[#61533F] shadow-3xs font-extrabold' 
                : 'bg-[#262626] text-white shadow-3xs font-extrabold';
              return (
                <button
                  key={thm}
                  onClick={() => handleThemeChange(thm)}
                  className={`px-3 py-1 rounded-xl transition-all text-[11px] font-bold cursor-pointer ${
                    active 
                      ? activeThemeBg 
                      : (isButter ? 'text-neutral-500 hover:text-[#61533F]' : 'text-neutral-400 hover:text-neutral-800')
                  }`}
                >
                  {labels[language]}
                </button>
              );
            })}
          </div>

          {/* Persistent Settings: Language Switcher */}
          <div className={languageContainerClass}>
            {(['ko', 'en', 'ja'] as Language[]).map((ln) => {
              const active = language === ln;
              const labels = { ko: '한국어', ja: '日本語', en: 'English' };
              return (
                <button
                  key={ln}
                  onClick={() => handleLanguageChange(ln)}
                  className={`px-2.5 py-1 rounded-xl transition-all text-[11px] font-bold cursor-pointer ${
                    active 
                      ? languageActiveStyle 
                      : languageInactiveStyle
                  }`}
                  title={labels[ln]}
                >
                  {ln === 'ko' ? '한' : ln === 'ja' ? '日' : 'EN'}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:p-8 flex flex-col gap-6">
        
        {/* Navigation & Controls Section */}
        <div className={appNavCardClass}>
          
          {/* Calendar Shift controllers */}
          <div className="flex items-center gap-3">
            <h2 className={`text-[19px] md:text-[21px] font-extrabold tracking-tight min-w-[140px] ${isButter ? 'text-[#61533F]' : 'text-neutral-900'}`} id="current-period-text">
              {formatMonthYear(currentDate, language)}
            </h2>

            <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl">
              <button
                onClick={handlePrevDate}
                className="p-1.5 hover:bg-neutral-50 rounded-lg transition text-neutral-600 cursor-pointer"
                id="prev-period-btn"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleJumpToToday}
                className="px-2.5 py-1 text-[11px] font-extrabold hover:bg-neutral-50 rounded-lg transition text-neutral-750 cursor-pointer"
                id="today-btn"
              >
                {language === 'ja' ? '今日' : language === 'en' ? 'Today' : '오늘'}
              </button>
              <button
                onClick={handleNextDate}
                className="p-1.5 hover:bg-neutral-50 rounded-lg transition text-neutral-600 cursor-pointer"
                id="next-period-btn"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* View Type Toggle Group (Monthly, Weekly, Daily) */}
          <div className="flex items-center justify-between gap-4">
            <div className={toggleGroupClass}>
              {(['month', 'week', 'day'] as ViewType[]).map((type) => {
                const labels = {
                  month: language === 'ja' ? '月間' : language === 'en' ? 'Month' : '월간',
                  week: language === 'ja' ? '週間' : language === 'en' ? 'Week' : '주간',
                  day: language === 'ja' ? '日間' : language === 'en' ? 'Day' : '일간'
                };
                const isActive = viewType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setViewType(type)}
                    className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer text-[12.5px] font-bold ${
                      isActive ? toggleBtnActiveStyle : toggleBtnInactiveStyle
                    }`}
                    id={`view-type-${type}`}
                  >
                    {labels[type]}
                  </button>
                );
              })}
            </div>

            {/* Quick Add floating action for desktops */}
            <button
              onClick={() => handleAddNewEventOpen(formatDate(currentDate))}
              className={addEventFloatingStyle}
              id="header-nav-add-btn"
            >
              <Plus size={15} />
              <span>{t.addEvent}</span>
            </button>
          </div>
        </div>

        {/* Responsive Tabs on Mobile Layout */}
        <div className={mobileTabsGroupClass}>
          <button
            onClick={() => setMobileTab('calendar')}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mobileTab === 'calendar' ? mobileTabActiveStyle : mobileTabInactiveStyle
            }`}
          >
            <CalendarIcon size={15} />
            {t.calendarTab}
          </button>
          <button
            onClick={() => setMobileTab('todo')}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mobileTab === 'todo' ? mobileTabActiveStyle : mobileTabInactiveStyle
            }`}
          >
            <ListTodo size={15} />
            {t.todoTab(todos.filter(t => !t.completed).length)}
          </button>
        </div>

        {/* Core Layout Split */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
          {/* Calendar Pane */}
          <div className={`flex-1 min-h-[450px] lg:block ${mobileTab === 'calendar' ? 'block' : 'hidden'}`}>
            <div className={calendarContainerClass}>
              <CalendarView
                currentDate={currentDate}
                viewType={viewType}
                events={events}
                onDateSelect={setCurrentDate}
                onEventSelect={handleEditEventOpen}
                onAddEventClick={handleAddNewEventOpen}
                language={language}
                theme={theme}
              />
            </div>
          </div>

          {/* Todo Sidebar Pane */}
          <div className={`lg:block ${mobileTab === 'todo' ? 'block' : 'hidden'}`}>
            <TodoSidebar
              items={todos}
              onAddItem={handleAddTodoItem}
              onToggleComplete={handleToggleTodoComplete}
              onDeleteItem={handleDeleteTodoItem}
              selectedDate={formatDate(currentDate)}
              language={language}
              theme={theme}
            />
          </div>
        </div>
      </main>

      {/* Persistent Event Addition / Modification Modal */}
      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDate={dialogPreTargetDate}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        language={language}
        theme={theme}
      />
    </div>
  );
}
