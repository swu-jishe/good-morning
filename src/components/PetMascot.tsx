import { useState, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Move } from 'lucide-react';
import { usePet } from '../context/PetContext';
import { cn } from '../lib/utils';
import { submissionContent } from '../content/submissionContent';

const greetings = submissionContent.mascot.greetings;

const easterEggLines = [
  '哇，你把互动彩蛋点出来了。',
  '轻一点，我还在努力站稳。',
  '收到连击，今天状态拉满。',
  '彩蛋模式启动，继续保持好奇心。',
  '我有认真数次数，真的。',
  '五连击达成，送你一个庆祝动作。',
];

type AnimKey = 'hop' | 'squash' | 'wiggle' | 'blink' | 'celebrate' | 'greetingHop' | 'spin';

const animationMap: Record<AnimKey, Record<string, unknown>> = {
  hop: { y: [0, -38, 0], transition: { duration: 0.6, ease: 'easeOut' } },
  squash: { scale: [1, 0.85, 1.1, 1], transition: { duration: 0.5 } },
  wiggle: { rotate: [0, -10, 10, -4, 0], transition: { duration: 0.7 } },
  blink: { scaleY: [1, 0.3, 1], scaleX: [1, 1.2, 1], transition: { duration: 0.25 } },
  celebrate: { rotate: [0, 360], y: [0, -62, 0], transition: { duration: 0.9, ease: 'easeOut' } },
  greetingHop: { y: [0, -50, 0], transition: { duration: 0.45 } },
  spin: { rotate: [0, 720], scale: [1, 1.2, 1], transition: { duration: 1.0, ease: 'easeInOut' } },
};

const IDLE_POOL: AnimKey[] = ['hop', 'squash', 'wiggle', 'blink'];

const POS_STORAGE_KEY = 'zhitu-pet-position';
const PET_SIZE = 192; // px（w-48 h-48）
const DRAG_THRESHOLD = 5;
const CLICK_WINDOW_MS = 2500;
const CLICK_COUNT_THRESHOLD = 5;

interface Position {
  x: number;
  y: number;
}

function loadPosition(): Position | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(POS_STORAGE_KEY);
  if (!stored) return null;
  try {
    const p = JSON.parse(stored);
    if (typeof p?.x === 'number' && typeof p?.y === 'number') {
      return { x: p.x, y: p.y };
    }
  } catch {
    // ignore corrupt value
  }
  return null;
}

function clampPosition(p: Position): Position {
  if (typeof window === 'undefined') return p;
  const maxX = window.innerWidth - PET_SIZE - 8;
  const maxY = window.innerHeight - PET_SIZE - 8;
  return {
    x: Math.max(8, Math.min(maxX, p.x)),
    y: Math.max(8, Math.min(maxY, p.y)),
  };
}

function timeGreeting(): string | null {
  const hour = new Date().getHours();
  if (hour < 6 || hour >= 23) return submissionContent.mascot.timeGreetings.late;
  if (hour < 10) return submissionContent.mascot.timeGreetings.early;
  return submissionContent.mascot.timeGreetings.normal;
}

export default function PetMascot() {
  const { bubbleContent, isThinking, isVisible, celebrateTrigger, speak, setVisible } = usePet();
  const [animKey, setAnimKey] = useState<AnimKey>('hop');
  const [animTick, setAnimTick] = useState(0);
  const [hovered, setHovered] = useState(false);

  const [position, setPosition] = useState<Position | null>(() => loadPosition());
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bubbleVisibleRef = useRef(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number } | null>(null);
  const didDragRef = useRef(false);
  const justDraggedRef = useRef(false);
  const positionRef = useRef<Position | null>(position);
  const clickCountRef = useRef(0);
  const firstClickAtRef = useRef(0);
  const eggCooldownUntilRef = useRef(0);

  bubbleVisibleRef.current = Boolean(bubbleContent);
  positionRef.current = position;

  // Random idle animation every 10s (paused while bubble shown or dragging)
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (bubbleVisibleRef.current || dragStartRef.current) return;
      const pick = IDLE_POOL[Math.floor(Math.random() * IDLE_POOL.length)];
      setAnimKey(pick);
      setAnimTick((t) => t + 1);
    }, 10_000);
    return () => window.clearInterval(interval);
  }, []);

  // Celebration trigger
  useEffect(() => {
    if (celebrateTrigger === 0) return;
    setAnimKey('celebrate');
    setAnimTick((t) => t + 1);
  }, [celebrateTrigger]);

  // Time-based greeting on first mount
  useEffect(() => {
    const greeting = timeGreeting();
    if (greeting) {
      const t = window.setTimeout(() => speak(greeting, 4000), 1200);
      return () => window.clearTimeout(t);
    }
  }, [speak]);

  // Document-level drag handlers
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const start = dragStartRef.current;
      if (!start) return;
      const dx = e.clientX - start.clientX;
      const dy = e.clientY - start.clientY;
      if (!didDragRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        didDragRef.current = true;
        setIsDragging(true);
      }
      if (didDragRef.current) {
        const next = clampPosition({ x: start.posX + dx, y: start.posY + dy });
        setPosition(next);
      }
    };
    const onUp = () => {
      if (dragStartRef.current && didDragRef.current) {
        if (positionRef.current) {
          try {
            window.localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(positionRef.current));
          } catch {
            // localStorage disabled, ignore
          }
        }
        justDraggedRef.current = true;
        window.setTimeout(() => {
          justDraggedRef.current = false;
        }, 250);
      }
      dragStartRef.current = null;
      didDragRef.current = false;
      setIsDragging(false);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Reclamp on window resize
  useEffect(() => {
    const onResize = () => {
      setPosition((p) => (p ? clampPosition(p) : p));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handlePetMouseDown = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    const currentX = positionRef.current?.x ?? rect?.left ?? 96;
    const currentY = positionRef.current?.y ?? rect?.top ?? window.innerHeight - PET_SIZE - 24;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      posX: currentX,
      posY: currentY,
    };
    didDragRef.current = false;
  };

  const handleClick = () => {
    if (justDraggedRef.current) return;

    const now = Date.now();

    // 彩蛋冷却期内（默认 6 秒，匹配彩蛋气泡展示时长）点击只做小动作，不刷新气泡
    if (now < eggCooldownUntilRef.current) {
      setAnimKey('greetingHop');
      setAnimTick((t) => t + 1);
      return;
    }

    const inWindow = now - firstClickAtRef.current <= CLICK_WINDOW_MS;

    if (inWindow) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
      firstClickAtRef.current = now;
    }

    // 5 连击：触发彩蛋
    if (clickCountRef.current >= CLICK_COUNT_THRESHOLD) {
      const line = easterEggLines[Math.floor(Math.random() * easterEggLines.length)];
      clickCountRef.current = 0;
      firstClickAtRef.current = 0;
      eggCooldownUntilRef.current = now + 6000;
      speak(line, 6000);
      setAnimKey('spin');
      setAnimTick((t) => t + 1);
      return;
    }

    // 首次点击才弹新气泡；连击窗口内的后续点击只做小动作，不刷新气泡
    if (clickCountRef.current === 1) {
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      speak(greeting, 5000);
    }
    setAnimKey('greetingHop');
    setAnimTick((t) => t + 1);
  };

  const handleReset = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPosition(null);
    try {
      window.localStorage.removeItem(POS_STORAGE_KEY);
    } catch {
      // ignore
    }
    speak('我回到默认位置了。', 2500);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-6 left-24 z-[60] w-11 h-11 rounded-full bg-indigo-600 text-white font-bold shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center"
        aria-label="显示助手"
        title="显示助手"
      >
        <span className="text-[14px] tracking-widest">知</span>
      </button>
    );
  }

  // When position is set, use absolute left/top; otherwise default CSS anchor.
  const usingCustomPosition = position !== null;
  const topHalf = position ? position.y < window.innerHeight / 2 : false;
  const controlsVisible = hovered && !isDragging;
  // Bubble absolute-positioned so pet layout is never affected by bubble toggling
  const bubbleWrapperClass = topHalf
    ? 'absolute left-0 top-full mt-3'
    : 'absolute left-0 bottom-full mb-3';
  const bubblePointerClass = topHalf
    ? 'absolute -top-[9px] left-24 w-4 h-4 bg-white border-l border-t border-slate-200 rotate-45'
    : 'absolute -bottom-[9px] left-24 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45';
  const bubbleInitialY = topHalf ? -10 : 10;

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed z-[60] w-48 h-48 pointer-events-none',
        !usingCustomPosition && 'bottom-6 left-24',
      )}
      style={
        usingCustomPosition
          ? { left: position.x, top: position.y, bottom: 'auto', right: 'auto' }
          : undefined
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {bubbleContent && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, scale: 0.85, y: bubbleInitialY }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: bubbleInitialY }}
            transition={{ duration: 0.25 }}
            className={cn(
              'max-w-[720px] min-w-[320px] bg-white border border-slate-200 rounded-[20px] px-5 py-3 shadow-lg pointer-events-auto',
              bubbleWrapperClass,
            )}
          >
            <div className={bubblePointerClass} />
            <div className="text-[18px] text-slate-700 leading-snug font-medium">
              {isThinking ? (
                <span className="inline-flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  </span>
                  <span className="text-slate-500">思考中</span>
                </span>
              ) : (
                bubbleContent
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-48 h-48 group pointer-events-auto">
        <motion.button
          key={animTick}
          onMouseDown={handlePetMouseDown}
          onClick={handleClick}
          animate={animationMap[animKey]}
          whileHover={isDragging ? undefined : { scale: 1.08 }}
          className={cn(
            'block cursor-pointer drop-shadow-[0_4px_10px_rgba(99,102,241,0.25)] outline-none select-none',
            isDragging && 'cursor-grabbing drop-shadow-[0_10px_20px_rgba(99,102,241,0.35)]',
          )}
          aria-label="助手形象，点击互动（可拖拽）"
        >
          <img
            src="/pet.png"
            alt="助手形象"
            className="w-48 h-48 object-contain select-none"
            style={{ imageRendering: 'pixelated' }}
            draggable={false}
          />
        </motion.button>

        {/* Hover controls */}
        <div
          aria-hidden={!controlsVisible}
          className={cn(
            'absolute -top-1 -right-1 flex items-center gap-1 transition-opacity',
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          {usingCustomPosition && (
            <button
              onClick={handleReset}
              className="w-5 h-5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center"
              aria-label="回到默认位置"
              title="回到默认位置"
              tabIndex={controlsVisible ? 0 : -1}
            >
              <Move size={10} />
            </button>
          )}
          <button
            onClick={() => setVisible(false)}
            className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
            aria-label="隐藏助手"
            title="隐藏助手（可重新显示）"
            tabIndex={controlsVisible ? 0 : -1}
          >
            <X size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
