import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

interface PetCtx {
  bubbleContent: string | null;
  isThinking: boolean;
  isVisible: boolean;
  celebrateTrigger: number;
  speak: (content: string, ttlMs?: number) => void;
  speakPersistent: (content: string) => void;
  dismissPersistent: () => void;
  setThinking: (thinking: boolean) => void;
  setVisible: (v: boolean) => void;
  celebrate: (content?: string) => void;
}

const Ctx = createContext<PetCtx | null>(null);

export function PetProvider({ children }: { children: ReactNode }) {
  const [bubbleContent, setBubbleContent] = useState<string | null>(null);
  const [isThinking, setIsThinkingState] = useState(false);
  const [isVisible, setIsVisibleState] = useState(true);
  const [celebrateTrigger, setCelebrateTrigger] = useState(0);
  const timerRef = useRef<number | null>(null);
  // 当前气泡是否由 hover 持久模式设置（仅在鼠标离开目标时才主动关闭）
  const persistentRef = useRef(false);

  const speak = useCallback((content: string, ttlMs = 5000) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setIsThinkingState(false);
    persistentRef.current = false;
    setBubbleContent(content);
    if (ttlMs > 0) {
      timerRef.current = window.setTimeout(() => {
        setBubbleContent(null);
      }, ttlMs);
    }
  }, []);

  const speakPersistent = useCallback((content: string) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setIsThinkingState(false);
    persistentRef.current = true;
    setBubbleContent(content);
  }, []);

  const dismissPersistent = useCallback(() => {
    if (persistentRef.current) {
      persistentRef.current = false;
      setBubbleContent(null);
    }
  }, []);

  const setThinking = useCallback((thinking: boolean) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    persistentRef.current = false;
    setIsThinkingState(thinking);
    if (thinking) {
      setBubbleContent('思考中');
    } else {
      setBubbleContent(null);
    }
  }, []);

  const setVisible = useCallback((v: boolean) => {
    setIsVisibleState(v);
    if (!v) {
      persistentRef.current = false;
      setBubbleContent(null);
    }
  }, []);

  const celebrate = useCallback(
    (content = '完美！已经帮你全部同步啦 ✨') => {
      setCelebrateTrigger((c) => c + 1);
      speak(content, 4500);
    },
    [speak],
  );

  return (
    <Ctx.Provider
      value={{
        bubbleContent,
        isThinking,
        isVisible,
        celebrateTrigger,
        speak,
        speakPersistent,
        dismissPersistent,
        setThinking,
        setVisible,
        celebrate,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePet() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePet must be used within PetProvider');
  return v;
}
