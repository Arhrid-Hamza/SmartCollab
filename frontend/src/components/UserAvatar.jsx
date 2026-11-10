import React, { useState } from 'react';
import { User } from 'lucide-react';

export const UserAvatar = ({
  user,
  size = 'md',
  className = '',
  showStoryRing = true,
  alt = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = () => {
    if (!user) return 'EM';
    const first = (user.firstName || user.name || '').trim().charAt(0);
    const last = (user.lastName || '').trim().charAt(0);
    if (!first && !last) return (user.email || 'EM').slice(0, 2).toUpperCase();
    return `${first}${last}`.toUpperCase();
  };

  const sizeClasses = {
    xs: { outer: 'w-7 h-7', inner: 'w-6 h-6 text-[10px]', icon: 'w-3.5 h-3.5' },
    sm: { outer: 'w-9 h-9', inner: 'w-8 h-8 text-xs', icon: 'w-4 h-4' },
    md: { outer: 'w-11 h-11', inner: 'w-10 h-10 text-xs', icon: 'w-5 h-5' },
    lg: { outer: 'w-14 h-14', inner: 'w-12 h-12 text-sm', icon: 'w-6 h-6' },
    xl: { outer: 'w-20 h-20', inner: 'w-[72px] h-[72px] text-lg', icon: 'w-9 h-9' },
    '2xl': { outer: 'w-24 h-24', inner: 'w-[88px] h-[88px] text-xl', icon: 'w-11 h-11' },
  };

  const config = sizeClasses[size] || sizeClasses.md;
  const hasValidPhoto = user?.avatarUrl && !imageError;

  // Instagram-style gradient ring
  const ringClasses = showStoryRing
    ? 'p-[2px] bg-gradient-to-tr from-emerald-600 via-[#15885a] to-teal-400'
    : 'border border-slate-200';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${config.outer} ${ringClasses} ${className}`}
    >
      <div className={`w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center overflow-hidden`}>
        {hasValidPhoto ? (
          <img
            src={user.avatarUrl}
            alt={alt || `${user.firstName || ''} ${user.lastName || ''}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-bold select-none">
            {getInitials() || <User className={config.icon} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
