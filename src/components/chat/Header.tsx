'use client';

import { ChatRoom, User } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/ui/user-avatar';
import { formatLastSeen } from '@/lib/date-utils';

interface HeaderProps {
  currentRoom: ChatRoom | null;
  currentUser: User | null;
  onlineUsers: User[];
  onLogout: () => void;
  onToggleTheme?: () => void;
}

export const Header = ({ 
  currentRoom, 
  currentUser, 
  onlineUsers,
  onLogout,
  onToggleTheme 
}: HeaderProps) => {
  if (!currentRoom || !currentUser) return null;

  const roomOnlineCount = onlineUsers.length;

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
      {/* Room Info */}
      <div className="flex items-center space-x-3">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: currentRoom.color }}
        />
        <div className="flex flex-col">
          <h1 className="font-semibold text-gray-900 dark:text-white">
            {currentRoom.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentRoom.description} • {roomOnlineCount} online
          </p>
        </div>
      </div>

      {/* Right Side - User Controls */}
      <div className="flex items-center space-x-3">
        {/* Room Stats */}
        <div className="hidden sm:flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {currentRoom.memberCount} members
          </Badge>
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ 
              borderColor: currentRoom.color,
              color: currentRoom.color 
            }}
          >
            {currentRoom.category}
          </Badge>
        </div>

        {/* Online Users Preview */}
        <div className="hidden md:flex items-center space-x-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
            Online:
          </span>
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 5).map((user) => (
              <UserAvatar
                key={user.id}
                src={user.avatar}
                alt={user.name}
                fallback={user.name.charAt(0).toUpperCase()}
                size="sm"
                status={user.status}
                showStatus={true}
                className="ring-2 ring-background hover:z-10 transition-transform hover:scale-110"
              />
            ))}
            {onlineUsers.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-background flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                +{onlineUsers.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 h-auto">
              <UserAvatar
                src={currentUser.avatar}
                alt={currentUser.name}
                fallback={currentUser.name.charAt(0).toUpperCase()}
                size="lg"
                status={currentUser.status}
                showStatus={true}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center space-x-3 p-3">
              <UserAvatar
                src={currentUser.avatar}
                alt={currentUser.name}
                fallback={currentUser.name.charAt(0).toUpperCase()}
                size="md"
                status={currentUser.status}
                showStatus={true}
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {currentUser.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatLastSeen(new Date())}
                </span>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer">
              Set Status
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Preferences
            </DropdownMenuItem>
            
            {onToggleTheme && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={onToggleTheme}
                >
                  Toggle Theme
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 dark:text-red-400" 
              onClick={onLogout}
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};