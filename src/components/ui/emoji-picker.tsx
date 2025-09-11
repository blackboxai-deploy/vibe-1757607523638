'use client';

import { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { ScrollArea } from './scroll-area';
import { popularEmojis } from '@/lib/chat-data';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const emojiCategories = {
  recent: '🕐',
  smileys: '😀',
  people: '👋',
  nature: '🌱',
  food: '🍕',
  activities: '🎈',
  travel: '🚗',
  objects: '💡',
  symbols: '❤️',
  flags: '🏳️'
};

const recentEmojis = ['😀', '👍', '❤️', '😂', '🎉', '🔥', '✨', '💯'];

export const EmojiPicker = ({ onEmojiSelect, className, children }: EmojiPickerProps) => {
  const [activeCategory, setActiveCategory] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  const getEmojisByCategory = (category: string) => {
    if (category === 'recent') {
      return recentEmojis.map(emoji => ({
        emoji,
        name: emoji,
        category: 'recent',
        keywords: []
      }));
    }
    
    return popularEmojis.filter(e => e.category === category);
  };

  const getFilteredEmojis = () => {
    const emojis = getEmojisByCategory(activeCategory);
    
    if (!searchTerm) return emojis;
    
    return emojis.filter(e =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-8 w-8 p-0', className)}
          >
            😀
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        side="top"
      >
        <div className="p-3 border-b">
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto p-1 bg-gray-50 dark:bg-gray-800">
            {Object.entries(emojiCategories).map(([category, icon]) => (
              <TabsTrigger 
                key={category}
                value={category}
                className="flex-shrink-0 text-base px-2 py-1"
                title={category.charAt(0).toUpperCase() + category.slice(1)}
              >
                {icon}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="h-64">
            {Object.keys(emojiCategories).map((category) => (
              <TabsContent 
                key={category}
                value={category}
                className="h-full m-0"
              >
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-8 gap-1 p-2">
                    {getFilteredEmojis().map((emojiData, index) => (
                      <Button
                        key={`${emojiData.emoji}-${index}`}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 text-base"
                        onClick={() => handleEmojiClick(emojiData.emoji)}
                        title={emojiData.name}
                      >
                        {emojiData.emoji}
                      </Button>
                    ))}
                  </div>
                  
                  {getFilteredEmojis().length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No emojis found' : 'No emojis in this category'}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <div className="p-2 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex gap-1 overflow-x-auto">
            {recentEmojis.slice(0, 10).map((emoji, index) => (
              <Button
                key={`recent-${emoji}-${index}`}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 text-base"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};