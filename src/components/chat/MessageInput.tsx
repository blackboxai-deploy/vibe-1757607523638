'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { MessageSendData } from '@/types/chat';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: MessageSendData) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const MessageInput = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = "Type your message...",
  className
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSendMessage = () => {
    if (!message.trim() || disabled) return;

    const messageData: MessageSendData = {
      content: message.trim(),
      type: 'text'
    };

    onSendMessage(messageData);
    setMessage('');
    handleStopTyping();

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      return;
    }

    handleStartTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;

    if (e.target.value.trim()) {
      handleStartTyping();
    } else {
      handleStopTyping();
    }
  };

  const handleStartTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      onTypingStop();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.slice(0, start) + emoji + message.slice(end);
    
    setMessage(newMessage);
    
    // Focus and set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    handleStartTyping();
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const mockFile = {
      name: 'image.jpg',
      size: 1024000,
      type: 'image/jpeg'
    };

    const fileMessage: MessageSendData = {
      content: `Shared a file: ${mockFile.name}`,
      type: 'file'
    };

    onSendMessage(fileMessage);
  };

  return (
    <div className={cn('border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4', className)}>
      <div className="flex items-end space-x-2">
        {/* File Upload Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFileUpload}
          disabled={disabled}
          className="h-10 w-10 p-0 flex-shrink-0"
          title="Upload file"
        >
          📎
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[40px] max-h-[120px] resize-none pr-12 py-2"
            rows={1}
          />
          
          {/* Emoji Picker */}
          <div className="absolute right-2 bottom-2">
            <EmojiPicker onEmojiSelect={handleEmojiSelect}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
                title="Add emoji"
              >
                😀
              </Button>
            </EmojiPicker>
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled}
          size="sm"
          className="h-10 px-4 flex-shrink-0"
        >
          Send
        </Button>
      </div>

      {/* Character Count */}
      {message.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
          {message.length}/2000 characters
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>

        {/* Quick Emoji Reactions */}
        <div className="flex items-center space-x-1">
          {['👍', '❤️', '😄', '🎉'].map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleEmojiSelect(emoji)}
              disabled={disabled}
              title={`Add ${emoji}`}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};