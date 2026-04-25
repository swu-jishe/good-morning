import { Target, Milestone, Zap, BrainCircuit, ExternalLink, ChartCandlestick, Flag, TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import RadarChart from '../components/RadarChart';
import { ABILITY_RADAR } from '../data/academic';

interface StageProgress {
  subject: string;
  category: string;
  status: 'ahead' | 'on-track' | 'behind' | 'severely-behind';
  delta: string;
  detail: string;
  barPercent: number;
}

const STAGE_PROGRESS: StageProgress[] = [
  {
    subject: '专业课',
    category: '数据结构与算法',
    status: 'ahead',
    delta: '领先 5%',
    detail: '历年真题一刷完毕，错题率稳定 15% 内。图与树综合大题得分率显著提升。',
    barPercent: 72,
  },
  {
    subject: '数学',
    category: '高等数学 + 线性代数',
    status: 'on-track',
    delta: '符合规划',
    detail: '660 题第二轮进度 60%，线代两轮已过，概率论待开启。',
    barPercent: 55,
  },
  {
    subject: '英语',
    category: '英语一',
    status: 'behind',
    delta: '落后 3%',
    detail: '阅读正确率维稳 78%，作文仍需系统训练；近 5 年真题剩 2 套未做。',
    barPercent: 48,
  },
  {
    subject: '政治',
    category: '主观题背诵',
    status: 'severely-behind',
    delta: '落后 15%',
    detail: '马原原理解析准确率偏低，近代史主脉络记忆存在断层。已下发针对性背诵日程。',
    barPercent: 32,
  },
];

interface MilestoneItem {
  label: string;
  date: string;
  status: 'done' | 'next' | 'future';
}

const MILESTONES: MilestoneItem[] = [
  { label: '蓝桥杯国赛一等奖', date: '2025 年 6 月', status: 'done' },
  { label: '暑期专业课一轮', date: '2025 年 8 月', status: 'done' },
  { label: '考研政治一轮过境', date: '2025 年 9 月', status: 'done' },
  { label: '全国网报确认', date: '2025 年 10 月 25 日', status: 'next' },
  { label: '考研初试', date: '2025 年 12 月 21 日', status: 'future' },
  { label: '成绩公布 / 复试准备', date: '2026 年 2-3 月', status: 'future' },
];

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
  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="shrink-0">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">成长档案</h1>
        <p className="text-slate-500 font-medium">全局上下文与学习主线数据记录</p>
      </header>

      {/* Row 1: Long-term Goal (full width) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        data-pet-hint="主干长期目标：2026 年南大软工，目标分 385+，距初试 248 天，当前胜率评估 62%。"
        className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 relative overflow-hidden group hover:border-indigo-200 hover:shadow-md transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-bl-full rounded-tr-3xl -z-10 pointer-events-none" />
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Target size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">主干长期目标 · 2026 年双一流初试</h3>
              <div className="text-xs font-medium text-slate-500 mt-0.5">由策略 Agent 持续护航</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">距离初试</span>
              <span className="font-bold text-indigo-600 text-xl leading-none tabular-nums">248 <span className="text-xs text-indigo-400">天</span></span>
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1">
              同步至 Agent <ExternalLink size={12} />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-[13px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">报考院校</div>
            <div className="font-bold text-slate-800 text-[17px]">南京大学</div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-[13px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">报考专业</div>
            <div className="font-bold text-slate-800 text-[17px]">软件工程</div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-[13px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">目标分数</div>
            <div className="font-bold text-indigo-700 text-[17px] tabular-nums">385+</div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-[13px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">当前胜率评估</div>
            <div className="font-bold text-emerald-600 text-[17px]">62% 提升期</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>总复习进度</span>
            <span className="tabular-nums">45%</span>
          </div>
          <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
          </div>
          <div className="mt-2 flex justify-between text-[12px] font-semibold text-slate-400">
            <span>基础期</span>
            <span className="text-indigo-500">· 强化期（当前）</span>
            <span>冲刺期</span>
            <span>初试</span>
          </div>
        </div>
      </motion.div>

      {/* Row 2: Stage Progress (col-span-2) + Radar (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          data-pet-hint="4 学科对照：专业课领先、数学符合、英语微落后、政治落后最严重。系统建议重点抓政治背诵。"
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col hover:border-emerald-200 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ChartCandlestick size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">当前阶段进展</h3>
                <div className="text-xs font-medium text-slate-500 mt-0.5">10 月强化冲刺期 · 四大学科对照</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {STAGE_PROGRESS.map((item) => {
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
          data-pet-hint="多维能力雷达：6 维对比目标院校要求，红点是差距最大的维度——政治、英语、数学是重点突破方向。"
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col hover:border-amber-200 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-[17px] leading-tight">多维能力雷达</h3>
                <div className="text-[13px] text-slate-500 font-medium mt-0.5">当前 vs 目标要求</div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded uppercase tracking-widest">
              target-gap
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <RadarChart dimensions={ABILITY_RADAR} size={260} />
          </div>
        </motion.div>
      </div>

      {/* Row 3: Horizontal Milestones (col-span-2) + Agent Memory (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          data-pet-hint="学业主线时间轴：已完成蓝桥国赛一等奖、暑期一轮、政治一轮，下一个里程碑是 10/25 的网报确认。"
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col hover:border-rose-200 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Milestone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">阶段里程碑 · 主线时间轴</h3>
                <div className="text-xs font-medium text-slate-500 mt-0.5">过去成果 · 近期节点 · 未来规划</div>
              </div>
            </div>
            <span className="text-[12px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
              共 {MILESTONES.length} 节点
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center pt-2 pb-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 right-0 top-[22px] h-0.5 bg-slate-200 rounded-full" />
              <div
                className="absolute left-0 top-[22px] h-0.5 bg-indigo-400 rounded-full"
                style={{ width: `${((MILESTONES.findIndex((m) => m.status === 'next') + 0.5) / MILESTONES.length) * 100}%` }}
              />

              <div className="grid" style={{ gridTemplateColumns: `repeat(${MILESTONES.length}, minmax(0, 1fr))` }}>
                {MILESTONES.map((m) => {
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
          data-pet-hint="这是我记住的你：学科偏好、行为规律、个人特质。3 个 Agent 都会参考这些来给你个性化建议。"
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex flex-col hover:border-indigo-200 hover:shadow-md transition-all duration-300"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50/80 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <BrainCircuit size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-[17px] leading-tight">Agent 长期记忆摘要</h3>
              <div className="text-[13px] text-slate-500 font-medium mt-0.5">跨 Agent 共享上下文</div>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <div className="text-[12px] font-semibold text-indigo-600 uppercase tracking-widest mb-2">学科偏好</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium px-2 py-0.5 rounded-md">数学一</span>
                <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium px-2 py-0.5 rounded-md">英语一</span>
                <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium px-2 py-0.5 rounded-md">408 专业课</span>
              </div>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-indigo-600 uppercase tracking-widest mb-2">行为规律</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium px-2 py-0.5 rounded-md">偏好夜间复习</span>
                <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium px-2 py-0.5 rounded-md">需强制番茄钟</span>
              </div>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-indigo-600 uppercase tracking-widest mb-2">个人特质</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium px-2 py-0.5 rounded-md">抗压能力中等</span>
                <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium px-2 py-0.5 rounded-md">对截止日敏感</span>
              </div>
            </div>
          </div>

          <p className="mt-4 pt-4 border-t border-slate-100 text-[13px] text-slate-500 leading-relaxed font-medium">
            上述标签由信息研判、日程规划、策略支持三个 Agent 在底层上下文共享，确保输出建议与个人特质拟合。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
