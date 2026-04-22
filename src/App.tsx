import { useState } from 'react';
import { PageType, AgentType } from './types';
import Sidebar from './components/Sidebar';
import AgentDrawer from './components/AgentDrawer';
import DashboardView from './views/DashboardView';
import ScheduleView from './views/ScheduleView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  // Derived agent type based on page context (Settings => Policy, Profile => Policy for now, can adjust)
  const currentAgentType: AgentType = 
    currentPage === 'dashboard' ? 'judgment' : 
    currentPage === 'schedule' ? 'planning' : 'policy';

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col relative px-4 md:px-8 pt-8 pb-4">
        {/* Top gradient blur reflection */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto w-full h-full custom-scrollbar pr-2 mb-2">
           {currentPage === 'dashboard' && <DashboardView />}
           {currentPage === 'schedule' && <ScheduleView />}
           {currentPage === 'settings' && <SettingsView />}
           {currentPage === 'profile' && <ProfileView />}
        </div>
      </main>

      {/* Persistent AI Drawer */}
      <AgentDrawer agentType={currentAgentType} />
    </div>
  );
}
