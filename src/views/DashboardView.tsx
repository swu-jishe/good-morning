import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Calendar, Sparkles, BrainCircuit, Users, ExternalLink, GraduationCap, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function DashboardView() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto w-full">
      <header className="mb-5 flex items-end justify-between shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">聚合工作台</h1>
           <p className="text-xs text-slate-500 font-medium mt-1">今天是 10 月 23 日 星期三，系统已完成早间多源信息拉取。</p>
        </div>
      </header>

      {/* Bento Grid layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 pb-6 overflow-y-auto custom-scrollbar pr-2 min-h-0">
        
        {/* ROW 1: High Priority Risk (2 cols) & Decision Hub (1 col) */}
        
        {/* Large Card: Task Understanding */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-2 flex flex-col group hover:shadow-md transition-all duration-300 relative overflow-hidden h-full"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-bl-full -z-10 transition-transform duration-700 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-2xl shadow-inner">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">高优预警与任务理解</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">研判 Agent 已清洗 12 条常规动态，截获 <strong className="text-rose-500">1 条阻断级风险</strong>。</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-end">
             {/* Draggable Task Block */}
             <div 
                className="bg-slate-50/50 border-[1.5px] border-slate-200 border-dashed p-4 rounded-2xl flex flex-col gap-2 relative group/card hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-grab active:cursor-grabbing shadow-sm"
                draggable
                onDragStart={() => setDragActive(true)}
                onDragEnd={() => setDragActive(false)}
             >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 group-hover/card:text-indigo-400 transition-colors opacity-0 group-hover/card:opacity-100 hidden md:flex items-center justify-center p-1">
                  <GripVertical size={16} />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between md:pl-6 gap-2 sm:gap-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <AlertCircle size={12} /> 强动作阻断风险
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">来源: 研招网</span>
                  </div>
                  <div className="text-[11px] font-bold text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg group-hover/card:bg-indigo-600 group-hover/card:text-white transition-colors shadow-sm hidden sm:block">
                     拖拽至右侧发起编排
                  </div>
                </div>

                <div className="md:pl-6 space-y-1.5 mt-0.5">
                   <h3 className="font-bold text-slate-900 text-[15px]">考研报名信息网上确认预期冲突</h3>
                   <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                     官方截止时间为 <strong className="text-slate-800">10月25日 17:00</strong>。<br/>
                     在此刻之前存在与机房签到的直接重合，需主动重编。
                   </p>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Medium Card: Collaborative Decision */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-1 flex flex-col hover:shadow-md transition-all duration-300 relative overflow-hidden h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-2xl shadow-inner">
              <Users size={18} />
            </div>
            <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">协同决策网</h2>
          </div>

          <div className="space-y-3 flex-1 flex flex-col">
             <div className="grid grid-cols-1 gap-2 flex-1">
               <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1 transition-colors hover:bg-blue-50/50 hover:border-blue-100">
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />研判意见
                 </span>
                 <span className="text-xs text-slate-700 font-medium">耗时约15分，瓶颈是 IP 强制验证。</span>
               </div>
               <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1 transition-colors hover:bg-violet-50/50 hover:border-violet-100">
                 <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />策略护航
                 </span>
                 <span className="text-xs text-slate-700 font-medium">当前需以报考资格为最高权纲。</span>
               </div>
             </div>

             {/* Auto Height to push this to bottom */}
             <div className="mt-auto bg-indigo-600 p-3.5 rounded-xl flex items-start gap-2.5 shadow-md shadow-indigo-200 group">
                <CheckCircle2 size={16} className="text-indigo-200 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-indigo-200 font-bold mb-0.5 opacity-90 uppercase tracking-widest">一键推荐动作</div>
                  <div className="text-xs font-bold text-white leading-snug">
                    调剂至「今晚 19:00」，同步拦截周五 30 分钟。
                  </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* ROW 2: Timeline, Profile, Global Context */}

        {/* Timeline Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-slate-900 rounded-3xl p-5 md:p-6 shadow-sm lg:col-span-1 text-white relative overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <h2 className="text-[15px] font-bold text-white mb-6 flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
               <Calendar size={16} className="text-indigo-400" />
            </div>
            执行流 (今日)
          </h2>
          
          <div className="relative pl-5 space-y-6 flex-1 before:absolute before:inset-y-2 before:left-[9px] before:w-px before:bg-slate-800">
            <div className="relative">
              <div className="absolute left-[-23px] w-3.5 h-3.5 bg-indigo-500 rounded-full border-[3px] border-slate-900 ring-2 ring-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <div className="text-[10px] text-indigo-300 font-bold mb-0.5 tracking-widest uppercase">执行中 (10:00 - 11:30)</div>
              <div className="text-[13px] font-bold text-white tracking-wide">专业课 强化训练</div>
              <div className="text-[11px] text-slate-400 mt-1 font-medium line-clamp-1">图的历年真题选做</div>
            </div>
            
            <div className="relative opacity-60 hover:opacity-100 transition-opacity">
              <div className="absolute left-[-22px] w-2.5 h-2.5 bg-slate-600 rounded-full border-2 border-slate-900" />
              <div className="text-[10px] text-slate-400 mb-0.5 font-bold tracking-widest uppercase">空闲区块 (14:00 - 17:00)</div>
              <div className="text-[13px] font-bold text-slate-200">无硬性日程绑定</div>
            </div>

            <div className="relative opacity-90">
              <div className="absolute left-[-22px] w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              <div className="flex items-center gap-2 mb-0.5">
                 <div className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">编排槽位 (19:00开始)</div>
              </div>
              <div className="text-[13px] font-bold text-slate-100 mb-1.5">数据库原理上机实验</div>
              <span className="text-[9px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                 已建议调剂至此
              </span>
            </div>
          </div>
        </motion.div>

        {/* Profile Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-1 flex flex-col hover:border-orange-200 hover:shadow-md transition-all group relative overflow-hidden h-full"
        >
           <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
             <ExternalLink size={14} className="text-slate-300 hover:text-indigo-500 transition-colors" />
           </div>
           <div className="flex items-center gap-3 mb-5">
             <div className="w-10 h-10 rounded-2xl bg-orange-50/80 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
               <GraduationCap size={18} />
             </div>
             <div>
               <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-indigo-700 transition-colors">核心成长档案</h3>
               <p className="text-[11px] text-slate-500 mt-0.5 font-medium">主干目标：2026初试</p>
             </div>
           </div>
           
           <div className="flex-1 flex flex-col justify-center gap-4">
             <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div className="flex justify-between items-center text-[11px] font-bold mb-2.5">
                   <span className="text-slate-600">阶段：<span className="text-slate-900">强化期</span></span>
                   <span className="text-indigo-600">完成度 45%</span>
                </div>
                <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-indigo-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </div>
             </div>

             <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">数据结构达优</span>
                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded text-[10px] font-bold border border-rose-100">马原进度滞后</span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">夜间高能</span>
             </div>
           </div>
        </motion.div>

        {/* Global Context Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 lg:col-span-1 flex flex-col hover:border-purple-200 hover:shadow-md transition-all group relative h-full"
        >
           <div className="flex items-center gap-3 mb-5">
             <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
               <BrainCircuit size={18} />
             </div>
             <div>
               <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-indigo-700 transition-colors whitespace-nowrap">系统上下文嗅探</h3>
               <p className="text-[11px] text-slate-500 mt-0.5 font-medium">当前活跃的前置挂载点</p>
             </div>
           </div>
           
           <div className="flex-1 flex flex-col justify-center gap-3">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-2 h-2 shrink-0 bg-emerald-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                <div>
                   <div className="text-[12px] font-bold text-slate-800">研招网动态监控</div>
                   <div className="text-[10px] text-slate-500 font-medium mt-0.5">高敏截获 (实时)</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-2 h-2 shrink-0 bg-emerald-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                <div>
                   <div className="text-[12px] font-bold text-slate-800">学习通/教务处轮询</div>
                   <div className="text-[10px] text-slate-500 font-medium mt-0.5">课表感知 (依频率)</div>
                </div>
              </div>
           </div>
        </motion.div>

      </div>
    </div>
  );
}
