'use client';

import { Message, MessageReaction } from '@/types/chat';
import { UserAvatar } from './user-avatar';
import { formatTimeForMessage } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
  className?: string;
}

export const MessageBubble = ({ 
  message, 
  isCurrentUser, 
  showAvatar = true,
  onReaction,
  className 
}: MessageBubbleProps) => {
  const handleReaction = (emoji: string) => {
    if (onReaction) {
      onReaction(message.id, emoji);
    }
  };

  if (message.type === 'system') {
    return (
      <div className={cn('flex justify-center my-2', className)}>
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex gap-3 group',
      isCurrentUser ? 'flex-row-reverse' : 'flex-row',
      className
    )}>
      {/* Avatar */}
      {showAvatar && !isCurrentUser && (
        <UserAvatar
          src={message.userAvatar}
          alt={message.userName}
          fallback={message.userName.charAt(0).toUpperCase()}
          size="md"
          className="flex-shrink-0 mt-1"
        />
      )}

      {/* Message Content */}
      <div className={cn(
        'flex flex-col max-w-[70%] space-y-1',
        isCurrentUser ? 'items-end' : 'items-start'
      )}>
        {/* User name and timestamp */}
        {!isCurrentUser && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span 
              className="font-medium"
              style={{ color: message.userColor }}
            >
              {message.userName}
            </span>
            <span>{formatTimeForMessage(message.timestamp)}</span>
          </div>
        )}

        {/* Message bubble */}
        <div className="relative">
          <div
            className={cn(
              'px-4 py-2 rounded-lg text-sm break-words',
              isCurrentUser
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
            )}
          >
            {message.content}
            {message.edited && (
              <span className="ml-1 text-xs opacity-60">(edited)</span>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {getUniqueReactions(message.reactions).map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReaction(reaction.emoji)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {reaction.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Quick reactions on hover */}
          <div className={cn(
            'absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10',
            isCurrentUser ? 'right-full mr-2' : 'left-full ml-2'
          )}>
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-2 py-1">
              {['👍', '❤️', '😄', '😮', '😢', '😡'].map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Timestamp for current user */}
        {isCurrentUser && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimeForMessage(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to group reactions by emoji
function getUniqueReactions(reactions: MessageReaction[]) {
  const grouped = reactions.reduce((acc, reaction) => {
    const existing = acc.find(r => r.emoji === reaction.emoji);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ emoji: reaction.emoji, count: 1 });
    }
    return acc;
  }, [] as { emoji: string; count: number }[]);

  return grouped;
}