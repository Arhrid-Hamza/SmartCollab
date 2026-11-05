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
  CheckSquare,
  User,
  Award,
  FileSpreadsheet,
  FileText,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ activeTab, onSelectTab, isOpen }) => {
  const { user, logout } = useAuth();

  const role = user?.role || 'STUDENT';
  const isProf = role === 'PROFESSOR';
  const isAdmin = role === 'ADMIN';
  const isStudent = role === 'STUDENT';
  const isHamza = user?.email === 'hamza.arhrid@emsi-edu.ma' || user?.firstName === 'Hamza';

  let menuItems = [];
  let secondaryItems = [];
  let navTitle = 'Navigation';
  let secondaryTitle = 'Informations Générales';

  if (isProf) {
    navTitle = 'Espace Enseignant';
    secondaryTitle = 'Pédagogie & Outils';
    menuItems = [
      { id: 'accueil', label: 'Tableau de bord', icon: Home },
      { id: 'profile', label: 'Mon profil Enseignant', icon: User },
      { id: 'subjects', label: 'Gestion des Sujets PFE/PFA', icon: FolderGit2, badge: '5' },
      { id: 'applications', label: 'Candidatures reçues', icon: CheckSquare, badgeAmber: '3' },
      { id: 'mentoring', label: "Suivi de l'Encadrement PFE", icon: Award },
      { id: 'schedule', label: 'Mon Emploi du Temps', icon: Calendar },
      { id: 'grades', label: 'Saisie Absences & Notes', icon: CalendarCheck },
      { id: 'announcements', label: 'Annonces Pédagogiques', icon: Megaphone },
    ];
    secondaryItems = [
      { id: 'reports', label: 'Fiches d’évaluation PFE', icon: FileText },
      { id: 'survey', label: 'Questionnaires étudiants', icon: BarChart2 },
    ];
  } else if (isAdmin) {
    navTitle = 'Direction des Études';
    secondaryTitle = 'Administration Centrale';
    menuItems = [
      { id: 'accueil', label: 'Tableau de bord Global', icon: Home },
      { id: 'profile', label: 'Profil Coordination', icon: User },
      { id: 'subjects', label: 'Validation des Sujets PFE', icon: FolderGit2, badge: '5' },
      { id: 'applications', label: 'Affectations & Groupes', icon: CheckSquare },
      { id: 'users_management', label: 'Gestion des Comptes', icon: Users },
      { id: 'schedule', label: 'Planning Soutenances', icon: Calendar },
      { id: 'reports', label: 'Bilans & Délibérations', icon: FileSpreadsheet },
      { id: 'announcements', label: 'Annonces Officielles', icon: Megaphone, badgeBlue: '1' },
    ];
    secondaryItems = [
      { id: 'disciplinary', label: 'Comité de Discipline', icon: Scale },
      { id: 'survey', label: 'Statistiques & Enquêtes', icon: BarChart2 },
    ];
  } else {
    // STUDENT (Exact EMSI student portal)
    navTitle = 'Navigation';
    secondaryTitle = 'Informations Générales';
    menuItems = [
      { id: 'accueil', label: 'Accueil', icon: Home },
      { id: 'profile', label: 'Mon profil', icon: User },
      { id: 'schedule', label: 'Mon emploi du temps', icon: Calendar },
      { id: 'absences', label: 'Mes absences', icon: CalendarCheck, badgeRed: '14' },
      { id: 'announcements', label: 'Mes annonces', icon: Megaphone, badgeBlue: '1' },
      { id: 'documents', label: 'Mes documents', icon: Folder },
      { id: 'subjects', label: 'Sujets de Projets (PFE/PFA)', icon: FolderGit2, badge: '5' },
      { id: 'groups', label: 'Mes Groupes', icon: Users },
      { id: 'applications', label: 'Mes Candidatures & Choix', icon: CheckSquare },
    ];
    secondaryItems = [
      { id: 'disciplinary', label: 'Mesures disciplinaires', icon: Scale },
      { id: 'survey', label: 'Questionnaire fin de format...', icon: BarChart2 },
    ];
  }

  return (
    <aside
      className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              {navTitle}
            </h3>
            {isProf && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                Professeur
              </span>
            )}
            {isAdmin && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                Direction
              </span>
            )}
          </div>

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
                  {item.badgeAmber && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                      {item.badgeAmber}
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
            {secondaryTitle}
          </h4>

          <nav className="space-y-1">
            {secondaryItems.map((item) => {
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
        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          title="Consulter et modifier mon profil"
          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors text-left focus:outline-none"
        >
          {isHamza ? (
            <img
              src="/hamza-avatar.png"
              alt="Hamza Arhrid"
              className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-sm flex-shrink-0"
            />
          ) : isProf ? (
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              KB
            </div>
          ) : isAdmin ? (
            <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              ED
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-emsi-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              {user?.firstName?.charAt(0) || 'H'}{user?.lastName?.charAt(0) || 'A'}
            </div>
          )}
          <div className="truncate flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.lastName?.toUpperCase() || 'ARHRID'} {user?.firstName || 'Hamza'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {isStudent && (user?.studentIdentifier || user?.matricule || 'C-2025-000564')}
              {isProf && 'Professeur • Dép. IIR'}
              {isAdmin && 'Direction des Études'}
            </p>
          </div>
        </button>

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
