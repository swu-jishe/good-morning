import type {DragEvent, KeyboardEvent, MouseEvent as ReactMouseEvent} from 'react';
import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  CalendarCheck,
  FileText,
  Lightbulb,
  MessageSquare,
  Send,
  Settings2,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import type {AgentType} from '../types';
import {submissionContent} from '../content/submissionContent';
import {usePet} from '../context/PetContext';
import {cn} from '../lib/utils';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  agentId?: AgentType;
  text: string;
}

interface AgentDrawerProps {
  agentType: AgentType;
}

const MIN_DRAWER_WIDTH = 288;
const MAX_DRAWER_WIDTH = 640;
const DEFAULT_DRAWER_WIDTH = 376;
const STORAGE_KEY = 'zhitu-agent-drawer-width';
const KEYBOARD_RESIZE_STEP = 16;
const SYSTEM_MESSAGE_ID = 'sys_init';

const agentConfig: Record<
  AgentType,
  {
    id: AgentType;
    shortName: string;
    name: string;
    icon: typeof MessageSquare;
    color: string;
  }
> = {
  judgment: {
    id: 'judgment',
    shortName: '研判',
    name: '信息研判 Agent',
    icon: MessageSquare,
    color: 'bg-blue-500',
  },
  planning: {
    id: 'planning',
    shortName: '规划',
    name: '日程规划 Agent',
    icon: CalendarCheck,
    color: 'bg-emerald-500',
  },
  policy: {
    id: 'policy',
    shortName: '策略',
    name: '策略支持 Agent',
    icon: Lightbulb,
    color: 'bg-violet-500',
  },
};

export default function AgentDrawer({agentType}: AgentDrawerProps) {
  const assistantCopy = submissionContent.assistant;
  const {speak: petSpeak} = usePet();
  const [activeAgents, setActiveAgents] = useState<AgentType[]>([agentType]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_DRAWER_WIDTH;
    const stored = Number(window.localStorage.getItem(STORAGE_KEY));
    if (!stored || Number.isNaN(stored)) return DEFAULT_DRAWER_WIDTH;
    return Math.max(MIN_DRAWER_WIDTH, Math.min(MAX_DRAWER_WIDTH, stored));
  });
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {id: SYSTEM_MESSAGE_ID, role: 'system', text: assistantCopy.systemMessage},
  ]);
  const [inputText, setInputText] = useState('');
  const [dragOverlay, setDragOverlay] = useState(false);
  const [agentPrompts, setAgentPrompts] = useState<Record<AgentType, string>>({
    ...assistantCopy.prompts,
  });
  const isResizingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const configTitleId = 'agent-drawer-config-title';
  const openConfigButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeConfigButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const stopResize = () => {
    isResizingRef.current = false;
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  const clampWidth = (width: number) => Math.max(MIN_DRAWER_WIDTH, Math.min(MAX_DRAWER_WIDTH, width));

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const next = Math.max(
        MIN_DRAWER_WIDTH,
        Math.min(MAX_DRAWER_WIDTH, window.innerWidth - e.clientX),
      );
      setDrawerWidth(next);
    };

    const handleUp = () => {
      if (!isResizingRef.current) return;
      stopResize();
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      stopResize();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, String(drawerWidth));
  }, [drawerWidth]);

  useEffect(() => {
    setActiveAgents([agentType]);
    setMessages([{id: SYSTEM_MESSAGE_ID, role: 'system', text: assistantCopy.systemMessage}]);
    setInputText('');
  }, [agentType, assistantCopy.systemMessage]);

  useEffect(() => {
    if (!isConfigOpen) {
      const focusTarget = previousFocusRef.current ?? openConfigButtonRef.current;
      focusTarget?.focus();
      previousFocusRef.current = null;
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeConfigButtonRef.current?.focus();
  }, [isConfigOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages, activeAgents]);

  const startResize = (e: ReactMouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const resetWidth = () => {
    setDrawerWidth(DEFAULT_DRAWER_WIDTH);
  };

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setDrawerWidth((prev) => clampWidth(prev + KEYBOARD_RESIZE_STEP));
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setDrawerWidth((prev) => clampWidth(prev - KEYBOARD_RESIZE_STEP));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setDrawerWidth(MIN_DRAWER_WIDTH);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setDrawerWidth(MAX_DRAWER_WIDTH);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      resetWidth();
    }
  };

  const toggleAgent = (target: AgentType) => {
    setActiveAgents((prev) => {
      if (prev.includes(target)) {
        if (prev.length === 1) return prev;
        return prev.filter((agent) => agent !== target);
      }

      return [...prev, target];
    });
  };

  const handleSendMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const timestamp = Date.now();
    const assistantAgent = activeAgents[0] ?? agentType;

    setMessages((prev) => [
      ...prev,
      {id: `user-${timestamp}`, role: 'user', text},
      {
        id: `assistant-${timestamp}`,
        role: 'assistant',
        agentId: assistantAgent,
        text: assistantCopy.responseMessage,
      },
    ]);
    setInputText('');
    petSpeak(assistantCopy.responseMessage, 4000);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverlay(true);
  };

  const handleDragLeave = () => {
    setDragOverlay(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverlay(false);
    setInputText(assistantCopy.dragPrefill);
  };

  const handleConfigKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsConfigOpen(false);
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusables = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (focusables.length === 0) return;

    const firstFocusable = focusables[0] as HTMLElement | undefined;
    const lastFocusable = focusables[focusables.length - 1] as HTMLElement | undefined;
    const activeElement = document.activeElement;

    if (!firstFocusable || !lastFocusable) return;

    if (!event.shiftKey && activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
      return;
    }

    if (event.shiftKey && activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    }
  };

  const activeNames = activeAgents.map((agent) => agentConfig[agent].shortName).join('、');
  const combinedSuggestions: string[] = Array.from(
    new Set(activeAgents.flatMap((agent) => assistantCopy.suggestions[agent])),
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{width: `${drawerWidth}px`}}
      className={cn(
        'relative h-full z-20 shrink-0 bg-slate-50/50 border-l border-slate-200/60 shadow-sm flex flex-col overflow-hidden',
        isResizing && 'select-none',
      )}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="拖动调整抽屉宽度"
        aria-valuemin={MIN_DRAWER_WIDTH}
        aria-valuemax={MAX_DRAWER_WIDTH}
        aria-valuenow={drawerWidth}
        tabIndex={0}
        onMouseDown={startResize}
        onDoubleClick={resetWidth}
        onKeyDown={handleResizeKeyDown}
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1.5 z-40 cursor-col-resize transition-colors group/resize',
          isResizing ? 'bg-indigo-400' : 'hover:bg-indigo-200',
        )}
      >
        <div
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-1 rounded-full transition-colors',
            isResizing ? 'bg-white' : 'bg-slate-300 group-hover/resize:bg-indigo-400',
          )}
        />
      </div>

      <div className="px-5 pt-5 pb-4 border-b border-slate-200/60 flex flex-col shrink-0 bg-white z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-[17px] flex items-center gap-2 tracking-tight">
            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
              <Users size={14} />
            </div>
            智能协同面板
          </h2>
          <button
            type="button"
            aria-label="打开协同配置"
            onClick={() => setIsConfigOpen(true)}
            ref={openConfigButtonRef}
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 focus:outline-none group"
          >
            <Settings2 size={18} className="group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        <p className="text-[13px] text-slate-500 mt-3.5 mb-2 font-medium">
          {assistantCopy.configNotice}
        </p>
        <div className="flex flex-wrap gap-2 w-full mt-1">
          {(['judgment', 'planning', 'policy'] as AgentType[]).map((agent) => {
            const isActive = activeAgents.includes(agent);
            const config = agentConfig[agent];

            return (
              <button
                key={agent}
                type="button"
                onClick={() => toggleAgent(agent)}
                className={cn(
                  'relative h-[34px] rounded-xl flex items-center justify-center px-3.5 transition-all focus:outline-none border',
                  isActive
                    ? cn(config.color, 'border-transparent text-white shadow-md shadow-indigo-100')
                    : 'bg-slate-50/50 border-slate-200 text-slate-500 hover:bg-slate-100/80',
                )}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <config.icon size={13} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="text-[14px] font-bold whitespace-nowrap">{config.shortName}</span>
                </span>
                {isActive && (
                  <div className="absolute top-0 right-0 w-[6px] h-[6px] rounded-bl text-white bg-white/20" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {dragOverlay && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="absolute inset-0 z-40 bg-indigo-500/10 backdrop-blur-[2px] border-[3px] border-indigo-500 border-dashed flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-md px-6 py-5 rounded-2xl shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-[17px] mb-0.5">松开手以填充输入框</div>
                <div className="text-[14px] text-slate-500 font-medium">系统已就绪，等待后端返回。</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 flex flex-col gap-6">
        {messages.map((msg) => {
          if (msg.role === 'system') {
            return (
              <div key={msg.id} className="text-center">
                <span className="text-[12px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full items-center inline-flex gap-1.5">
                  <Sparkles size={10} className="text-indigo-400" />
                  {msg.text}
                </span>
              </div>
            );
          }

          const resolvedAgent = msg.agentId ?? activeAgents[0] ?? agentType;
          const config = agentConfig[resolvedAgent];

          return (
            <motion.div
              key={msg.id}
              initial={{opacity: 0, y: 10, scale: 0.98}}
              animate={{opacity: 1, y: 0, scale: 1}}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              {msg.role === 'assistant' && (
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5',
                    config.color,
                  )}
                >
                  <config.icon size={14} />
                </div>
              )}

              <div className="flex flex-col max-w-[85%]">
                <div
                  className={cn(
                    'px-4 py-3 relative break-words',
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-md shadow-md shadow-indigo-200/50'
                      : 'bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-md text-slate-700',
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="text-[12px] font-bold mb-1 opacity-60 flex items-center gap-1 uppercase tracking-wider">
                      {config.name}
                    </div>
                  )}
                  <div className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </div>

      <div className="px-3 pb-3 flex overflow-x-auto custom-scrollbar gap-2 shrink-0 bg-gradient-to-t from-white via-white to-transparent pt-4">
        {combinedSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSendMessage(suggestion)}
            className="shrink-0 text-[13px] font-bold text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm rounded-xl px-3.5 py-2 transition-all active:scale-95"
          >
            "{suggestion}"
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200/60 bg-white shrink-0 pb-6 lg:pb-4 shadow-sm">
        <div className="relative">
          <input
            type="text"
            aria-label="团队输入框"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder={`输入协同内容，等待 [${activeNames}] 后端返回...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-11 py-3.5 text-[15px] focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all font-semibold placeholder:font-medium placeholder:text-slate-400 shadow-sm"
          />
          <button
            type="button"
            aria-label="发送消息"
            disabled={inputText.trim().length === 0}
            onClick={() => handleSendMessage(inputText)}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 text-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95',
              inputText.trim().length > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                : 'bg-slate-300 cursor-not-allowed',
            )}
          >
            <Send size={15} className="ml-0.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isConfigOpen && (
          <motion.div
            initial={{y: '100%'}}
            animate={{y: 0}}
            exit={{y: '100%'}}
            transition={{type: 'spring', damping: 28, stiffness: 280}}
            role="dialog"
            aria-modal="true"
            aria-labelledby={configTitleId}
            tabIndex={-1}
            ref={dialogRef}
            onKeyDown={handleConfigKeyDown}
            className="absolute inset-0 z-50 bg-white flex flex-col shadow-2xl"
          >
            <div className="px-5 py-4 border-b border-slate-200/60 flex items-center justify-between h-[4.5rem] bg-indigo-50/50 shrink-0">
              <div id={configTitleId} className="flex items-center gap-2 text-indigo-900 font-bold text-[17px]">
                <Settings2 size={16} className="text-indigo-600" />
                协同配置
              </div>
              <button
                type="button"
                aria-label="关闭协同配置"
                onClick={() => setIsConfigOpen(false)}
                ref={closeConfigButtonRef}
                className="p-1 px-2 hover:bg-slate-200/60 rounded-lg text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/30">
              <h4 className="text-[15px] font-bold text-slate-800 mb-5 pb-2 border-b border-slate-100/60">
                当前协同说明 (0)
              </h4>

              {activeAgents.map((agent) => {
                const config = agentConfig[agent];
                const promptId = `agent-prompt-${agent}`;

                return (
                  <div key={agent} className="mb-6">
                    <label
                      htmlFor={promptId}
                      className="text-[14px] font-bold text-slate-600 mb-2.5 flex items-center gap-2"
                    >
                      <div className={cn('w-6 h-6 rounded flex items-center justify-center text-white', config.color)}>
                        <config.icon size={12} />
                      </div>
                      {config.name} 协同说明
                    </label>
                    <textarea
                      id={promptId}
                      className="w-full h-24 p-3.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 leading-relaxed font-medium focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-none custom-scrollbar shadow-sm"
                      value={agentPrompts[agent]}
                      onChange={(e) =>
                        setAgentPrompts((prev) => ({
                          ...prev,
                          [agent]: e.target.value,
                        }))
                      }
                    />
                  </div>
                );
              })}

              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl mt-8 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    <Sparkles size={14} className="text-indigo-500" />
                  </div>
                  <p className="text-[13px] text-indigo-800 leading-relaxed font-bold">
                    {assistantCopy.configFootnote}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200/60 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-slate-200 active:scale-[0.98]"
              >
                关闭当前协同配置
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
