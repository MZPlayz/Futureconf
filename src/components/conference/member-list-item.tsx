
'use client';

import type { Participant } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemberListItemProps {
  participant: Participant;
}

export function MemberListItem({ participant }: MemberListItemProps) {
  const { name, avatar, role, status = 'online', dataAiHint } = participant;

  return (
    <div className="flex items-center space-x-2.5 p-1.5 hover:bg-muted/50 rounded-md transition-colors duration-150 cursor-pointer">
      <div className="relative">
        <Avatar className="w-7 h-7">
          <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint || "person"} />
          <AvatarFallback className="text-xs">
            {name ? name.charAt(0).toUpperCase() : <User2 className="w-3 h-3" />}
          </AvatarFallback>
        </Avatar>
        {status === 'online' && (
          <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-card" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p 
          className="text-xs font-medium truncate"
          style={{ color: role?.color || 'hsl(var(--foreground))' }}
        >
          {name}
        </p>
        {role && (
          <p className="text-[10px] text-muted-foreground truncate">
            {role.name}
          </p>
        )}
      </div>
    </div>
  );
}
