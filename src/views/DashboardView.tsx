import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Calendar, Sparkles, BrainCircuit, Users, ExternalLink, GraduationCap, GripVertical, ArrowUpRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '../lib/utils';
import WorkflowVisualizer from '../components/WorkflowVisualizer';
import { PageType } from '../types';
import { usePet } from '../context/PetContext';

interface DashboardViewProps {
  onNavigate?: (page: PageType, focusEventId?: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [dragActive, setDragActive] = useState(false);
  const dragOccurredRef = useRef(false);
  const { speak: petSpeak } = usePet();

  return (
    <div className="h-full flex flex-col w-full">
      <header className="mb-5 flex items-end justify-between shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">聚合工作台</h1>
           <p className="text-xs text-slate-500 font-medium mt-1">今天是 10 月 23 日 星期三，系统已完成早间多源信息拉取。</p>
        </div>
      </header>

      {/* Bento Grid layout (6-col base: row1 = 3+3 equal, row2 = 2+2+2) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 pb-6 overflow-y-auto custom-scrollbar pr-2 min-h-0">
        
        {/* ROW 1: High Priority Risk (3 cols) & Decision Hub (3 cols) - equal */}
        
        {/* Card: Task Understanding */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          data-pet-hint="高优预警区。研判 Agent 已清洗 12 条动态，现在有 1 条阻断级风险——考研报名死线。可以点击或拖到右侧 Agent 抽屉编排。"
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-3 flex flex-col group hover:border-indigo-200 hover:shadow-md transition-all duration-300 relative"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/40 rounded-bl-full rounded-tr-3xl -z-10 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-2xl shadow-inner">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">高优预警与任务理解</h2>
              <p className="text-[13px] text-slate-500 font-medium mt-0.5">研判 Agent 多源信息摘清洗</p>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex flex-col items-center justify-center">
              <div className="text-[20px] font-bold text-slate-800 leading-none tabular-nums">12</div>
              <div className="text-[12px] text-slate-500 font-semibold mt-1">已清洗</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 flex flex-col items-center justify-center">
              <div className="text-[20px] font-bold text-amber-700 leading-none tabular-nums">3</div>
              <div className="text-[12px] text-amber-700 font-semibold mt-1">待评估</div>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 flex flex-col items-center justify-center">
              <div className="text-[20px] font-bold text-rose-600 leading-none tabular-nums">1</div>
              <div className="text-[12px] text-rose-600 font-semibold mt-1">阻断级</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
             {/* Draggable + Clickable Task Block */}
             <div 
                role="button"
                tabIndex={0}
                data-pet-hint="这条是考研报名死线，漏掉就无法参加考试！可以单击看详情，或直接拖到右侧 Agent 抽屉编排～"
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
                  petSpeak('P0 死线！我跟你一起过去 Agent 抽屉，让规划 Agent 帮你重排～', 4000);
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
                    <AlertCircle size={12} /> 阻断风险
                  </span>
                  <span className="text-[12px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">研招网</span>
                </div>

                <div className="md:pl-5 space-y-1.5 mt-0.5">
                   <h3 className="font-bold text-slate-900 text-[16px] leading-snug">考研报名确认预期冲突</h3>
                   <p className="text-[13.5px] text-slate-600 font-medium leading-relaxed">
                     官方截止 <strong className="text-slate-800">10 月 25 日 17:00</strong>，与机房签到直接重合，需主动重编。
                   </p>
                </div>

                <div className="md:pl-5 mt-1 flex flex-wrap gap-1.5">
                  <span className="text-[12px] font-semibold text-slate-500 border border-slate-200 bg-white px-2 py-0.5 rounded inline-flex items-center gap-1">
                    点击查看 <ArrowUpRight size={10} />
                  </span>
                  <span className="text-[12px] font-semibold text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded group-hover/card:bg-indigo-600 group-hover/card:text-white transition-colors">
                    或拖至右侧
                  </span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Card: Collaborative Decision (single-column full workflow) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          data-pet-hint="协同决策网：三个子 Agent 并行处理冲突，主控裁决后输出推荐动作——这就是报告里的多智能体协同工作流。"
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
                <p className="text-xs text-slate-500 font-medium mt-0.5">Multi-Agent 任务理解 · 分解 · 裁决</p>
              </div>
            </div>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              正在处理：报名确认冲突
            </span>
          </div>

          <div className="flex flex-col">
            <WorkflowVisualizer />
          </div>

          <div className="mt-4 bg-indigo-600 p-3.5 rounded-2xl flex items-start gap-2.5 shadow-md shadow-indigo-200">
            <CheckCircle2 size={16} className="text-indigo-200 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-indigo-200 font-semibold mb-0.5 uppercase tracking-widest">主控裁决 · 当前推荐动作</div>
              <div className="text-[15px] font-bold text-white leading-snug">
                调剂至「今晚 19:00」，同步拦截周五 30 分钟。
              </div>
            </div>
          </div>
        </motion.div>

        {/* ROW 2: Timeline, Profile, Global Context */}

        {/* Timeline Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          data-pet-hint="今日执行流：上午执行中是专业课强化，晚上 19:00 是 Agent 刚帮你排过的计网实验。"
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-2 relative flex flex-col hover:border-indigo-200 hover:shadow-md transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -z-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/60 rounded-full blur-3xl"></div>
          </div>
          <h2 className="text-[17px] font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
               <Calendar size={16} className="text-indigo-600" />
            </div>
            执行流 (今日)
          </h2>
          
          <div className="relative pl-5 space-y-6 flex-1 before:absolute before:inset-y-2 before:left-[9px] before:w-px before:bg-slate-200">
            <div className="relative">
              <div className="absolute left-[-23px] w-3.5 h-3.5 bg-indigo-500 rounded-full border-[3px] border-white ring-2 ring-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <div className="text-[12px] text-indigo-600 font-bold mb-0.5 tracking-widest uppercase">执行中 (10:00 - 11:30)</div>
              <div className="text-[15px] font-bold text-slate-900 tracking-wide">专业课 强化训练</div>
              <div className="text-[13px] text-slate-500 mt-1 font-medium line-clamp-1">图的历年真题选做</div>
            </div>
            
            <div className="relative opacity-70 hover:opacity-100 transition-opacity">
              <div className="absolute left-[-22px] w-2.5 h-2.5 bg-slate-300 rounded-full border-2 border-white" />
              <div className="text-[12px] text-slate-400 mb-0.5 font-bold tracking-widest uppercase">空闲区块 (14:00 - 17:00)</div>
              <div className="text-[15px] font-bold text-slate-600">无硬性日程绑定</div>
            </div>

            <div className="relative">
              <div className="absolute left-[-22px] w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              <div className="flex items-center gap-2 mb-0.5">
                 <div className="text-[12px] text-emerald-700 font-bold tracking-widest uppercase">编排槽位 (19:00 开始)</div>
              </div>
              <div className="text-[15px] font-bold text-slate-800 mb-1.5">数据库原理上机实验</div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                 已建议调剂至此
              </span>
            </div>
          </div>
        </motion.div>

        {/* Profile Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          data-pet-hint="核心成长档案：主干目标 2026 双一流初试，强化期进度 45%，细节在成长档案页。"
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
               <p className="text-[13px] text-slate-500 mt-0.5 font-medium">主干目标：2026初试</p>
             </div>
           </div>
           
           <div className="flex-1 flex flex-col justify-center gap-4">
             <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div className="flex justify-between items-center text-[13px] font-bold mb-2.5">
                   <span className="text-slate-600">阶段：<span className="text-slate-900">强化期</span></span>
                   <span className="text-indigo-600">完成度 45%</span>
                </div>
                <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-indigo-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </div>
             </div>

             <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[12px] font-bold">数据结构达优</span>
                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded text-[12px] font-bold border border-rose-100">马原进度滞后</span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[12px] font-bold">夜间高能</span>
             </div>
           </div>
        </motion.div>

        {/* Global Context Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
          data-pet-hint="系统正在监控的信息源：研招网实时截获、学习通按课表轮询，出了动静会立刻提醒你。"
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-2 flex flex-col hover:border-violet-200 hover:shadow-md transition-all group relative"
        >
           <div className="flex items-center gap-3 mb-5">
             <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
               <BrainCircuit size={18} />
             </div>
             <div>
               <h3 className="font-bold text-slate-800 text-[17px] group-hover:text-indigo-700 transition-colors whitespace-nowrap">系统上下文嗅探</h3>
               <p className="text-[13px] text-slate-500 mt-0.5 font-medium">当前活跃的前置挂载点</p>
             </div>
           </div>
           
           <div className="flex-1 flex flex-col justify-center gap-3">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-2 h-2 shrink-0 bg-emerald-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                <div>
                   <div className="text-[14px] font-bold text-slate-800">研招网动态监控</div>
                   <div className="text-[12px] text-slate-500 font-medium mt-0.5">高敏截获 (实时)</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-2 h-2 shrink-0 bg-emerald-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                <div>
                   <div className="text-[14px] font-bold text-slate-800">学习通/教务处轮询</div>
                   <div className="text-[12px] text-slate-500 font-medium mt-0.5">课表感知 (依频率)</div>
                </div>
              </div>
           </div>
        </motion.div>

      </div>
    </div>
  );
}
