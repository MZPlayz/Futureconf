
'use client';

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
    isVideoEnabled, 
    isMuted,
    isScreenSharing, 
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
    if (isClient && videoRef.current) {
      // Check if MediaStream is defined and mediaStream is an instance of it
      if (typeof MediaStream !== 'undefined' && mediaStream instanceof MediaStream) {
        videoRef.current.srcObject = mediaStream;
      } else {
        videoRef.current.srcObject = null; // Clear srcObject if stream is not valid or null
      }
    }
  }, [mediaStream, isClient]); 

  const showVideoStream = isClient && mediaStream && typeof MediaStream !== 'undefined' && mediaStream instanceof MediaStream && (isScreenSharing || (isLocal && isVideoEnabled) || (!isLocal && isVideoEnabled));
  const showRemotePlaceholder = isVideoEnabled && !isLocal && !showVideoStream;


  return (
    <Card className="relative aspect-video overflow-hidden bg-muted shadow-none border-none rounded-sm">
      <CardContent className="p-0 h-full flex items-center justify-center">
        {showVideoStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal || !isSpeaking} 
            className={`w-full h-full ${isScreenSharing ? 'object-contain bg-black' : 'object-cover'}`}
          />
        ) : showRemotePlaceholder ? (
          <Image
            src={avatar || `https://picsum.photos/seed/${name}/400/300`}
            alt={name}
            fill // Changed from layout="fill" to fill for Next 13+ Image component
            objectFit="cover"
            data-ai-hint={dataAiHint || "person"}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Avatar className="w-10 h-10 md:w-14 md:h-14">
              <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint || "person"} />
              <AvatarFallback className="text-base md:text-lg bg-card">
                {name ? name.charAt(0).toUpperCase() : <User className="w-5 h-5 md:w-7 md:h-7" />}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {((isLocal && !isVideoEnabled && !isScreenSharing) || (!isLocal && !isVideoEnabled)) && !isScreenSharing && (
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
             <VideoOff className="w-5 h-5 md:w-7 md:h-7 text-white/80" />
           </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 md:p-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium text-white truncate ${isSpeaking ? 'ring-1 ring-green-400 bg-green-500/40 rounded-sm px-1 py-0.5' : ''}`}>
              {name} {isLocal && "(You)"}
            </span>
            <div className="flex items-center space-x-1">
              {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

