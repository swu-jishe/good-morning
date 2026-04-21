import { PageType } from '../types';
import { LayoutDashboard, CalendarDays, Settings, Radar } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { id: 'dashboard', label: '工作台', icon: LayoutDashboard },
    { id: 'schedule', label: '日程安排', icon: CalendarDays },
    { id: 'settings', label: '订阅配置', icon: Settings },
  ] as const;

  return (
    <div className="relative h-full shrink-0 z-50 hidden md:block w-[5.5rem]">
      <nav 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "absolute left-0 top-0 h-full bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.03)] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden",
          isHovered ? "w-[16.25rem]" : "w-[5.5rem]"
        )}
      >
        <div className="w-[16.25rem] flex flex-col h-full pt-6 pb-6">
          {/* Header */}
          <div className="px-6 flex items-center gap-4 mb-10 h-12 shrink-0">
            <div className="w-10 h-10 shrink-0 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Radar size={24} strokeWidth={2.5} />
            </div>
            <div className={cn("transition-opacity duration-300 flex flex-col justify-center", isHovered ? "opacity-100 delay-100" : "opacity-0")}>
              <h1 className="font-bold text-slate-900 text-[17px] tracking-tight leading-tight">Goal Radar</h1>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block w-fit mt-0.5">
                考研模式
              </span>
            </div>
          </div>

          {/* Nav Menu */}
          <div className="flex-1 px-4 space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = currentPage === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={cn(
                    "relative w-full flex items-center h-[3.25rem] rounded-2xl text-sm font-semibold transition-colors group px-4 justify-start"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 bg-indigo-50/80 rounded-2xl -z-10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <Icon size={20} className={cn("shrink-0", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className={cn(
                    "ml-3.5 transition-opacity duration-300 whitespace-nowrap text-[15px]", 
                    isHovered ? "opacity-100 delay-100" : "opacity-0 pointer-events-none",
                    isActive ? "text-indigo-700" : "text-slate-500 group-hover:text-slate-900"
                  )}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Target Progress Widget */}
          <div className={cn("px-5 transition-opacity duration-300", isHovered ? "opacity-100 delay-100" : "opacity-0 pointer-events-none")}>
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs font-semibold text-slate-400 mb-1">当前主目标</div>
              <div className="font-bold text-slate-800 text-[13px]">2026年考研初试</div>
              <div className="mt-3 bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
