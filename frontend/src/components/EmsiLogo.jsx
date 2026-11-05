import React from 'react';

export const EmsiLogo = ({ variant = 'white', className = '', showSubtitle = true, size = 'default' }) => {
  const isWhite = variant === 'white';
  const textColor = isWhite ? 'text-white' : 'text-slate-900';
  const subColor = isWhite ? 'text-white/80' : 'text-slate-500';
  const emblemBg = isWhite ? 'bg-white text-emsi-700' : 'bg-emsi-700 text-white';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* EMSI Emblem */}
      <div className={`flex-shrink-0 flex items-center justify-center rounded-lg shadow-sm font-black tracking-tighter ${
        size === 'large' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-xs'
      } ${emblemBg}`}>
        <div className="flex flex-col items-center justify-center leading-none">
          <svg className={size === 'large' ? 'w-7 h-7' : 'w-6 h-6'} viewBox="0 0 24 24" fill="currentColor">
            {/* EMSI stylized graduation / 3 pillars graphic */}
            <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
            <path d="M3.5 10.5v5.8C5.8 18.2 8.7 19 12 19s6.2-.8 8.5-2.7v-5.8l-8.5 3.86-8.5-3.86z" opacity="0.85" />
          </svg>
          <span className="text-[8px] font-extrabold tracking-widest mt-0.5">EMSI</span>
        </div>
      </div>

      {/* EMSI Typography */}
      <div className="flex flex-col text-left leading-tight">
        <span className={`font-bold uppercase tracking-wider ${
          size === 'large' ? 'text-sm' : 'text-[11px] sm:text-xs'
        } ${textColor}`}>
          École Marocaine des
        </span>
        <span className={`font-extrabold uppercase tracking-wide ${
          size === 'large' ? 'text-base font-black' : 'text-xs sm:text-sm font-black'
        } ${textColor}`}>
          Sciences de l'Ingénieur
        </span>
        {showSubtitle && (
          <span className={`text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase ${subColor}`}>
            Membre de <span className="font-bold underline decoration-amber-400">Honoris United Universities</span>
          </span>
        )}
      </div>
    </div>
  );
};
