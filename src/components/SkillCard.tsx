import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MessageSquare,
  CalendarCheck,
  Lightbulb,
  FileText,
  X,
  Ban,
  CheckCheck,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SkillDef, AgentType } from '../types';

const agentStyles: Record<
  AgentType,
  { color: string; bg: string; text: string; name: string; icon: typeof FileText }
> = {
  judgment: {
    color: 'bg-blue-500',
    bg: 'bg-blue-50 border-blue-100',
    text: 'text-blue-700',
    name: '信息研判 Agent',
    icon: MessageSquare,
  },
  planning: {
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50 border-emerald-100',
    text: 'text-emerald-700',
    name: '日程规划 Agent',
    icon: CalendarCheck,
  },
  policy: {
    color: 'bg-violet-500',
    bg: 'bg-violet-50 border-violet-100',
    text: 'text-violet-700',
    name: '策略支持 Agent',
    icon: Lightbulb,
  },
};

export default function SkillCard({ skill }: { skill: SkillDef }) {
  const [modalOpen, setModalOpen] = useState(false);
  const s = agentStyles[skill.ownerAgent];
  const AgentIcon = s.icon;
  const dialogTitleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (modalOpen) {
      closeButtonRef.current?.focus();
    }
  }, [modalOpen]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-start gap-2.5 mb-2">
          <div className={cn('w-8 h-8 rounded-lg text-white flex items-center justify-center shrink-0', s.color)}>
            <AgentIcon size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-slate-900 text-[16px] leading-tight">{skill.name}</div>
            <div className="font-mono text-[12px] text-slate-400 mt-0.5 truncate">{skill.code}.md</div>
          </div>
          <span
            className={cn(
              'text-[12px] font-bold px-2 py-0.5 rounded border shrink-0',
              s.bg,
              s.text,
            )}
          >
            {s.name.replace(' Agent', '')}
          </span>
        </div>
        <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{skill.scenario}</p>
      </div>

      <div className="p-4 space-y-3 flex-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <ArrowDownToLine size={10} /> 输入 · {skill.inputs.length} 项
            </div>
            {skill.inputs.slice(0, 2).map((f) => (
              <div key={f.name} className="flex items-baseline gap-1 text-[12.5px] leading-tight mt-1">
                <span className="font-mono font-semibold text-slate-700 truncate">{f.name}</span>
                {f.required && <span className="text-[11px] font-bold text-rose-500">*</span>}
              </div>
            ))}
            {skill.inputs.length > 2 && (
              <div className="text-[11px] text-slate-400 font-medium mt-1">+{skill.inputs.length - 2}</div>
            )}
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <ArrowUpFromLine size={10} /> 输出 · {skill.outputs.length} 项
            </div>
            {skill.outputs.slice(0, 2).map((f) => (
              <div key={f.name} className="flex items-baseline gap-1 text-[12.5px] leading-tight mt-1">
                <span className="font-mono font-semibold text-slate-700 truncate">{f.name}</span>
              </div>
            ))}
            {skill.outputs.length > 2 && (
              <div className="text-[11px] text-slate-400 font-medium mt-1">+{skill.outputs.length - 2}</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            关键约束
          </div>
          <div className="space-y-1">
            {skill.constraints.slice(0, 2).map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-1.5 text-[13px] font-medium text-slate-700 leading-snug"
              >
                {c.kind === 'forbid' ? (
                  <Ban size={11} className="text-rose-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCheck size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                )}
                <span className="line-clamp-1">{c.text}</span>
              </div>
            ))}
            {skill.constraints.length > 2 && (
              <div className="text-[12px] text-slate-400 font-medium">+{skill.constraints.length - 2} 条，详见 .md</div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle size={10} /> 异常回执
          </div>
          <p className="text-[13px] text-slate-600 leading-snug font-medium line-clamp-2">
            {skill.exceptionPolicy}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
          Capability Spec
        </span>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
        >
          <FileText size={11} /> 查看 .md
        </button>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              tabIndex={-1}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className={cn('w-8 h-8 rounded-lg text-white flex items-center justify-center', s.color)}>
                    <FileText size={14} />
                  </div>
                  <div>
                    <div id={dialogTitleId} className="font-mono font-bold text-slate-800 text-[15px]">skills/{skill.code}.md</div>
                    <div className="text-[12px] text-slate-500 font-medium">能力说明文档</div>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200/60 text-slate-500 flex items-center justify-center"
                  aria-label="关闭能力说明文档"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-slate-900">
                <pre className="text-[14px] leading-relaxed text-slate-100 font-mono whitespace-pre-wrap">
                  {skill.mdPreview}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
