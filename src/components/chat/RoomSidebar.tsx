'use client';

import { ChatRoom } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatMessageTime } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

interface RoomSidebarProps {
  rooms: ChatRoom[];
  currentRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  className?: string;
}

const categoryIcons = {
  general: '💬',
  work: '💼',
  social: '🎉',
  random: '🎲'
};

const categoryColors = {
  general: 'text-blue-600 dark:text-blue-400',
  work: 'text-green-600 dark:text-green-400',
  social: 'text-purple-600 dark:text-purple-400',
  random: 'text-pink-600 dark:text-pink-400'
};

export const RoomSidebar = ({ 
  rooms, 
  currentRoomId, 
  onRoomSelect,
  className 
}: RoomSidebarProps) => {
  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.category]) {
      acc[room.category] = [];
    }
    acc[room.category].push(room);
    return acc;
  }, {} as Record<string, ChatRoom[]>);

  return (
    <div className={cn('w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col', className)}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Chat Rooms
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {rooms.length} channels available
        </p>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {Object.entries(groupedRooms).map(([category, categoryRooms]) => (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center space-x-2 px-2 py-1 mb-2">
                <span className="text-lg">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </span>
                <span className={cn(
                  'text-sm font-semibold uppercase tracking-wider',
                  categoryColors[category as keyof typeof categoryColors]
                )}>
                  {category}
                </span>
              </div>

              {/* Category Rooms */}
              <div className="space-y-1">
                {(categoryRooms as ChatRoom[]).map((room) => (
                  <Button
                    key={room.id}
                    variant="ghost"
                    onClick={() => onRoomSelect(room.id)}
                    className={cn(
                      'w-full justify-start p-3 h-auto text-left relative',
                      currentRoomId === room.id
                        ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
                        : 'hover:bg-white dark:hover:bg-gray-800'
                    )}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {/* Room Color Indicator */}
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: room.color }}
                      />
                      
                      {/* Room Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {room.name}
                          </span>
                          {room.unreadCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="ml-2 h-5 min-w-[20px] text-xs px-1.5 py-0 flex-shrink-0"
                            >
                              {room.unreadCount > 99 ? '99+' : room.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Last Message Preview */}
                        {room.lastMessage && (
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="truncate flex-1 mr-2">
                              <span className="font-medium">
                                {room.lastMessage.userName}:
                              </span>{' '}
                              {room.lastMessage.content}
                            </span>
                            <span className="flex-shrink-0">
                              {formatMessageTime(room.lastMessage.timestamp)}
                            </span>
                          </div>
                        )}
                        
                        {/* Member Count */}
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {room.memberCount} members
                          {room.isPrivate && (
                            <span className="ml-1">🔒</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active Room Indicator */}
                    {currentRoomId === room.id && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                        style={{ backgroundColor: room.color }}
                      />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <div>Total Unread: {rooms.reduce((sum, room) => sum + room.unreadCount, 0)}</div>
          <div className="mt-1">
            Active Rooms: {rooms.filter(room => room.memberCount > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
};