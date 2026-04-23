import { useState } from 'react';
import { PageType, AgentType } from './types';
import Sidebar from './components/Sidebar';
import AgentDrawer from './components/AgentDrawer';
import DashboardView from './views/DashboardView';
import AcademicView from './views/AcademicView';
import ScheduleView from './views/ScheduleView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';

function AppShell() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const { setSelectedEventId } = useSchedule();

  const currentAgentType: AgentType =
    currentPage === 'dashboard' ? 'judgment' :
    currentPage === 'schedule' ? 'planning' :
    currentPage === 'academic' ? 'policy' :
    'policy';

  const navigateTo = (page: PageType, focusEventId?: string) => {
    setCurrentPage(page);
    if (focusEventId) setSelectedEventId(focusEventId);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col relative px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 pb-4">
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto w-full h-full custom-scrollbar pr-2 mb-2">
           {currentPage === 'dashboard' && <DashboardView onNavigate={navigateTo} />}
           {currentPage === 'academic' && <AcademicView />}
           {currentPage === 'schedule' && <ScheduleView />}
           {currentPage === 'settings' && <SettingsView />}
           {currentPage === 'profile' && <ProfileView />}
        </div>
      </main>

      <AgentDrawer agentType={currentAgentType} />
    </div>
  );
}

export default function App() {
  return (
    <ScheduleProvider>
      <AppShell />
    </ScheduleProvider>
  );
}
