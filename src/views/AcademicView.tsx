import { motion } from 'motion/react';
import {
  GraduationCap,
  TrendingUp,
  Target,
  AlertTriangle,
  Info,
  BookOpen,
  Sparkles,
  Network,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  GPA_BY_SEMESTER,
  CURRENT_GPA,
  TARGET_GPA,
  CREDIT_CATEGORIES,
  ONGOING_COURSES,
  KNOWLEDGE_NODES,
  KNOWLEDGE_EDGES,
  CREDIT_WARNINGS,
} from '../data/academic';

const riskStyles = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  high: 'bg-rose-50 text-rose-700 border-rose-100',
};

const riskLabels = { low: '稳定', medium: '需关注', high: '高风险' };

const masteryColors = {
  done: { fill: '#10b981', stroke: '#047857', text: '#fff' },
  ongoing: { fill: '#f59e0b', stroke: '#b45309', text: '#fff' },
  locked: { fill: '#e2e8f0', stroke: '#94a3b8', text: '#64748b' },
};

function GpaCard() {
  const maxGpa = 4.0;
  const maxValue = Math.max(...GPA_BY_SEMESTER.map((s) => s.value));
  const minValue = Math.min(...GPA_BY_SEMESTER.map((s) => s.value));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <TrendingUp size={18} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-[17px]">实时 GPA 测算</h3>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">
            由 <span className="font-bold text-violet-600">gpa-early-warning</span> Skill 驱动
          </p>
        </div>
      </div>

      <div className="flex items-end gap-3 mb-5">
        <div className="text-[45px] font-bold text-slate-900 leading-none tracking-tight tabular-nums">
          {CURRENT_GPA.toFixed(2)}
        </div>
        <div className="text-sm text-slate-500 font-semibold pb-1">/ {maxGpa.toFixed(1)}</div>
        <div className="ml-auto text-right">
          <div className="text-[12px] text-slate-400 font-semibold uppercase tracking-wider">距目标 {TARGET_GPA.toFixed(1)}</div>
          <div className="text-[15px] font-bold text-indigo-600 flex items-center gap-1.5 justify-end tabular-nums">
            <Target size={12} />
            +{(TARGET_GPA - CURRENT_GPA).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">
            5 学期趋势
          </div>
          <div className="text-[11px] text-slate-400 font-semibold tabular-nums">
            {minValue.toFixed(2)} → {maxValue.toFixed(2)}
          </div>
        </div>
        {(() => {
          // Zoomed baseline: amplify small GPA differences visually
          const chartMin = 3.4;
          const chartMax = 4.0;
          return (
            <>
              <div className="flex items-end gap-2 h-32">
                {GPA_BY_SEMESTER.map((s, i) => {
                  const isLatest = i === GPA_BY_SEMESTER.length - 1;
                  const heightRatio = Math.max(
                    8,
                    ((s.value - chartMin) / (chartMax - chartMin)) * 100,
                  );
                  return (
                    <div
                      key={s.label}
                      className="flex-1 flex flex-col items-center justify-end h-full min-w-0"
                    >
                      <div
                        className={cn(
                          'text-[11px] font-bold mb-1.5 tabular-nums',
                          isLatest ? 'text-indigo-600' : 'text-slate-500',
                        )}
                      >
                        {s.value.toFixed(2)}
                      </div>
                      <div
                        className={cn(
                          'w-14 rounded-lg transition-all',
                          isLatest
                            ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                            : 'bg-slate-200',
                        )}
                        style={{ height: `${heightRatio}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-2">
                {GPA_BY_SEMESTER.map((s, i) => {
                  const isLatest = i === GPA_BY_SEMESTER.length - 1;
                  return (
                    <div
                      key={s.label}
                      className={cn(
                        'flex-1 text-[11px] font-semibold text-center min-w-0',
                        isLatest ? 'text-indigo-700' : 'text-slate-500',
                      )}
                    >
                      {s.label}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}

function CreditCard() {
  const totalEarned = CREDIT_CATEGORIES.reduce((a, c) => a + c.earned, 0);
  const totalRequired = CREDIT_CATEGORIES.reduce((a, c) => a + c.required, 0);
  const ratio = totalEarned / totalRequired;
  const circ = 2 * Math.PI * 36;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <GraduationCap size={18} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-[17px]">毕业学分进度</h3>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">培养方案对照</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative shrink-0 w-[84px] h-[84px]">
          <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
            <circle cx="42" cy="42" r="36" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="42"
              cy="42"
              r="36"
              fill="none"
              stroke="#6366f1"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circ * ratio} ${circ}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[20px] font-bold text-slate-900 leading-none tabular-nums">
              {Math.round(ratio * 100)}%
            </div>
            <div className="text-[11px] text-slate-400 font-bold mt-0.5">已达成</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[13px] text-slate-500 font-semibold mb-1">总学分</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[25px] font-bold text-slate-900 tabular-nums leading-none">{totalEarned}</span>
            <span className="text-sm text-slate-400 font-bold">/ {totalRequired}</span>
          </div>
          <div className="text-[13px] text-slate-500 font-medium mt-1">
            还差 <span className="text-indigo-600 font-bold">{totalRequired - totalEarned}</span> 学分
          </div>
        </div>
      </div>

      <div className="space-y-2.5 mt-auto">
        {CREDIT_CATEGORIES.map((c) => {
          const r = c.earned / c.required;
          return (
            <div key={c.label}>
              <div className="flex items-center justify-between text-[13px] font-bold mb-1">
                <span className="text-slate-700">{c.label}</span>
                <span className="text-slate-500 tabular-nums">
                  {c.earned} / {c.required}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', c.color)}
                  style={{ width: `${Math.min(100, r * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WarningCard() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertTriangle size={18} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-[17px]">学分预警与选课建议</h3>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">由策略 Agent 主动巡检</p>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {CREDIT_WARNINGS.map((w, i) => (
          <div
            key={i}
            className={cn(
              'p-3.5 rounded-2xl border flex gap-2.5',
              w.level === 'warn'
                ? 'bg-amber-50/70 border-amber-100'
                : 'bg-indigo-50/60 border-indigo-100',
            )}
          >
            <div className="shrink-0">
              {w.level === 'warn' ? (
                <AlertTriangle size={16} className="text-amber-600" />
              ) : (
                <Info size={16} className="text-indigo-600" />
              )}
            </div>
            <div>
              <div
                className={cn(
                  'font-bold text-[14px] mb-0.5',
                  w.level === 'warn' ? 'text-amber-800' : 'text-indigo-800',
                )}
              >
                {w.title}
              </div>
              <p className="text-[13px] leading-relaxed font-medium text-slate-600">{w.desc}</p>
            </div>
          </div>
        ))}

        <div className="mt-auto p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-2.5 items-start">
          <Sparkles size={14} className="shrink-0 mt-0.5 text-indigo-600" />
          <div>
            <div className="text-[12px] font-bold text-indigo-700 uppercase tracking-widest mb-0.5">
              Agent 建议
            </div>
            <div className="text-[14px] font-semibold leading-relaxed text-slate-800">
              下学期建议选《高级算法分析》+《科技史导论》，同时补齐通识学分与考研冲刺短板。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OngoingCoursesTable() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-[17px]">本学期在修课程</h3>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">基于随堂成绩 + 出勤动态预测</p>
          </div>
        </div>
        <span className="text-[13px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          共 {ONGOING_COURSES.length} 门
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="text-left py-2 px-3">课程</th>
              <th className="text-left py-2 px-3">授课</th>
              <th className="text-left py-2 px-3">学分</th>
              <th className="text-left py-2 px-3">上课时间</th>
              <th className="text-left py-2 px-3">预测分</th>
              <th className="text-left py-2 px-3">风险</th>
            </tr>
          </thead>
          <tbody>
            {ONGOING_COURSES.map((c) => (
              <tr
                key={c.id}
                className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-800">{c.name}</div>
                  {c.note && (
                    <div className="text-[12px] text-slate-500 font-medium mt-0.5">{c.note}</div>
                  )}
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium">{c.teacher}</td>
                <td className="py-3 px-3 text-slate-700 font-bold tabular-nums">{c.credit}</td>
                <td className="py-3 px-3 text-slate-500 font-medium">{c.schedule}</td>
                <td className="py-3 px-3">
                  <span
                    className={cn(
                      'font-bold tabular-nums',
                      c.predicted >= 85
                        ? 'text-emerald-600'
                        : c.predicted >= 80
                        ? 'text-slate-700'
                        : 'text-rose-600',
                    )}
                  >
                    {c.predicted}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={cn(
                      'text-[12px] font-bold px-2 py-0.5 rounded-md border',
                      riskStyles[c.risk],
                    )}
                  >
                    {riskLabels[c.risk]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KnowledgeTopology() {
  const cols = 6;
  const rows = 4;
  const colGap = 165;
  const rowGap = 92;
  const padX = 70;
  const padY = 58;
  const width = padX * 2 + (cols - 1) * colGap;
  const height = padY * 2 + (rows - 1) * rowGap;
  const nodeHalfWidth = 50;
  const nodeHalfHeight = 20;

  const nodeMap = Object.fromEntries(
    KNOWLEDGE_NODES.map((n) => [
      n.id,
      { ...n, px: padX + n.x * colGap, py: padY + n.y * rowGap },
    ]),
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Network size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-[17px]">专业知识点拓扑图</h3>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">
              展示核心课程的依赖关系与掌握进度
            </p>
          </div>
        </div>
        <div className="flex gap-3 text-[12px] font-bold text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 已掌握
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 在学
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> 未开始
          </span>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <svg
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto"
          style={{ maxWidth: `${width}px` }}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#cbd5e1" />
            </marker>
          </defs>

          {KNOWLEDGE_EDGES.map((e, i) => {
            const a = nodeMap[e.from];
            const b = nodeMap[e.to];
            if (!a || !b) return null;
            return (
              <line
                key={i}
                x1={a.px + nodeHalfWidth}
                y1={a.py}
                x2={b.px - nodeHalfWidth}
                y2={b.py}
                stroke="#cbd5e1"
                strokeWidth={1.8}
                markerEnd="url(#arrow)"
              />
            );
          })}

          {KNOWLEDGE_NODES.map((n) => {
            const pos = nodeMap[n.id];
            const c = masteryColors[n.mastery];
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                <rect
                  x={pos.px - nodeHalfWidth}
                  y={pos.py - nodeHalfHeight}
                  width={nodeHalfWidth * 2}
                  height={nodeHalfHeight * 2}
                  rx={11}
                  fill={c.fill}
                  stroke={c.stroke}
                  strokeWidth={1.6}
                />
                <text
                  x={pos.px}
                  y={pos.py + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={c.text}
                  style={{ fontSize: 13, fontWeight: 700 }}
                >
                  {n.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function AcademicView() {
  return (
    <div className="h-full flex flex-col w-full pb-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-end justify-between shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">学业规划</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            GPA 动态测算 · 学分进度追踪 · 知识点依赖拓扑
          </p>
        </div>
        <span className="text-[13px] font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
          数据同步：10 分钟前（教务接口）
        </span>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="h-full"
        >
          <GpaCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-full"
        >
          <CreditCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="h-full"
        >
          <WarningCard />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <OngoingCoursesTable />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <KnowledgeTopology />
      </motion.div>
    </div>
  );
}
