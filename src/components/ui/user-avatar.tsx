'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  status?: 'online' | 'away' | 'offline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg'
};

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500', 
  offline: 'bg-gray-400'
};

const statusSizes = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5'
};

export const UserAvatar = ({
  src,
  alt,
  fallback,
  status,
  size = 'md',
  showStatus = false,
  className
}: UserAvatarProps) => {
  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
          {fallback}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && status && (
        <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
          <div
            className={cn(
              'rounded-full border-2 border-background',
              statusColors[status],
              statusSizes[size]
            )}
          />
        </div>
      )}
    </div>
  );
};

interface UserAvatarWithTooltipProps extends UserAvatarProps {
  userName: string;
  lastSeen?: string;
  showTooltip?: boolean;
}

export const UserAvatarWithTooltip = ({
  userName,
  lastSeen,
  showTooltip = true,
  ...avatarProps
}: UserAvatarWithTooltipProps) => {
  if (!showTooltip) {
    return <UserAvatar {...avatarProps} />;
  }

  return (
    <div className="group relative">
      <UserAvatar {...avatarProps} />
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-black text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
          <div className="font-medium">{userName}</div>
          {lastSeen && (
            <div className="text-gray-300 text-xs">{lastSeen}</div>
          )}
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      </div>
    </div>
  );
};