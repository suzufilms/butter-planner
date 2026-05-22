import React, { useState } from 'react';
import { Check, Trash2, Plus, Flag, Tag, Calendar, AlertCircle } from 'lucide-react';
import { TodoItem, Priority, Language, ThemeMode } from '../types';

interface TodoSidebarProps {
  items: TodoItem[];
  onAddItem: (title: string, priority: Priority, tags: string[], dueDate?: string) => void;
  onToggleComplete: (id: string) => void;
  onDeleteItem: (id: string) => void;
  selectedDate: string; // Currently focused date on calendar for quick link!
  language?: Language;
  theme?: ThemeMode;
}

const SIDEBAR_MESSAGES = {
  ko: {
    todoTitle: '할 일 리스트',
    allTasks: '전체 태스크',
    relatedTasks: (date: string) => `${date} 관련 할 일`,
    completedText: (comp: number, tot: number) => `${comp} / ${tot} 완료됨`,
    inputPlaceholder: '오늘 해야 할 일을 기록해 보세요...',
    priorityLabel: '우선순위',
    low: '낮음',
    medium: '보통',
    high: '높음',
    tagsLabel: '태그 설정',
    tagPlaceholder: '태그...',
    addTagBtn: '+',
    linkToDateLabel: (date: string) => `선택일(${date})에 일정 연동`,
    addTodoBtn: '할 일 추가',
    badgeAll: '전체',
    badgeActive: '진행중',
    badgeCompleted: '완료',
    sortDefault: '등록순',
    sortPriority: '우선순위순',
    sortDate: '날짜순',
    noTodos: '등록된 할 일이 없습니다.'
  },
  ja: {
    todoTitle: 'やることリスト',
    allTasks: 'すべてのタスク',
    relatedTasks: (date: string) => `${date} のやること`,
    completedText: (comp: number, tot: number) => `${comp} / ${tot} 完了`,
    inputPlaceholder: '今日のやることを記録しましょう...',
    priorityLabel: '優先度',
    low: '低い',
    medium: '普通',
    high: '高い',
    tagsLabel: 'タグ設定',
    tagPlaceholder: 'タグ...',
    addTagBtn: '+',
    linkToDateLabel: (date: string) => `選択日 (${date}) に予定を連動`,
    addTodoBtn: '予定を追加する',
    badgeAll: 'すべて',
    badgeActive: '進行中',
    badgeCompleted: '完了済',
    sortDefault: '登録順',
    sortPriority: '優先度順',
    sortDate: '日付順',
    noTodos: '登録されたやることがありません。'
  },
  en: {
    todoTitle: 'To-Do List',
    allTasks: 'All Tasks',
    relatedTasks: (date: string) => `Tasks for ${date}`,
    completedText: (comp: number, tot: number) => `${comp} / ${tot} Completed`,
    inputPlaceholder: 'Write down your tasks for today...',
    priorityLabel: 'Priority',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    tagsLabel: 'Tags Config',
    tagPlaceholder: 'Tag...',
    addTagBtn: '+',
    linkToDateLabel: (date: string) => `Link task to picked date (${date})`,
    addTodoBtn: 'Add To-Do',
    badgeAll: 'All',
    badgeActive: 'Active',
    badgeCompleted: 'Completed',
    sortDefault: 'Created At',
    sortPriority: 'Priority',
    sortDate: 'Due Date',
    noTodos: 'No items in the list.'
  }
};

export default function TodoSidebar({
  items,
  onAddItem,
  onToggleComplete,
  onDeleteItem,
  selectedDate,
  language = 'ko',
  theme = 'butter',
}: TodoSidebarProps) {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [linkToDate, setLinkToDate] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'default'>('default');

  const t = SIDEBAR_MESSAGES[language];
  const isButter = theme === 'butter';

  const priorityMeta = isButter 
    ? {
        low: {
          border: 'border-[#F4E5D1] focus:ring-[#FAF5EA]/50',
          text: 'text-[#7A6031]',
          bgBase: 'bg-[#FFFDF4]',
          badge: 'bg-[#FFFDF4] text-[#7A6031] border-[#F4E5D1]',
          dot: 'bg-[#CCBA95]',
          label: t.low
        },
        medium: {
          border: 'border-[#F2C553]/60 focus:ring-[#FAF5EA]/50',
          text: 'text-[#5C4D2E]',
          bgBase: 'bg-[#FEF9EA]/75',
          badge: 'bg-[#FEF9EA] text-[#5C4D2E] border-[#F2C553]/50',
          dot: 'bg-[#F2C553]',
          label: t.medium
        },
        high: {
          border: 'border-[#5C4D2E] focus:ring-[#5C4D2E]/30',
          text: 'text-[#FFFDF6]',
          bgBase: 'bg-[#5C4D2E]/95',
          badge: 'bg-[#5C4D2E] text-[#FFFDF6] border-[#5C4D2E]',
          dot: 'bg-[#F6D375]',
          label: t.high
        }
      }
    : {
        low: {
          border: 'border-neutral-200 focus:ring-neutral-200/50',
          text: 'text-neutral-600',
          bgBase: 'bg-neutral-50',
          badge: 'bg-neutral-50 text-neutral-600 border border-neutral-200',
          dot: 'bg-[#8E8E93]',
          label: t.low
        },
        medium: {
          border: 'border-neutral-300 focus:ring-neutral-200/40',
          text: 'text-neutral-700',
          bgBase: 'bg-neutral-120',
          badge: 'bg-neutral-120 text-neutral-700 border border-neutral-300',
          dot: 'bg-neutral-400',
          label: t.medium
        },
        high: {
          border: 'border-[#262626] focus:ring-[#262626]/30',
          text: 'text-white',
          bgBase: 'bg-[#262626]',
          badge: 'bg-[#262626] text-white border border-[#262626]',
          dot: 'bg-white',
          label: t.high
        }
      };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem(
      newTitle.trim(),
      priority,
      tags,
      linkToDate ? selectedDate : undefined
    );

    // Reset fields
    setNewTitle('');
    setPriority('medium');
    setTags([]);
    setNewTagInput('');
    setLinkToDate(false);
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Filter and sort computation
  const filteredItems = items
    .filter((item) => {
      if (activeFilter === 'active') return !item.completed;
      if (activeFilter === 'completed') return item.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityScore = { high: 3, medium: 2, low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      }
      if (sortBy === 'date') {
        const dateA = a.dueDate || '9999-99-99';
        const dateB = b.dueDate || '9999-99-99';
        return dateA.localeCompare(dateB);
      }
      return 0;
    });

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.completed).length;

  const sidebarContainerClass = isButter
    ? "w-full lg:w-96 bg-white border border-[#FFFDF4] rounded-[28px] p-6 shadow-2xs flex flex-col h-full"
    : "w-full lg:w-96 bg-white border border-neutral-200/55 rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col h-full";

  const formClass = isButter
    ? "space-y-3 mb-6 p-4 bg-[#FFFDF4] rounded-2xl border border-[#FFFDF4]"
    : "space-y-3 mb-6 p-4 bg-neutral-50/70 rounded-2xl border border-neutral-200/50";

  const inputClass = isButter
    ? "w-full bg-white px-3.5 py-2.5 rounded-xl text-[12.5px] border border-[#FFFDF4] focus:outline-[#FFFDF4] focus:border-[#FFFDF4] focus:ring-1 focus:ring-[#FFFDF4]/10 placeholder-neutral-400 font-semibold transition text-[#61533F]"
    : "w-full bg-white px-3.5 py-2.5 rounded-xl text-[12.5px] border border-neutral-200/60 focus:outline-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]/10 placeholder-neutral-400 font-semibold transition text-neutral-900";

  const tagPillClass = isButter
    ? "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#FFFDF4] text-[#61533F] text-[10px] rounded font-bold hover:bg-neutral-100 hover:text-neutral-600 transition cursor-pointer border border-[#FFFDF4]"
    : "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-neutral-150 text-neutral-800 text-[10px] rounded font-bold hover:bg-neutral-200 hover:text-neutral-900 transition cursor-pointer border border-neutral-200";

  const checkboxCompletedClass = isButter
    ? "bg-[#FFFDF4] border-[#FFFDF4] text-[#61533F]"
    : "bg-[#262626] border-[#262626] text-white";

  const checkboxUncompletedClass = isButter
    ? "border-[#FFFDF4] hover:border-[#FFFDF4] bg-white"
    : "border-neutral-250 hover:border-[#262626] bg-white";

  const addButtonClass = isButter
    ? "w-full py-2 bg-white hover:bg-[#FFFDF4] text-[#61533F] border border-[#FFFDF4] rounded-xl text-[12.5px] font-extrabold flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
    : "w-full py-2 bg-[#262626] hover:bg-[#404040] text-white rounded-xl text-[12.5px] font-extrabold flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer";

  const prioritySelectionActiveStyles = isButter
    ? {
        low: 'bg-[#FFFDF4] text-[#61533F] font-bold border border-[#FFFDF4]',
        medium: 'bg-[#FFFDF4] text-[#61533F] font-bold border border-[#FFFDF4]',
        high: 'bg-[#61533F] text-white font-bold border border-[#61533F]'
      }
    : {
        low: 'bg-neutral-50 text-neutral-655 font-bold border border-neutral-250',
        medium: 'bg-neutral-100 text-neutral-855 font-bold border border-neutral-300',
        high: 'bg-[#262626] text-white font-bold border border-[#262626]'
      };

  const activeFilterButtonClass = isButter
    ? "bg-white text-[#61533F] border border-[#FFFDF4] shadow-3xs"
    : "bg-[#262626] text-white shadow-3xs";

  const progressBarProgressClass = isButter ? "bg-[#FFFDF4]" : "bg-[#262626]";

  const selectColorFocusClass = isButter ? "focus:border-[#FFFDF4]" : "focus:border-[#262626]";

  const itemTagClass = isButter ? "text-[#BAAF99]" : "text-neutral-400";

  const textHeadingClass = isButter ? "text-[#61533F]" : "text-[#262626]";
  const textSubClass = isButter ? "text-[#BAAF99]" : "text-neutral-550";

  return (
    <div className={sidebarContainerClass}>
      {/* Title & Stats */}
      <div className="mb-5">
        <h3 className={`text-[17px] font-extrabold tracking-tight ${textHeadingClass}`}>{t.todoTitle}</h3>
        <div className={`flex items-center justify-between mt-1 text-[11px] font-semibold ${textSubClass}`}>
          <span>{selectedDate ? t.relatedTasks(selectedDate) : t.allTasks}</span>
          <span>{t.completedText(completedCount, totalCount)}</span>
        </div>
        <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${progressBarProgressClass}`}
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Creation Form */}
      <form onSubmit={handleAddItem} className={formClass}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={t.inputPlaceholder}
          className={inputClass}
          id="todo-input"
        />

        {/* Priority selecting row */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500 font-semibold">
          <span className="flex items-center gap-1.5">
            <Flag size={12} className={isButter ? "text-[#998B71]" : "text-neutral-450"} />
            {t.priorityLabel}
          </span>
          <div className="flex gap-1">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => {
              const selected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2.5 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
                    selected ? prioritySelectionActiveStyles[p] : 'bg-white hover:bg-neutral-50 text-neutral-500 border border-neutral-200/50'
                  }`}
                  id={`todo-prio-${p}`}
                >
                  {priorityMeta[p].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags selecting row */}
        <div className={`flex flex-col gap-2 pt-1 border-t ${isButter ? 'border-[#F4E5D1]/30' : 'border-neutral-200/35'}`}>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Tag size={12} className={isButter ? "text-[#998B71]" : "text-neutral-450"} />
              {t.tagsLabel}
            </span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={t.tagPlaceholder}
                className={`w-16 px-1.5 py-0.5 text-[10px] bg-white border border-neutral-200/50 rounded focus:outline-none ${selectColorFocusClass}`}
                id="todo-tag-shortcut"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="p-1 px-2 bg-white hover:bg-neutral-100 border border-neutral-200/40 rounded text-[10px] cursor-pointer"
              >
                {t.addTagBtn}
              </button>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <span
                  key={tag}
                  onClick={() => handleRemoveTag(tag)}
                  className={tagPillClass}
                >
                  #{tag}
                  <span className="text-[8px] font-bold">×</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Date Link (Link to calendar focus date) */}
        <div className={`flex items-center justify-between pt-1 border-t text-[11px] ${isButter ? 'border-[#FFFDF8]' : 'border-neutral-200/35'}`}>
          <span className="text-neutral-500 flex items-center gap-1.5 font-semibold">
            <Calendar size={12} className={isButter ? "text-[#998B71]" : "text-neutral-450"} />
            {t.linkToDateLabel(selectedDate)}
          </span>
          <input
            type="checkbox"
            checked={linkToDate}
            onChange={(e) => setLinkToDate(e.target.checked)}
            className={`w-3.5 h-3.5 border-neutral-300 rounded cursor-pointer ${isButter ? 'text-[#FFFDF8]' : 'text-[#262626]'}`}
            id="todo-date-link-checkbox"
          />
        </div>

        {/* Add Submission Button */}
        <button
          type="submit"
          className={addButtonClass}
          id="add-todo-btn"
        >
          <Plus size={14} />
          <span>{t.addTodoBtn}</span>
        </button>
      </form>

      {/* Grid Filters */}
      <div className={`flex items-center justify-between border-b pb-3 mb-3 text-[11px] font-semibold ${isButter ? 'border-[#F4E5D1]/30' : 'border-neutral-200/35'}`}>
        <div className="flex gap-1">
          {(['all', 'active', 'completed'] as const).map((filter) => {
            const labels = { all: t.badgeAll, active: t.badgeActive, completed: t.badgeCompleted };
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2 py-1 rounded transition cursor-pointer font-bold ${
                  isActive ? activeFilterButtonClass : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-transparent text-neutral-400 focus:outline-none cursor-pointer font-extrabold hover:text-neutral-700 text-[10.5px]"
        >
          <option value="default">{t.sortDefault}</option>
          <option value="priority">{t.sortPriority}</option>
          <option value="date">{t.sortDate}</option>
        </select>
      </div>

      {/* Checklist Stack */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {filteredItems.length === 0 ? (
          <div className={`text-center py-12 text-[12px] font-medium italic ${isButter ? 'text-[#998B71]' : 'text-neutral-400'}`}>
            {t.noTodos}
          </div>
        ) : (
          filteredItems.map((item) => {
            const prioClass = priorityMeta[item.priority];
            const rowBorderClass = isButter 
              ? (item.completed ? 'bg-neutral-50/40 border-neutral-100/50' : 'bg-white border-[#F4E5D1]/40 hover:border-[#F4E5D1]/85 hover:shadow-3xs')
              : (item.completed ? 'bg-neutral-50/40 border-neutral-150/40' : 'bg-white border-neutral-205/60 hover:border-neutral-300 hover:shadow-3xs');

            return (
              <div
                key={item.id}
                className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all duration-200 ${rowBorderClass}`}
                id={`todo-row-${item.id}`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Task Checkbox */}
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className={`mt-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center transition shrink-0 cursor-pointer ${
                      item.completed ? checkboxCompletedClass : checkboxUncompletedClass
                    }`}
                    id={`todo-box-${item.id}`}
                  >
                    {item.completed && <Check size={11} strokeWidth={3.5} />}
                  </button>

                  <div className="flex-1 min-w-0 select-none">
                    {/* Title */}
                    <p
                      className={`text-[12.5px] font-bold leading-relaxed tracking-tight ${
                        item.completed ? 'text-neutral-305 line-through opacity-60' : (isButter ? 'text-[#61533F]' : 'text-[#1B1B1F]')
                      }`}
                    >
                      {item.title}
                    </p>

                    {/* Meta Indicators (Priority & Tags & Due Date) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {/* Priority dot/label */}
                      <span className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 text-[8.5px] font-bold border rounded-md leading-none ${prioClass.badge}`}>
                        <span className={`w-1 h-1 rounded-full ${prioClass.dot}`} />
                        {prioClass.label}
                      </span>

                      {/* Due Date Indicator if present */}
                      {item.dueDate && (
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-100 leading-none">
                          <Calendar size={8} />
                          {item.dueDate}
                        </span>
                      )}

                      {/* Item Tags list */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 leading-none">
                          {item.tags.map((tag) => (
                            <span key={tag} className={`text-[8.5px] font-bold ${itemTagClass}`}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete button (displays on row hover on desktop) */}
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="xl:opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-neutral-300 hover:text-red-500 transition shrink-0 ml-1.5 cursor-pointer"
                  title="할 일 삭제"
                  id={`delete-todo-row-${item.id}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
