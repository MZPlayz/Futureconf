import type { Participant } from '@/types';
import { ParticipantTile } from './participant-tile';

interface VideoGridProps {
  participants: Participant[];
  screenSharingParticipantId?: string | null; 
}

export function VideoGrid({ participants, screenSharingParticipantId }: VideoGridProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-2"> {/* Reduced padding */}
        <p className="text-sm text-muted-foreground">Waiting for participants...</p> {/* Reduced font size */}
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
      <div className="flex-1 grid grid-rows-[minmax(0,_3fr)_minmax(0,_1fr)] gap-0.5 p-0.5 md:p-1 bg-background overflow-hidden"> {/* Reduced gap and padding */}
        <div className="bg-black rounded-sm overflow-hidden h-full"> {/* Reduced radius */}
         <ParticipantTile participant={{...mainScreenParticipant, isScreenSharing: true }} />
        </div>
        {otherParticipants.length > 0 && (
          <div className={`grid gap-0.5 overflow-x-auto overflow-y-hidden pb-0.5 h-full ${ // Reduced gap and padding
              otherParticipants.length === 1 ? 'grid-cols-1' :
              otherParticipants.length === 2 ? 'grid-cols-2' :
              otherParticipants.length === 3 ? 'grid-cols-3' :
              'grid-cols-4 md:grid-cols-5' 
            }`}
            style={{ gridAutoFlow: 'column', gridAutoColumns: `minmax(${otherParticipants.length > 3 ? '80px' : '100px'}, 1fr)` }} // Adjusted minmax for smaller tiles
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
  if (participants.length === 3) gridClasses = 'grid-cols-2 md:grid-cols-3'; // Ensure 3 participants also get decent space
  if (participants.length === 4) gridClasses = 'grid-cols-2';
  if (participants.length > 4 && participants.length <= 6) gridClasses = 'grid-cols-2 md:grid-cols-3';
  if (participants.length > 6) gridClasses = 'grid-cols-3 sm:grid-cols-3 md:grid-cols-4';


  return (
    <div className={`flex-1 grid gap-0.5 md:gap-1 p-0.5 md:p-1 bg-background overflow-y-auto ${gridClasses}`}> {/* Reduced gap and padding */}
      {participants.map(participant => (
        <ParticipantTile key={participant.id} participant={{...participant, isScreenSharing: false}} />
      ))}
    </div>
  );
}
