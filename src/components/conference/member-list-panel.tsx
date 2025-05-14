
'use client';

import React, { useState } from 'react';
import type { Participant } from '@/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MemberListItem } from './member-list-item';
import { Users, Search } from 'lucide-react';

interface MemberListPanelProps {
  participants: Participant[];
}

export function MemberListPanel({ participants }: MemberListPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-full bg-card flex flex-col h-full border-l border-border">
      <header className="p-2 border-b border-border flex items-center space-x-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-foreground">
          Members ({participants.length})
        </h2>
      </header>
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 text-xs h-8 rounded-sm bg-input focus:border-primary"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-1 space-y-0.5">
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <MemberListItem key={participant.id} participant={participant} />
            ))
          ) : (
            <p className="p-4 text-center text-xs text-muted-foreground">
              No members found.
            </p>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
