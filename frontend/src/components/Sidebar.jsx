import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Calendar,
  CalendarCheck,
  Megaphone,
  Folder,
  Scale,
  BarChart2,
  LogOut,
  FolderGit2,
  Users,
  CheckSquare
} from 'lucide-react';

export const Sidebar = ({ activeTab, onSelectTab, isOpen }) => {
  const { user, logout } = useAuth();

  const isProf = user?.role === 'PROFESSOR';
  const isHamza = user?.email === 'hamza.arhrid@emsi-edu.ma' || user?.firstName === 'Hamza';

  const menuItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'schedule', label: 'Mon emploi du temps', icon: Calendar },
    { id: 'absences', label: 'Mes absences', icon: CalendarCheck, badgeRed: '14' },
    { id: 'announcements', label: 'Mes annonces', icon: Megaphone, badgeBlue: '1' },
    { id: 'documents', label: 'Mes documents', icon: Folder },
    { id: 'subjects', label: isProf ? 'Gestion des Sujets PFE/PFA' : 'Sujets de Projets (PFE/PFA)', icon: FolderGit2, badge: '5' },
    { id: 'groups', label: 'Mes Groupes', icon: Users },
    { id: 'applications', label: isProf ? 'Candidatures reçues' : 'Mes Candidatures & Choix', icon: CheckSquare },
  ];

  const infoItems = [
    { id: 'disciplinary', label: 'Mesures disciplinaires', icon: Scale },
    { id: 'survey', label: 'Questionnaire fin de format...', icon: BarChart2 },
  ];

  return (
    <aside
      className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-wide mb-3 px-2">
            Navigation
          </h3>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'border border-emsi-600/70 bg-emsi-50/80 text-emsi-700 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emsi-700' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                  {item.badgeRed && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
                      {item.badgeRed}
                    </span>
                  )}
                  {item.badgeBlue && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                      {item.badgeBlue}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Informations Générales
          </h4>

          <nav className="space-y-1">
            {infoItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'border border-emsi-600/70 bg-emsi-50/80 text-emsi-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50/60 space-y-3">
        <div className="flex items-center gap-3 px-1">
          {isHamza ? (
            <img
              src="/hamza-avatar.png"
              alt="Hamza Arhrid"
              className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-emsi-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              {user?.firstName?.charAt(0) || 'H'}{user?.lastName?.charAt(0) || 'A'}
            </div>
          )}
          <div className="truncate">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.lastName?.toUpperCase() || 'ARHRID'} {user?.firstName || 'Hamza'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {user?.studentIdentifier || user?.matricule || 'C-2025-000564'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          type="button"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
