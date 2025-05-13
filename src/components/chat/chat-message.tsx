import type { ChatMessage as Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns'; // Using isValid for better date checking
import { User2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { sender, text, timestamp, isOwn, avatar } = message;
  const [formattedTimestamp, setFormattedTimestamp] = useState<string>('');

  useEffect(() => {
    // Ensure timestamp is valid before formatting and it's client-side only
    if (typeof window !== 'undefined') {
      if (timestamp && isValid(new Date(timestamp))) { // Use isValid for robust checking
        setFormattedTimestamp(format(new Date(timestamp), "p"));
      } else {
        setFormattedTimestamp("..."); // Fallback for invalid or missing timestamp
      }
    }
    // If window is undefined (server-side), set a placeholder to avoid mismatch.
    // This ensures `formattedTimestamp` has a consistent initial value on both server and client before the effect runs.
    else {
        setFormattedTimestamp("...");
    }
  }, [timestamp]); // Dependency array includes timestamp

  return (
    <div
      className={cn(
        "flex items-start space-x-2 py-2 animate-in fade-in-50 duration-300", // Reduced space and padding
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <Avatar className="w-7 h-7"> {/* Reduced avatar size */}
          <AvatarImage src={avatar} alt={sender} data-ai-hint="person portrait" />
          <AvatarFallback>
            <User2 className="w-3.5 h-3.5" /> {/* Reduced icon size */}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[70%]")}>
        <div
          className={cn(
            "p-2 rounded-md shadow", // Reduced padding and radius
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-card border border-border rounded-bl-none"
          )}
        >
          {!isOwn && (
            <p className="text-xs font-semibold mb-0.5 text-muted-foreground">{sender}</p> {/* Reduced mb */}
          )}
          <p className="text-xs whitespace-pre-wrap break-words">{text}</p> {/* Reduced font size */}
        </div>
        <p
          className={cn(
            "text-xs text-muted-foreground mt-1",
            isOwn ? "text-right" : "text-left"
          )}
        >
          {formattedTimestamp}
        </p>
      </div>
      {isOwn && (
        <Avatar className="w-7 h-7 ml-2"> {/* Reduced avatar size and margin */}
           <AvatarImage src={avatar} alt={sender} data-ai-hint="person portrait"/>
          <AvatarFallback>
             <User2 className="w-3.5 h-3.5" /> {/* Reduced icon size */}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
