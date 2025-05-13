import type { Participant } from '@/types';
import { ParticipantTile } from './participant-tile';

interface VideoGridProps {
  participants: Participant[];
  screenSharingParticipantId?: string | null; 
}

export function VideoGrid({ participants, screenSharingParticipantId }: VideoGridProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">Waiting for participants...</p>
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
      <div className="flex-1 grid grid-rows-[minmax(0,_3fr)_minmax(0,_1fr)] gap-1 p-1 md:p-2 bg-background overflow-hidden">
        <div className="bg-black rounded-md overflow-hidden h-full">
         <ParticipantTile participant={{...mainScreenParticipant, isScreenSharing: true }} />
        </div>
        {otherParticipants.length > 0 && (
          <div className={`grid gap-1 overflow-x-auto overflow-y-hidden pb-1 h-full ${
              otherParticipants.length === 1 ? 'grid-cols-1' :
              otherParticipants.length === 2 ? 'grid-cols-2' :
              otherParticipants.length === 3 ? 'grid-cols-3' :
              'grid-cols-4 md:grid-cols-5' // Reduced max columns for larger tiles in smaller space
            }`}
            style={{ gridAutoFlow: 'column', gridAutoColumns: `minmax(${otherParticipants.length > 3 ? '100px' : '130px'}, 1fr)` }} // Adjusted minmax
          >
            {otherParticipants.map(participant => (
              <ParticipantTile key={participant.id} participant={{...participant, isScreenSharing: false}} />
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Adjusted grid layout for fewer participants to give more space
  let gridClasses = 'grid-cols-1';
  if (participants.length === 2) gridClasses = 'grid-cols-1 md:grid-cols-2';
  if (participants.length === 3) gridClasses = 'grid-cols-2 md:grid-cols-3';
  if (participants.length === 4) gridClasses = 'grid-cols-2';
  if (participants.length > 4 && participants.length <= 6) gridClasses = 'grid-cols-2 md:grid-cols-3';
  if (participants.length > 6) gridClasses = 'grid-cols-3 sm:grid-cols-3 md:grid-cols-4';


  return (
    <div className={`flex-1 grid gap-1 md:gap-2 p-1 md:p-2 bg-background overflow-y-auto ${gridClasses}`}>
      {participants.map(participant => (
        <ParticipantTile key={participant.id} participant={{...participant, isScreenSharing: false}} />
      ))}
    </div>
  );
}
