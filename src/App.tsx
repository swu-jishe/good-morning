import { useState, useEffect } from 'react';
import { PageType, AgentType } from './types';
import Sidebar from './components/Sidebar';
import AgentDrawer from './components/AgentDrawer';
import PetMascot from './components/PetMascot';
import DashboardView from './views/DashboardView';
import AcademicView from './views/AcademicView';
import ScheduleView from './views/ScheduleView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { PetProvider, usePet } from './context/PetContext';

const PAGE_SUMMARIES: Record<PageType, string> = {
  dashboard: '聚合工作台：今日最需要关注"考研报名ddl"，10 月 25 日前要完成确认。',
  academic: '学业规划：当前 GPA 3.82 领先，政治进度落后 15%，建议重点加强。',
  schedule: '日程编排：本周 3 件事，考研报名 P0 最优先级，可点击查看完整回写时间线。',
  profile: '成长档案：距初试 248 天，当前强化期进度 45%，胜率评估 62%。',
  settings: '信息源与策略：已接入 2 个数据源，试试点"立即抓取"？',
};

function useGlobalHoverHint() {
  const { speakPersistent, dismissPersistent } = usePet();
  useEffect(() => {
    let hoverTimer: number | null = null;
    let currentHintEl: Element | null = null;
    let dragging = false;

    const clearPendingHint = () => {
      if (hoverTimer !== null) {
        window.clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    };

    const clearHover = () => {
      clearPendingHint();
      currentHintEl = null;
    };

    const onMouseOver = (e: MouseEvent) => {
      if (dragging) return; // 拖拽过程中不触发 hover hint
      const target = (e.target as HTMLElement | null)?.closest('[data-pet-hint]');
      if (!target || !(target instanceof HTMLElement)) return;
      if (target === currentHintEl) return;
      clearHover();
      currentHintEl = target;
      const hint = target.getAttribute('data-pet-hint');
      if (!hint) return;
      // Optional per-element delay override via data-pet-hint-delay (ms), default 3s
      const delayAttr = target.getAttribute('data-pet-hint-delay');
      const delay = delayAttr ? Number.parseInt(delayAttr, 10) : 3000;
      hoverTimer = window.setTimeout(() => {
        // Hover-triggered bubble stays visible until mouse leaves the element
        speakPersistent(hint);
      }, Number.isFinite(delay) ? delay : 3000);
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('[data-pet-hint]');
      const related = (e.relatedTarget as HTMLElement | null)?.closest('[data-pet-hint]');
      if (target === currentHintEl && related !== currentHintEl) {
        clearHover();
        dismissPersistent();
      }
    };

    // 点击（mousedown）立即取消任何 pending hover hint——点击即表示用户已经
    // 在交互，不需要 5s 后再弹解释
    const onMouseDown = () => {
      clearPendingHint();
    };

    // 拖拽开始：取消 pending hint 并进入拖拽态（禁用新 hover hint），防止
    // 先前 hover 启动的定时器或拖拽经过的其他模块覆盖拖拽气泡
    const onDragStart = () => {
      dragging = true;
      clearHover();
      dismissPersistent();
    };

    const onDragEnd = () => {
      dragging = false;
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('dragend', onDragEnd);
    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('dragend', onDragEnd);
      clearHover();
    };
  }, [speakPersistent, dismissPersistent]);
}

function AppShell() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const { setSelectedEventId } = useSchedule();
  const { speak } = usePet();

  useGlobalHoverHint();

  const currentAgentType: AgentType =
    currentPage === 'dashboard' ? 'judgment' :
    currentPage === 'schedule' ? 'planning' :
    currentPage === 'academic' ? 'policy' :
    'policy';

  // 统一的导航入口：仅当页面实际发生切换时才弹出页面摘要气泡
  const handleNavigate = (page: PageType, focusEventId?: string) => {
    if (focusEventId) setSelectedEventId(focusEventId);
    if (page !== currentPage) {
      setCurrentPage(page);
      const summary = PAGE_SUMMARIES[page];
      if (summary) speak(summary, 5000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col relative px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 pb-4">
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto w-full h-full custom-scrollbar pr-2 mb-2">
           {currentPage === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
           {currentPage === 'academic' && <AcademicView />}
           {currentPage === 'schedule' && <ScheduleView />}
           {currentPage === 'settings' && <SettingsView />}
           {currentPage === 'profile' && <ProfileView />}
        </div>
      </main>

      <AgentDrawer agentType={currentAgentType} />
      <PetMascot />
    </div>
  );
}

export default function App() {
  return (
    <ScheduleProvider>
      <PetProvider>
        <AppShell />
      </PetProvider>
    </ScheduleProvider>
  );
}
