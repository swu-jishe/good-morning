import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Clock, BookOpen, ChevronRight, Calendar, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { Sparkles } from 'lucide-react';

export default function DashboardView() {
  return (
    <div className="h-full flex flex-col">
      <header className="mb-6 flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">你好，李同学</h1>
          <p className="text-slate-500 mt-1 text-sm">今天是 10 月 23 日 星期三，距离考研初试还有 <span className="font-semibold text-indigo-600">60</span> 天</p>
        </div>
      </header>

      {/* Bento Grid layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 md:gap-5 pb-4">
        
        {/* Large Card: AI Briefing */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 col-span-1 md:col-span-8 md:row-span-3 flex flex-col group hover:shadow-md transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 text-indigo-700 p-2 rounded-xl">
              <Sparkles size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">今日 AI 研判简报</h2>
          </div>
          <div className="flex-1 flex flex-col">
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              昨夜至今，工作台新收录了 <span className="font-semibold text-slate-900">12 条</span> 动态信息。
              其中，南京大学研招网发布了<span className="text-rose-600 font-medium">考研报名确认通知</span>，截止时间与你的《计算机网络》实验报告冲突。建议将实验报告提前至今晚完成。
            </p>
            <div className="space-y-3 mt-auto">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700">将《计算机网络》实验上机提至今天 19:00</span>
                <button className="ml-auto text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-colors cursor-pointer">
                  一键排程
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Large Card: High Priority Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-rose-50 rounded-3xl p-6 shadow-sm border border-rose-100 col-span-1 md:col-span-4 md:row-span-3 flex flex-col hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-rose-100 text-rose-600 p-2 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <h2 className="text-lg font-bold text-rose-900">高优预警</h2>
            <span className="ml-auto bg-rose-200 text-rose-800 text-xs font-bold px-2 py-1 rounded-md">2 项</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            <a href="https://yz.chsi.com.cn/" target="_blank" rel="noreferrer" className="block bg-white p-4 rounded-2xl shadow-sm border border-rose-100/50 hover:border-rose-300 hover:shadow-md transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">考研重要时间节点</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">网上报名信息确认确认截止</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5"><Clock size={12} /> 剩不到 48 小时 (10/25 17:00)</p>
            </a>
            
            <a href="https://i.chaoxing.com/" target="_blank" rel="noreferrer" className="block bg-white p-4 rounded-2xl shadow-sm border border-rose-100/50 hover:border-rose-300 hover:shadow-md transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">课程作业冲突</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">数据库原理大作业提交</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5"><Clock size={12} /> 今晚 23:59 截止</p>
            </a>
          </div>
        </motion.div>

        {/* Medium Card: Today's Focus */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 col-span-1 md:col-span-4 md:row-span-3 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center mb-5 justify-between">
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              今日目标清单
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { title: '复习数据结构第一到第三章', type: '自主复习', color: 'text-indigo-600 bg-indigo-50', done: true },
              { title: '完成英语长难句每日一练', type: '日常打卡', color: 'text-blue-600 bg-blue-50', done: false },
              { title: '参加《网络安全》专家讲座', type: '学校活动', color: 'text-amber-600 bg-amber-50', done: false },
            ].map((task, i) => (
              <div key={i} className="flex gap-3 items-start group cursor-pointer">
                <div className={cn("mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors", task.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent group-hover:border-emerald-400")}>
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className={cn("text-sm font-medium transition-colors", task.done ? "text-slate-400 line-through" : "text-slate-700")}>{task.title}</h4>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded mt-1.5 inline-block border border-transparent", task.color, "group-hover:border-current/20")}>{task.type}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medium Card: Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-slate-900 rounded-3xl p-6 shadow-sm col-span-1 md:col-span-4 md:row-span-3 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <h2 className="text-md font-bold text-white mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-400" />
            时间轴 / 正在进行
          </h2>
          <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-px before:bg-slate-700">
            <div className="relative">
              <div className="absolute left-[-16px] w-3 h-3 bg-indigo-500 rounded-full border-4 border-slate-900 ring-2 ring-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <div className="text-xs text-indigo-300 font-medium mb-1">现在 (10:00 - 11:30)</div>
              <div className="text-sm font-semibold text-white">计算机网络 课程学习</div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-1">教学楼 B401</div>
            </div>
            <div className="relative opacity-60">
              <div className="absolute left-[-15px] w-2.5 h-2.5 bg-slate-600 rounded-full border-2 border-slate-900" />
              <div className="text-xs text-slate-400 mb-1">14:00 - 15:30</div>
              <div className="text-sm font-medium text-slate-200">考研政治 强化班（云端）</div>
            </div>
            <div className="relative opacity-60">
              <div className="absolute left-[-15px] w-2.5 h-2.5 bg-slate-600 rounded-full border-2 border-slate-900" />
              <div className="text-xs text-slate-400 mb-1">19:00 - 21:00</div>
              <div className="text-sm font-medium text-slate-200">数据库原理上机实验</div>
            </div>
          </div>
        </motion.div>

        {/* Small Cards: Sources Inbox */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-4 md:row-span-3 flex flex-col gap-4"
        >
          {/* Card 1 */}
          <a href="https://i.chaoxing.com/" target="_blank" rel="noreferrer" className="block bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex-1 hover:border-indigo-200 hover:shadow-md transition-shadow group cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">教务与课程</h3>
                <p className="text-xs text-slate-500 mt-0.5"><span className="text-indigo-600 font-semibold mr-1">2</span>条新作业发布</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0" size={20} />
          </a>
          
          {/* Card 2 */}
          <a href="https://yz.chsi.com.cn/" target="_blank" rel="noreferrer" className="block bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex-1 hover:border-indigo-200 hover:shadow-md transition-shadow group cursor-pointer flex items-center justify-between">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">考研资讯</h3>
                <p className="text-xs text-slate-500 mt-0.5"><span className="text-indigo-600 font-semibold mr-1">1</span>条目标院校动态</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0" size={20} />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
