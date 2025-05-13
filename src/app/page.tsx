'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VideoGrid } from '@/components/conference/video-grid';
import { ConferenceControls } from '@/components/conference/conference-controls';
import { ChatPanel } from '@/components/chat/chat-panel';
import type { ChatMessage, Participant } from '@/types';
import { suggestReplies } from '@/ai/flows/suggest-replies';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RadioTower } from 'lucide-react';

const initialParticipants: Participant[] = [
  { id: 'p1', name: 'Alice', avatar: 'https://picsum.photos/seed/alice-conf/200/200', isHost: true, isSpeaking: false, dataAiHint: 'woman smiling', isLocal: false },
  { id: 'p2', name: 'You', avatar: 'https://picsum.photos/seed/you-conf/200/200', isHost: false, isSpeaking: true, dataAiHint: 'person happy', isLocal: true },
  { id: 'p3', name: 'Bob', avatar: 'https://picsum.photos/seed/bob-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'man thinking', isLocal: false },
  { id: 'p4', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'person glasses', isLocal: false },
  { id: 'p5', name: 'Diana', avatar: 'https://picsum.photos/seed/diana-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'woman nature', isLocal: false },
];

const initialMessages: ChatMessage[] = [
  { id: '1', sender: 'Alice', text: 'Hey everyone, welcome to FutureConf!', timestamp: new Date(Date.now() - 1000 * 60 * 5), isOwn: false, avatar: 'https://picsum.photos/seed/alice-chat/40/40', },
  { id: '2', sender: 'Bob', text: 'Hi Alice! Glad to be here.', timestamp: new Date(Date.now() - 1000 * 60 * 4), isOwn: false, avatar: 'https://picsum.photos/seed/bob-chat/40/40' },
  { id: '3', sender: 'You', text: 'Hello! Looking forward to this meeting.', timestamp: new Date(Date.now() - 1000 * 60 * 3), isOwn: true, avatar: 'https://picsum.photos/seed/you-chat/40/40' },
  { id: '4', sender: 'Charlie', text: 'Can everyone hear me okay?', timestamp: new Date(Date.now() - 1000 * 60 * 2), isOwn: false, avatar: 'https://picsum.photos/seed/charlie-chat/40/40' },
];

export default function FutureConfPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [smartReplySuggestions, setSmartReplySuggestions] = useState<string[]>([]);
  const [isSmartRepliesLoading, setIsSmartRepliesLoading] = useState(false);
  
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  
  // Conference states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false); 
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenSharingParticipantId, setScreenSharingParticipantId] = useState<string | null>(null);

  const [localCameraStream, setLocalCameraStream] = useState<MediaStream | null>(null);
  const [localScreenStream, setLocalScreenStream] = useState<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const { toast } = useToast();

  // Request camera permission on mount
  useEffect(() => {
    let isMounted = true;
    const getCameraPermission = async () => {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (isMounted) {
            setLocalCameraStream(stream);
            setHasCameraPermission(true);
            setIsVideoEnabled(true);
            setParticipants(prev => prev.map(p => p.isLocal ? {...p, isVideoEnabled: true, isMuted: false } : p));
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          if (isMounted) {
            setHasCameraPermission(false);
            setIsVideoEnabled(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera and microphone permissions in your browser settings.',
            });
          }
        }
      } else {
        if (isMounted) {
          setHasCameraPermission(false); 
          console.warn("navigator.mediaDevices is not available.")
        }
      }
    };

    getCameraPermission();

    return () => { 
      isMounted = false;
      localCameraStream?.getTracks().forEach(track => track.stop());
      localScreenStream?.getTracks().forEach(track => track.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);


  const handleSendMessage = useCallback((text: string) => {
    if (text.trim() === '') return;
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: 'You',
      text,
      timestamp: new Date(),
      isOwn: true,
      avatar: 'https://picsum.photos/seed/you-chat/40/40'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setCurrentMessage('');
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (messages.length === 0 || !isChatPanelOpen) {
        setSmartReplySuggestions([]);
        return;
      }
      
      setIsSmartRepliesLoading(true);
      const chatHistoryText = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
      try {
        const result = await suggestReplies({ chatHistory: chatHistoryText });
        setSmartReplySuggestions(result.suggestions);
      } catch (error) {
        console.error('Error fetching smart replies:', error);
        setSmartReplySuggestions([]);
        toast({
          title: "Smart Replies Error",
          description: "Could not fetch smart replies.",
          variant: "destructive",
        });
      } finally {
        setIsSmartRepliesLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 500); // Debounce
    return () => clearTimeout(timer);
  }, [messages, isChatPanelOpen, toast]);

  const handleSmartReplyClick = (reply: string) => {
    setCurrentMessage(reply);
  };

  const toggleChatPanel = () => setIsChatPanelOpen(prev => !prev);

  const handleMuteToggle = () => {
    const newIsMuted = !isMuted;
    setIsMuted(newIsMuted); 

    if (localCameraStream) {
        localCameraStream.getAudioTracks().forEach(track => track.enabled = !newIsMuted);
    }
    if (isScreenSharing && localScreenStream) { 
        localScreenStream.getAudioTracks().forEach(track => track.enabled = !newIsMuted);
    }
    setParticipants(prev => prev.map(p => p.isLocal ? {...p, isMuted: newIsMuted} : p));
    toast({ title: `Microphone ${newIsMuted ? 'muted' : 'unmuted'}` });
  };

  const handleVideoToggle = async () => {
    const newIsVideoEnabled = !isVideoEnabled;
    
    if (newIsVideoEnabled) {
        if (!localCameraStream && hasCameraPermission !== false) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalCameraStream(stream);
                setHasCameraPermission(true);
                stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({ variant: "destructive", title: "Camera Error", description: "Could not access camera."});
                return;
            }
        } else if (localCameraStream) {
            localCameraStream.getVideoTracks().forEach(track => track.enabled = true);
        }
    } else { 
        localCameraStream?.getVideoTracks().forEach(track => {
          track.enabled = false;
          // Optionally stop the track if you want to fully release the camera
          // track.stop(); 
        });
        // If stopping tracks, you might want to set localCameraStream to null
        // if all video tracks are stopped and you intend to re-request permissions next time.
        // However, for toggling, just disabling is usually sufficient.
    }
    setIsVideoEnabled(newIsVideoEnabled);
    setParticipants(prev => prev.map(p => p.isLocal ? {...p, isVideoEnabled: newIsVideoEnabled} : p));
    toast({ title: `Video ${newIsVideoEnabled ? 'enabled' : 'disabled'}` });
  };
  
  const handleScreenShareToggle = async () => {
    const newIsScreenSharing = !isScreenSharing;
    const youParticipant = participants.find(p => p.isLocal);

    if (newIsScreenSharing) {
        if (!youParticipant) return;
        try {
            if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
              const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } });
              stream.getVideoTracks()[0].addEventListener('ended', () => { // Listener for when user stops sharing via browser UI
                  setIsScreenSharing(false);
                  setLocalScreenStream(null);
                  setScreenSharingParticipantId(null);
                  if (isVideoEnabled && localCameraStream) { 
                     localCameraStream.getVideoTracks().forEach(track => track.enabled = true);
                  }
                  setParticipants(prev => prev.map(p => p.isLocal ? {...p, isScreenSharing: false} : p));
                  toast({ title: "Screen sharing stopped" });
              });
              setLocalScreenStream(stream);
              setIsScreenSharing(true);
              setScreenSharingParticipantId(youParticipant.id);
              if (isVideoEnabled && localCameraStream) { 
                localCameraStream.getVideoTracks().forEach(track => track.enabled = false);
              }
              setParticipants(prev => prev.map(p => p.isLocal ? {...p, isScreenSharing: true} : p));
              toast({ title: "Screen sharing started" });
            } else {
              toast({ variant: "destructive", title: "Screen Share Error", description: "Screen sharing is not supported by your browser or device."});
            }
        } catch (error) {
            console.error('Error starting screen share:', error);
            toast({ variant: "destructive", title: "Screen Share Error", description: "Could not start screen sharing. Please ensure permission is granted."});
        }
    } else {
        localScreenStream?.getTracks().forEach(track => track.stop());
        setLocalScreenStream(null);
        setIsScreenSharing(false);
        setScreenSharingParticipantId(null);
        if (isVideoEnabled && localCameraStream) { 
           localCameraStream.getVideoTracks().forEach(track => track.enabled = true);
        }
        setParticipants(prev => prev.map(p => p.isLocal ? {...p, isScreenSharing: false} : p));
        toast({ title: "Screen sharing stopped" });
    }
  };

  const handleEndCall = () => {
    localCameraStream?.getTracks().forEach(track => track.stop());
    localScreenStream?.getTracks().forEach(track => track.stop());
    setLocalCameraStream(null);
    setLocalScreenStream(null);
    toast({ title: 'Call Ended', description: 'You have left the meeting.' });
    setMessages([]);
    // Reset participants to initial state but ensure local user's media is off
    setParticipants(initialParticipants.map(p => {
      const baseParticipant = {...p, mediaStream: null, isVideoEnabled: false, isMuted: false, isScreenSharing: false};
      if (p.isLocal) {
        return {...baseParticipant, isVideoEnabled: false, isMuted: true}; // Ensure local video/audio is off
      }
      return baseParticipant;
    }));
    setIsVideoEnabled(false);
    setIsMuted(true); // Mute microphone by default after ending call
    setIsScreenSharing(false);
    setHasCameraPermission(null); // Reset permission state, might re-trigger on next join attempt
  };

  const processedParticipants = participants.map(p => {
    if (p.isLocal) {
        let mediaStreamToUse: MediaStream | null = null;
        const isCurrentlyScreenSharing = isScreenSharing && p.id === screenSharingParticipantId;

        if (isCurrentlyScreenSharing && localScreenStream) {
            mediaStreamToUse = localScreenStream;
        } else if (isVideoEnabled && localCameraStream) {
            mediaStreamToUse = localCameraStream;
        }
        
        return {
            ...p,
            isMuted: isMuted,
            isVideoEnabled: isCurrentlyScreenSharing ? false : isVideoEnabled, 
            mediaStream: mediaStreamToUse,
            isScreenSharing: isCurrentlyScreenSharing,
        };
    }
    // Example: Simulate remote participant video status
    if(p.id === 'p1') return {...p, isVideoEnabled: true, mediaStream: null} // Alice has video on (simulated)
    if(p.id === 'p3') return {...p, isVideoEnabled: false, mediaStream: null} // Bob has video off (simulated)
    return {...p, mediaStream: null}; // Default remote participants with no active stream for this example
  });


  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col relative">
        <header className="p-4 border-b border-border flex-shrink-0 bg-gradient-to-r from-primary/10 via-card to-card shadow-lg flex items-center space-x-4">
          <RadioTower className="w-10 h-10 text-primary animate-pulse" />
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight">FutureConf</h1>
            <p className="text-xs text-muted-foreground">Next Generation Video Conferencing</p>
          </div>
        </header>
        
        {hasCameraPermission === false && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 p-4 w-full max-w-md">
              <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Camera/Microphone Access Denied</AlertTitle>
                  <AlertDescription>
                      FutureConf needs camera and microphone access to function fully. Please enable permissions in your browser settings and refresh the page.
                  </AlertDescription>
              </Alert>
          </div>
        )}

        <VideoGrid 
            participants={processedParticipants} 
            screenSharingParticipantId={screenSharingParticipantId}
        />
        <ConferenceControls
            isMuted={isMuted}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            isChatPanelOpen={isChatPanelOpen}
            onMuteToggle={handleMuteToggle}
            onVideoToggle={handleVideoToggle}
            onScreenShareToggle={handleScreenShareToggle}
            onEndCall={handleEndCall}
            onChatToggle={toggleChatPanel}
            hasCameraPermission={hasCameraPermission}
        />
      </main>
      {isChatPanelOpen && (
        <div className="w-full md:max-w-sm md:min-w-[320px] h-full flex flex-col">
           <ChatPanel
            messages={messages}
            smartReplies={smartReplySuggestions}
            isSmartRepliesLoading={isSmartRepliesLoading}
            currentMessage={currentMessage}
            onSendMessage={handleSendMessage}
            onSmartReplyClick={handleSmartReplyClick}
            setCurrentMessage={setCurrentMessage}
          />
        </div>
      )}
    </div>
  );
}
