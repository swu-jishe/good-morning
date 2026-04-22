import { AgentType } from '../types';
import { MessageSquare, CalendarCheck, Lightbulb, Sparkles, Send, Settings2, X, ChevronDown, ExternalLink, Check, FileText, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, type DragEvent } from 'react';

interface Citation {
  id: number;
  title: string;
  summary: string;
  url: string;
}

interface ModificationCard {
  original: string;
  updated: string;
  impact: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  agentId?: AgentType;
  text: string;
  citations?: Citation[];
  modificationCard?: ModificationCard;
}

const MOCK_RESPONSES: Record<string, {text: string, agentId: AgentType, citations?: Citation[], modificationCard?: ModificationCard}> = {
  // Judgment Agent
  '解读今日高优预警': {
    agentId: 'judgment',
    text: '今天探测到 2 条与你的系统强相关的警告事项：\n\n南京大学研招网：报名信息确认截止时间迫在眉睫，如果不完成将无法获取考点资格。\n《计算机网络》课程：最新的实验报告上机要求已发布。\n\n需要我帮你定位具体流程入口吗？',
    citations: [
      { id: 1, title: '南大研招网系统通知', summary: '官方通知：2026年硕士招生信息确认时间点及在线提交流程更新。', url: 'https://yz.chsi.com.cn' },
      { id: 2, title: '教务通 - 计网作业', summary: '实验四：TCP/IP 协议分析作业详情及机房准入要求。', url: 'https://i.chaoxing.com/' }
    ]
  },
  '总结近期院校通知': {
    agentId: 'judgment',
    text: '为你追踪了近3天的高频异动信息：\n目标院校的考点安排公告已正式张贴。同时校内保研政策进行了局部微调，剔除了四级成绩的基础强制要求。\n已在信息池为你自动收录并打标。',
    citations: [
      { id: 1, title: '南京大学研究生院公告', summary: '关于2026届考点安排和考场指令的最新通报文件。', url: '#' }
    ]
  },
  '过滤低迷信息': {
    agentId: 'judgment',
    text: '已自动执行去噪算法。屏蔽了考研超话中的 45 条贩卖焦虑贴，以及屏蔽了二手书转让无效发帖。你的信息主池已恢复洁净。'
  },
  
  // Planning Agent
  '帮我规划本周节奏': {
    agentId: 'planning',
    text: '我已将网报确认与计网实验剥离，并为你提议了如下的底层编排变更：\n将计网上机提前至今日完成，彻底空出周五的网报时间。请在下方点击确认落库。',
    modificationCard: {
       original: "《计算机网络》实验上机 (本周五)",
       updated: "《计算机网络》实验上机 (改成今日 19:00)",
       impact: "已完美规避报名信息确认的物理冲突"
    }
  },
  '推迟低优活动': {
    agentId: 'planning',
    text: '已扫描日程。建议将本周四下午的"前端公开课分享"延后至下周一。',
    modificationCard: {
       original: "公开课分享 (周四)",
       updated: "公开课分享 (下周一 14:00)",
       impact: "释放本周四 2 小时用作政治重点突破"
    }
  },
  '为模拟考预留时间': {
    agentId: 'planning',
    text: '好的，我已经为你锁定了周六下午 14:00 - 17:00 这个完整的3小时区块，期间会自动开启免打扰番茄钟引擎。'
  },

  // Policy Agent
  '评估当前备考进度': {
    agentId: 'policy',
    text: '结合你多维能力画像，数据结构已达标，但政治马原背诵落后进度 15%。我已经为你生成了一套追赶计划节点。',
    citations: [
      { id: 1, title: '阶段进展卡', summary: '基于当前 10 月强化冲刺期的指标进行对比换算。', url: '#' }
    ]
  },
  '分析目标院校报录比': {
    agentId: 'policy',
    text: '双一流南大软工的最新统考竞争度情况，已被我整理成了图表报告卡：',
    citations: [
      { id: 1, title: '网报大数据监控版', summary: '系统抓取到预计报名人数有小幅上扬。', url: '#' },
    ]
  },
  '推荐适合的复习资料': {
    agentId: 'policy',
    text: '考虑到你倾向于夜间复习并存在数学短板，推荐使用《李林真题解析》来增强空间向量的计算硬度。'
  }
};

const CitationBlock = ({ citation }: { citation: Citation }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2.5 ml-1 mr-4 bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:border-slate-300">
      <div onClick={() => setOpen(!open)} className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors rounded-xl">
        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
           <span className="w-[1.125rem] h-[1.125rem] rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 shrink-0">
             {citation.id}
           </span>
           <span className="truncate max-w-[12rem] text-slate-800">{citation.title}</span>
        </div>
        <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-300", open ? "rotate-180 text-indigo-500" : "")} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
             <div className="px-3 pb-3 pt-1 border-t border-slate-100/60 mt-1">
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{citation.summary}</p>
                {citation.url !== '#' && (
                   <a href={citation.url} target="_blank" rel="noreferrer" className="mt-2.5 w-fit inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 hover:text-indigo-800 transition-colors">
                     访问来源链接 <ExternalLink size={10} />
                   </a>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ModCardBlock = ({ mod }: { mod: ModificationCard }) => {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="mt-3 ml-1 mr-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-3 border-b border-indigo-100 bg-white">
        <div className="flex flex-col gap-2 relative">
          <div className="text-[12px] text-slate-400 line-through font-medium">{mod.original}</div>
          <div className="text-[14px] text-indigo-900 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            {mod.updated}
          </div>
        </div>
      </div>
      <div className="p-3 bg-indigo-50/30">
        <div className="text-[11px] text-indigo-700 mb-3 font-medium flex items-start gap-1.5">
           <Sparkles size={12} className="shrink-0 mt-0.5 opacity-60" />
           {mod.impact}
        </div>
        <button 
           onClick={() => setConfirmed(true)}
           disabled={confirmed}
           className={cn("w-full py-2 rounded-xl text-[12px] font-bold transition-all flex justify-center items-center gap-1.5", confirmed ? "bg-emerald-500 text-white shadow-sm border border-emerald-500" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md border hover:border-indigo-800 active:scale-[0.98]")}
        >
          {confirmed ? <><Check size={14}/>已系统回写</> : "确认变更并写入日程"}
        </button>
      </div>
    </div>
  );
}

interface AgentDrawerProps {
  agentType: AgentType;
}

export default function AgentDrawer({ agentType }: AgentDrawerProps) {
  // Support independent selection: one, two, or three agents at the same time.
  const [activeAgents, setActiveAgents] = useState<AgentType[]>([agentType]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
     { id: 'sys_init', role: 'system', text: '知途多智能体 (Multi-Agent) 协同工作组已就绪，可随时添加或移除参与计算的 Agent。' }
  ]);
  const [inputText, setInputText] = useState("");
  const [dragOverlay, setDragOverlay] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If navigation passes a primary agent, ensure it's selected.
    if (!activeAgents.includes(agentType)) {
      setActiveAgents(prev => [...prev, agentType]);
    }
  }, [agentType]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAgent = (t: AgentType) => {
    setActiveAgents(prev => {
      // Allow unselecting down to 1 agent
      if (prev.includes(t)) {
        if (prev.length === 1) return prev; // Do not deselect the last active agent
        return prev.filter(a => a !== t);
      } else {
        return [...prev, t];
      }
    });
  };

  const agentConfig = {
    judgment: {
      id: 'judgment' as AgentType,
      shortName: '研判',
      name: '信息研判 Agent',
      icon: MessageSquare,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      suggestions: ['解读今日高优预警', '总结近期院校通知', '过滤低迷信息']
    },
    planning: {
      id: 'planning' as AgentType,
      shortName: '规划',
      name: '日程规划 Agent',
      icon: CalendarCheck,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      suggestions: ['帮我规划本周节奏', '推迟低优活动', '为模拟考预留时间']
    },
    policy: {
      id: 'policy' as AgentType,
      shortName: '策略',
      name: '策略支持 Agent',
      icon: Lightbulb,
      color: 'bg-violet-500',
      lightColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      suggestions: ['评估当前备考进度', '分析目标院校报录比', '推荐适合的复习资料']
    }
  };

  const [agentPrompts, setAgentPrompts] = useState({
    judgment: '系统级扮演：你是一个客观高效的信息研判专家。你的职责是从原始信息流中过滤噪音，提取高度强相关的变化、预警优先事项，以简练客观的方式汇报给用户。',
    planning: '系统级扮演：你是一个统筹兼顾的日程智脑。遇到拖拽来的任务冲突卡片时，不仅要给出回复，还要配合【研判Agent】输出修改建议卡，等待系统回写确认。',
    policy: '系统级扮演：你是一个拥有海量数据挖掘能力的策略教练。结合全局Profile上下文(如长期目标)进行智能诊断分析。'
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, activeAgents]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Contextual trigger for the drag-and-drop scenario
    if (text.includes('考研报名确认预期冲突')) {
       // Ensure Judgment and Planning are active
       setActiveAgents(prev => Array.from(new Set([...prev, 'judgment', 'planning'])));
       
       setTimeout(() => {
         setMessages(prev => [...prev, {
           id: Date.now().toString() + 'sj',
           role: 'assistant',
           agentId: 'judgment',
           text: '我已初步解析此冲突。研招网死线优先级为绝对高优(P0)，《计算机网络》实验为常规考核(P2)。建议立刻优先保底网报。\n\n已下发联动指令，请 @规划 Agent 介入排程。'
         }]);

         setIsTyping(true);

         setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now().toString() + 'sp',
              role: 'assistant',
              agentId: 'planning',
              text: '收到研判要求。我已计算出安全重组方案。\n可将实验上机迁移至今日晚间执行，彻底空出周五死线节点：',
              modificationCard: {
                 original: "《计算机网络》实验上机 (按原计划本周五)",
                 updated: "将计网实验上机锁定在今日 19:00",
                 impact: "成功规避撞期风险，并获取更多时间盈余。"
              }
            }]);
            setIsTyping(false);
         }, 2500);

       }, 1200);
       return;
    }

    setTimeout(() => {
      setIsTyping(false);
      let responseMatched = false;
      
      for (const [key, canned] of Object.entries(MOCK_RESPONSES)) {
        if (text.includes(key) || key.includes(text)) {
           // Ensure the agent replying is actually in the active roster
           if (!activeAgents.includes(canned.agentId)) {
             setActiveAgents(prev => [...prev, canned.agentId]);
           }
           
           setMessages(prev => [...prev, {
             id: Date.now().toString() + 'r',
             role: 'assistant',
             agentId: canned.agentId,
             text: canned.text,
             citations: canned.citations,
             modificationCard: canned.modificationCard
           }]);
           responseMatched = true;
           break;
        }
      }

      if (!responseMatched) {
         // Generic multi-agent response representation
         const genericTeamResponse = activeAgents.map(a => `[${agentConfig[a].shortName} Agent]: 已捕获你的意图并录入知识库。`).join('\n\n');
         
         setMessages(prev => [...prev, {
             id: Date.now().toString() + 'r',
             role: 'assistant',
             agentId: activeAgents[0],
             text: `目前已分配至联合处理流水线：\n\n${genericTeamResponse}`
         }]);
      }
    }, 1200); 
  };


  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverlay(true);
  }

  const handleDragLeave = () => {
    setDragOverlay(false);
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverlay(false);
    
    // Auto-select Judgment and Planning capabilities as prep
    setActiveAgents(prev => Array.from(new Set([...prev, 'judgment', 'planning'])));
    
    // Pre-fill input instead of auto-sending
    setInputText("引用了 [预警：考研报名确认预期冲突] 卡片，请帮我排查冲突并重排计划。");
  }

  // Derived arrays
  const activeNames = activeAgents.map(a => agentConfig[a].shortName).join('、');
  const combinedSuggestions: string[] = Array.from(new Set(activeAgents.flatMap(a => agentConfig[a].suggestions)));

  return (
    <div 
       onDragOver={handleDragOver}
       onDragLeave={handleDragLeave}
       onDrop={handleDrop}
       className="relative h-full z-20 shrink-0 w-[20rem] lg:w-[23.5rem] bg-slate-50/50 border-l border-slate-200/60 shadow-[0_0_40px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden"
    >
      
      {/* Header and Checkbox-style Selector */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-200/60 flex flex-col shrink-0 bg-white z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
           <h2 className="font-bold text-slate-800 text-[15px] flex items-center gap-2 tracking-tight">
              <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600"><Users size={14} /></div>
              多智能体协同引擎
              <span className="ml-1 bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded font-bold border border-emerald-100 uppercase tracking-widest">Team</span>
           </h2>
           <button onClick={() => setIsConfigOpen(true)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 focus:outline-none group">
              <Settings2 size={18} className="group-hover:rotate-45 transition-transform" />
           </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-3.5 mb-2 font-medium">配置当前参与协作的组员 (支持多个)：</p>
        <div className="flex flex-wrap gap-2 w-full mt-1">
          {(['judgment', 'planning', 'policy'] as AgentType[]).map((t) => {
            const isActive = activeAgents.includes(t);
            const config = agentConfig[t];
            return (
              <button 
                 key={t}
                 onClick={() => toggleAgent(t)}
                 className={cn(
                   "relative h-[34px] rounded-xl flex items-center justify-center px-3.5 transition-all focus:outline-none border", 
                   isActive ? cn(config.color, "border-transparent text-white shadow-md shadow-indigo-100") : "bg-slate-50/50 border-slate-200 text-slate-500 hover:bg-slate-100/80"
                 )}
              >
                 <span className="relative z-10 flex items-center gap-1.5">
                    <config.icon size={13} className={isActive ? "text-white" : "text-slate-400"} />
                    <span className="text-[12px] font-bold whitespace-nowrap">
                      {config.shortName}
                    </span>
                 </span>
                 {isActive && (
                    <div className="absolute top-0 right-0 w-[6px] h-[6px] rounded-bl text-white bg-white/20" />
                 )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Drag Overlay */}
      <AnimatePresence>
         {dragOverlay && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-indigo-500/10 backdrop-blur-[2px] border-[3px] border-indigo-500 border-dashed flex items-center justify-center pointer-events-none"
            >
                <div className="bg-white/90 backdrop-blur-md px-6 py-5 rounded-2xl shadow-2xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                     <FileText size={24}/>
                   </div>
                   <div>
                     <div className="font-bold text-slate-800 text-[15px] mb-0.5">松开手以引用于上下文</div>
                     <div className="text-[12px] text-slate-500 font-medium">Team 即将联推冲突分析与排程</div>
                   </div>
                </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Unified Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 flex flex-col gap-6">
        {messages.map((msg) => {
          if (msg.role === 'system') {
            return (
              <div key={msg.id} className="text-center">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full items-center inline-flex gap-1.5">
                  <Sparkles size={10} className="text-indigo-400" />
                  {msg.text}
                </span>
              </div>
            );
          }

          // Resolve agent config for assistant messages, default to the first active one if none specified.
          const aConf = msg.agentId ? agentConfig[msg.agentId] : agentConfig[activeAgents[0]];

          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
            >
              {msg.role === 'assistant' && (
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5", aConf.color)}>
                  <aConf.icon size={14} />
                </div>
              )}
              
              <div className="flex flex-col max-w-[85%]">
                <div className={cn(
                  "px-4 py-3 relative break-words",
                  msg.role === 'user' 
                    ? "bg-indigo-600 text-white rounded-[20px] rounded-tr-md shadow-md shadow-indigo-200/50" 
                    : "bg-white border border-slate-200 shadow-sm rounded-[20px] rounded-tl-md text-slate-700"
                )}>
                  {/* Agent Tag for Assistant responses */}
                  {msg.role === 'assistant' && (
                    <div className="text-[10px] font-bold mb-1 opacity-60 flex items-center gap-1 uppercase tracking-wider">
                      {aConf.name}
                    </div>
                  )}
                  <div className="text-[13px] leading-relaxed font-medium whitespace-pre-wrap">
                     {msg.text}
                  </div>
                </div>

                {/* Citations block */}
                {msg.citations && msg.citations.length > 0 && (
                   <div className="mt-1 flex flex-col gap-1">
                      {msg.citations.map((c) => (
                        <div key={c.id}>
                          <CitationBlock citation={c} />
                        </div>
                      ))}
                   </div>
                )}

                {/* Modification Card Block */}
                {msg.modificationCard && (
                   <ModCardBlock mod={msg.modificationCard} />
                )}
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mt-1">
             <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm bg-slate-800">
                <Users size={14} />
             </div>
             <div className="bg-white border border-slate-200 px-4 py-3 rounded-[20px] rounded-tl-md shadow-sm flex items-center gap-2 h-10">
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
             </div>
           </motion.div>
        )}
        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </div>

      {/* Floating Interleaved Suggestions from active agents */}
      <div className="px-3 pb-3 flex overflow-x-auto custom-scrollbar gap-2 shrink-0 bg-gradient-to-t from-white via-white to-transparent pt-4">
        {combinedSuggestions.map((suggestion) => (
          <button 
            key={suggestion}
            onClick={() => handleSendMessage(suggestion)}
            className="shrink-0 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm rounded-xl px-3.5 py-2 transition-all active:scale-95"
          >
            "{suggestion}"
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200/60 bg-white shrink-0 pb-6 lg:pb-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="relative">
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder={`交给团队 [${activeNames}] 处理...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-11 py-3.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all font-semibold placeholder:font-medium placeholder:text-slate-400 shadow-sm"
          />
          <button 
            onClick={() => handleSendMessage(inputText)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 text-white rounded-[10px] flex items-center justify-center transition-all shadow-sm active:scale-95",
              inputText.trim().length > 0 ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md" : "bg-slate-300 cursor-not-allowed"
            )}
          >
            <Send size={15} className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* Configuration Overlay Panel */}
      <AnimatePresence>
        {isConfigOpen && (
          <motion.div
             initial={{ y: '100%' }}
             animate={{ y: 0 }}
             exit={{ y: '100%' }}
             transition={{ type: 'spring', damping: 28, stiffness: 280 }}
             className="absolute inset-0 z-50 bg-white flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            {/* Settings Header */}
            <div className="px-5 py-4 border-b border-slate-200/60 flex items-center justify-between h-[4.5rem] bg-indigo-50/50 shrink-0">
               <div className="flex items-center gap-2 text-indigo-900 font-bold text-[15px]">
                 <Settings2 size={16} className="text-indigo-600" />
                 多智能体团队配置
               </div>
               <button onClick={() => setIsConfigOpen(false)} className="p-1 px-2 hover:bg-slate-200/60 rounded-lg text-slate-500 transition-colors">
                 <X size={18} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/30">
              <h4 className="text-[13px] font-black text-slate-800 mb-5 pb-2 border-b border-slate-100/60">团队提示词与规则配置 ({activeAgents.length})</h4>

              {/* Render inputs for all active agents */}
              {activeAgents.map(t => {
                 const conf = agentConfig[t];
                 return (
                    <div key={t} className="mb-6">
                       <label className="text-[12px] font-bold text-slate-600 mb-2.5 flex items-center gap-2">
                         <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white", conf.color)}><conf.icon size={12}/></div>
                         {conf.name} 身份规则
                       </label>
                       <textarea 
                         className="w-full h-24 p-3.5 bg-white border border-slate-200 rounded-xl text-[12px] text-slate-700 leading-relaxed font-medium focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-none custom-scrollbar shadow-sm"
                         value={agentPrompts[t]}
                         onChange={(e) => setAgentPrompts({...agentPrompts, [t]: e.target.value})}
                       />
                    </div>
                 );
              })}

              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl mt-8 shadow-sm">
                 <div className="flex items-start gap-2.5">
                   <div className="mt-0.5"><Sparkles size={14} className="text-indigo-500" /></div>
                   <p className="text-[11px] text-indigo-800 leading-relaxed font-bold">
                     你可以同时启用多个 Agent，他们会在后台并网计算。例如在处理混合冲突时，研判 Agent 识别死线，策略 Agent 提供优先级建议，然后交给规划 Agent 输出重排指令。
                   </p>
                 </div>
              </div>
            </div>

            {/* Config Footer Actions */}
            <div className="p-5 border-t border-slate-200/60 shrink-0 bg-white">
               <button 
                  onClick={() => setIsConfigOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-slate-200 active:scale-[0.98]"
               >
                 保存规则并应用至上下文
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
