import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Calendar, Sparkles, BrainCircuit, Users, ExternalLink, GraduationCap, GripVertical, ArrowUpRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '../lib/utils';
import WorkflowVisualizer from '../components/WorkflowVisualizer';
import { PageType } from '../types';
import { usePet } from '../context/PetContext';
import { submissionContent } from '../content/submissionContent';

interface DashboardViewProps {
  onNavigate?: (page: PageType, focusEventId?: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [dragActive, setDragActive] = useState(false);
  const dragOccurredRef = useRef(false);
  const { speak: petSpeak } = usePet();
  const { metrics, primaryCard, recommendation, timeline, profileSummary, monitors } = submissionContent.dashboard;

  const metricStyles = {
    neutral: {
      card: 'bg-slate-50 border-slate-100',
      value: 'text-slate-800',
      label: 'text-slate-500',
    },
    attention: {
      card: 'bg-amber-50 border-amber-100',
      value: 'text-amber-700',
      label: 'text-amber-700',
    },
    stable: {
      card: 'bg-emerald-50 border-emerald-100',
      value: 'text-emerald-600',
      label: 'text-emerald-600',
    },
  } as const;

  return (
    <div className="h-full flex flex-col w-full">
      <header className="mb-5 flex items-end justify-between shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">聚合工作台</h1>
           <p className="text-xs text-slate-500 font-medium mt-1">{submissionContent.dashboard.subtitle}</p>
        </div>
      </header>

      {/* Bento Grid layout (6-col base: row1 = 3+3 equal, row2 = 2+2+2) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 pb-6 overflow-y-auto custom-scrollbar pr-2 min-h-0">
        
        {/* ROW 1: High Priority Risk (3 cols) & Decision Hub (3 cols) - equal */}
        
        {/* Card: Task Understanding */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          data-pet-hint="这里展示首页摘要卡，可单击查看详情，或拖到右侧协同抽屉继续整理。"
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-3 flex flex-col group hover:border-indigo-200 hover:shadow-md transition-all duration-300 relative"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/40 rounded-bl-full rounded-tr-3xl -z-10 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-2xl shadow-inner">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">高优预警与任务理解</h2>
               <p className="text-[13px] text-slate-500 font-medium mt-0.5">系统摘要与零数据状态总览</p>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {metrics.map((metric) => {
              const style = metricStyles[metric.tone];
              return (
                <div
                  key={metric.label}
                  className={cn(
                    'rounded-xl p-2.5 flex flex-col items-center justify-center border',
                    style.card,
                  )}
                >
                  <div className={cn('text-[20px] font-bold leading-none tabular-nums', style.value)}>{metric.value}</div>
                  <div className={cn('text-[12px] font-semibold mt-1', style.label)}>{metric.label}</div>
                </div>
              );
            })}
          </div>

          <div className="flex-1 flex flex-col">
             {/* Draggable + Clickable Task Block */}
              <div 
                 role="button"
                 tabIndex={0}
                 data-pet-hint="这是一张首页重点卡片，可以单击查看详情，或直接拖到右侧协同抽屉。"
                 data-pet-hint-delay="1500"
                 className={cn(
                  "border-[1.5px] border-dashed p-4 rounded-2xl flex flex-col gap-2 relative group/card transition-all cursor-grab active:cursor-grabbing shadow-sm",
                  dragActive
                    ? "bg-indigo-50/70 border-indigo-400 ring-4 ring-indigo-200 scale-[1.01]"
                    : "bg-slate-50/50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20",
                )}
                draggable
                 onDragStart={() => {
                   setDragActive(true);
                   dragOccurredRef.current = true;
                   petSpeak('我陪你把这张卡片带到右侧协同抽屉，继续整理下一步。', 4000);
                 }}
                onDragEnd={() => {
                  setDragActive(false);
                  window.setTimeout(() => {
                    dragOccurredRef.current = false;
                  }, 120);
                }}
                onClick={() => {
                  if (dragOccurredRef.current) return;
                  onNavigate?.('schedule', '1');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate?.('schedule', '1');
                  }
                }}
             >
                <div className="absolute left-2 top-3 text-slate-300 group-hover/card:text-indigo-400 transition-colors opacity-0 group-hover/card:opacity-100 hidden md:flex items-center justify-center">
                  <GripVertical size={14} />
                </div>
                
                <div className="flex flex-wrap items-center gap-1.5 md:pl-5">
                  <span className="text-[12px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <AlertCircle size={12} /> 重点关注
                  </span>
                  <span className="text-[12px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">{primaryCard.sourceLabel}</span>
                </div>

                <div className="md:pl-5 space-y-1.5 mt-0.5">
                   <h3 className="font-bold text-slate-900 text-[16px] leading-snug">{primaryCard.title}</h3>
                   <p className="text-[13.5px] text-slate-600 font-medium leading-relaxed">
                     {primaryCard.summary}
                   </p>
                </div>

                <div className="md:pl-5 mt-1 flex flex-wrap gap-1.5">
                  <span className="text-[12px] font-semibold text-slate-500 border border-slate-200 bg-white px-2 py-0.5 rounded inline-flex items-center gap-1">
                    {primaryCard.actionLabel} <ArrowUpRight size={10} />
                  </span>
                  <span className="text-[12px] font-semibold text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded group-hover/card:bg-indigo-600 group-hover/card:text-white transition-colors">
                    {primaryCard.secondaryLabel}
                  </span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Card: Collaborative Decision (single-column full workflow) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          data-pet-hint="这里展示协同工作流页面，用于说明信息如何汇总成推荐动作。"
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-3 flex flex-col hover:border-emerald-200 hover:shadow-md transition-all duration-300 relative"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/40 rounded-bl-full rounded-tr-3xl -z-10 pointer-events-none" />
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-2xl shadow-inner">
                <Users size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">协同决策网</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">并行理解 · 分析 · 汇总</p>
              </div>
            </div>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              当前状态：等待数据同步
            </span>
          </div>

          <div className="flex flex-col">
            <WorkflowVisualizer />
          </div>

          <div className="mt-4 bg-indigo-600 p-3.5 rounded-2xl flex items-start gap-2.5 shadow-md shadow-indigo-200">
            <CheckCircle2 size={16} className="text-indigo-200 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-indigo-200 font-semibold mb-0.5 uppercase tracking-widest">主控汇总 · {recommendation.label}</div>
              <div className="text-[15px] font-bold text-white leading-snug">
                {recommendation.title}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ROW 2: Timeline, Profile, Global Context */}

        {/* Timeline Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          data-pet-hint="这里展示时间区块的布局结构，当前暂无新的业务时间记录。"
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-2 relative flex flex-col hover:border-indigo-200 hover:shadow-md transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -z-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/60 rounded-full blur-3xl"></div>
          </div>
          <h2 className="text-[17px] font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
               <Calendar size={16} className="text-indigo-600" />
            </div>
            时间区块
          </h2>
          
          <div className="relative pl-5 space-y-6 flex-1 before:absolute before:inset-y-2 before:left-[9px] before:w-px before:bg-slate-200">
            {timeline.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === timeline.length - 1;
              return (
                <div key={`${item.window}-${item.title}`} className={cn('relative', !isFirst && 'opacity-80 hover:opacity-100 transition-opacity')}>
                  <div
                    className={cn(
                      'absolute border-2 border-white rounded-full',
                      isFirst && 'left-[-23px] w-3.5 h-3.5 bg-indigo-500 ring-2 ring-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.5)]',
                      !isFirst && !isLast && 'left-[-22px] w-2.5 h-2.5 bg-slate-300',
                      isLast && 'left-[-22px] w-3 h-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
                    )}
                  />
                  <div className={cn('text-[12px] font-bold mb-0.5 tracking-widest uppercase', isFirst ? 'text-indigo-600' : isLast ? 'text-emerald-700' : 'text-slate-400')}>
                    {item.window}
                  </div>
                  <div className={cn('text-[15px] font-bold tracking-wide', isFirst ? 'text-slate-900' : isLast ? 'text-slate-800 mb-1.5' : 'text-slate-600')}>
                    {item.title}
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1 font-medium line-clamp-2">{item.detail}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Profile Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          data-pet-hint="这里展示长期规划摘要和阶段完成度，当前为零数据状态。"
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-2 flex flex-col hover:border-amber-200 hover:shadow-md transition-all group relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
             <ExternalLink size={14} className="text-slate-300 hover:text-indigo-500 transition-colors" />
           </div>
           <div className="flex items-center gap-3 mb-5">
             <div className="w-10 h-10 rounded-2xl bg-amber-50/80 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
               <GraduationCap size={18} />
             </div>
              <div>
                <h3 className="font-bold text-slate-800 text-[17px] group-hover:text-indigo-700 transition-colors">核心成长档案</h3>
                 <p className="text-[13px] text-slate-500 mt-0.5 font-medium">主干目标：{profileSummary.goal}</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                 <div className="flex justify-between items-center text-[13px] font-bold mb-2.5">
                    <span className="text-slate-600">阶段：<span className="text-slate-900">{profileSummary.stage}</span></span>
                    <span className="text-indigo-600">{profileSummary.progressLabel}</span>
                 </div>
                 <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                   <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: profileSummary.progressLabel.replace(/[^\d]/g, '') + '%' }} />
                 </div>
              </div>

              <div className="flex flex-wrap gap-2">
                 {profileSummary.tags.map((tag) => (
                   <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[12px] font-bold">
                     {tag}
                   </span>
                 ))}
              </div>
            </div>
         </motion.div>

        {/* Global Context Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
          data-pet-hint="这里展示当前系统会维护的上下文模块，说明哪些内容正在等待同步。"
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-2 flex flex-col hover:border-violet-200 hover:shadow-md transition-all group relative"
        >
           <div className="flex items-center gap-3 mb-5">
             <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
               <BrainCircuit size={18} />
             </div>
              <div>
                 <h3 className="font-bold text-slate-800 text-[17px] group-hover:text-indigo-700 transition-colors whitespace-nowrap">系统上下文摘要</h3>
                 <p className="text-[13px] text-slate-500 mt-0.5 font-medium">当前等待同步的内容维护项</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-3">
               {monitors.map((item) => (
                 <div key={item.title} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div className="w-2 h-2 shrink-0 bg-emerald-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                   <div>
                      <div className="text-[14px] font-bold text-slate-800">{item.title}</div>
                      <div className="text-[12px] text-slate-500 font-medium mt-0.5">{item.detail}</div>
                   </div>
                 </div>
               ))}
            </div>
         </motion.div>

      </div>
    </div>
  );
}
