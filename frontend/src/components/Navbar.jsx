import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Bell, ArrowLeft, Search, ShieldCheck, BookOpen, GraduationCap } from 'lucide-react';
import { EmsiBar, EMSI_GREEN } from './EmsiBar';

// Barre de recherche "glass" : la loupe apparaît seule, puis la barre s'étire et la loupe glisse vers la gauche
const SearchIcon = ({ loading }) => {
  // Loupe : tourne en boucle pendant la recherche, puis fait un petit "pop" quand le résultat arrive
  const [pop, setPop] = useState(false);
  const wasLoading = useRef(false);
  useEffect(() => {
    if (loading) {
      wasLoading.current = true;
      return undefined;
    }
    if (!wasLoading.current) return undefined;
    wasLoading.current = false;
    setPop(true);
    const t = setTimeout(() => setPop(false), 550);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <span className={`inline-flex shrink-0 ${loading ? 'search-icon-loading' : pop ? 'search-icon-pop' : ''}`}>
      <Search className="w-[18px] h-[18px] text-white" />
    </span>
  );
};

const SearchBar = ({ value, onChange, placeholder, loading = false }) => (
  <motion.label
    initial={{ width: 44, opacity: 0, scale: 0.5 }}
    animate={{ width: 460, opacity: 1, scale: 1 }}
    exit={{ width: 44, opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
    transition={{
      opacity: { duration: 0.25 },
      scale: { type: 'spring', stiffness: 380, damping: 20 },
      width: { delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    }}
    style={{ maxWidth: '38vw' }}
    className={`h-10 flex items-center gap-2.5 pl-[13px] pr-4 overflow-hidden rounded-full bg-white/15 backdrop-blur-md backdrop-saturate-150 border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_rgba(0,0,0,0.08)] focus-within:bg-white/25 focus-within:border-white/50 transition-colors cursor-text ${loading ? 'search-bar-loading' : ''}`}
  >
    <SearchIcon loading={loading} />
    <motion.input
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.35 }}
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/70"
    />
  </motion.label>
);

export const Navbar = ({ onBack, hideSearch = false, search = '', onSearch, searchPlaceholder = 'Rechercher…', searchLoading = false }) => {
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
  const isAdmin = user?.role === 'ADMIN';

  const logoutButton = (
    <button
      onClick={logout}
      title="Se déconnecter"
      aria-label="Se déconnecter"
      className="inline-flex items-center justify-center p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );

  const notificationButton = (
    <button
      type="button"
      title="Notifications"
      aria-label="Notifications"
      className="inline-flex items-center justify-center p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
    >
      <Bell className="w-5 h-5" />
    </button>
  );

  // Admin : barre épurée. Sur une sous-page (onBack), notifications + déconnexion sont remplacées par "Retour"
  if (isAdmin) {
    const swap = {
      initial: { opacity: 0, x: 16, scale: 0.9 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: -16, scale: 0.9 },
      transition: { duration: 0.25, ease: 'easeOut' },
    };
    return (
      <EmsiBar
        showSocials={false}
        center={
          <AnimatePresence>
            {onBack && !hideSearch && <SearchBar key="search" value={search} onChange={onSearch} placeholder={searchPlaceholder} loading={searchLoading} />}
          </AnimatePresence>
        }
      >
        {user && (
          <AnimatePresence mode="wait" initial={false}>
            {onBack ? (
              <motion.button
                key="back"
                type="button"
                onClick={onBack}
                {...swap}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </motion.button>
            ) : (
              <motion.div key="icons" {...swap} className="flex items-center gap-1">
                {notificationButton}
                {logoutButton}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </EmsiBar>
    );
  }

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
          {logoutButton}
        </div>
      )}
    </EmsiBar>
  );
};
