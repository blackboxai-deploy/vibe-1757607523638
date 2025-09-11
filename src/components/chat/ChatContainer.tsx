'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { RoomSidebar } from './RoomSidebar';
import { UserSidebar } from './UserSidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '@/hooks/use-chat';
import { useRealTime } from '@/hooks/use-real-time';
import { User, MessageSendData } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  currentUser: User;
  onLogout: () => void;
  className?: string;
}

export const ChatContainer = ({ currentUser, onLogout, className }: ChatContainerProps) => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const {
    chatState,
    sendMessage,
    switchRoom,
    addMessageReaction,
    setTyping,
    getCurrentRoomMessages,
    getCurrentRoom,
    getTypingUsersInCurrentRoom
  } = useChat(currentUser);

  // Handle new messages from real-time simulation
  const handleNewMessage = useCallback(() => {
    // We'll implement this by updating the chat state directly
    // For now, this is handled by the real-time hook
  }, []);

  // Handle user status changes from real-time simulation
  const handleUserStatusChange = useCallback(() => {
    // Update online users in chat state
    // For now, this is simulated within the useChat hook
  }, []);

  // Handle typing changes from real-time simulation
  const handleTypingChange = useCallback(() => {
    // Update typing users in chat state
    // For now, this is simulated within the useChat hook
  }, []);

  // Initialize real-time simulation
  useRealTime({
    currentUser,
    currentRoomId: chatState.currentRoomId,
    onNewMessage: handleNewMessage,
    onUserStatusChange: handleUserStatusChange,
    onTypingChange: handleTypingChange
  });

  // Handle responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setShowRightSidebar(false);
        if (window.innerWidth < 768) {
          setShowLeftSidebar(false);
        }
      } else {
        setShowLeftSidebar(true);
        setShowRightSidebar(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSendMessage = (messageData: MessageSendData) => {
    sendMessage(messageData);
  };

  const handleTypingStart = () => {
    setTyping(true);
  };

  const handleTypingStop = () => {
    setTyping(false);
  };

  const handleRoomSelect = (roomId: string) => {
    switchRoom(roomId);
    
    // On mobile, hide left sidebar after room selection
    if (isMobile) {
      setShowLeftSidebar(false);
    }
  };

  const currentRoom = getCurrentRoom();
  const messages = getCurrentRoomMessages();
  const typingUsers = getTypingUsersInCurrentRoom();

  return (
    <div className={cn('h-screen flex bg-gray-100 dark:bg-gray-950', className)}>
      {/* Left Sidebar - Rooms */}
      <div className={cn(
        'transition-all duration-300 flex-shrink-0',
        showLeftSidebar ? 'w-64' : 'w-0 overflow-hidden',
        isMobile && showLeftSidebar && 'absolute inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 shadow-xl'
      )}>
        <RoomSidebar
          rooms={chatState.rooms}
          currentRoomId={chatState.currentRoomId}
          onRoomSelect={handleRoomSelect}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && showLeftSidebar && (
        <div 
          className="absolute inset-0 bg-black/50 z-40"
          onClick={() => setShowLeftSidebar(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          currentRoom={currentRoom}
          currentUser={currentUser}
          onlineUsers={chatState.onlineUsers}
          onLogout={onLogout}
        />

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="flex items-center space-x-1"
            >
              <span>📋</span>
              <span>Rooms</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="flex items-center space-x-1"
            >
              <span>👥</span>
              <span>Members</span>
            </Button>
          </div>
        )}

        {/* Chat Content */}
        <div className="flex-1 flex min-h-0">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <MessageList
              messages={messages}
              currentUser={currentUser}
              typingUsers={typingUsers}
              onMessageReaction={addMessageReaction}
              className="flex-1"
            />
            
            <MessageInput
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              placeholder={`Message ${currentRoom?.name || 'chat'}...`}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Users */}
      <div className={cn(
        'transition-all duration-300 flex-shrink-0',
        showRightSidebar ? 'w-64' : 'w-0 overflow-hidden',
        isMobile && showRightSidebar && 'absolute inset-y-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-xl'
      )}>
        <UserSidebar
          users={chatState.onlineUsers}
          currentUser={currentUser}
        />
      </div>

      {/* Mobile Overlay for Right Sidebar */}
      {isMobile && showRightSidebar && (
        <div 
          className="absolute inset-0 bg-black/50 z-40"
          onClick={() => setShowRightSidebar(false)}
        />
      )}

      {/* Desktop Sidebar Toggle Buttons */}
      {!isMobile && (
        <>
          {/* Left Sidebar Toggle */}
          {!showLeftSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeftSidebar(true)}
              className="absolute left-2 top-20 z-30 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
            >
              📋
            </Button>
          )}

          {/* Right Sidebar Toggle */}
          {!showRightSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRightSidebar(true)}
              className="absolute right-2 top-20 z-30 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
            >
              👥
            </Button>
          )}
        </>
      )}

      {/* Connection Status Indicator */}
      {!chatState.isConnected && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm z-50">
          Disconnected - Trying to reconnect...
        </div>
      )}
    </div>
  );
};