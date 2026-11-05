import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HeaderBar } from '../components/HeaderBar';
import { Sidebar } from '../components/Sidebar';
import { AccueilView } from './AccueilView';
import { ProfessorDashboardView } from './ProfessorDashboardView';
import { AdminDashboardView } from './AdminDashboardView';
import { SubjectsView } from './SubjectsView';
import { GroupsView } from './GroupsView';
import { ApplicationsView } from './ApplicationsView';
import { ScheduleView } from './ScheduleView';
import { AbsencesView } from './AbsencesView';
import { AnnouncementsView } from './AnnouncementsView';
import { ProfileView } from './ProfileView';
import { DisciplinaryView, SurveyView } from './StaticViews';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('accueil');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'accueil':
        if (user?.role === 'ADMIN') {
          return <AdminDashboardView onNavigate={setActiveTab} />;
        }
        if (user?.role === 'PROFESSOR') {
          return <ProfessorDashboardView onNavigate={setActiveTab} />;
        }
        return <AccueilView onNavigate={setActiveTab} />;
      case 'subjects':
        return (
          <SubjectsView
            onNavigateToApplications={() => setActiveTab('applications')}
            onNavigateToGroups={() => setActiveTab('groups')}
          />
        );
      case 'groups':
        return <GroupsView />;
      case 'applications':
        return <ApplicationsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'absences':
        return <AbsencesView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'profile':
      case 'documents':
        return <ProfileView />;
      case 'disciplinary':
        return <DisciplinaryView />;
      case 'survey':
        return <SurveyView />;
      default:
        return <AccueilView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col font-sans">
      <HeaderBar
        onToggleSidebar={toggleSidebar}
        onNavigateProfile={() => setActiveTab('profile')}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
        />

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          />
        )}

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 w-full max-w-7xl mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
