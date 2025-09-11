export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

export const formatTimeForMessage = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatLastSeen = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Active now';
  if (diffInMinutes < 60) return `Active ${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Active ${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Active yesterday';
  if (diffInDays < 7) return `Active ${diffInDays}d ago`;
  
  return `Last seen ${date.toLocaleDateString()}`;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

export const shouldShowDateSeparator = (currentMessage: Date, previousMessage?: Date): boolean => {
  if (!previousMessage) return true;
  
  const current = new Date(currentMessage).toDateString();
  const previous = new Date(previousMessage).toDateString();
  
  return current !== previous;
};

export const formatDateSeparator = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }
  
  return date.toLocaleDateString([], { 
    weekday: 'long',
    month: 'short', 
    day: 'numeric'
  });
};