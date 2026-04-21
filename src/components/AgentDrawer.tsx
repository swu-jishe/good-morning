import { AgentType } from '../types';
import { MessageSquare, CalendarCheck, Lightbulb, Sparkles, Send, Settings2, X, ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

interface Citation {
  id: number;
  title: string;
  summary: string;
  url: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
}

const MOCK_RESPONSES: Record<string, {text: string, citations: Citation[]}> = {
  // Judgment Agent
  '解读今日高优预警': {
    text: '今天探测到 2 条与你的系统强相关的警告事项：\n\n南京大学研招网：报名信息确认截止时间迫在眉睫，如果不完成将无法获取考点资格。\n《计算机网络》课程：最新的实验报告上机要求已发布。\n\n需要我帮你定位具体流程入口吗？',
    citations: [
      { id: 1, title: '南大研招网系统通知', summary: '官方通知：2026年硕士招生信息确认时间点及在线提交流程更新。', url: 'https://yz.chsi.com.cn' },
      { id: 2, title: '教务通 - 计网作业', summary: '实验四：TCP/IP 协议分析作业详情及机房准入要求。', url: 'https://i.chaoxing.com/' }
    ]
  },
  '总结近期院校通知': {
    text: '为你追踪了近3天的高频异动信息：\n目标院校的考点安排公告已正式张贴。同时校内保研政策进行了局部微调，剔除了四级成绩的基础强制要求。\n已在信息池为你自动收录并打标。',
    citations: [
      { id: 1, title: '南京大学研究生院公告', summary: '关于2026届考点安排和考场指令的最新通报文件。', url: '#' }
    ]
  },
  '过滤低迷信息': {
    text: '已自动执行去噪算法。屏蔽了考研超话中的 45 条贩卖焦虑贴，以及屏蔽了二手书转让无效发帖。你的信息主池已恢复洁净。',
    citations: []
  },
  
  // Planning Agent
  '帮我规划本周节奏': {
    text: '根据你的核心目标和预警状态，我为你建议了如下的短期节奏排布：\n\n1. 本周前3天将重点投入实验课上机，确保平时分。\n2. 周五务必留出半小时进行网上资格报名确认。\n3. 周末完整保留出来，进行蓝桥杯算法拔高。',
    citations: [
      { id: 1, title: '个人日程表', summary: '读取到你近期的校内排课与考研里程碑节点。', url: '#' },
      { id: 2, title: '蓝桥杯最新试题库', summary: '第十五届全国软件算法大赛历年真题开放通道。', url: 'https://dasai.lanqiao.cn/' }
    ]
  },
  '推迟低优活动': {
    text: '已扫描日程。本周四下午的“前端公开课分享”已被识别为低优容忍活动，是否要帮你将它延后至下周一的空白时段，以便挪出精力备考？',
    citations: []
  },
  '为模拟考预留时间': {
    text: '好的，我已经为你锁定了周六下午 14:00 - 17:00 这个完整的3小时区块，期间会自动开启手机免打扰级别的专注模式。你的复习规划已同步。',
    citations: [
      { id: 1, title: '番茄钟引擎配置', summary: '同步拦截各类推送打扰，保持最纯粹的专注输出。', url: '#' }
    ]
  },

  // Policy Agent
  '评估当前备考进度': {
    text: '基于你在这几个月的模拟客观题胜率，当前的专业课进度相对踏实，但政治主观题的语料积累落后于同期均值 15%。建议下阶段强化主干脉络背诵。',
    citations: [
      { id: 1, title: '考研题库刷题数据', summary: '基于错题本记录生成的动态诊断报告。', url: '#' }
    ]
  },
  '分析目标院校报录比': {
    text: '目前抓取了该学院相关的关键考研指标数据：\n\n根据公开信息，南大软件学院2025届录取比率大约在 8:1 ，初试均分 362分。\n今年预计由于缩招等政策影响，竞争烈度存在小幅上扬可能。',
    citations: [
      { id: 1, title: '网报大数据监控版', summary: '2025届考研核心白皮书：双一流院校报录比走势与分析。', url: '#' },
    ]
  },
  '推荐适合的复习资料': {
    text: '由于你的线性代数基础出现薄弱环节，为你过滤出两套适合专项突破的资料：\n1. 《李林线性代数讲义》 - 难度适中\n2. 某站强化突击班视频记录。',
    citations: [
      { id: 1, title: '知识图谱薄弱项定位', summary: '系统诊断发现你在空间向量与矩阵变换章节错误率攀升。', url: '#' }
    ]
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


interface AgentDrawerProps {
  agentType: AgentType;
}

export default function AgentDrawer({ agentType }: AgentDrawerProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agentConfig = {
    judgment: {
      name: '信息研判 Agent',
      icon: MessageSquare,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      greeting: '为你整理了今日最值得关注的变化，要先看重点还是先看来源？',
      suggestions: ['解读今日高优预警', '总结近期院校通知', '过滤低迷信息']
    },
    planning: {
      name: '日程规划 Agent',
      icon: CalendarCheck,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      greeting: '你今天还有 2 项高优先级事项，需要我帮你重新安排吗？',
      suggestions: ['帮我规划本周节奏', '推迟低优活动', '为模拟考预留时间']
    },
    policy: {
      name: '策略支持 Agent',
      icon: Lightbulb,
      color: 'bg-violet-500',
      lightColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      greeting: '基于你当前的备考模式，我可以帮你判断下一步该优先投入什么。',
      suggestions: ['评估当前备考进度', '分析目标院校报录比', '推荐适合的复习资料']
    }
  };

  const [agentPrompts, setAgentPrompts] = useState({
    judgment: '系统级扮演：你是一个客观高效的信息研判专家。你的职责是从原始信息流中过滤噪音，提取高度强相关的变化、预警优先事项，以简练客观的方式汇报给用户。',
    planning: '系统级扮演：你是一个统筹兼顾的日程规划大脑。职责：排查各项任务死线，自动建议日程穿插。对话保持严谨精炼。',
    policy: '系统级扮演：你是一个拥有海量数据挖掘能力的策略教练。职责：评估当前进展并提供基于最新考点数据的针对性决策和辅导资料建议。'
  });

  const current = agentConfig[agentType];
  const Icon = current.icon;

  useEffect(() => {
    setMessages([
      { id: 'greeting', role: 'assistant', text: current.greeting }
    ]);
    setIsConfigOpen(false);
  }, [agentType, current.greeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let responseMatched = false;
      
      for (const [key, canned] of Object.entries(MOCK_RESPONSES)) {
        if (text.includes(key) || key.includes(text)) {
           setMessages(prev => [...prev, {
             id: Date.now().toString() + 'r',
             role: 'assistant',
             text: canned.text,
             citations: canned.citations
           }]);
           responseMatched = true;
           break;
        }
      }

      if (!responseMatched) {
         setMessages(prev => [...prev, {
             id: Date.now().toString() + 'r',
             role: 'assistant',
             text: `关于“${text}”，我的感知单元已经为你处理。你可以点开来源模块查看溯源资料。`
         }]);
      }
    }, 1200); 
  };


  return (
    <div className="relative h-full z-20 shrink-0 w-[20rem] lg:w-[22.5rem] bg-white border-l border-slate-100 shadow-[0_0_40px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
      
      {/* Header with Clickable Trigger */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 h-[4.5rem]">
        <button 
          onClick={() => setIsConfigOpen(true)}
          className="flex items-center gap-3 text-left w-full hover:bg-slate-50 -ml-2 p-2 rounded-2xl transition-all group focus:outline-none"
        >
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-active:scale-95", current.color)}>
            <Icon size={16} />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900 text-[15px] leading-tight flex items-center gap-1.5">
              {current.name}
              <Settings2 size={12} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">在线服务中 / 点此配置</span>
            </div>
          </div>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-slate-50/50 flex flex-col gap-6">
        {messages.map((msg, i) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
          >
            {msg.role === 'assistant' && (
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm mt-1 border-[2px] border-white focus:outline-none", current.color)}>
                <Icon size={14} />
              </div>
            )}
            
            <div className="flex flex-col max-w-[85%]">
              <div className={cn(
                "px-4 py-3 shadow-sm relative break-words",
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" 
                  : "bg-white border border-slate-100 rounded-2xl rounded-tl-sm text-slate-700"
              )}>
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

              {/* Initial Suggestions */}
              {i === 0 && msg.role === 'assistant' && (
                 <div className="flex flex-col gap-2 mt-4 self-start">
                   {current.suggestions.map((suggestion) => (
                     <button 
                       key={suggestion}
                       onClick={() => handleSendMessage(suggestion)}
                       className="text-[11.5px] font-bold text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 rounded-lg px-3 py-2 transition-colors shadow-sm text-left truncate w-[16rem]"
                     >
                       "{suggestion}"
                     </button>
                   ))}
                 </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
             <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm mt-1", current.color)}>
                <Icon size={14} />
             </div>
             <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
             </div>
           </motion.div>
        )}
        <div ref={messagesEndRef} className="h-2 shrink-0" />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0 pb-6 lg:pb-4">
        <div className="relative">
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder={`交给${current.name.split(' ')[0]}处理...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-3 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all font-medium placeholder:font-normal placeholder:text-slate-400 shadow-sm"
          />
          <button 
            onClick={() => handleSendMessage(inputText)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-white rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95",
              inputText.trim().length > 0 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-300 cursor-not-allowed"
            )}
          >
            <Send size={14} className="ml-0.5" />
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
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between h-[4.5rem] bg-indigo-50/50 shrink-0">
               <div className="flex items-center gap-2 text-indigo-900 font-bold">
                 <Settings2 size={16} className="text-indigo-600" />
                 个性化 Agent 配置
               </div>
               <button onClick={() => setIsConfigOpen(false)} className="p-1 px-2 hover:bg-slate-200/60 rounded-lg text-slate-500 transition-colors">
                 <X size={18} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/30">
              <h4 className="text-[13px] font-black text-slate-800 mb-5 pb-2 border-b border-slate-100/60">{current.name}</h4>

              <div className="mb-6">
                 <label className="text-[12px] font-bold text-slate-500 mb-2.5 block">系统提示词 (System Persona)</label>
                 <textarea 
                   className="w-full h-36 p-3.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 leading-relaxed focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-none custom-scrollbar shadow-sm"
                   value={agentPrompts[agentType]}
                   onChange={(e) => setAgentPrompts({...agentPrompts, [agentType]: e.target.value})}
                 />
              </div>

              <div className="mb-6">
                 <label className="text-[12px] font-bold text-slate-500 mb-2.5 flex justify-between">
                   <span>分析温度值 (Temperature)</span>
                   <span className="text-indigo-600 font-mono">0.4</span>
                 </label>
                 <div className="flex items-center gap-4 px-1">
                   <input type="range" className="w-full accent-indigo-600" min="0" max="100" defaultValue="40" />
                 </div>
                 <div className="mt-2 text-[10px] text-slate-400 font-medium">偏向客观数据提取，建议保持低温度以保证严谨。</div>
              </div>

              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl mt-8">
                 <div className="flex items-start gap-2.5">
                   <div className="mt-0.5"><Sparkles size={14} className="text-indigo-500" /></div>
                   <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
                     编辑保存后将重置当前会话实例。当前 Agent 已自动获得全局数据库、邮件订阅、日程排表的“读取”与“编排”权限。
                   </p>
                 </div>
              </div>
            </div>

            {/* Config Footer Actions */}
            <div className="p-5 border-t border-slate-100 shrink-0 bg-white">
               <button 
                  onClick={() => setIsConfigOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-slate-200 active:scale-[0.98]"
               >
                 保存配置并应用
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
