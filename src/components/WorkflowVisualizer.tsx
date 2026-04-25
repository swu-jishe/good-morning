import { motion } from 'motion/react';
import {
  MessageSquare,
  CalendarCheck,
  Lightbulb,
  GitBranch,
  CheckCircle2,
  FileOutput,
} from 'lucide-react';
import { cn } from '../lib/utils';

type Role = 'master' | 'judgment' | 'planning' | 'policy' | 'output';

interface Node {
  id: string;
  role: Role;
  label: string;
  detail?: string;
  status: 'done' | 'active' | 'pending';
}

const roleStyles: Record<
  Role,
  { color: string; icon: typeof GitBranch; name: string }
> = {
  master: { color: 'bg-slate-900 text-white', icon: GitBranch, name: '主控' },
  judgment: { color: 'bg-blue-500 text-white', icon: MessageSquare, name: '研判' },
  planning: { color: 'bg-emerald-500 text-white', icon: CalendarCheck, name: '规划' },
  policy: { color: 'bg-violet-500 text-white', icon: Lightbulb, name: '策略' },
  output: { color: 'bg-indigo-600 text-white', icon: FileOutput, name: '输出' },
};

const STAGES: {
  stage: 'intake' | 'parallel' | 'converge' | 'output';
  nodes: Node[];
}[] = [
  {
    stage: 'intake',
    nodes: [
      {
        id: 'master-plan',
        role: 'master',
        label: '意图拆解 & Plan 生成',
        detail: '识别目标 / 约束 / 时间范围 / 关键对象',
        status: 'done',
      },
    ],
  },
  {
    stage: 'parallel',
    nodes: [
      { id: 'judgment', role: 'judgment', label: '信息研判', detail: '事件性质 · 重要度 · 来源可信度', status: 'done' },
      { id: 'planning', role: 'planning', label: '日程规划', detail: '拆解 · 排期 · 冲突检测', status: 'active' },
      { id: 'policy', role: 'policy', label: '策略支持', detail: '结合长期目标做优先级与取舍', status: 'active' },
    ],
  },
  {
    stage: 'converge',
    nodes: [
      {
        id: 'master-merge',
        role: 'master',
        label: '冲突检测 & 加权裁决',
        detail: '比对子结论一致性，依目标优先级出裁定',
        status: 'pending',
      },
    ],
  },
  {
    stage: 'output',
    nodes: [
      {
        id: 'output',
        role: 'output',
        label: '结构化输出',
        detail: '推荐方案 + 理由说明 + 可选替代路径',
        status: 'pending',
      },
    ],
  },
];

function StatusDot({ status }: { status: Node['status'] }) {
  if (status === 'done') return <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />;
  if (status === 'active')
    return (
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" aria-hidden />
    );
  return <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" aria-hidden />;
}

function FullNode({ node }: { node: Node }) {
  const s = roleStyles[node.role];
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        'relative flex items-center gap-2.5 rounded-xl border shadow-sm bg-white px-3 py-2.5 h-full w-full',
        node.status === 'active' ? 'border-indigo-300 ring-4 ring-indigo-100' : 'border-slate-200',
      )}
    >
      <div className={cn('rounded-lg flex items-center justify-center shrink-0 w-8 h-8', s.color)}>
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-slate-800 leading-tight text-[14px]">{node.label}</div>
        {node.detail && (
          <div className="text-[12px] text-slate-500 font-medium mt-0.5 leading-snug line-clamp-2">{node.detail}</div>
        )}
      </div>
      <StatusDot status={node.status} />
    </motion.div>
  );
}

function CompactNode({ node }: { node: Node }) {
  const s = roleStyles[node.role];
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative flex items-center justify-center gap-1 rounded-lg border shadow-sm bg-white px-2 py-1.5 w-full',
        node.status === 'active' ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200',
      )}
      title={node.detail}
    >
      <div className={cn('rounded-md flex items-center justify-center shrink-0 w-5 h-5', s.color)}>
        <Icon size={10} />
      </div>
      <span className="text-[12px] font-semibold text-slate-700 truncate">{s.name}</span>
      <StatusDot status={node.status} />
    </motion.div>
  );
}

function Connector({ compact, vertical }: { compact?: boolean; vertical?: boolean }) {
  if (vertical) {
    return <div className={cn('bg-slate-300 mx-auto', compact ? 'w-px h-2' : 'w-px h-3')} />;
  }
  return <div className={cn('bg-slate-300', compact ? 'h-px w-2' : 'h-px w-3')} />;
}

interface WorkflowVisualizerProps {
  title?: string;
  hint?: string;
  compact?: boolean;
}

export default function WorkflowVisualizer({
  title = '多智能体协同流水线',
  hint = '多智能体协同工作流：意图拆解 → 子 Agent 并行 → 主控裁决 → 结构化输出',
  compact = false,
}: WorkflowVisualizerProps) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white p-1.5 rounded-lg">
            <GitBranch size={compact ? 12 : 14} />
          </div>
          <div>
            <div className={cn('font-semibold text-slate-800', compact ? 'text-[14px]' : 'text-[15px]')}>
              {title}
            </div>
            {!compact && (
              <div className="text-[12px] text-slate-500 font-medium mt-0.5">{hint}</div>
            )}
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-widest">
          Agent Flow
        </span>
      </div>

      {compact ? (
        /* 2-row horizontal flow fits inside narrow cards */
        <div className="space-y-2">
          <div className="flex items-stretch gap-1">
            <div className="flex-1"><CompactNode node={STAGES[0].nodes[0]} /></div>
            <div className="flex items-center"><Connector compact /></div>
            <div className="flex-[2] grid grid-cols-3 gap-1">
              {STAGES[1].nodes.map((n) => (
                <div key={n.id}>
                  <CompactNode node={n} />
                </div>
              ))}
            </div>
          </div>
          <Connector compact vertical />
          <div className="flex items-stretch gap-1">
            <div className="flex-1"><CompactNode node={STAGES[2].nodes[0]} /></div>
            <div className="flex items-center"><Connector compact /></div>
            <div className="flex-1"><CompactNode node={STAGES[3].nodes[0]} /></div>
          </div>
        </div>
      ) : (
        /* Unified 3-column grid: single-node stages sit in center column; parallel stage fills all 3 */
        <div className="flex flex-col gap-1.5">
          {STAGES.map((stage, idx) => (
            <div key={stage.stage}>
              {idx > 0 && (
                <div className="grid grid-cols-3 h-3">
                  <div />
                  <div className="w-px h-full bg-slate-300 mx-auto" />
                  <div />
                </div>
              )}
              {stage.stage === 'parallel' ? (
                <div>
                  <div className="grid grid-cols-3 mb-1.5">
                    <div />
                    <div className="flex justify-center">
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        parallel
                      </span>
                    </div>
                    <div />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {stage.nodes.map((n) => (
                      <div key={n.id} className="h-full">
                        <FullNode node={n} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div />
                  <FullNode node={stage.nodes[0]} />
                  <div />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
