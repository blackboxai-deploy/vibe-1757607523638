'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (userData: {
    id: string;
    name: string;
    avatar: string;
    color: string;
  }) => {
    login(userData);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Show loading state
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Chat App...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="relative">
        <LoginForm onLogin={handleLogin} />
        
        {/* Theme Toggle for Login Page */}
        {mounted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="absolute top-4 right-4 z-10"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
        )}
      </div>
    );
  }

  // Show chat interface if authenticated
  return (
    <div className="relative">
      <ChatContainer 
        currentUser={user} 
        onLogout={handleLogout}
      />
      
      {/* Global Theme Toggle */}
      {mounted && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="absolute top-4 right-4 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </Button>
      )}
    </div>
  );
}