import type { ChatMessage as Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { User2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { sender, text, timestamp, isOwn, avatar } = message;
  const [formattedTimestamp, setFormattedTimestamp] = useState<string>('');

  useEffect(() => {
    setFormattedTimestamp(format(new Date(timestamp), "p"));
  }, [timestamp]);

  return (
    <div
      className={cn(
        "flex items-start space-x-3 py-3 animate-in fade-in-50 duration-300",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatar} alt={sender} data-ai-hint="person portrait" />
          <AvatarFallback>
            <User2 className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[70%]")}>
        <div
          className={cn(
            "p-3 rounded-lg shadow",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-card border border-border rounded-bl-none"
          )}
        >
          {!isOwn && (
            <p className="text-xs font-semibold mb-1 text-muted-foreground">{sender}</p>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        </div>
        <p
          className={cn(
            "text-xs text-muted-foreground mt-1",
            isOwn ? "text-right" : "text-left"
          )}
        >
          {formattedTimestamp || "..."}
        </p>
      </div>
      {isOwn && (
        <Avatar className="w-8 h-8 ml-3">
           <AvatarImage src={avatar} alt={sender} data-ai-hint="person portrait"/>
          <AvatarFallback>
             <User2 className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
