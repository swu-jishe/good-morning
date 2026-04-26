import { motion } from 'motion/react';
import { Calendar, ListTodo, MoreVertical, Filter, ExternalLink, Sparkles, CheckCircle2, Bot, User, CalendarClock, Zap, Bell, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { WritebackPlatform, WritebackStep } from '../types';
import { useSchedule, stepKey } from '../context/ScheduleContext';
import { buildCalendarModel } from '../lib/scheduleCalendar';

const platformConfig: Record<
  WritebackPlatform,
  { label: string; color: string; bg: string; icon: typeof Bot }
> = {
  agent: { label: 'Agent', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-100', icon: Bot },
  user: { label: '用户', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200', icon: User },
  dingtalk: { label: '通知渠道', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-100', icon: CalendarClock },
  calendar: { label: '日历接口', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', icon: Calendar },
  openclaw: { label: '扩展接口', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-100', icon: Zap },
  system: { label: '系统', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100', icon: Bell },
};

function WritebackTimeline({
  eventId,
  steps,
  recentlyAppendedIds,
}: {
  eventId: string;
  steps: WritebackStep[];
  recentlyAppendedIds: string[];
}) {
  const doneCount = steps.filter((s) => s.status === 'done').length;
  return (
    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-slate-800">本地处理时间线</span>
        </div>
        <span className="text-[13px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
          <CheckCircle2 size={12} /> {doneCount} / {steps.length} 步已完成
        </span>
      </div>

      <ol className="relative space-y-3.5 pl-[26px] before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-px before:bg-slate-200">
        {steps.map((step, idx) => {
          const cfg = platformConfig[step.platform];
          const Icon = cfg.icon;
          const isActive = step.status === 'active';
          const isPending = step.status === 'pending';
          const isRecent = recentlyAppendedIds.includes(stepKey(eventId, step));
          return (
            <motion.li
              key={`${eventId}-${idx}-${step.time}-${step.label}`}
              initial={isRecent ? { opacity: 0, x: -8 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="relative"
            >
              <div
                className={cn(
                  'absolute -left-[26px] top-0 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shadow-sm',
                  isPending ? 'bg-white border-slate-300 text-slate-400' : cn(cfg.bg, cfg.color),
                  isActive && 'ring-4 ring-indigo-100 animate-pulse',
                  isRecent && 'ring-4 ring-indigo-200 animate-pulse',
                )}
              >
                <Icon size={10} />
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-400 tabular-nums shrink-0">
                  <Clock size={10} />
                  {step.time}
                </span>
                <span
                  className={cn(
                    'text-[12px] font-semibold border px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider',
                    cfg.bg,
                    cfg.color,
                  )}
                >
                  {cfg.label}
                </span>
                <span
                  className={cn(
                    'text-[14px] font-semibold leading-snug',
                    isPending ? 'text-slate-500' : 'text-slate-800',
                  )}
                >
                  {step.label}
                  {isPending && (
                    <span className="ml-1 text-[12px] text-slate-400 font-semibold">· 待触发</span>
                  )}
                </span>
                {isRecent && (
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded uppercase tracking-widest">
                    新
                  </span>
                )}
              </div>
              {step.meta && (
                <div className="mt-1 ml-[66px] text-[12px] text-slate-500 font-mono truncate">
                  {step.meta}
                </div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export default function ScheduleView() {
  const [viewMode, setViewMode] = useState<'detail' | 'calendar'>('detail');
  const { events, selectedEventId, setSelectedEventId, recentlyAppendedIds } = useSchedule();
  const calendarModel = buildCalendarModel(events);

  const sourceColors = {
    competition: 'bg-blue-50 text-blue-700 border-blue-200',
    exam: 'bg-rose-50 text-rose-700 border-rose-200',
    course: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    activity: 'bg-amber-50 text-amber-700 border-amber-200',
    system: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  
  const sourceLabels = {
    competition: '竞赛赛事',
    exam: '考研升学',
    course: '课程教学',
    activity: '校园活动',
    system: '系统通知',
  };

  const selectedEvent = events.find(e => e.id === selectedEventId) ?? events[0] ?? null;
  const checklist = selectedEvent?.checklist ?? [];

  const stripColors = {
    competition: 'bg-blue-100 text-blue-700 hover:bg-blue-200 text-[12px]',
    exam: 'bg-rose-100 text-rose-700 hover:bg-rose-200 text-[12px]',
    course: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-[12px]',
    activity: 'bg-amber-100 text-amber-700 hover:bg-amber-200 text-[12px]',
    system: 'bg-slate-200 text-slate-700 hover:bg-slate-300 text-[12px]',
  };

  function getEventTimeLabel(time?: string) {
    return time ? time.split(' ')[0] : '时间待定';
  }

  if (events.length === 0 || !selectedEvent) {
    return (
      <div className="h-full flex flex-col">
        <header className="mb-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">日程与待办</h1>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('detail')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
                viewMode === 'detail' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <ListTodo size={16} /> 事项详情
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
                viewMode === 'calendar' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <Calendar size={16} /> 月视日历
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          <div className="w-full md:w-5/12 lg:w-1/3 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden shrink-0 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <span className="font-semibold text-slate-700 text-sm">本周重点清单</span>
              <span className="text-xs font-semibold text-slate-500">0 条事项</span>
            </div>
            <div className="flex-1 p-4 text-sm text-slate-500 leading-relaxed">当前暂无日程输入。</div>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col relative overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-300">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex-1 flex flex-col gap-6">
              {viewMode === 'detail' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1 font-medium">计划时间</div>
                      <div className="font-bold text-slate-800 text-lg">待定</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                      <div className="text-xs text-slate-500 mb-1 font-medium">处理时长</div>
                      <div className="font-bold text-slate-800 text-lg">00:00</div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">当前暂无日程输入</h2>
                    <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-lg">
                      系统已就绪，但当前暂无日程记录，等待后端返回。
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">待定</h2>
                    <span className="text-xs font-semibold text-slate-500">0 条日程记录</span>
                  </div>
                  <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-5 flex items-center justify-center text-sm text-slate-500">
                    暂无日历记录，等待后端返回。
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6 flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">日程与待办</h1>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('detail')}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2", viewMode === 'detail' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
          >
            <ListTodo size={16} /> 事项详情
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2", viewMode === 'calendar' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
          >
            <Calendar size={16} /> 月视日历
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Left Side: ALWAYS List merged with "This week's focus tasks" */}
        <div
          data-pet-hint="本周重点清单，点击任一条会在右侧展开详情。"
          className="w-full md:w-5/12 lg:w-1/3 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden shrink-0 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
        >
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <span className="font-semibold text-slate-700 text-sm">本周重点清单</span>
            <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-medium select-none">
              <Filter size={16} aria-hidden="true" />
              只读筛选
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => {
                  setSelectedEventId(event.id);
                  if (viewMode === 'calendar') setViewMode('detail');
                }}
                aria-label={`${event.title} ${event.date}`}
                className={cn(
                  "w-full p-4 rounded-2xl transition-all border text-left",
                  selectedEventId === event.id 
                    ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                    : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                )}
              >
                <div className="flex gap-2 mb-2">
                  <span className={cn("text-[12px] font-bold px-2 py-0.5 rounded-md border", sourceColors[event.source])}>
                    {sourceLabels[event.source]}
                  </span>
                  {event.priority === 'high' && (
                    <span className="text-[12px] font-bold px-2 py-0.5 rounded-md text-red-600 bg-red-50 border border-red-100">
                      高优先级
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{event.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium"><Calendar size={12} className="text-slate-400"/> {event.date} {event.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: detail view OR massive calendar */}
        {viewMode === 'detail' ? (
          <div
            data-pet-hint="任务详情页：往下滚可查看当前事项拆解和本地处理时间线。"
            className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col relative overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-300"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

            <motion.div 
              key={selectedEvent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-2 -mr-2"
            >
              <div className="flex items-center gap-3 mb-4">
                 <span className={cn("text-xs font-bold px-3 py-1 rounded-lg border", sourceColors[selectedEvent.source])}>
                  {sourceLabels[selectedEvent.source]}
                </span>
                {selectedEvent.priority === 'high' && (
                  <span className="text-xs font-bold px-3 py-1 rounded-lg text-rose-600 bg-rose-50 border border-rose-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    紧急待办
                  </span>
                )}
                 <span className="ml-auto inline-flex items-center gap-1.5 text-slate-400 text-xs font-medium select-none">
                   <MoreVertical size={20} aria-hidden="true" />
                   更多信息
                 </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">{selectedEvent.title}</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1 font-medium">计划时间</div>
                  <div className="font-bold text-slate-800 text-lg">{selectedEvent.date} {selectedEvent.time}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <div className="text-xs text-slate-500 mb-1 font-medium">动作要求 / 来源系统</div>
                  <div className="font-bold text-indigo-700 text-sm mt-1">{selectedEvent.actionRequired}</div>
                </div>
              </div>
              
              {/* Task Breakdown Area */}
              <div className="mb-6">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">当前事项拆解</h4>
                <div className="space-y-2 border border-slate-100 p-4 rounded-2xl bg-white shadow-sm">
                   {checklist.length > 0 ? checklist.map(sub => (
                       <div key={sub.id} className="flex items-center gap-3 group">
                         <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-colors", sub.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-emerald-400")}>
                            <CheckCircle2 size={12} className={cn(sub.done ? "opacity-100" : "opacity-0")} />
                         </div>
                         <span className={cn("text-[15px] font-medium transition-colors", sub.done ? "text-slate-400 line-through" : "text-slate-700")}>{sub.title}</span>
                         <span className="ml-auto text-[13px] text-slate-400 font-medium">{sub.estimate}</span>
                       </div>
                   )) : (
                     <div className="text-[14px] text-slate-500 leading-relaxed">
                       当前事项暂无拆解清单，可后续补充执行说明。
                     </div>
                   )}
                </div>
              </div>

              <div className="mt-auto space-y-4">
                {selectedEvent.writebackTimeline && selectedEvent.writebackTimeline.length > 0 && (
                  <WritebackTimeline
                    eventId={selectedEvent.id}
                    steps={selectedEvent.writebackTimeline}
                    recentlyAppendedIds={recentlyAppendedIds}
                  />
                )}
                <div className="flex gap-4">
                   <button className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] text-[15px]">
                     查看说明
                    </button>
                   {selectedEvent.url ? (
                      <a 
                       href={selectedEvent.url}
                       target="_blank"
                        rel="noreferrer"
                        className="flex-[2] flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98] group text-[15px]"
                      >
                        预留执行入口 
                        <ExternalLink size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <button className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98] text-[15px]">
                        预留执行入口
                      </button>
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-300"
          >
            {/* Calendar Header */}
             <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
               <div className="flex items-center gap-4">
                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">{calendarModel.monthLabel}</h2>
                  <span className="text-[13px] font-semibold text-slate-400">0 条日程记录</span>
               </div>
             </div>

            {/* Calendar Body */}
            <div className="flex-1 flex flex-col pt-2 bg-slate-50/50">
              {/* Days header */}
              <div className="grid grid-cols-7 border-b border-slate-200/60 pb-2 mx-1 shrink-0">
                {['周日','周一','周二','周三','周四','周五','周六'].map((day, i) => (
                  <div key={day} className={cn("text-xs font-bold text-center", i === 0 || i === 6 ? "text-slate-400" : "text-slate-600")}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="flex-1 grid grid-cols-7 gap-px bg-slate-200/60 mx-1 mb-1 mt-1 rounded-xl overflow-hidden border border-slate-200/60 shadow-inner" style={{ gridTemplateRows: `repeat(${Math.ceil(calendarModel.days.length / 7)}, minmax(0, 1fr))` }}>
                {calendarModel.days.map((dateObj, i) => {
                  const isToday = dateObj.key === calendarModel.todayKey;
                  const dayEvents = calendarModel.eventsByDate[dateObj.key] || [];
                  
                  return (
                    <div key={i} className="bg-white min-h-0 flex flex-col p-1.5 relative group">
                      <span className={cn(
                        "text-[15px] font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 shrink-0",
                        isToday ? "bg-indigo-600 text-white" : "",
                        dateObj.month !== 'curr' && !isToday && "text-slate-300",
                        dateObj.month === 'curr' && !isToday && "text-slate-700"
                      )}>
                        {dateObj.day}
                      </span>

                      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                        {dayEvents.map(e => (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => {
                              setSelectedEventId(e.id);
                              setViewMode('detail');
                            }}
                            aria-label={`${getEventTimeLabel(e.time)} ${e.title}`}
                            className={cn(
                              "w-full text-[13px] px-2 py-1.5 rounded-lg truncate transition-all font-semibold tabular-nums tracking-tight text-left",
                              stripColors[e.source as keyof typeof stripColors] || stripColors.system,
                              "hover:shadow-sm"
                            )}
                          >
                            {getEventTimeLabel(e.time)} {e.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
