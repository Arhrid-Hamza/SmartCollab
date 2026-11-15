import React from 'react';

// Carte "fantôme" affichée pendant la recherche, à la taille exacte de la vraie carte étudiant (360 x ~507)
export const StudentCardSkeleton = () => (
  <div role="status" aria-live="polite" aria-label="Recherche en cours">
    <p className="text-sm text-slate-600 mb-8 text-center">Recherche en cours…</p>
    <div className="flex justify-center">
      <div className="skeleton-card relative w-[360px] max-w-full h-[507px] rounded-[28px] overflow-hidden border border-white/70 bg-white/45 backdrop-blur-xl shadow-[0_18px_50px_rgba(21,136,90,0.18)]">
        <div className="absolute inset-x-0 top-0 h-[62%] bg-emerald-900/10" />
        <div className="relative p-6 space-y-4">
          <span className="block w-[66px] h-[66px] rounded-full bg-white/80" />
          <div className="pt-16 space-y-3">
            <span className="block h-7 w-2/3 rounded-lg bg-emerald-900/15" />
            <span className="block h-4 w-3/4 rounded-lg bg-emerald-900/10" />
          </div>
          <div className="space-y-2.5 pt-2">
            <span className="block h-9 w-40 rounded-full bg-emerald-900/10" />
            <span className="block h-9 w-64 max-w-full rounded-full bg-emerald-900/10" />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <span className="block h-10 rounded-lg bg-emerald-900/10" />
            <span className="block h-10 rounded-lg bg-emerald-900/10" />
            <span className="block h-10 rounded-lg bg-emerald-900/10" />
          </div>
          <span className="block h-[54px] w-full rounded-full bg-emerald-900/15" />
        </div>
      </div>
    </div>
  </div>
);

export default StudentCardSkeleton;
