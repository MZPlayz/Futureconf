import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface SmartRepliesProps {
  replies: string[];
  onReplyClick: (reply: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function SmartReplies({ replies, onReplyClick, isLoading, className }: SmartRepliesProps) {
  if (isLoading) {
    return (
      <div className={`p-2 ${className}`}>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Sparkles className="w-4 h-4 mr-2 text-primary" />
          <span>Generating replies...</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <Button key={i} variant="outline" size="sm" disabled className="bg-muted animate-pulse h-8 w-24 rounded-full"></Button>
          ))}
        </div>
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className={`p-2 ${className}`}>
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Sparkles className="w-4 h-4 mr-2 text-primary" />
        <span>Smart Replies</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onReplyClick(reply)}
            className="rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  );
}