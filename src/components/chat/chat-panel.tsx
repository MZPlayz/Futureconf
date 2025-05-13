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
    <aside className="w-full md:w-96 bg-card border-l border-border flex flex-col h-full shadow-xl">
      <header className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-primary">Chat</h2>
      </header>
      <MessageList messages={messages} className="flex-1" />
      <SmartReplies 
        replies={smartReplies} 
        onReplyClick={onSmartReplyClick} 
        isLoading={isSmartRepliesLoading}
        className="border-t border-border" 
      />
      <MessageInput 
        onSendMessage={onSendMessage}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
      />
    </aside>
  );
}