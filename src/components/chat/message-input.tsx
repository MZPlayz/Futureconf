'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import React, { type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  currentMessage: string;
  setCurrentMessage: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MessageInput({ onSendMessage, currentMessage, setCurrentMessage, disabled, className }: MessageInputProps) {
  
  const handleSubmit = () => {
    if (currentMessage.trim() === '') return;
    onSendMessage(currentMessage);
    setCurrentMessage('');
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("flex items-start space-x-1.5", className)}> {/* Reduced space */}
      <Textarea
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 resize-none rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-sm py-1.5 px-2.5" // Adjusted padding & text size
        rows={1}
        disabled={disabled}
      />
      <Button 
        onClick={handleSubmit} 
        size="icon" 
        className="rounded-md h-auto aspect-square p-2" // Adjusted padding & rounded
        disabled={disabled || currentMessage.trim() === ''}
        aria-label="Send Message"
      >
        <Send className="w-4 h-4" /> {/* Reduced icon size */}
      </Button>
    </div>
  );
}
