import { PageType } from '../types';
import { LayoutDashboard, CalendarDays, Settings, Radar, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useState } from 'react';
import { submissionContent } from '../content/submissionContent';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { id: 'dashboard', label: '聚合工作台', icon: LayoutDashboard },
    { id: 'academic', label: '学业规划', icon: GraduationCap },
    { id: 'schedule', label: '日程编排', icon: CalendarDays },
    { id: 'profile', label: '成长档案', icon: BookOpen },
    { id: 'settings', label: '信息源与策略', icon: Settings },
  ] as const;

  return (
    <div className="relative h-full shrink-0 z-50 w-[16.25rem] md:w-[5.5rem]">
      <nav 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "absolute left-0 top-0 h-full bg-white border-r border-slate-100 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden",
          "w-[16.25rem]",
          isHovered ? "md:w-[16.25rem]" : "md:w-[5.5rem]"
        )}
      >
        <div className="w-[16.25rem] flex flex-col h-full pt-6 pb-6">
          {/* Header */}
          <div className="px-6 flex items-center gap-4 mb-10 h-12 shrink-0">
            <div className="w-10 h-10 shrink-0 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Radar size={24} strokeWidth={2.5} />
            </div>
            <div className={cn("transition-opacity duration-300 flex flex-col justify-center opacity-100 md:opacity-0", isHovered && "md:opacity-100 md:delay-100")}>
              <h1 className="font-bold text-slate-900 text-[19px] tracking-tight leading-tight">{submissionContent.navigation.appName}</h1>
              <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block w-fit mt-0.5">
                {submissionContent.navigation.badge}
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
                    "ml-3.5 transition-opacity duration-300 whitespace-nowrap text-[17px] opacity-100 md:opacity-0",
                    isHovered && "md:opacity-100 md:delay-100",
                    !isHovered && "md:pointer-events-none",
                    isActive ? "text-indigo-700" : "text-slate-500 group-hover:text-slate-900"
                  )}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
