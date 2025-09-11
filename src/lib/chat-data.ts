import { User, ChatRoom, Message, EmojiData } from '@/types/chat';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/136da07d-618c-4981-a62d-6bd1cb3ec407.png',
    status: 'online',
    color: '#3B82F6'
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/340e6055-d561-41be-9b7c-f40bb8dc3975.png',
    status: 'online',
    color: '#10B981'
  },
  {
    id: 'user-3',
    name: 'Carol Davis',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/35735565-86c6-4a88-a984-fa2a23ad003e.png',
    status: 'away',
    color: '#F59E0B'
  },
  {
    id: 'user-4',
    name: 'David Wilson',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7ad941ce-55fb-49b3-8986-6ec61d022078.png',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000),
    color: '#EF4444'
  },
  {
    id: 'user-5',
    name: 'Emma Brown',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fc7737e9-0943-4ef4-8e8b-042c61bb2fa4.png',
    status: 'online',
    color: '#8B5CF6'
  }
];

export const mockRooms: ChatRoom[] = [
  {
    id: 'general',
    name: 'General',
    description: 'General discussion for everyone',
    color: '#6366F1',
    memberCount: 12,
    isPrivate: false,
    unreadCount: 0,
    category: 'general'
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Random chats and fun stuff',
    color: '#EC4899',
    memberCount: 8,
    isPrivate: false,
    unreadCount: 2,
    category: 'random'
  },
  {
    id: 'work',
    name: 'Work Discussion',
    description: 'Work-related discussions',
    color: '#059669',
    memberCount: 15,
    isPrivate: false,
    unreadCount: 0,
    category: 'work'
  },
  {
    id: 'social',
    name: 'Social Hub',
    description: 'Social events and meetups',
    color: '#DC2626',
    memberCount: 20,
    isPrivate: false,
    unreadCount: 5,
    category: 'social'
  },
  {
    id: 'tech-talk',
    name: 'Tech Talk',
    description: 'Technology discussions',
    color: '#7C3AED',
    memberCount: 25,
    isPrivate: false,
    unreadCount: 1,
    category: 'work'
  }
];

export const generateMockMessages = (roomId: string, count: number = 20): Message[] => {
  const messages: Message[] = [];
  const now = Date.now();
  
  const sampleMessages = [
    "Hey everyone! How's your day going?",
    "Just finished a great project!",
    "Anyone up for a coffee break?",
    "The weather is amazing today ☀️",
    "Working on some exciting features",
    "Happy Friday! 🎉",
    "Thanks for the help earlier!",
    "Looking forward to the weekend",
    "Great meeting today, team!",
    "Coffee time! ☕",
    "This new feature looks fantastic",
    "Hope everyone is doing well",
    "Beautiful sunset tonight 🌅",
    "Team lunch tomorrow?",
    "Excited about the new updates!"
  ];

  for (let i = 0; i < count; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const messageContent = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    
    messages.push({
      id: `msg-${roomId}-${i}`,
      content: messageContent,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userColor: user.color || '#6366F1',
      timestamp: new Date(now - (count - i) * 60000 * Math.random() * 10),
      roomId,
      type: 'text',
      reactions: Math.random() > 0.7 ? [
        {
          emoji: ['👍', '❤️', '😄', '🎉'][Math.floor(Math.random() * 4)],
          userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
          userName: mockUsers[Math.floor(Math.random() * mockUsers.length)].name
        }
      ] : undefined
    });
  }

  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const popularEmojis: EmojiData[] = [
  { emoji: '😀', name: 'grinning', category: 'smileys', keywords: ['happy', 'smile', 'grin'] },
  { emoji: '😂', name: 'joy', category: 'smileys', keywords: ['funny', 'laugh', 'tears'] },
  { emoji: '🥰', name: 'love', category: 'smileys', keywords: ['love', 'heart', 'cute'] },
  { emoji: '😎', name: 'cool', category: 'smileys', keywords: ['cool', 'sunglasses', 'awesome'] },
  { emoji: '🤔', name: 'thinking', category: 'smileys', keywords: ['think', 'hmm', 'consider'] },
  { emoji: '👍', name: 'thumbs_up', category: 'people', keywords: ['good', 'approve', 'like'] },
  { emoji: '👎', name: 'thumbs_down', category: 'people', keywords: ['bad', 'disapprove', 'dislike'] },
  { emoji: '👏', name: 'clap', category: 'people', keywords: ['applause', 'praise', 'clap'] },
  { emoji: '🙏', name: 'pray', category: 'people', keywords: ['thanks', 'please', 'pray'] },
  { emoji: '❤️', name: 'heart', category: 'symbols', keywords: ['love', 'heart', 'like'] },
  { emoji: '🎉', name: 'party', category: 'activities', keywords: ['party', 'celebrate', 'congrats'] },
  { emoji: '🔥', name: 'fire', category: 'nature', keywords: ['hot', 'fire', 'awesome'] },
  { emoji: '⚡', name: 'lightning', category: 'nature', keywords: ['fast', 'energy', 'power'] },
  { emoji: '✨', name: 'sparkles', category: 'nature', keywords: ['magic', 'sparkle', 'shine'] },
  { emoji: '💯', name: 'hundred', category: 'symbols', keywords: ['perfect', '100', 'score'] },
  { emoji: '🚀', name: 'rocket', category: 'travel', keywords: ['launch', 'fast', 'space'] },
  { emoji: '☕', name: 'coffee', category: 'food', keywords: ['coffee', 'drink', 'morning'] },
  { emoji: '🍕', name: 'pizza', category: 'food', keywords: ['pizza', 'food', 'hungry'] }
];

export const getRandomTypingUsers = (roomId: string, excludeUserId: string): string[] => {
  const availableUsers = mockUsers.filter(u => u.id !== excludeUserId && u.status === 'online');
  const typingCount = Math.random() > 0.8 ? Math.floor(Math.random() * 2) + 1 : 0;
  
  return availableUsers
    .sort(() => Math.random() - 0.5)
    .slice(0, typingCount)
    .map(u => u.name);
};

export const generateSystemMessage = (type: 'join' | 'leave', userName: string, roomId: string): Message => {
  const content = type === 'join' ? `${userName} joined the room` : `${userName} left the room`;
  
  return {
    id: `system-${Date.now()}-${Math.random()}`,
    content,
    userId: 'system',
    userName: 'System',
    userAvatar: '',
    userColor: '#6B7280',
    timestamp: new Date(),
    roomId,
    type: 'system'
  };
};