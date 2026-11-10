import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  UserPlus,
  Home
} from 'lucide-react';
import { EmsiBar, EMSI_GREEN } from './EmsiBar';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

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
  const isAdmin = user?.role === 'ADMIN';

  const navLinks = [
    { to: '/', label: 'Tableau de bord', icon: Home, exact: true },
    { to: '/admin/students', label: 'Étudiants', icon: GraduationCap },
    { to: '/admin/professors', label: 'Professeurs', icon: BookOpen },
    { to: '/admin/users/new', label: 'Nouveau Compte', icon: UserPlus, highlight: true },
  ];

  const adminNav = isAdmin ? (
    <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = link.exact
          ? location.pathname === link.to
          : location.pathname.startsWith(link.to);

        if (link.highlight) {
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap shadow-sm ${
                isActive
                  ? 'bg-white text-[#15885a]'
                  : 'bg-emerald-400/25 hover:bg-emerald-400/40 text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={link.to}
            to={link.to}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              isActive
                ? 'bg-white text-[#15885a] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  ) : null;

  return (
    <EmsiBar navContent={adminNav}>
      {user && (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-2.5 sm:space-x-3 bg-white/10 border border-white/20 rounded-full pl-3 sm:pl-4 pr-1.5 sm:pr-2 py-1 text-white">
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-white/70 leading-tight truncate max-w-[140px]">{user.email}</p>
            </div>
            <span
              style={{ color: EMSI_GREEN }}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white shadow-sm"
            >
              <RoleIcon className="w-3 h-3" />
              <span className="hidden sm:inline">{badge.label}</span>
            </span>
          </div>

          <button
            onClick={logout}
            title="Se déconnecter"
            className="inline-flex items-center justify-center p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}
    </EmsiBar>
  );
};
