import type { Participant } from '@/types';
import { ParticipantTile } from './participant-tile';

interface VideoGridProps {
  participants: Participant[];
  screenSharingParticipantId?: string | null; 
}

export function VideoGrid({ participants, screenSharingParticipantId }: VideoGridProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-1.5">
        <p className="text-xs text-muted-foreground">Waiting for participants...</p>
      </div>
    );
  }
  
  const isScreenSharingActive = !!screenSharingParticipantId;
  const mainScreenParticipant = isScreenSharingActive 
    ? participants.find(p => p.id === screenSharingParticipantId) 
    : null;
  
  const otherParticipants = isScreenSharingActive 
    ? participants.filter(p => p.id !== screenSharingParticipantId)
    : participants;


  if (isScreenSharingActive && mainScreenParticipant) {
    return (
      <div className="flex-1 grid grid-rows-[minmax(0,_3fr)_minmax(0,_1fr)] gap-0.5 p-0.5 bg-background overflow-hidden">
        <div className="bg-black rounded-sm overflow-hidden h-full">
         <ParticipantTile participant={{...mainScreenParticipant, isScreenSharing: true }} />
        </div>
        {otherParticipants.length > 0 && (
          <div className={`grid gap-0.5 overflow-x-auto overflow-y-hidden pb-0.5 h-full ${
              otherParticipants.length === 1 ? 'grid-cols-1' :
              otherParticipants.length === 2 ? 'grid-cols-2' :
              otherParticipants.length === 3 ? 'grid-cols-3' :
              'grid-cols-4 md:grid-cols-5' 
            }`}
            style={{ gridAutoFlow: 'column', gridAutoColumns: `minmax(${otherParticipants.length > 3 ? '70px' : '90px'}, 1fr)` }}
          >
            {otherParticipants.map(participant => (
              <ParticipantTile key={participant.id} participant={{...participant, isScreenSharing: false}} />
            ))}
          </div>
        )}
      </div>
    );
  }
  
  let gridClasses = 'grid-cols-1';
  if (participants.length === 2) gridClasses = 'grid-cols-1 md:grid-cols-2';
  if (participants.length === 3) gridClasses = 'grid-cols-2 md:grid-cols-3';
  if (participants.length === 4) gridClasses = 'grid-cols-2';
  if (participants.length > 4 && participants.length <= 6) gridClasses = 'grid-cols-2 md:grid-cols-3';
  if (participants.length > 6) gridClasses = 'grid-cols-3 sm:grid-cols-3 md:grid-cols-4';


  return (
    <div className={`flex-1 grid gap-0.5 p-0.5 bg-background overflow-y-auto ${gridClasses}`}>
      {participants.map(participant => (
        <ParticipantTile key={participant.id} participant={{...participant, isScreenSharing: false}} />
      ))}
    </div>
  );
}
