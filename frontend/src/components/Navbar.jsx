import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, BookOpen, GraduationCap } from 'lucide-react';
import { EmsiBar, EMSI_GREEN } from './EmsiBar';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Administrateur', icon: ShieldCheck };
      case 'PROFESSOR':
        return { label: 'Professeur', icon: BookOpen };
      default:
        return { label: 'Étudiant', icon: GraduationCap };
    }
  };

  const badge = user ? getRoleBadge(user.role) : null;
  const RoleIcon = badge ? badge.icon : null;

  return (
    <EmsiBar>
      {user && (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 bg-white/10 border border-white/20 rounded-full pl-4 pr-2 py-1.5 text-white">
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-white/70 leading-tight">{user.email}</p>
            </div>
            <span
              style={{ color: EMSI_GREEN }}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white"
            >
              <RoleIcon className="w-3 h-3" />
              {badge.label}
            </span>
          </div>

          <button
            onClick={logout}
            title="Se déconnecter"
            className="inline-flex items-center justify-center p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </EmsiBar>
  );
};
