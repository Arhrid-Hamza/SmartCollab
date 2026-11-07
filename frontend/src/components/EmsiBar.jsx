import React from 'react';
import emsiLogo from '../assets/emsi-logo.png';

export const EMSI_GREEN = '#15885a';

// Barre verte EMSI pleine largeur : logo tout à gauche, rien d'autre (hauteur 64px)
export const EmsiBar = ({ children }) => (
  <header
    style={{ backgroundColor: EMSI_GREEN }}
    className="h-16 w-full shrink-0 sticky top-0 z-30 shadow-md shadow-black/10"
  >
    <div className="h-full w-full px-4 sm:px-6 flex items-center justify-between">
      <img src={emsiLogo} alt="EMSI" className="h-10 w-auto select-none" draggable="false" />
      {children}
    </div>
  </header>
);
