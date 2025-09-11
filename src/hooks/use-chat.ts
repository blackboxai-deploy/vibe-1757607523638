'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatState, Message, User, MessageSendData } from '@/types/chat';
import { mockRooms, generateMockMessages, mockUsers } from '@/lib/chat-data';

const CHAT_STORAGE_KEY = 'chat-state';

export const useChat = (currentUser: User | null) => {
  const [chatState, setChatState] = useState<ChatState>({
    currentUser,
    currentRoomId: null,
    rooms: [],
    messages: {},
    onlineUsers: [],
    typingUsers: [],
    isConnected: true
  });

  // Initialize chat state
  useEffect(() => {
    const storedState = localStorage.getItem(CHAT_STORAGE_KEY);
    let initialMessages: { [roomId: string]: Message[] } = {};

    if (storedState) {
      try {
        const parsed = JSON.parse(storedState);
        initialMessages = parsed.messages || {};
      } catch (error) {
        console.error('Error parsing stored chat state:', error);
      }
    }

    // Generate mock messages for rooms that don't have stored messages
    mockRooms.forEach(room => {
      if (!initialMessages[room.id]) {
        initialMessages[room.id] = generateMockMessages(room.id, 15);
      }
    });

    setChatState(prev => ({
      ...prev,
      currentUser,
      currentRoomId: mockRooms[0].id,
      rooms: mockRooms,
      messages: initialMessages,
      onlineUsers: mockUsers.filter(u => u.status === 'online')
    }));
  }, [currentUser]);

  // Persist messages to localStorage
  useEffect(() => {
    if (Object.keys(chatState.messages).length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({
        messages: chatState.messages
      }));
    }
  }, [chatState.messages]);

  const sendMessage = useCallback((messageData: MessageSendData) => {
    if (!currentUser || !chatState.currentRoomId) return;

    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userColor: currentUser.color || '#6366F1',
      roomId: chatState.currentRoomId
    };

    setChatState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [chatState.currentRoomId!]: [
          ...(prev.messages[chatState.currentRoomId!] || []),
          newMessage
        ]
      }
    }));

    // Update room's last message
    setChatState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => 
        room.id === chatState.currentRoomId
          ? { ...room, lastMessage: newMessage }
          : room
      )
    }));
  }, [currentUser, chatState.currentRoomId]);

  const switchRoom = useCallback((roomId: string) => {
    setChatState(prev => ({
      ...prev,
      currentRoomId: roomId,
      rooms: prev.rooms.map(room => 
        room.id === roomId 
          ? { ...room, unreadCount: 0 }
          : room
      )
    }));
  }, []);

  const addMessageReaction = useCallback((messageId: string, emoji: string) => {
    if (!currentUser || !chatState.currentRoomId) return;

    setChatState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [chatState.currentRoomId!]: prev.messages[chatState.currentRoomId!]?.map(msg => {
          if (msg.id !== messageId) return msg;

          const existingReaction = msg.reactions?.find(r => r.userId === currentUser.id && r.emoji === emoji);
          if (existingReaction) {
            // Remove reaction if it already exists
            return {
              ...msg,
              reactions: msg.reactions?.filter(r => !(r.userId === currentUser.id && r.emoji === emoji))
            };
          } else {
            // Add new reaction
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                {
                  emoji,
                  userId: currentUser.id,
                  userName: currentUser.name
                }
              ]
            };
          }
        }) || []
      }
    }));
  }, [currentUser, chatState.currentRoomId]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!currentUser || !chatState.currentRoomId) return;

    setChatState(prev => {
      const newTypingUsers = isTyping
        ? [
            ...prev.typingUsers.filter(t => t.userId !== currentUser.id),
            {
              userId: currentUser.id,
              userName: currentUser.name,
              roomId: chatState.currentRoomId!,
              timestamp: new Date()
            }
          ]
        : prev.typingUsers.filter(t => t.userId !== currentUser.id);

      return {
        ...prev,
        typingUsers: newTypingUsers
      };
    });

    // Auto-remove typing indicator after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        setChatState(prev => ({
          ...prev,
          typingUsers: prev.typingUsers.filter(t => 
            t.userId !== currentUser.id || 
            Date.now() - t.timestamp.getTime() < 3000
          )
        }));
      }, 3000);
    }
  }, [currentUser, chatState.currentRoomId]);

  const getCurrentRoomMessages = useCallback(() => {
    if (!chatState.currentRoomId) return [];
    return chatState.messages[chatState.currentRoomId] || [];
  }, [chatState.currentRoomId, chatState.messages]);

  const getCurrentRoom = useCallback(() => {
    if (!chatState.currentRoomId) return null;
    return chatState.rooms.find(room => room.id === chatState.currentRoomId) || null;
  }, [chatState.currentRoomId, chatState.rooms]);

  const getTypingUsersInCurrentRoom = useCallback(() => {
    if (!chatState.currentRoomId) return [];
    return chatState.typingUsers
      .filter(t => t.roomId === chatState.currentRoomId && t.userId !== currentUser?.id)
      .map(t => t.userName);
  }, [chatState.currentRoomId, chatState.typingUsers, currentUser]);

  return {
    chatState,
    sendMessage,
    switchRoom,
    addMessageReaction,
    setTyping,
    getCurrentRoomMessages,
    getCurrentRoom,
    getTypingUsersInCurrentRoom
  };
};