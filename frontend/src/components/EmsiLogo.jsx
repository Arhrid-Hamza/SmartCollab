import React from 'react';

export const EmsiLogo = ({ variant = 'white', className = '', size = 'default' }) => {
  if (variant === 'color' || variant === 'green') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img
          src="/emsi-logo.png"
          alt="EMSI - Ecole Marocaine des Sciences de l'Ingenieur"
          className={size === 'large' ? 'h-14 w-auto object-contain' : 'h-10 w-auto object-contain'}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="flex-shrink-0 flex items-center justify-center rounded-lg bg-white p-1 shadow-sm">
        <img
          src="/emsi-logo.png"
          alt="EMSI"
          className="h-8 w-auto object-contain"
        />
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="font-extrabold text-white uppercase tracking-wider text-[11px] sm:text-xs">
          École Marocaine des Sciences de l'Ingénieur
        </span>
        <span className="text-[9px] font-semibold text-emerald-100 uppercase tracking-widest">
          Membre de Honoris United Universities
        </span>
      </div>
    </div>
  );
};
