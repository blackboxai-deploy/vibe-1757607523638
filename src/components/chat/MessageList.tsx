'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Message, User } from '@/types/chat';
import { MessageBubble } from '@/components/ui/message-bubble';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { shouldShowDateSeparator, formatDateSeparator } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
  typingUsers: string[];
  onMessageReaction?: (messageId: string, emoji: string) => void;
  className?: string;
}

export const MessageList = ({
  messages,
  currentUser,
  typingUsers,
  onMessageReaction,
  className
}: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Auto-scroll to bottom for new messages
  const scrollToBottom = useCallback((force: boolean = false) => {
    if (messagesEndRef.current && (!isUserScrolling || force)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isUserScrolling]);

  // Check if user is near bottom
  const handleScroll = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
    setIsUserScrolling(!isNearBottom);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const isCurrentUserMessage = lastMessage.userId === currentUser?.id;
      
      // Always scroll for current user's messages, or if user is at bottom
      if (isCurrentUserMessage || !isUserScrolling) {
        scrollToBottom();
      }
    }
  }, [messages, currentUser?.id, isUserScrolling, scrollToBottom]);

  // Auto-scroll on typing indicators
  useEffect(() => {
    if (typingUsers.length > 0 && !isUserScrolling) {
      scrollToBottom();
    }
  }, [typingUsers, isUserScrolling, scrollToBottom]);

  // Group consecutive messages from the same user
  const groupMessages = (messages: Message[]) => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];

    messages.forEach((message, index) => {
      const prevMessage = messages[index - 1];
      const isSameUser = prevMessage && 
        prevMessage.userId === message.userId && 
        prevMessage.type !== 'system' && 
        message.type !== 'system';
      
      const timeDiff = prevMessage ? 
        message.timestamp.getTime() - prevMessage.timestamp.getTime() : 
        0;
      
      const isWithinGroupTime = timeDiff < 5 * 60 * 1000; // 5 minutes

      if (isSameUser && isWithinGroupTime) {
        currentGroup.push(message);
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [message];
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = groupMessages(messages);

  const handleScrollButtonClick = () => {
    scrollToBottom(true);
    setIsUserScrolling(false);
  };

  if (!currentUser) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900', className)}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-lg mb-2">Welcome to the Chat!</div>
          <div>Please log in to start chatting</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full relative', className)}>
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 px-4"
        onScrollCapture={(e) => {
          const target = e.target as HTMLDivElement;
          handleScroll(target.scrollTop, target.scrollHeight, target.clientHeight);
        }}
      >
        <div className="py-4 space-y-4">
          {messageGroups.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No messages yet
              </div>
              <div className="text-gray-400 dark:text-gray-500">
                Start the conversation by sending the first message!
              </div>
            </div>
          ) : (
            messageGroups.map((group, groupIndex) => {
              const firstMessage = group[0];
              const showDateSeparator = groupIndex === 0 || 
                shouldShowDateSeparator(
                  firstMessage.timestamp,
                  messageGroups[groupIndex - 1]?.[0]?.timestamp
                );

              return (
                <div key={`group-${groupIndex}`}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                        <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {formatDateSeparator(firstMessage.timestamp)}
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                      </div>
                    </div>
                  )}

                  {/* Message Group */}
                  <div className="space-y-1">
                    {group.map((message, messageIndex) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isCurrentUser={message.userId === currentUser.id}
                        showAvatar={messageIndex === 0} // Only show avatar for first message in group
                        onReaction={onMessageReaction}
                        className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <TypingIndicator users={typingUsers} />
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </ScrollArea>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={handleScrollButtonClick}
            size="sm"
            className="rounded-full h-10 w-10 p-0 shadow-lg hover:shadow-xl transition-shadow"
            title="Scroll to bottom"
          >
            ↓
          </Button>
        </div>
      )}
    </div>
  );
};