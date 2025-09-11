'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LoginFormProps {
  onLogin: (userData: {
    id: string;
    name: string;
    avatar: string;
    color: string;
  }) => void;
}

const avatarOptions = [
  { id: 1, text: 'A', color: '#3B82F6', name: 'Blue' },
  { id: 2, text: 'B', color: '#10B981', name: 'Green' },
  { id: 3, text: 'C', color: '#F59E0B', name: 'Orange' },
  { id: 4, text: 'D', color: '#EF4444', name: 'Red' },
  { id: 5, text: 'E', color: '#8B5CF6', name: 'Purple' },
  { id: 6, text: 'F', color: '#EC4899', name: 'Pink' },
  { id: 7, text: 'G', color: '#06B6D4', name: 'Cyan' },
  { id: 8, text: 'H', color: '#84CC16', name: 'Lime' },
];

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      const userData = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a809b404-d9da-4b88-9c14-c744232fd054.png'#', '')}/${selectedAvatar.color.replace('#', '')}?text=${selectedAvatar.text}`,
        color: selectedAvatar.color
      };
      
      onLogin(userData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Chat
          </CardTitle>
          <CardDescription>
            Enter your name and choose an avatar to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="text-center"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label>Choose Your Avatar</Label>
              <div className="grid grid-cols-4 gap-3">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    disabled={isLoading}
                    className={`
                      relative aspect-square rounded-lg border-2 transition-all duration-200
                      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${selectedAvatar.id === avatar.id 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div 
                      className="w-full h-full rounded-md flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: avatar.color }}
                    >
                      {avatar.text}
                    </div>
                    {selectedAvatar.id === avatar.id && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          {avatar.name}
                        </Badge>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!name.trim() || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Joining Chat...' : 'Join Chat'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Join the conversation and connect with others!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};