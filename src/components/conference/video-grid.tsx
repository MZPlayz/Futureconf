import type { Participant } from '@/types';
import { ParticipantTile } from './participant-tile';

interface VideoGridProps {
  participants: Participant[];
  isScreenSharingActive?: boolean; // To identify if any participant is screen sharing
  screenSharingParticipantId?: string; // ID of the participant sharing screen
}

export function VideoGrid({ participants, isScreenSharingActive, screenSharingParticipantId }: VideoGridProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted p-4">
        <p className="text-muted-foreground">Waiting for participants to join...</p>
      </div>
    );
  }
  
  const mainScreenParticipant = isScreenSharingActive 
    ? participants.find(p => p.id === screenSharingParticipantId) 
    : null;
  const otherParticipants = isScreenSharingActive 
    ? participants.filter(p => p.id !== screenSharingParticipantId)
    : participants;


  if (isScreenSharingActive && mainScreenParticipant) {
    return (
      <div className="flex-1 grid grid-rows-[3fr_1fr] gap-2 p-2 md:p-4 bg-secondary/50 overflow-hidden">
        <div className="bg-black rounded-lg overflow-hidden">
         <ParticipantTile participant={{...mainScreenParticipant, isScreenSharing: true }} />
        </div>
        {otherParticipants.length > 0 && (
          <div className={`grid gap-2 overflow-x-auto overflow-y-hidden pb-2 ${
              otherParticipants.length === 1 ? 'grid-cols-1' :
              otherParticipants.length === 2 ? 'grid-cols-2' :
              otherParticipants.length === 3 ? 'grid-cols-3' :
              'grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
            }`}
            style={{ gridAutoFlow: 'column', gridAutoColumns: `minmax(${otherParticipants.length > 4 ? '120px' : '150px'}, 1fr)` }}
          >
            {otherParticipants.map(participant => (
              <ParticipantTile key={participant.id} participant={participant} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default grid view
  const gridCols = participants.length === 1 ? 1 :
                   participants.length <= 4 ? 2 :
                   participants.length <= 9 ? 3 : 4;
  
  return (
    <div className={`flex-1 grid gap-2 md:gap-4 p-2 md:p-4 bg-secondary/50 overflow-y-auto
      ${participants.length === 1 ? 'grid-cols-1' : ''}
      ${participants.length >= 2 && participants.length <= 3 ? 'grid-cols-1 md:grid-cols-' + participants.length : ''}
      ${participants.length === 4 ? 'grid-cols-2' : ''}
      ${participants.length > 4 && participants.length <= 6 ? 'grid-cols-2 md:grid-cols-3' : ''}
      ${participants.length > 6 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : ''}
    `}>
      {participants.map(participant => (
        <ParticipantTile key={participant.id} participant={participant} />
      ))}
    </div>
  );
}