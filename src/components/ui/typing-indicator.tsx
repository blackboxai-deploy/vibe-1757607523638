'use client';

import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  users: string[];
  className?: string;
}

export const TypingIndicator = ({ users, className }: TypingIndicatorProps) => {
  if (users.length === 0) return null;

  const formatTypingText = () => {
    if (users.length === 1) {
      return `${users[0]} is typing`;
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing`;
    } else {
      return `${users[0]}, ${users[1]} and ${users.length - 2} other${users.length - 2 > 1 ? 's' : ''} are typing`;
    }
  };

  return (
    <div className={cn('flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400', className)}>
      <div className="flex space-x-1">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
      <span className="text-xs italic">
        {formatTypingText()}...
      </span>
    </div>
  );
};

interface TypingDotsProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const TypingDots = ({ size = 'md', className }: TypingDotsProps) => {
  const dotSize = size === 'sm' ? 'h-1 w-1' : 'h-2 w-2';
  
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className={cn(dotSize, 'bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]')}></div>
      <div className={cn(dotSize, 'bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]')}></div>
      <div className={cn(dotSize, 'bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce')}></div>
    </div>
  );
};