import { motion } from 'motion/react';
import { Calendar, ListTodo, MoreVertical, Filter, ExternalLink, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { EventItem } from '../types';

export default function ScheduleView() {
  const [viewMode, setViewMode] = useState<'detail' | 'calendar'>('detail');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('1');

  const events: EventItem[] = [
    {
      id: '1',
      title: '南京大学研招网报名确认',
      date: '10月25日',
      time: '17:00 截止',
      source: 'exam',
      priority: 'high',
      summary: '请登录学信网完成2026年硕士研究生招生考试网上报名信息的确认，逾期未确认将无法参加考试。',
      actionRequired: '登录南大研招网系统',
      url: 'https://yz.chsi.com.cn/'
    },
    {
      id: '2',
      title: '《计算机网络》实验上机',
      date: '10月23日',
      time: '今天 19:00',
      source: 'course',
      priority: 'high',
      summary: '实验四：TCP/IP 协议分析。需要在机房完成。',
      actionRequired: '参加实验课',
      url: 'https://i.chaoxing.com/'
    },
    {
      id: '3',
      title: '蓝桥杯校内选拔赛报名',
      date: '10月28日',
      time: '全天',
      source: 'competition',
      priority: 'medium',
      summary: '第十五届蓝桥杯全国软件和信息技术专业人才大赛校内选拔赛通知。',
      actionRequired: '班群填写报名表',
      url: 'https://dasai.lanqiao.cn/'
    }
  ];

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

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  const generateCalendarDays = () => {
    const days = [];
    // prev month
    for(let i=28; i<=30; i++) days.push({ m: 'prev', d: i, dStr: `09-${i}` });
    // current month
    for(let i=1; i<=31; i++) days.push({ m: 'curr', d: i, dStr: `10-${i.toString().padStart(2, '0')}` });
    // next month
    for(let i=1; i<=1; i++) days.push({ m: 'next', d: i, dStr: `11-01` });
    return days;
  };
  const calendarDays = generateCalendarDays();

  const stripColors = {
    competition: 'bg-blue-100 text-blue-700 hover:bg-blue-200 text-[10px]',
    exam: 'bg-rose-100 text-rose-700 hover:bg-rose-200 text-[10px]',
    course: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-[10px]',
    activity: 'bg-amber-100 text-amber-700 hover:bg-amber-200 text-[10px]',
    system: 'bg-slate-200 text-slate-700 hover:bg-slate-300 text-[10px]',
  };

  const eventsByDateStr: Record<string, typeof events> = {
    '10-25': [events[0]],
    '10-23': [events[1]],
    '10-28': [events[2]]
  };

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
        <div className="w-full md:w-5/12 lg:w-1/3 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <span className="font-semibold text-slate-700 text-sm">本周重点清单</span>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1"><Filter size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {events.map((event) => (
              <div 
                key={event.id}
                onClick={() => {
                  setSelectedEventId(event.id);
                  if (viewMode === 'calendar') setViewMode('detail');
                }}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all border",
                  selectedEventId === event.id 
                    ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                    : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                )}
              >
                <div className="flex gap-2 mb-2">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", sourceColors[event.source])}>
                    {sourceLabels[event.source]}
                  </span>
                  {event.priority === 'high' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md text-red-600 bg-red-50 border border-red-100">
                      高优先级
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{event.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium"><Calendar size={12} className="text-slate-400"/> {event.date} {event.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: detail view OR massive calendar */}
        {viewMode === 'detail' ? (
          <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

            <motion.div 
              key={selectedEvent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
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
                {/* Orchestration Writeback Marker */}
                <span className="text-xs font-bold px-3 py-1 rounded-lg text-indigo-600 bg-indigo-50 border border-indigo-200 flex items-center gap-1">
                  <Sparkles size={12} /> 被 Agent 重新排期
                </span>
                <button className="ml-auto text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">{selectedEvent.title}</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1 font-medium">修改后执行时间</div>
                  <div className="font-bold text-slate-800 text-lg">{selectedEvent.date} {selectedEvent.time}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <div className="text-xs text-slate-500 mb-1 font-medium">动作要求 / 来源系统</div>
                  <div className="font-bold text-indigo-700 text-sm mt-1">{selectedEvent.actionRequired}</div>
                </div>
              </div>
              
              {/* Task Breakdown Area */}
              <div className="mb-6">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">智能任务拆解区</h4>
                <div className="space-y-2 border border-slate-100 p-4 rounded-2xl bg-white shadow-sm">
                   {[
                     { id: 1, title: '检查学信网账号密码是否可用', time: '预计 2 分钟', done: true },
                     { id: 2, title: '准备身份证正反面照片上传', time: '预计 5 分钟', done: false },
                     { id: 3, title: '登录系统完成在线承诺书签署', time: '预计 3 分钟', done: false }
                   ].map(sub => (
                      <div key={sub.id} className="flex items-center gap-3 group">
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-colors", sub.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-emerald-400")}>
                           <CheckCircle2 size={12} className={cn(sub.done ? "opacity-100" : "opacity-0")} />
                        </div>
                        <span className={cn("text-[13px] font-medium transition-colors", sub.done ? "text-slate-400 line-through" : "text-slate-700")}>{sub.title}</span>
                        <span className="ml-auto text-[11px] text-slate-400 font-medium">{sub.time}</span>
                      </div>
                   ))}
                </div>
              </div>

              {/* Execution Confirmation & Feedback Area */}
              <div className="mt-auto bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-bold text-slate-800">执行确认与回写状态</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                      <CheckCircle2 size={12} /> 已写入外部日程
                    </span>
                 </div>
                 <div className="flex gap-4">
                    <button className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] text-[13px]">
                      生成强提醒 (电话)
                    </button>
                    {selectedEvent.url ? (
                      <a 
                        href={selectedEvent.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-[2] flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98] group text-[13px]"
                      >
                        跳转外部执行 
                        <ExternalLink size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <button className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98] text-[13px]">
                        进入执行队列
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
            className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden"
          >
            {/* Calendar Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">2025年 10月</h2>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  <button className="p-1 px-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"><ChevronLeft size={18}/></button>
                  <button className="text-[13px] font-bold px-3 py-1 text-slate-600 hover:text-slate-900 transition-colors">今天</button>
                  <button className="p-1 px-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"><ChevronRight size={18}/></button>
                </div>
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
              <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-slate-200/60 mx-1 mb-1 mt-1 rounded-xl overflow-hidden border border-slate-200/60 shadow-inner">
                {calendarDays.map((dateObj, i) => {
                  const isToday = dateObj.m === 'curr' && dateObj.d === 23;
                  const dayEvents = eventsByDateStr[dateObj.dStr] || [];
                  
                  return (
                    <div key={i} className="bg-white min-h-0 flex flex-col p-1.5 relative group">
                      <span className={cn(
                        "text-[13px] font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 shrink-0",
                        isToday ? "bg-indigo-600 text-white" : "",
                        dateObj.m !== 'curr' && !isToday && "text-slate-300",
                        dateObj.m === 'curr' && !isToday && "text-slate-700"
                      )}>
                        {dateObj.d}
                      </span>

                      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                        {dayEvents.map(e => (
                          <div 
                            key={e.id}
                            onClick={() => {
                              setSelectedEventId(e.id);
                              setViewMode('detail');
                            }}
                            className={cn(
                              "text-[11px] px-2 py-1.5 rounded-lg cursor-pointer truncate transition-all font-semibold tabular-nums tracking-tight",
                              stripColors[e.source as keyof typeof stripColors] || stripColors.system,
                              "hover:shadow-sm"
                            )}
                          >
                            {e.time.split(' ')[0]} {e.title}
                          </div>
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
