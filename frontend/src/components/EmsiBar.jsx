import React from 'react';
import { FacebookIcon, InstagramIcon, TiktokIcon, LinkedinIcon, YoutubeIcon } from './SocialIcons';
import emsiLogo from '../assets/emsi-logo.png';

export const EMSI_GREEN = '#15885a';

const SOCIALS = [
  { name: 'Facebook', href: 'https://www.facebook.com/emsi.ma/', Icon: FacebookIcon },
  { name: 'Instagram', href: 'https://www.instagram.com/emsigroupe.officiel/', Icon: InstagramIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@groupe.emsi?is_from_webapp=1&sender_device=pc', Icon: TiktokIcon },
  {
    name: 'LinkedIn',
    href: "https://www.linkedin.com/school/ecole-marocaine-des-sciences-de-l'ing%C3%A9nieur",
    Icon: LinkedinIcon,
  },
  { name: 'YouTube', href: 'https://www.youtube.com/channel/UC5BiOBai2N48ytbCRQWWqJw', Icon: YoutubeIcon },
];

// Barre verte EMSI pleine largeur : logo à gauche, réseaux sociaux à droite (hauteur 64px)
export const EmsiBar = ({ children }) => (
  <header
    style={{ backgroundColor: EMSI_GREEN }}
    className="h-16 w-full shrink-0 sticky top-0 z-30 shadow-md shadow-black/10"
  >
    <div className="h-full w-full px-4 sm:px-6 flex items-center justify-between">
      <img src={emsiLogo} alt="EMSI" className="h-10 w-auto select-none" draggable="false" />

      <div className="flex items-center gap-5">
        <nav className="flex items-center gap-4" aria-label="Réseaux sociaux EMSI">
          {SOCIALS.map(({ name, href, Icon }, index) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              style={{ animationDelay: `${0.35 + index * 0.12}s` }}
              className="social-icon text-white"
            >
              <Icon className="w-[22px] h-[22px]" />
            </a>
          ))}
        </nav>
        {children}
      </div>
    </div>
  </header>
);
