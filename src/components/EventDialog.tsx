import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Tag, Flag, AlertCircle, Trash2, Palette } from 'lucide-react';
import { ScheduleEvent, Priority, TrackingColor, Language, ThemeMode } from '../types';
import { getDynamicColorStyles, colorsPresetList } from '../utils/colorUtils';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  event: ScheduleEvent | null; // Null if creating new event
  onSave: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  language?: Language;
  theme?: ThemeMode;
}

const DIALOG_MESSAGES = {
  ko: {
    editTitle: '일정 수정하기',
    addTitle: '새로운 일정 추가',
    titlePlaceholder: '일정 제목 입력...',
    dateLabel: '날짜',
    timeLabel: '시간 설정',
    timeTo: 'to',
    priorityLabel: '우선순위',
    prioLow: '낮음',
    prioMedium: '보통',
    prioHigh: '높음',
    categoryLabel: '카테고리명 직접 입력',
    categoryPlaceholder: '예: 업무, 공부, 러닝, 식사...',
    colorLabel: '컬러 하이라이트 설정',
    tagsLabel: '태그',
    tagPlaceholder: '태그 입력...',
    addTagBtn: '추가',
    descLabel: '상세 메모',
    descPlaceholder: '여기에 생각이나 세부 일정을 기록하세요.',
    deleteBtn: '삭제',
    cancelBtn: '취소',
    saveBtn: '저장',
    errorTitleRequired: '일정 제목을 입력해 주세요.',
    errorTimeInvalid: '종료 시간은 시작 시간보다 빨라야 합니다.',
    predefinedTags: ['일과', '공부', '운동', '개인', '업무', '가족', '중요'],
    colorTitles: {
      '#6B7280': '회색',
      '#3B82F6': '파랑 (작업/연습)',
      '#EF4444': '빨강 (휴식/식사)',
      '#F59E0B': '노랑 (이동/외출)',
      '#10B981': '초록 (자기관리)',
      '#F97316': '주황 (기타)',
      '#8B5CF6': '보라 (스터디)',
      '#EC4899': '분홍 (취미)',
      '#0D9488': '청록 (피트니스)',
      '#4F46E5': '인디고 (미팅)',
      '#78350F': '갈색 (가정)',
      '#65A30D': '올리브 (명상)'
    }
  },
  ja: {
    editTitle: '予定の編集',
    addTitle: '新規予定 of 作成',
    titlePlaceholder: '予定のタイトルを入力...',
    dateLabel: '日付',
    timeLabel: '時間設定',
    timeTo: '〜',
    priorityLabel: '優先度',
    prioLow: '低い',
    prioMedium: '普通',
    prioHigh: '高い',
    categoryLabel: 'カテゴリー名直接入力',
    categoryPlaceholder: '例: 仕事, 勉強, 趣味, 食事...',
    colorLabel: 'カラーハイライト設定',
    tagsLabel: 'タグ',
    tagPlaceholder: 'タグを入力...',
    addTagBtn: '追加',
    descLabel: '詳細メモ',
    descPlaceholder: '考えや詳細な日程をここに記録します。',
    deleteBtn: '削除',
    cancelBtn: 'キャンセル',
    saveBtn: '保存',
    errorTitleRequired: '予定のタイトルを入力してください。',
    errorTimeInvalid: '終了時間は開始時間よりも遅い時間にしてください。',
    predefinedTags: ['日課', '勉強', '運動', 'プライベート', '仕事', '家族', '重要'],
    colorTitles: {
      '#6B7280': 'グレー',
      '#3B82F6': '青 (作業/練習)',
      '#EF4444': '赤 (休息/食事)',
      '#F59E0B': '黄 (移動/外出)',
      '#10B981': '緑 (自己管理)',
      '#F97316': 'オレンジ (その他)',
      '#8B5CF6': '紫 (勉強)',
      '#EC4899': 'ピンク (趣味)',
      '#0D9488': 'シアン (フィットネス)',
      '#4F46E5': 'インディゴ (会議)',
      '#78350F': 'ブラウン (家財)',
      '#65A30D': 'オリーブ (瞑想)'
    }
  },
  en: {
    editTitle: 'Edit Scheduled Event',
    addTitle: 'Create New Event',
    titlePlaceholder: 'Enter event title...',
    dateLabel: 'Date',
    timeLabel: 'Time Slot',
    timeTo: 'to',
    priorityLabel: 'Priority',
    prioLow: 'Low',
    prioMedium: 'Medium',
    prioHigh: 'High',
    categoryLabel: 'Custom Category (Any Name)',
    categoryPlaceholder: 'e.g., Work, Hobby, Fitness, Rest...',
    colorLabel: 'Event Highlight Color',
    tagsLabel: 'Tags',
    tagPlaceholder: 'Type new tag...',
    addTagBtn: 'Add',
    descLabel: 'Detailed Notes',
    descPlaceholder: 'Write down thoughts or details here...',
    deleteBtn: 'Delete',
    cancelBtn: 'Cancel',
    saveBtn: 'Save',
    errorTitleRequired: 'Please input event title.',
    errorTimeInvalid: 'End time must be after the start time.',
    predefinedTags: ['Daily', 'Study', 'Workout', 'Personal', 'Work', 'Family', 'Important'],
    colorTitles: {
      '#6B7280': 'Gray',
      '#3B82F6': 'Blue (Work/Study)',
      '#EF4444': 'Red (Rest/Meal)',
      '#F59E0B': 'Yellow (Transit)',
      '#10B981': 'Green (Self-Care)',
      '#F97316': 'Orange (Other)',
      '#8B5CF6': 'Purple (Seminar)',
      '#EC4899': 'Pink (Creative)',
      '#0D9488': 'Teal (Exercise)',
      '#4F46E5': 'Indigo (Appointment)',
      '#78350F': 'Brown (Domestic)',
      '#65A30D': 'Olive (Meditation)'
    }
  }
};

export default function EventDialog({
  isOpen,
  onClose,
  selectedDate,
  event,
  onSave,
  onDelete,
  language = 'ko',
  theme = 'butter',
}: EventDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('10:00');
  const [priority, setPriority] = useState<Priority>('medium');
  const [color, setColor] = useState<TrackingColor>('#6B7280');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const t = DIALOG_MESSAGES[language];
  const isButter = theme === 'butter';

  // Sync state if editing or creating
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setDate(event.date);
        setTimeStart(event.timeStart || '09:00');
        setTimeEnd(event.timeEnd || '10:00');
        setPriority(event.priority);
        setColor(event.color || '#6B7280');
        setCategory(event.category || '');
        setTags(event.tags || []);
      } else {
        setTitle('');
        setDescription('');
        setDate(selectedDate);
        setTimeStart('09:00');
        setTimeEnd('10:00');
        setPriority('medium');
        setColor('#6B7280');
        setCategory('');
        setTags([]);
      }
      setErrorMsg('');
      setNewTagInput('');
    }
  }, [isOpen, event, selectedDate]);

  const handleAddTag = (rawTag: string) => {
    const trimmed = rawTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg(t.errorTitleRequired);
      return;
    }

    // validate time if defined
    if (timeStart && timeEnd) {
      if (timeStart.localeCompare(timeEnd) >= 0) {
        setErrorMsg(t.errorTimeInvalid);
        return;
      }
    }

    onSave({
      id: event ? event.id : crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      timeStart: timeStart || undefined,
      timeEnd: timeEnd || undefined,
      priority,
      tags,
      color,
      category: category.trim() || undefined
    });

    onClose();
  };

  // Dynamic Styles
  const dialogBoxClass = isButter
    ? "bg-white w-full max-w-xl rounded-[28px] border border-[#FFFDF8] shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col max-h-[90vh]"
    : "bg-white w-full max-w-xl rounded-[28px] border border-neutral-200 shadow-[0_12px_44px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col max-h-[90vh]";

  const inputTitleClass = isButter
    ? "w-full text-[21px] font-extrabold pb-3 bg-transparent border-b border-[#FFFDF4] focus:outline-none focus:border-[#61533F] text-[#61533F] placeholder-neutral-300 transition"
    : "w-full text-[21px] font-extrabold pb-3 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-[#262626] text-[#1B1B1F] placeholder-neutral-350 transition";

  const fieldsetBgClass = isButter
    ? "bg-[#FFFDF4] border-[#FFFDF4] rounded-2xl p-4 border"
    : "bg-neutral-50/65 border-neutral-200 rounded-2xl p-4 border";

  const formInputClass = isButter
    ? "px-3 py-2 bg-white border border-[#FFFDF4] rounded-xl text-[12.5px] font-semibold focus:outline-none focus:border-[#FFFDF4] text-[#61533F]"
    : "px-3 py-2 bg-white border border-neutral-200 rounded-xl text-[12.5px] font-semibold focus:outline-none focus:border-[#262626] text-[#1B1B1F]";

  const activePriorityStyles = isButter
    ? {
        low: 'bg-[#FFFDF4] text-[#61533F] font-bold border border-[#FFFDF4]',
        medium: 'bg-[#FFFDF4] text-[#61533F] font-bold border border-[#FFFDF4]',
        high: 'bg-[#61533F] text-white font-bold border border-[#61533F]'
      }
    : {
        low: 'bg-neutral-50 text-neutral-600 font-bold border border-neutral-200/90',
        medium: 'bg-neutral-100 text-[#262626] font-bold border border-neutral-300',
        high: 'bg-[#262626] text-white font-bold border border-[#262626]'
      };

  const inlineFormInputClass = isButter
    ? "flex-1 px-3 py-2 bg-white border border-[#FFFDF4] focus:outline-none focus:border-[#FFFDF4] rounded-xl text-[12px] font-semibold"
    : "flex-1 px-3 py-2 bg-white border border-neutral-205 focus:outline-[#262626] focus:border-[#262626] rounded-xl text-[12px] font-semibold";

  const smallAddButtonClass = isButter
    ? "px-3 py-2 bg-white border border-[#FFFDF4] hover:bg-[#FFFDF4] text-[#61533F] rounded-xl text-[12px] font-extrabold transition cursor-pointer"
    : "px-3 py-2 bg-neutral-100 border border-neutral-300 hover:bg-neutral-200 text-[#262626] hover:text-neutral-950 rounded-xl text-[12px] font-extrabold transition cursor-pointer";

  const textareaClass = isButter
    ? "w-full px-3 py-2.5 bg-white border border-[#FFFDF4] rounded-xl focus:outline-none focus:border-[#FFFDF4] focus:ring-1 focus:ring-[#FFFDF4]/10 transition-colors text-[12.5px] font-semibold text-[#61533F]"
    : "w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#262626] focus:ring-1 focus:ring-[#262626]/10 transition-colors text-[12.5px] font-semibold text-[#1B1B1F]";

  const saveButtonClass = isButter
    ? "px-5 py-2 bg-white hover:bg-[#FFFDF4] text-[#61533F] border border-[#FFFDF4] font-extrabold rounded-xl text-[13.5px] shadow-2xs transition cursor-pointer"
    : "px-5 py-2 bg-[#262626] hover:bg-[#404040] text-white font-extrabold rounded-xl text-[13.5px] shadow-3xs transition cursor-pointer";



  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={dialogBoxClass}
          >
            {/* Header Dialog */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className={`text-[16px] font-black tracking-tight ${isButter ? 'text-[#61533F]' : 'text-neutral-900'}`}>
                {event ? t.editTitle : t.addTitle}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-150 rounded-full text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Error Callout if any */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-[12px] font-bold">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Event Title Input */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.titlePlaceholder}
                  className={inputTitleClass}
                  autoFocus
                  id="event-title-input"
                />
              </div>

              {/* Custom Written-in Category Field */}
              <div className={fieldsetBgClass}>
                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-500 text-[11px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                    <Palette size={12} className={isButter ? 'text-[#998B71]' : 'text-neutral-450'} />
                    {t.categoryLabel}
                  </span>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={t.categoryPlaceholder}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-[12.5px] font-semibold focus:outline-none focus:ring-1 focus:ring-current text-current-dark"
                    style={{
                      borderColor: isButter ? '#E4DDD3' : '#FF3B30'
                    }}
                    id="event-category-written-input"
                  />
                </div>
              </div>

              {/* Double-Column Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Parameter Fieldset (Date & Priority) */}
                <div className={`${fieldsetBgClass} flex flex-col gap-3.5`}>
                  {/* Date Input */}
                  <div className="flex flex-col gap-1">
                    <span className="text-neutral-500 text-[11px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                      <Calendar size={12} className={isButter ? 'text-[#998B71]' : 'text-neutral-450'} />
                      {t.dateLabel}
                    </span>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={formInputClass}
                      id="event-date-input"
                    />
                  </div>

                  {/* Priority Selectors */}
                  <div className="flex flex-col gap-1">
                    <span className="text-neutral-500 text-[11px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                      <Flag size={12} className={isButter ? 'text-[#998B71]' : 'text-neutral-450'} />
                      {t.priorityLabel}
                    </span>
                    <div className="flex gap-1 mt-0.5">
                      {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                        const isSel = priority === p;
                        const labels = { low: t.prioLow, medium: t.prioMedium, high: t.prioHigh };
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`flex-1 py-1 rounded-lg text-[11px] transition duration-150 cursor-pointer ${
                              isSel ? activePriorityStyles[p] : 'bg-white text-neutral-400 border border-neutral-200/55 hover:bg-neutral-50/70'
                            }`}
                          >
                            {labels[p]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Parameter Fieldset (Time Slot Setup) */}
                <div className={`${fieldsetBgClass} flex flex-col justify-between gap-3.5`}>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-neutral-500 text-[11px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                      <Clock size={12} className={isButter ? 'text-[#998B71]' : 'text-neutral-450'} />
                      {t.timeLabel}
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-0.5">
                      <div className="flex flex-col gap-1">
                        <input
                          type="time"
                          value={timeStart}
                          onChange={(e) => setTimeStart(e.target.value)}
                          className={formInputClass}
                          id="event-start-time"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="time"
                          value={timeEnd}
                          onChange={(e) => setTimeEnd(e.target.value)}
                          className={formInputClass}
                          id="event-end-time"
                        />
                      </div>
                    </div>
                  </div>

                   {/* Color Tracking Category */}
                  <div className="flex flex-col gap-1.5 pt-1.5">
                    <span className="text-neutral-500 text-[11px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                      <Palette size={12} className={isButter ? 'text-[#998B71]' : 'text-neutral-450'} />
                      {t.colorLabel}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 max-w-full">
                      {colorsPresetList.map((c) => {
                        const isSelColor = color === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            title={t.colorTitles[c] || c}
                            style={{ backgroundColor: c }}
                            className={`w-6.5 h-6.5 rounded-full border shadow-2xs transition cursor-pointer shrink-0 ${
                              isSelColor ? 'scale-115 ring-2 ring-black border-white' : 'border-neutral-200'
                            }`}
                          />
                        );
                      })}
                      {/* Native Color Picker for custom codes */}
                      <label
                        className="w-6.5 h-6.5 rounded-full border border-dashed border-neutral-400 hover:border-neutral-700 flex items-center justify-center cursor-pointer transition shrink-0 relative hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: !colorsPresetList.includes(color) ? color : 'transparent'
                        }}
                        title="Custom Color (커스텀 색상)"
                      >
                        <input
                          type="color"
                          value={color.startsWith('#') ? color : '#3B82F6'}
                          onChange={(e) => setColor(e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <span className={`text-[12px] font-black ${!colorsPresetList.includes(color) ? 'text-white drop-shadow-sm' : 'text-neutral-500'}`}>
                          +
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag System */}
              <div className={fieldsetBgClass}>
                <div className="flex flex-col gap-2">
                  <span className="text-neutral-500 text-[11px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                    <Tag size={12} className={isButter ? 'text-[#998B71]' : 'text-neutral-450'} />
                    {t.tagsLabel}
                  </span>

                  <div className="flex flex-col gap-2.5">
                    {/* User custom tags list pills */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 leading-none mt-1">
                        {tags.map((tg) => (
                          <span
                            key={tg}
                            onClick={() => handleRemoveTag(tg)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10.5px] font-bold cursor-pointer transition ${
                              isButter 
                                ? 'bg-[#FFFDF4] text-[#61533F] hover:bg-red-50 hover:text-red-500 border border-[#FFFDF4]'
                                : 'bg-neutral-100 text-neutral-800 hover:bg-red-50 hover:text-red-500 border border-neutral-300'
                            }`}
                          >
                            #{tg}
                            <span className="text-[9px] font-black">×</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick predefined choices or short text */}
                    <div className="space-y-2 mt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(newTagInput);
                            }
                          }}
                          placeholder={t.tagPlaceholder}
                          className={inlineFormInputClass}
                          id="new-tag-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag(newTagInput)}
                          className={smallAddButtonClass}
                        >
                          {t.addTagBtn}
                        </button>
                      </div>

                      {/* Predefined Quick Tags */}
                      <div className="flex flex-wrap gap-1">
                        {t.predefinedTags.map(pt => {
                          const isSelected = tags.includes(pt);
                          return (
                            <button
                              key={pt}
                              type="button"
                              onClick={() => {
                                if (isSelected) handleRemoveTag(pt);
                                else handleAddTag(pt);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? (isButter 
                                    ? 'bg-[#FFFDF4] text-[#61533F] border border-[#FFFDF4]' 
                                    : 'bg-neutral-200 text-[#262626] border border-neutral-350')
                                  : (isButter
                                    ? 'bg-white text-neutral-550 border border-[#FFFDF4] hover:text-[#61533F]'
                                    : 'bg-white text-neutral-400 hover:text-neutral-700 border border-neutral-200')
                              }`}
                            >
                              #{pt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 pt-3 border-t border-neutral-100">
                <span className="text-neutral-500 text-[12.5px] font-bold">{t.descLabel}</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.descPlaceholder}
                  rows={3}
                  className={textareaClass}
                  id="event-description-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8 sticky bottom-0 bg-white pt-4 border-t border-neutral-100">
                {event ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (event) {
                        onDelete(event.id);
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-[13.5px] font-extrabold transition-all cursor-pointer"
                    id="delete-event-btn"
                  >
                    <Trash2 size={16} />
                    <span>{t.deleteBtn}</span>
                  </button>
                ) : (
                  <div />
                )}
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 hover:bg-neutral-100 text-neutral-500 rounded-xl text-[13.5px] font-bold transition cursor-pointer"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className={saveButtonClass}
                    id="save-event-btn"
                  >
                    {t.saveBtn}
                  </button>
                </div>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
