import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, User, ShieldCheck, BookOpen } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Administrateur',
          classes: 'bg-purple-100 text-purple-700 border-purple-200',
          icon: ShieldCheck,
        };
      case 'PROFESSOR':
        return {
          label: 'Professeur',
          classes: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: BookOpen,
        };
      default:
        return {
          label: 'Étudiant',
          classes: 'bg-indigo-100 text-indigo-700 border-indigo-200',
          icon: GraduationCap,
        };
    }
  };

  const badge = user ? getRoleBadge(user.role) : null;
  const RoleIcon = badge ? badge.icon : User;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              SmartCollab
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              PFE & Projects
            </span>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">{user.email}</p>
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${badge.classes}`}>
                <RoleIcon className="w-3 h-3" />
                {badge.label}
              </span>
            </div>

            <button
              onClick={logout}
              title="Se déconnecter"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
