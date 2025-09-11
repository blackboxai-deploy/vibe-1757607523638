'use client';

import { useEffect, useCallback } from 'react';
import { User } from '@/types/chat';
import { mockUsers } from '@/lib/chat-data';

interface UseRealTimeProps {
  currentUser: User | null;
  currentRoomId: string | null;
  onNewMessage: () => void;
  onUserStatusChange: () => void;
  onTypingChange: () => void;
}

const SIMULATION_INTERVALS = {
  NEW_MESSAGE: 15000, // 15 seconds
  USER_STATUS: 30000, // 30 seconds  
  TYPING: 8000, // 8 seconds
  USER_JOIN_LEAVE: 60000 // 1 minute
};

export const useRealTime = ({
  currentUser,
  currentRoomId,
  onNewMessage,
  onUserStatusChange,
  onTypingChange
}: UseRealTimeProps) => {

  // Simulate random messages from other users
  const simulateRandomMessage = useCallback(() => {
    if (!currentUser || !currentRoomId) return;

    const availableUsers = mockUsers.filter(u => 
      u.id !== currentUser.id && u.status === 'online'
    );
    
    if (availableUsers.length === 0) return;

    onNewMessage();
  }, [currentUser, currentRoomId, onNewMessage]);

  // Simulate user status changes
  const simulateUserStatusChanges = useCallback(() => {
    onUserStatusChange();
  }, [onUserStatusChange]);

  // Simulate typing indicators
  const simulateTyping = useCallback(() => {
    if (!currentUser || !currentRoomId) return;

    onTypingChange();

    // Clear typing indicators after 3 seconds
    setTimeout(() => {
      onTypingChange();
    }, 3000);
  }, [currentUser, currentRoomId, onTypingChange]);

  // Simulate users joining/leaving rooms
  const simulateUserJoinLeave = useCallback(() => {
    if (!currentUser || !currentRoomId || Math.random() > 0.3) return;

    onNewMessage();
  }, [currentUser, currentRoomId, onNewMessage]);

  // Set up intervals for real-time simulation
  useEffect(() => {
    if (!currentUser) return;

    const intervals = [
      setInterval(simulateRandomMessage, SIMULATION_INTERVALS.NEW_MESSAGE + Math.random() * 10000),
      setInterval(simulateUserStatusChanges, SIMULATION_INTERVALS.USER_STATUS),
      setInterval(simulateTyping, SIMULATION_INTERVALS.TYPING + Math.random() * 5000),
      setInterval(simulateUserJoinLeave, SIMULATION_INTERVALS.USER_JOIN_LEAVE + Math.random() * 30000)
    ];

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [currentUser, simulateRandomMessage, simulateUserStatusChanges, simulateTyping, simulateUserJoinLeave]);

  // Initial simulation on mount
  useEffect(() => {
    if (!currentUser) return;

    // Trigger initial user status update
    setTimeout(simulateUserStatusChanges, 1000);
  }, [currentUser, simulateUserStatusChanges]);

  return {
    // Expose methods for manual triggering if needed
    triggerRandomMessage: simulateRandomMessage,
    triggerStatusUpdate: simulateUserStatusChanges,
    triggerTyping: simulateTyping
  };
};