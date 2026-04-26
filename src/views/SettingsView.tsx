import {AnimatePresence, motion} from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BellRing,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Link2,
} from 'lucide-react';
import {type ReactNode, useState} from 'react';
import SkillCard from '../components/SkillCard';
import {submissionContent} from '../content/submissionContent';
import {SKILLS} from '../data/skills';
import {cn} from '../lib/utils';

type SourceStatus = 'configured' | 'manual' | 'pending';
type SourceKind = 'official' | 'schedule' | 'future';

interface SourceItem {
  id: number;
  name: string;
  domain: string;
  url: string;
  status: SourceStatus;
  lastSync: string;
  total: number;
  latestRaw: string;
  items: {title: string; date: string; url: string}[];
}

const sourceKindById: Record<number, SourceKind> = {
  1: 'official',
  2: 'schedule',
  3: 'future',
};

const sourceKindStyles: Record<
  SourceKind,
  {icon: typeof Globe; color: string; bg: string; badge: string}
> = {
  official: {
    icon: Globe,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    badge: '官方说明',
  },
  schedule: {
    icon: Link2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badge: '日程说明',
  },
  future: {
    icon: FileText,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    badge: '预留接入位',
  },
};

const sourceStatusStyles: Record<
  SourceStatus,
  {label: string; color: string; dot: string}
> = {
  configured: {label: '返回 0 条', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500'},
  manual: {label: '暂无记录', color: 'text-slate-700 bg-slate-100 border-slate-200', dot: 'bg-slate-500'},
  pending: {label: '等待返回', color: 'text-amber-700 bg-amber-50 border-amber-100', dot: 'bg-amber-500'},
};

const exceptionStateStyles: Record<string, string> = {
  pending: 'bg-amber-400 w-1/2',
  readonly: 'bg-slate-400 w-full',
  planned: 'bg-indigo-400 w-1/3',
};

function isPlaceholderUrl(url: string) {
  return !url || url === '#';
}

function SourceLink({url, children, className}: {url: string; children: ReactNode; className: string}) {
  if (isPlaceholderUrl(url)) {
    return <span className={className}>{children}</span>;
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function SettingsView() {
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);
  const sources = submissionContent.settings.sources as SourceItem[];
  const selectedSource = sources.find((source) => source.id === selectedSourceId) ?? null;

  return (
    <div className="h-full flex flex-col w-full relative">
      <AnimatePresence mode="wait">
        {!selectedSource && (
          <motion.div
            key="grid-view"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -20}}
            transition={{duration: 0.2}}
            className="flex flex-col h-full absolute inset-0"
          >
            <header className="mb-8 shrink-0">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {submissionContent.settings.overviewTitle}
              </h1>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl">
                {submissionContent.settings.overviewText}
              </p>
            </header>

            <div className="flex-1 overflow-y-auto space-y-10 pb-10 pr-2">
              <section>
                <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Database size={18} className="text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-800">来源状态列表</h2>
                    <span className="ml-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      返回 0 条记录
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className="text-[12px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {submissionContent.settings.statusText}
                    </span>
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-xl border bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    >
                      {submissionContent.settings.fetchButtonLabel}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {sources.map((source) => {
                    const kind = sourceKindById[source.id] ?? 'future';
                    const kindStyle = sourceKindStyles[kind];
                    const statusStyle = sourceStatusStyles[source.status];
                    const Icon = kindStyle.icon;

                    return (
                      <motion.div
                        key={source.id}
                        initial={{opacity: 0, scale: 0.96}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.25}}
                        whileHover={{y: -2}}
                        className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-4 gap-3">
                          <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center shrink-0', kindStyle.bg, kindStyle.color)}>
                            <Icon size={20} />
                          </div>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded border', statusStyle.color)}>
                              <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1.5', statusStyle.dot)} />
                              {statusStyle.label}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {kindStyle.badge}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-bold text-slate-900 text-[17px] mb-1 line-clamp-1" title={source.name}>
                            {source.name}
                          </h3>
                          <SourceLink url={source.url} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 w-fit">
                            <>
                              {source.domain}
                              {!isPlaceholderUrl(source.url) && <ExternalLink size={10} />}
                            </>
                          </SourceLink>
                        </div>

                          <button
                            type="button"
                            onClick={() => setSelectedSourceId(source.id)}
                            aria-label={`查看来源状态 ${source.name}`}
                            className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-4 flex-1 text-left hover:border-indigo-100 transition-colors"
                          >
                            <div className="text-[13px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                             <span>来源状态</span>
                             <span className="text-slate-500 bg-white px-1.5 py-0.5 rounded text-[11px] border border-slate-200">0 条</span>
                            </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {source.latestRaw}
                          </p>
                        </button>

                        <div className="flex items-center justify-between pt-1">
                          <div className="text-xs text-slate-500">
                            返回 <span className="font-semibold text-slate-700">{source.total}</span> 条记录
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedSourceId(source.id)}
                            className="text-xs font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
                          >
                            查看来源状态
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden mb-6 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Database size={100} />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Database size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Skill 能力手册</h2>
                      <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                        系统已就绪，当前展示能力边界与约束说明。
                      </p>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                    已注册 0 项 Skill
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-6 relative z-10 leading-relaxed">
                  当前暂无新的能力输入记录，继续保留智能协同、策略、信息源与工作流的边界说明。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 relative z-10 items-stretch">
                  {SKILLS.map((skill) => (
                    <div key={skill.id} className="h-full">
                      <SkillCard skill={skill} />
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:border-amber-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <BellRing size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">提醒策略说明</h2>
                  </div>
                  <div className="space-y-4">
                    {submissionContent.settings.reminderRules.map((rule) => (
                      <div key={rule.title} className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                        <div className="text-sm font-bold text-slate-700 mb-1">{rule.title}</div>
                        <p className="text-sm text-slate-500 leading-relaxed">{rule.detail}</p>
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-amber-50/50 border border-amber-100 flex items-start gap-3 rounded-xl">
                      <span className="text-amber-500 mt-0.5"><AlertCircle size={16} /></span>
                       <p className="text-xs text-amber-800 font-medium leading-relaxed">
                         系统已就绪，当前暂无提醒记录，等待后端返回。
                       </p>
                    </div>
                  </div>
                </section>

                <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-50/60 blur-3xl rounded-full pointer-events-none" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Database size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">异常状态说明</h2>
                  </div>

                  <div className="space-y-3 mt-6">
                    {submissionContent.settings.exceptionStates.map((state, index) => (
                      <div key={state.label} className={cn('flex items-center justify-between pb-3', index < submissionContent.settings.exceptionStates.length - 1 && 'border-b border-slate-100')}>
                        <div className="text-[15px] font-semibold text-slate-700">{state.label}</div>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className={cn('h-full', exceptionStateStyles[state.status] ?? 'bg-slate-300 w-1/2')} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}

        {selectedSource && (
          <motion.div
            key="detail-view"
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 20}}
            transition={{duration: 0.2}}
            className="flex flex-col h-full absolute inset-0 bg-slate-50"
          >
            <div className="flex items-center gap-4 mb-6 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSourceId(null)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 flex-wrap">
                  {selectedSource.name}
                  <span className={cn('flex items-center gap-1 text-xs font-bold border px-2 py-0.5 rounded-md', sourceStatusStyles[selectedSource.status].color)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', sourceStatusStyles[selectedSource.status].dot)} />
                    {sourceStatusStyles[selectedSource.status].label}
                  </span>
                </h2>
                <SourceLink url={selectedSource.url} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 mt-0.5">
                  <>
                    {selectedSource.url}
                    {!isPlaceholderUrl(selectedSource.url) && <ExternalLink size={12} />}
                  </>
                </SourceLink>
              </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center gap-3 flex-wrap">
                 <span className="font-semibold text-slate-700 text-sm">来源记录</span>
                 <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                   0 条记录
                 </span>
               </div>
               <div className="px-6 pt-5 text-sm text-slate-500 leading-relaxed">
                 当前暂无来源记录，系统已就绪，等待后端返回。
               </div>
               <div className="flex-1 overflow-y-auto px-2 py-2">
                 <div className="divide-y divide-slate-100">
                  {selectedSource.items.length === 0 && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-slate-400 font-medium">当前暂无来源记录，系统已就绪，等待后端返回。</p>
                    </div>
                  )}
                  {selectedSource.items.map((item, index) => {
                    const itemContent = (
                      <>
                      <div className="flex flex-col mb-2 sm:mb-0">
                        <h4 className="font-bold text-slate-800 text-[17px] group-hover:text-indigo-700 transition-colors flex items-center gap-2">
                          {item.title}
                          {!isPlaceholderUrl(item.url) && <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all -ml-1" />}
                        </h4>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                          <span>说明条目</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="font-mono text-[12px]">{item.date}</span>
                        </div>
                      </div>
                      <div className="sm:ml-4 shrink-0 flex items-center gap-2">
                          <div className="text-xs font-semibold px-3 py-1.5 border border-slate-200 text-slate-500 rounded-xl group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                          {isPlaceholderUrl(item.url) ? '暂无记录' : '查看原文'}
                        </div>
                      </div>
                      </>
                    );

                    if (isPlaceholderUrl(item.url)) {
                      return (
                        <div key={index} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl mx-2 my-1">
                          {itemContent}
                        </div>
                      );
                    }

                    return (
                      <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-indigo-50/40 transition-colors rounded-2xl mx-2 my-1"
                      >
                        {itemContent}
                      </a>
                    );
                  })}

                  <div className="p-6 text-center">
                    <p className="text-sm text-slate-400 font-medium">
                      0 条记录
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
