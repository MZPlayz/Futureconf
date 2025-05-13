import type { Participant } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MicOff, VideoOff, User, ScreenShare as ScreenShareIcon } from 'lucide-react';

interface ParticipantTileProps {
  participant: Participant;
}

export function ParticipantTile({ participant }: ParticipantTileProps) {
  const { name, avatar, isSpeaking, isVideoEnabled = true, isMuted = false, isScreenSharing = false, dataAiHint } = participant;

  return (
    <Card className="relative aspect-video overflow-hidden shadow-lg group">
      <CardContent className="p-0 h-full">
        {isScreenSharing ? (
          <div className="w-full h-full bg-secondary flex flex-col items-center justify-center">
            <ScreenShareIcon className="w-16 h-16 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">{name} is sharing screen</p>
          </div>
        ) : isVideoEnabled ? (
          <Image
            src={avatar || `https://picsum.photos/seed/${name}/400/300`}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={dataAiHint || "person"}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint || "person"} />
              <AvatarFallback className="text-3xl">
                {name ? name.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        {!isScreenSharing && !isVideoEnabled && (
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
             <VideoOff className="w-12 h-12 text-white" />
           </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium text-white truncate ${isSpeaking ? 'ring-2 ring-green-500 rounded px-1' : ''}`}>
              {name}
            </span>
            <div className="flex items-center space-x-2">
              {isMuted && <MicOff className="w-4 h-4 text-red-400" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}