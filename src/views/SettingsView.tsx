import { motion, AnimatePresence } from 'motion/react';
import { Plus, ExternalLink, RefreshCw, Globe, Rss, Link2, BellRing, Database, ArrowLeft, ArrowUpRight, AlertCircle, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import SkillCard from '../components/SkillCard';
import { SKILLS } from '../data/skills';
import { usePet } from '../context/PetContext';

interface SourceItem {
  id: number;
  name: string;
  domain: string;
  url: string;
  status: 'active' | 'warning';
  lastSync: string;
  icon: typeof Globe;
  color: string;
  bg: string;
  total: number;
  latestRaw: string;
  items: { title: string; date: string; url: string }[];
}

const SOURCE_RESEARCH: SourceItem = {
  id: 1,
  name: '研招网与目标院校信息',
  domain: 'yz.chsi.com.cn',
  url: 'https://yz.chsi.com.cn/',
  status: 'active',
  lastSync: '10 分钟前',
  icon: Globe,
  color: 'text-indigo-600',
  bg: 'bg-indigo-50',
  total: 34,
  latestRaw: '关于做好2026年硕士研究生招生考试网上报名...',
  items: [
    { title: '2026年全国硕士研究生招生工作管理规定', date: '2025-09-15', url: 'https://yz.chsi.com.cn/kyzx/zcdh/202509/20250915/2293121111.html' },
    { title: '南京大学2026年硕士研究生招生章程', date: '2025-09-20', url: 'https://grawww.nju.edu.cn/' },
    { title: '网报信息确认入口开放通知', date: '2025-10-20', url: 'https://yz.chsi.com.cn/kyzx/kydt/202510/20251020/2293155555.html' },
  ],
};

const SOURCE_CS_JW: SourceItem = {
  id: 2,
  name: '计算机学院教务通知公告',
  domain: 'cs.nju.edu.cn/jw/',
  url: 'https://cs.nju.edu.cn/',
  status: 'active',
  lastSync: '1 小时前',
  icon: Rss,
  color: 'text-emerald-600',
  bg: 'bg-emerald-50',
  total: 128,
  latestRaw: '[10/22] 提醒：数据库原理上机实验安排调整...',
  items: [
    { title: '[10/22] 提醒：数据库原理上机实验安排调整', date: '昨天 19:30', url: 'https://cs.nju.edu.cn' },
    { title: '2025-2026学年第一学期期末考试预通知', date: '10-15', url: 'https://cs.nju.edu.cn' },
    { title: '关于举办"网络安全防护分析"专家讲座的通知', date: '10-10', url: 'https://cs.nju.edu.cn' },
  ],
};

const SOURCE_CHAOXING_NEW: SourceItem = {
  id: 3,
  name: '超星学习通课程作业抓取',
  domain: 'i.chaoxing.com',
  url: 'https://i.chaoxing.com/',
  status: 'warning',
  lastSync: '刚刚',
  icon: Link2,
  color: 'text-amber-600',
  bg: 'bg-amber-50',
  total: 15,
  latestRaw: '《计算机网络》实验四提交提醒 (未完成)',
  items: [
    { title: '《计算机网络》实验四提交提醒', date: '昨天 10:00', url: 'https://i.chaoxing.com/' },
    { title: '《数据结构》期中测验成绩发布', date: '10-20', url: 'https://i.chaoxing.com/' },
    { title: '《机器学习》第三章随堂测验', date: '10-18', url: 'https://i.chaoxing.com/' },
  ],
};

const RESEARCH_UPDATED: Partial<SourceItem> = {
  latestRaw: '[10/23 刚刚] 研招网发布考场最终分配名单与入场须知，需在 10/25 17:00 前完成确认',
  total: 36,
  lastSync: '刚刚',
};

export default function SettingsView() {
  const { speak: petSpeak, setThinking: petSetThinking } = usePet();
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);
  const [sources, setSources] = useState<SourceItem[]>([SOURCE_RESEARCH, SOURCE_CS_JW]);
  const [lastFetchTime, setLastFetchTime] = useState('3 分钟前');
  const [isFetching, setIsFetching] = useState(false);
  const [highlightedSourceId, setHighlightedSourceId] = useState<number | null>(null);

  const selectedSource = sources.find((s) => s.id === selectedSourceId);

  const handleFetch = () => {
    if (isFetching) return;
    setIsFetching(true);
    petSetThinking(true);
    window.setTimeout(() => {
      setSources((prev) => {
        const updatedResearch: SourceItem = { ...prev[0], ...RESEARCH_UPDATED };
        const rest = prev.slice(1);
        return [updatedResearch, ...rest, SOURCE_CHAOXING_NEW];
      });
      setLastFetchTime('刚刚');
      setIsFetching(false);
      setHighlightedSourceId(SOURCE_RESEARCH.id);
      petSpeak('扫完啦！研招网多了 2 条新动态，还自动接入了超星学习通 ✨', 6000);
      window.setTimeout(() => setHighlightedSourceId(null), 6000);
    }, 4000);
  };

  return (
    <div className="h-full flex flex-col w-full relative">
      <AnimatePresence mode="wait">
        
        {/* Main Settings Grid View */}
        {!selectedSource && (
          <motion.div 
            key="grid-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full absolute inset-0"
          >
            <header className="mb-8 shrink-0">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">信息源接入与管理</h1>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl">
                配置并管理知途的底层信息抓取节点。你可以接入任意网页、RSS 或平台，系统将自动汇总原始信息，并交由 Agent 提炼至工作台。
              </p>
            </header>

            <div className="flex-1 overflow-y-auto space-y-10 pb-10 pr-2">
              <section data-pet-hint="信息源接入区：默认 2 个数据源（研招网+教务），点「立即抓取」能看到研招网更新 + 新接入学习通的效果。">
                <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Database size={18} className="text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-800">已连接的原始信息源</h2>
                    <span className="ml-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      已接入 {sources.length} 节点
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      上次自动抓取：{lastFetchTime}
                    </span>
                    <button
                      onClick={handleFetch}
                      disabled={isFetching}
                      data-pet-hint="点我一下，我帮你去扫所有信息源，看看有没有新动态～"
                      data-pet-hint-delay="1500"
                      className={cn(
                        'inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all active:scale-[0.97] border',
                        isFetching
                          ? 'bg-indigo-50 text-indigo-400 border-indigo-100 cursor-wait'
                          : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200',
                      )}
                    >
                      <RefreshCw
                        size={13}
                        className={cn('shrink-0', isFetching && 'animate-spin')}
                      />
                      {isFetching ? '抓取中 …' : '立即抓取'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  <AnimatePresence initial={false}>
                  {sources.map((source) => (
                    <motion.div
                      key={source.id}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.35 }}
                      whileHover={{ y: -2 }}
                      className={cn(
                        'bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden',
                        highlightedSourceId === source.id
                          ? 'border-indigo-300 ring-4 ring-indigo-100'
                          : 'border-slate-200',
                      )}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0", source.bg, source.color)}>
                          <source.icon size={20} />
                        </div>
                        <div className="flex items-center gap-2">
                          {highlightedSourceId === source.id && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded uppercase tracking-widest">
                              <Zap size={10} />新抓取
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                            <RefreshCw size={10} className={source.status === 'active' ? "text-emerald-500" : "text-amber-500"} />
                            {source.lastSync}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-bold text-slate-900 text-[17px] mb-1 line-clamp-1" title={source.name}>
                          {source.name}
                        </h3>
                        <a href={source.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 w-fit">
                          {source.domain} <ExternalLink size={10} />
                        </a>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-4 group-hover:border-indigo-100 transition-colors flex-1 cursor-pointer" onClick={() => setSelectedSourceId(source.id)}>
                        <div className="text-[13px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                          <span>最新抓取动态</span>
                          <span className="text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">RAW</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {source.latestRaw}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs text-slate-500">
                          已收录 <span className="font-semibold text-slate-700">{source.total}</span> 条
                        </div>
                        <button 
                          onClick={() => setSelectedSourceId(source.id)}
                          className="text-xs font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          查看聚合池
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>

                  {/* Add New Source Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all min-h-[260px] group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors">
                      <Plus size={24} className="text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-[17px] mb-1">新增信息源</h3>
                    <p className="text-xs text-center leading-relaxed px-4 opacity-80">
                      支持导入网页链接、RSS 订阅源<br/>或通过 API 密钥授权拉取
                    </p>
                  </motion.button>
                </div>
              </section>

              <section
                data-pet-hint="Skill 能力手册：遵循 Anthropic Agent Skills 规范，每个 Skill 都有输入/输出/约束/异常回执，杜绝参数幻觉。"
                className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden mb-6 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
              >
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
                         遵循 Anthropic Agent Skills 规范 · 每项 Skill 对应一份 <span className="font-mono">.md</span> 描述文件
                       </p>
                     </div>
                   </div>
                   <span className="text-[12px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                     已注册 {SKILLS.length} 项 Skill
                   </span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium mb-6 relative z-10 leading-relaxed">
                   每项 Skill 明确声明：<span className="font-bold text-slate-700">适用场景 / 强类型输入输出 / 执行约束（禁令+必选）/ 异常回执策略</span>。智能体按手册调度，杜绝参数幻觉。
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
                  {/* Reminder Strategy */}
                  <section
                    data-pet-hint="高优预警触发规则：ddl前 48 小时自动进入阻断流，最高触达方式是系统电话呼叫。"
                    className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:border-amber-200 hover:shadow-md transition-all duration-300"
                  >
                     <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                         <BellRing size={20} />
                       </div>
                       <h2 className="text-lg font-bold text-slate-800">高优预警与提醒策略</h2>
                     </div>
                     <div className="space-y-4">
                       <p className="text-sm text-slate-500 font-medium mb-4">当满足以下条件时，将触发系统级阻断性工作流：</p>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-3 border border-slate-100 rounded-xl">
                            <span className="text-[13px] font-semibold text-slate-400 block mb-1">时间阈值</span>
                            <span className="text-sm font-bold text-slate-700">ddl前 48 小时</span>
                          </div>
                          <div className="bg-slate-50 p-3 border border-slate-100 rounded-xl">
                            <span className="text-[13px] font-semibold text-slate-400 block mb-1">冲突判定</span>
                            <span className="text-sm font-bold text-slate-700">强物理占用重叠</span>
                          </div>
                       </div>
                       <div className="mt-4 p-4 bg-amber-50/50 border border-amber-100 flex items-start gap-3 rounded-xl">
                          <span className="text-amber-500 mt-0.5"><AlertCircle size={16} /></span>
                          <p className="text-xs text-amber-800 font-medium leading-relaxed">
                            当存在未确认或逾期风险极高的行动项时，系统默认最高触达方式为：<span className="font-bold text-rose-600 underline underline-offset-2">自动系统电话呼叫 / 强音效推送</span>。
                          </p>
                       </div>
                     </div>
                  </section>

                  {/* Exception Receipt Area */}
                  <section
                    data-pet-hint="异常控制：3 种状态——等待用户确认、仅建议不回写、API 拉取断连。Agent 有问题前端第一时间能看到。"
                    className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                  >
                     <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-50/60 blur-3xl rounded-full pointer-events-none" />
                     <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                         <RefreshCw size={20} />
                       </div>
                       <h2 className="text-lg font-bold text-slate-800">异常控制与回执</h2>
                     </div>
                     
                     <div className="space-y-3 mt-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                           <div className="text-[15px] font-semibold text-slate-700">等待用户确认 (Pending)</div>
                           <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-amber-400 w-1/2 animate-pulse" />
                           </div>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mt-1">
                           <div className="text-[15px] font-semibold text-slate-700">仅限建议不回写 (Read-Only)</div>
                           <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-slate-400 w-full" />
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                           <div className="text-[15px] font-semibold text-slate-700">API 拉取断连 (Failed)</div>
                           <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-rose-500 w-1/4" />
                           </div>
                        </div>
                     </div>
                  </section>
              </div>
            </div>
          </motion.div>
        )}

        {/* Drill-down: Data Source Details Pool */}
        {selectedSource && (
          <motion.div 
            key="detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full absolute inset-0 bg-slate-50"
          >
            <div className="flex items-center gap-4 mb-6 shrink-0">
              <button 
                onClick={() => setSelectedSourceId(null)} 
                className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  {selectedSource.name}
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 抓取正常
                  </span>
                </h2>
                <a href={selectedSource.url} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-indigo-600 hover:underline flex items-center gap-1 mt-0.5">
                  {selectedSource.url} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="font-semibold text-slate-700 text-sm">原始抓取池 (Raw Elements)</span>
                <button className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5">
                  <RefreshCw size={12} /> 立即强制抓取
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-2">
                <div className="divide-y divide-slate-100">
                  {selectedSource.items.map((item, idx) => (
                    <a 
                      key={idx} 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-indigo-50/40 transition-colors rounded-2xl mx-2 my-1"
                    >
                      <div className="flex flex-col mb-2 sm:mb-0">
                        <h4 className="font-bold text-slate-800 text-[17px] group-hover:text-indigo-700 transition-colors flex items-center gap-2">
                          {item.title}
                          <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all -ml-1" />
                        </h4>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                          <span>提取自系统解析节点</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="font-mono text-[12px]">{item.date}</span>
                        </div>
                      </div>
                      <div className="sm:ml-4 shrink-0 flex items-center gap-2">
                        {idx === 0 && <span className="text-[12px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-md border border-red-100">New</span>}
                        <div className="text-xs font-semibold px-3 py-1.5 border border-slate-200 text-slate-500 rounded-xl group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                          访问原文
                        </div>
                      </div>
                    </a>
                  ))}
                  
                  {/* Mock loading generic item */}
                  <div className="p-6 text-center">
                    <p className="text-sm text-slate-400 font-medium">已展示最新 {selectedSource.items.length} 条有效记录，历史数据已归档整理。</p>
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
