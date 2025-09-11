'use client';

import { User } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { UserAvatarWithTooltip } from '@/components/ui/user-avatar';
import { formatLastSeen } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

interface UserSidebarProps {
  users: User[];
  currentUser: User | null;
  className?: string;
}

const statusIcons = {
  online: '🟢',
  away: '🟡',
  offline: '🔴'
};

const statusLabels = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline'
};

export const UserSidebar = ({ users, currentUser, className }: UserSidebarProps) => {
  // Group users by status
  const groupedUsers = users.reduce((acc, user) => {
    if (!acc[user.status]) {
      acc[user.status] = [];
    }
    acc[user.status].push(user);
    return acc;
  }, {} as Record<string, User[]>);

  // Sort users within each status group
  Object.keys(groupedUsers).forEach(status => {
    groupedUsers[status].sort((a, b) => a.name.localeCompare(b.name));
  });

  const onlineCount = groupedUsers.online?.length || 0;
  const totalCount = users.length;

  return (
    <div className={cn('w-64 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col', className)}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Members
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{onlineCount} online</span>
          <span>•</span>
          <span>{totalCount} total</span>
        </div>
      </div>

      {/* User List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {(['online', 'away', 'offline'] as const).map(status => {
            const statusUsers = groupedUsers[status] || [];
            if (statusUsers.length === 0) return null;

            return (
              <div key={status}>
                {/* Status Header */}
                <div className="flex items-center space-x-2 px-2 py-1 mb-2">
                  <span className="text-sm">
                    {statusIcons[status]}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {statusLabels[status]}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {statusUsers.length}
                  </Badge>
                </div>

                {/* Status Users */}
                <div className="space-y-1">
                  {statusUsers.map((user) => (
                    <div
                      key={user.id}
                      className={cn(
                        'flex items-center space-x-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors',
                        currentUser?.id === user.id && 'bg-white dark:bg-gray-800 ring-1 ring-blue-500 dark:ring-blue-400'
                      )}
                    >
                      <UserAvatarWithTooltip
                        src={user.avatar}
                        alt={user.name}
                        fallback={user.name.charAt(0).toUpperCase()}
                        userName={user.name}
                        lastSeen={user.lastSeen ? formatLastSeen(user.lastSeen) : undefined}
                        status={user.status}
                        size="md"
                        showStatus={true}
                        showTooltip={true}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {user.name}
                          </span>
                          {currentUser?.id === user.id && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              You
                            </Badge>
                          )}
                        </div>
                        
                        {/* Last seen for offline users */}
                        {user.status === 'offline' && user.lastSeen && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {formatLastSeen(user.lastSeen)}
                          </div>
                        )}
                        
                        {/* Activity status for online/away users */}
                        {(user.status === 'online' || user.status === 'away') && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.status === 'online' ? 'Active now' : 'Away'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Sidebar Footer - Status Distribution */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between items-center mb-1">
            <span>Status Distribution</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center space-x-1">
                <span>{statusIcons.online}</span>
                <span>Online</span>
              </span>
              <span>{groupedUsers.online?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center space-x-1">
                <span>{statusIcons.away}</span>
                <span>Away</span>
              </span>
              <span>{groupedUsers.away?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center space-x-1">
                <span>{statusIcons.offline}</span>
                <span>Offline</span>
              </span>
              <span>{groupedUsers.offline?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};