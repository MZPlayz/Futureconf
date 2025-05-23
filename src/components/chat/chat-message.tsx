
'use client';

import type { ChatMessage as Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import { User2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { sender, text, timestamp, isOwn, avatar } = message;
  const [formattedTimestamp, setFormattedTimestamp] = useState<string>('');

  useEffect(() => {
    // This effect runs only on the client, after initial hydration
    // to prevent server-client mismatch for timestamps.
    if (timestamp && isValid(new Date(timestamp))) {
      setFormattedTimestamp(format(new Date(timestamp), "p"));
    } else {
      // Set a non-time placeholder if timestamp is invalid,
      // or keep it as "..." if that's preferred for loading/invalid states.
      setFormattedTimestamp("..."); 
    }
  }, [timestamp]);

  // Initial render on server and client before useEffect will use this:
  const displayTimestamp = formattedTimestamp || "...";

  return (
    <div
      className={cn(
        "flex items-start space-x-2 py-2 animate-in fade-in-50 duration-300",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <Avatar className="w-7 h-7">
          <AvatarImage src={avatar} alt={sender} data-ai-hint="person portrait" />
          <AvatarFallback>
            <User2 className="w-3.5 h-3.5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[70%]")}>
        <div
          className={cn(
            "p-2 rounded-md shadow", 
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-card border border-border rounded-bl-none"
          )}
        >
          {!isOwn && (
            <p className="text-xs font-semibold mb-0.5 text-muted-foreground">{sender}</p>
          )}
          <p className="text-xs whitespace-pre-wrap break-words">{text}</p>
        </div>
        <p
          className={cn(
            "text-xs text-muted-foreground mt-1",
            isOwn ? "text-right" : "text-left"
          )}
        >
          {displayTimestamp}
        </p>
      </div>
      {isOwn && (
        <Avatar className="w-7 h-7 ml-2">
           <AvatarImage src={avatar} alt={sender} data-ai-hint="person portrait"/>
          <AvatarFallback>
             <User2 className="w-3.5 h-3.5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

