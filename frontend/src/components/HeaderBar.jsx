import React from 'react';
import { useAuth } from '../context/AuthContext';
import { EmsiLogo } from './EmsiLogo';
import { Menu, Bell, User as UserIcon } from 'lucide-react';

export const HeaderBar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-emsi-700 text-white sticky top-0 z-40 shadow-md">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Hamburger & EMSI Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            type="button"
            className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            title="Menu navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <EmsiLogo variant="white" size="default" />

          <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-white/20">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-white backdrop-blur-sm tracking-wide">
              EmsiCollab • PFE & Projets
            </span>
          </div>
        </div>

        {/* Right: Notifications & Profile avatar */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            className="relative p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2 pl-2">
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner">
              {user?.firstName?.charAt(0) || 'H'}{user?.lastName?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left text-xs leading-none">
              <span className="font-bold text-white tracking-wide">
                {user ? `${user.firstName} ${user.lastName}` : 'ARHRID Hamza'}
              </span>
              <span className="text-[10px] text-emerald-200 mt-0.5 font-medium">
                {user?.role === 'PROFESSOR' ? 'Enseignant / Encadrant' : user?.role === 'ADMIN' ? 'Coordination EMSI' : 'Étudiant 5DSIO'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
