import type { ChatMessage } from '@/types';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { SmartReplies } from './smart-replies';

interface ChatPanelProps {
  messages: ChatMessage[];
  smartReplies: string[];
  currentMessage: string;
  isSmartRepliesLoading: boolean;
  onSendMessage: (text: string) => void;
  onSmartReplyClick: (reply: string) => void;
  setCurrentMessage: (text: string) => void;
}

export function ChatPanel({
  messages,
  smartReplies,
  currentMessage,
  isSmartRepliesLoading,
  onSendMessage,
  onSmartReplyClick,
  setCurrentMessage,
}: ChatPanelProps) {
  return (
    <aside className="w-full bg-card flex flex-col h-full">
      <header className="p-2 border-b border-border"> {/* Reduced padding */}
        <h2 className="text-base font-medium text-foreground">Chat</h2> {/* Reduced font size */}
      </header>
      <MessageList messages={messages} className="flex-1" />
      <SmartReplies 
        replies={smartReplies} 
        onReplyClick={onSmartReplyClick} 
        isLoading={isSmartRepliesLoading}
        className="border-t border-border p-1.5"  // Adjusted padding
      />
      <MessageInput 
        onSendMessage={onSendMessage}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        className="p-1.5 border-t border-border bg-card" // Adjusted padding
      />
    </aside>
  );
}
