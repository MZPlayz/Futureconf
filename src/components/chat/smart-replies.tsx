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
      <div className={cn("p-1.5", className)}> {/* Reduced padding */}
        <div className="flex items-center text-xs text-muted-foreground mb-1"> {/* Reduced mb */}
          <Sparkles className="w-3 h-3 mr-1 text-primary" /> {/* Reduced icon size and margin */}
          <span>Generating replies...</span>
        </div>
        <div className="flex space-x-1.5 overflow-x-auto pb-0.5"> {/* Reduced space and padding */}
          {[1, 2, 3].map((i) => (
            <Button key={i} variant="outline" size="sm" disabled className="bg-muted/50 animate-pulse h-6 text-[11px] px-2 rounded-full"></Button> {/* Reduced height, font, padding */}
          ))}
        </div>
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className={cn("p-1.5", className)}> {/* Reduced padding */}
      <div className="flex items-center text-xs text-muted-foreground mb-1"> {/* Reduced mb */}
        <Sparkles className="w-3 h-3 mr-1 text-primary" /> {/* Reduced icon size and margin */}
        <span>Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-1"> {/* Reduced gap */}
        {replies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onReplyClick(reply)}
            className="rounded-full text-[11px] px-2 h-6 shadow-none hover:bg-accent hover:text-accent-foreground transition-colors duration-150" // Reduced height, font, padding
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  );
}
