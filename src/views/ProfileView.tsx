import { BookOpen, Target, Milestone, Zap, BrainCircuit, ExternalLink, GraduationCap, Award, ChartCandlestick } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ProfileView() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="flex items-end justify-between shrink-0">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">成长档案</h1>
           <p className="text-slate-500 font-medium">全局上下文与学习主线数据记录</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Long term goal and Stage Progress (Left Column) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           {/* Long term goal */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col relative overflow-hidden group cursor-pointer transition-all hover:shadow-md">
             <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1">
                  同步至 Agent <ExternalLink size={12} />
                </span>
             </div>
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                 <Target size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 text-lg">主干长期目标：2026年双一流初试</h3>
                  <div className="text-xs font-medium text-slate-500">距考研初试剩余 248 天</div>
               </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1 font-medium">报考院校</div>
                  <div className="font-bold text-slate-800">南京大学</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1 font-medium">报考专业</div>
                  <div className="font-bold text-slate-800">软件工程</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1 font-medium">目标分数</div>
                  <div className="font-bold text-indigo-700">385+</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1 font-medium">当前胜率评估</div>
                  <div className="font-bold text-emerald-600">62% (提升期)</div>
                </div>
             </div>
             
             {/* Progress */}
             <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>总复习进度</span>
                  <span>45%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
                </div>
             </div>
           </div>

           {/* Stage Progress */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                 <ChartCandlestick size={20} />
               </div>
               <h3 className="font-bold text-slate-900 text-lg">当前阶段进展（10月强化冲刺期）</h3>
             </div>
             
             <div className="space-y-4">
                {/* 1 */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3">
                   <div className="flex justify-between items-center">
                     <span className="font-bold text-slate-800 text-sm">专业课（数据结构与算法）</span>
                     <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">领先规划 5%</span>
                   </div>
                   <p className="text-xs text-slate-500 font-medium">已完成历年真题一刷，错题率维稳在 15% 以内。图与树的综合大题得分率显著提升。</p>
                </div>
                {/* 2 */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3">
                   <div className="flex justify-between items-center">
                     <span className="font-bold text-slate-800 text-sm">政治（主观题背诵）</span>
                     <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">落后规划 15%</span>
                   </div>
                   <p className="text-xs text-slate-500 font-medium">马原原理解析准确率偏低，近代史主脉络记忆存在断层。系统已下发警报并生成针对性背诵日程。</p>
                </div>
             </div>
           </div>
        </div>

        {/* Capability Profile and Context (Right Column) */}
        <div className="flex flex-col gap-6">
           
           {/* Capability Profile */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-md">多维能力画像</h3>
              </div>
              <div className="space-y-5">
                 {/* Item */}
                 <div>
                    <div className="flex justify-between text-[13px] font-bold text-slate-700 mb-2">
                       <span className="flex items-center gap-2"><GraduationCap size={14} className="text-slate-400" /> 学业 GPA</span>
                       <span>3.8 / 4.0</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[85%] rounded-full" />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[13px] font-bold text-slate-700 mb-2">
                       <span className="flex items-center gap-2"><Award size={14} className="text-slate-400" /> 竞赛参与</span>
                       <span>前 20%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[80%] rounded-full" />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[13px] font-bold text-slate-700 mb-2">
                       <span className="flex items-center gap-2"><BrainCircuit size={14} className="text-slate-400" /> 信息素养</span>
                       <span>极高</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[95%] rounded-full" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Context Summary for Agents */}
           <div className="bg-slate-900 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/30 blur-2xl rounded-full" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <BrainCircuit size={16} />
                </div>
                <h3 className="font-bold text-white text-md">Agent 长期记忆摘要</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                 <span className="bg-white/10 border border-white/10 text-white/90 text-[11px] font-medium px-2 py-1 rounded-lg">抗压能力中等</span>
                 <span className="bg-white/10 border border-white/10 text-white/90 text-[11px] font-medium px-2 py-1 rounded-lg">偏好夜间复习</span>
                 <span className="bg-white/10 border border-white/10 text-white/90 text-[11px] font-medium px-2 py-1 rounded-lg">数学一</span>
                 <span className="bg-white/10 border border-white/10 text-white/90 text-[11px] font-medium px-2 py-1 rounded-lg">英语一</span>
                 <span className="bg-white/10 border border-white/10 text-white/90 text-[11px] font-medium px-2 py-1 rounded-lg">需强制番茄钟限制</span>
              </div>
              <p className="mt-5 text-[11px] text-slate-400 leading-relaxed font-medium">
                上述标签已被所有 Agent（信息研判、日程编排、策略支持）在底层上下文中共享，以确保输出的建议与规划与你的个人特质绝对拟合。
              </p>
           </div>
           
           {/* Key Milestones */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Milestone size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-md">阶段里程碑</h3>
              </div>
              <div className="relative pl-4 border-l-2 border-slate-100 flex flex-col gap-6 pt-2">
                 <div className="relative">
                    <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[23px] top-1 outline outline-4 outline-white" />
                    <div className="text-xs font-bold text-slate-800">蓝桥杯国赛一等奖</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">2025年 6月</div>
                 </div>
                 <div className="relative">
                    <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[23px] top-1 outline outline-4 outline-white" />
                    <div className="text-xs font-bold text-slate-800">考研政治一轮过境</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">2025年 9月</div>
                 </div>
                 <div className="relative">
                    <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[23px] top-1 outline outline-4 outline-white bg-white border-2 border-indigo-500" />
                    <div className="text-xs font-bold text-indigo-700">全国网报确认</div>
                    <div className="text-[11px] text-indigo-500 mt-0.5 font-medium">即将到来 (10月25日)</div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
