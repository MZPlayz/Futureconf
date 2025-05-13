import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartRepliesProps {
  replies: string[];
  onReplyClick: (reply: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function SmartReplies({ replies, onReplyClick, isLoading, className }: SmartRepliesProps) {
  if (isLoading) {
    return (
      <div className={cn("p-2", className)}>
        <div className="flex items-center text-xs text-muted-foreground mb-1.5">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
          <span>Generating replies...</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {[1, 2, 3].map((i) => (
            <Button key={i} variant="outline" size="sm" disabled className="bg-muted/50 animate-pulse h-7 text-xs px-2.5 rounded-full"></Button>
          ))}
        </div>
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className={cn("p-2", className)}>
      <div className="flex items-center text-xs text-muted-foreground mb-1.5">
        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
        <span>Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {replies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onReplyClick(reply)}
            className="rounded-full text-xs px-2.5 h-7 shadow-none hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  );
}
