'use client';

import { useState, useEffect } from 'react';
import { User, AuthState } from '@/types/chat';

const AUTH_STORAGE_KEY = 'chat-auth';

export const useAuth = (): AuthState & {
  login: (user: Omit<User, 'status' | 'lastSeen'>) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Load auth state from localStorage on mount
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuthState({
          user: { ...parsedAuth.user, status: 'online' },
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (userData: Omit<User, 'status' | 'lastSeen'>) => {
    const user: User = {
      ...userData,
      status: 'online'
    };

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false
    });

    // Persist to localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });

    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...updates };
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    // Update localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: updatedUser }));
  };

  return {
    ...authState,
    login,
    logout,
    updateUser
  };
};