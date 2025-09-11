export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
  color?: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userColor: string;
  timestamp: Date;
  roomId: string;
  type: 'text' | 'emoji' | 'file' | 'system';
  reactions?: MessageReaction[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: Date;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  color: string;
  memberCount: number;
  isPrivate: boolean;
  lastMessage?: Message;
  unreadCount: number;
  category: 'general' | 'work' | 'social' | 'random';
}

export interface TypingUser {
  userId: string;
  userName: string;
  roomId: string;
  timestamp: Date;
}

export interface ChatState {
  currentUser: User | null;
  currentRoomId: string | null;
  rooms: ChatRoom[];
  messages: { [roomId: string]: Message[] };
  onlineUsers: User[];
  typingUsers: TypingUser[];
  isConnected: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface EmojiData {
  emoji: string;
  name: string;
  category: string;
  keywords: string[];
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export type MessageSendData = {
  content: string;
  type: 'text' | 'emoji' | 'file' | 'system';
  replyTo?: string;
};

export type UserPreferences = {
  theme: 'light' | 'dark';
  notifications: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  emojiSkin: string;
};