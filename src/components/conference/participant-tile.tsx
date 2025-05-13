
import type { Participant } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MicOff, VideoOff, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ParticipantTileProps {
  participant: Participant;
}

export function ParticipantTile({ participant }: ParticipantTileProps) {
  const {
    name,
    avatar,
    isSpeaking,
    isVideoEnabled, // Camera status specifically
    isMuted,
    isScreenSharing, // True if this participant is the one actively sharing screen in the main grid view
    mediaStream,
    dataAiHint,
    isLocal
  } = participant;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      // On the client, MediaStream is defined.
      // We only want to assign if mediaStream is actually a MediaStream instance or null.
      if (mediaStream && typeof MediaStream !== 'undefined' && mediaStream instanceof MediaStream) {
        videoRef.current.srcObject = mediaStream;
      } else {
        // This handles mediaStream being null, undefined, or not a MediaStream instance.
        videoRef.current.srcObject = null;
      }
    }
  }, [mediaStream]); // isClient is not strictly needed here as useEffect runs client-side

  // Guard MediaStream check with isClient and typeof MediaStream to prevent SSR errors and hydration mismatches
  const showVideoStream = isClient && mediaStream && typeof MediaStream !== 'undefined' && mediaStream instanceof MediaStream && (isScreenSharing || (isLocal && isVideoEnabled));
  const showRemotePlaceholder = isVideoEnabled && !isLocal && !showVideoStream;

  return (
    <Card className="relative aspect-video overflow-hidden shadow-lg group bg-black">
      <CardContent className="p-0 h-full flex items-center justify-center">
        {showVideoStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal} // Local previews (camera or screen share) should be muted
            className={`w-full h-full ${isScreenSharing ? 'object-contain' : 'object-cover'}`}
          />
        ) : showRemotePlaceholder ? (
          <Image
            src={avatar || `https://picsum.photos/seed/${name}/400/300`}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={dataAiHint || "person"}
          />
        ) : (
          // Fallback: Video is off for local user, or no stream, or remote user with video off
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint || "person"} />
              <AvatarFallback className="text-3xl">
                {name ? name.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Overlay for VideoOff icon if camera is intended to be off, and not currently screen sharing */}
        {((isLocal && !isVideoEnabled) || (!isLocal && !isVideoEnabled)) && !isScreenSharing && (
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
             <VideoOff className="w-10 h-10 text-white/70" />
           </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 md:p-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs md:text-sm font-medium text-white truncate ${isSpeaking ? 'ring-2 ring-green-400 bg-green-500/30 rounded px-1 py-0.5' : ''}`}>
              {name} {isLocal && "(You)"}
            </span>
            <div className="flex items-center space-x-1 md:space-x-2">
              {isMuted && <MicOff className="w-3 h-3 md:w-4 md:h-4 text-red-400" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
