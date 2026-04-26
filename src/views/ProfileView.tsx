import { Target, Milestone, Zap, BrainCircuit, ExternalLink, ChartCandlestick, Flag, TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import RadarChart from '../components/RadarChart';
import { submissionContent } from '../content/submissionContent';

interface StageProgress {
  subject: string;
  category: string;
  status: 'ahead' | 'on-track' | 'behind' | 'severely-behind';
  delta: string;
  detail: string;
  barPercent: number;
}

interface MilestoneItem {
  label: string;
  date: string;
  status: 'done' | 'next' | 'future';
}

const statusStyle: Record<
  StageProgress['status'],
  { bg: string; text: string; border: string; bar: string; icon: typeof TrendingUp }
> = {
  ahead: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100',
    bar: 'bg-emerald-500',
    icon: TrendingUp,
  },
  'on-track': {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    bar: 'bg-slate-400',
    icon: Minus,
  },
  behind: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    bar: 'bg-amber-500',
    icon: TrendingDown,
  },
  'severely-behind': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-100',
    bar: 'bg-rose-500',
    icon: TrendingDown,
  },
};

export default function ProfileView() {
  const { overview, stageProgress, milestones, memorySections } = submissionContent.profile;
  const progressMarkers = ['起步', '待同步（当前）', '分析', '更新'];
  const abilityRadar = submissionContent.academic.abilityRadar;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="shrink-0">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">成长档案</h1>
        <p className="text-slate-500 font-medium">全局上下文与长期规划数据记录</p>
      </header>

      {/* Row 1: Long-term Goal (full width) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        data-pet-hint="这里展示长期规划总览、阶段完成度和关键指标卡，当前暂无新的业务记录。"
        className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 relative overflow-hidden group hover:border-indigo-200 hover:shadow-md transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-bl-full rounded-tr-3xl -z-10 pointer-events-none" />
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Target size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">{overview.title}</h3>
              <div className="text-xs font-medium text-slate-500 mt-0.5">{overview.subtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">当前阶段</span>
              <span className="font-bold text-indigo-600 text-xl leading-none tabular-nums">{overview.daysLabel}</span>
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1">
              查看说明 <ExternalLink size={12} />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {overview.cards.map((card) => (
            <div key={card.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="text-[13px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">{card.label}</div>
              <div className="font-bold text-slate-800 text-[17px]">{card.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>总复习进度</span>
            <span className="tabular-nums">{overview.progress}%</span>
          </div>
          <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" style={{ width: `${overview.progress}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[12px] font-semibold text-slate-400">
            {progressMarkers.map((label, index) => (
              <span key={label} className={index === 1 ? 'text-indigo-500' : undefined}>{index === 1 ? `· ${label}` : label}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Row 2: Stage Progress (col-span-2) + Radar (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          data-pet-hint="这里对照不同维度的阶段进展，当前暂无新的进展记录。"
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col hover:border-emerald-200 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ChartCandlestick size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">当前阶段进展</h3>
                <div className="text-xs font-medium text-slate-500 mt-0.5">当前空态 · 核心维度对照</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {stageProgress.map((item: StageProgress) => {
              const s = statusStyle[item.status];
              const Icon = s.icon;
              return (
                <div
                  key={item.subject}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-[16px] leading-tight truncate">
                        {item.subject}
                      </div>
                      <div className="text-[13px] text-slate-500 font-medium mt-0.5 truncate">
                        {item.category}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-[12.5px] font-semibold px-2 py-1 rounded-md border shrink-0',
                        s.bg,
                        s.text,
                        s.border,
                      )}
                    >
                      <Icon size={11} />
                      {item.delta}
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', s.bar)}
                      style={{ width: `${item.barPercent}%` }}
                    />
                  </div>

                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          data-pet-hint="这里展示能力雷达与目标基线之间的差距，当前暂无分析结果。"
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col hover:border-amber-200 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-[17px] leading-tight">多维能力雷达</h3>
                <div className="text-[13px] text-slate-500 font-medium mt-0.5">当前 0 vs 目标 0</div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded uppercase tracking-widest">
              0-gap
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <RadarChart dimensions={abilityRadar} size={260} />
          </div>
        </motion.div>
      </div>

      {/* Row 3: Horizontal Milestones (col-span-2) + Agent Memory (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          data-pet-hint="这里展示阶段里程碑时间轴，当前暂无新的里程碑日期。"
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col hover:border-rose-200 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Milestone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">阶段里程碑 · 主线时间轴</h3>
                <div className="text-xs font-medium text-slate-500 mt-0.5">当前状态 · 后续节点 · 未来规划</div>
              </div>
            </div>
            <span className="text-[12px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
              共 {milestones.length} 节点
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center pt-2 pb-4">
            <div className="relative">
              {/* Timeline line */}
               <div className="absolute left-0 right-0 top-[22px] h-0.5 bg-slate-200 rounded-full" />
               <div
                  className="absolute left-0 top-[22px] h-0.5 bg-indigo-400 rounded-full"
                  style={{ width: '0%' }}
                />

               <div className="grid" style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}>
                 {milestones.map((m: MilestoneItem) => {
                   const isNext = m.status === 'next';
                   const isDone = m.status === 'done';
                   return (
                    <div key={m.label} className="flex flex-col items-center text-center px-1">
                      <div
                        className={cn(
                          'relative z-10 rounded-full flex items-center justify-center border-[3px] bg-white shadow-sm',
                          isDone && 'w-11 h-11 border-emerald-500 text-emerald-600',
                          isNext && 'w-11 h-11 border-indigo-500 text-indigo-600 ring-4 ring-indigo-100',
                          !isDone && !isNext && 'w-9 h-9 border-slate-200 text-slate-300',
                        )}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : isNext ? <Flag size={16} /> : <span className="w-2 h-2 rounded-full bg-slate-300" />}
                      </div>
                      <div className={cn(
                        'mt-2.5 text-[14px] font-bold leading-tight line-clamp-2',
                        isDone && 'text-slate-700',
                        isNext && 'text-indigo-700',
                        !isDone && !isNext && 'text-slate-400',
                      )}>
                        {m.label}
                      </div>
                      <div className={cn(
                        'text-[12px] font-semibold mt-1',
                        isNext ? 'text-indigo-500' : 'text-slate-400',
                      )}>
                        {m.date}
                      </div>
                      {isNext && (
                        <span className="mt-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-widest">
                          即将到来
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          data-pet-hint="这里展示共享记忆摘要，说明系统当前保留的跨页面上下文。"
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex flex-col hover:border-indigo-200 hover:shadow-md transition-all duration-300"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50/80 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <BrainCircuit size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-[17px] leading-tight">共享记忆摘要</h3>
              <div className="text-[13px] text-slate-500 font-medium mt-0.5">跨页面共享的业务上下文</div>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {memorySections.map((section) => (
              <div key={section.title}>
                <div className="text-[12px] font-semibold text-indigo-600 uppercase tracking-widest mb-2">{section.title}</div>
                <div className="flex flex-wrap gap-1.5">
                  {section.items.map((item) => (
                    <span key={item} className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium px-2 py-0.5 rounded-md">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 pt-4 border-t border-slate-100 text-[13px] text-slate-500 leading-relaxed font-medium">
            上述标签由统一内容层共享，便于不同页面在零数据状态下保持一致的业务上下文。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
