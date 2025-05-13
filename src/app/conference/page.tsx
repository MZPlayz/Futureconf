
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VideoGrid } from '@/components/conference/video-grid';
import { ConferenceControls } from '@/components/conference/conference-controls';
import { ChatPanel } from '@/components/chat/chat-panel';
import type { ChatMessage, Participant } from '@/types';
import { suggestReplies } from '@/ai/flows/suggest-replies';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RadioTower, Maximize, Zap, Settings2, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';


const initialParticipants: Participant[] = [
  { id: 'p1', name: 'Alice', avatar: 'https://picsum.photos/seed/alice-conf/200/200', isHost: true, isSpeaking: false, dataAiHint: 'woman smiling', isLocal: false },
  // You will be added dynamically based on auth user
  { id: 'p3', name: 'Bob', avatar: 'https://picsum.photos/seed/bob-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'man thinking', isLocal: false },
  { id: 'p4', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'person glasses', isLocal: false },
  { id: 'p5', name: 'Diana', avatar: 'https://picsum.photos/seed/diana-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'woman nature', isLocal: false },
];

const initialMessages: ChatMessage[] = [
  { id: '1', sender: 'Alice', text: 'Hey everyone, welcome to FutureConf!', timestamp: new Date(Date.now() - 1000 * 60 * 5), isOwn: false, avatar: 'https://picsum.photos/seed/alice-chat/40/40', },
  { id: '2', sender: 'Bob', text: 'Hi Alice! Glad to be here.', timestamp: new Date(Date.now() - 1000 * 60 * 4), isOwn: false, avatar: 'https://picsum.photos/seed/bob-chat/40/40' },
  // Your messages will be added dynamically
  { id: '4', sender: 'Charlie', text: 'Can everyone hear me okay?', timestamp: new Date(Date.now() - 1000 * 60 * 2), isOwn: false, avatar: 'https://picsum.photos/seed/charlie-chat/40/40' },
];

export default function FutureConfPage() {
  const { user, loading: authLoading, signOutUser } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [smartReplySuggestions, setSmartReplySuggestions] = useState<string[]>([]);
  const [isSmartRepliesLoading, setIsSmartRepliesLoading] = useState(false);
  
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false); 
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenSharingParticipantId, setScreenSharingParticipantId] = useState<string | null>(null);

  const [localCameraStream, setLocalCameraStream] = useState<MediaStream | null>(null);
  const [localScreenStream, setLocalScreenStream] = useState<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      const localParticipant: Participant = {
        id: user.id, 
        name: user.email?.split('@')[0] || 'You',
        avatar: `https://picsum.photos/seed/${user.id}/200/200`, 
        isHost: false,
        isSpeaking: true, 
        dataAiHint: 'person happy',
        isLocal: true,
        isVideoEnabled: false, 
        isMuted: false, 
      };
      setParticipants([localParticipant, ...initialParticipants.filter(p => !p.isLocal)]);
      
      setMessages(prev => {
        const userMessageExists = prev.some(m => m.sender === (user.email?.split('@')[0] || 'You'));
        if (!userMessageExists) {
          return [
            ...prev,
            { id: '3', sender: user.email?.split('@')[0] || 'You', text: 'Hello! Looking forward to this meeting.', timestamp: new Date(Date.now() - 1000 * 60 * 3), isOwn: true, avatar: `https://picsum.photos/seed/${user.id}/40/40` } 
          ].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
        }
        return prev;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };
  
  const handleLogout = async () => {
    await handleEndCall(true); 
  };

  useEffect(() => {
    let isMounted = true;
    const getCameraPermission = async () => {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && user) { 
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (isMounted) {
            setLocalCameraStream(stream);
            setHasCameraPermission(true);
            setIsVideoEnabled(true);
            setIsMuted(false); 
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
      } else if(user) { 
        if (isMounted) {
          setHasCameraPermission(false); 
          console.warn("navigator.mediaDevices is not available.")
        }
      }
    };

    if (user) { 
      getCameraPermission();
    }

    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => { 
      isMounted = false;
      if (localCameraStream) {
        localCameraStream.getTracks().forEach(track => track.stop());
      }
      if (localScreenStream) {
        localScreenStream.getTracks().forEach(track => track.stop());
      }
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, user]); 


  const handleSendMessage = useCallback((text: string) => {
    if (text.trim() === '' || !user) return;
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: user.email?.split('@')[0] || 'You',
      text,
      timestamp: new Date(),
      isOwn: true,
      avatar: `https://picsum.photos/seed/${user.id}/40/40`
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setCurrentMessage('');
  }, [user]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (messages.length === 0 || !isChatPanelOpen || !user) { 
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

    const timer = setTimeout(fetchSuggestions, 500); 
    return () => clearTimeout(timer);
  }, [messages, isChatPanelOpen, toast, user]); 

  const handleSmartReplyClick = (reply: string) => {
    setCurrentMessage(reply);
  };

  const toggleChatPanel = () => setIsChatPanelOpen(prev => !prev);

  const handleMuteToggle = () => {
    if (!user) return; 
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
    if (!user) return; 
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
        });
    }
    setIsVideoEnabled(newIsVideoEnabled);
    setParticipants(prev => prev.map(p => p.isLocal ? {...p, isVideoEnabled: newIsVideoEnabled} : p));
    toast({ title: `Video ${newIsVideoEnabled ? 'enabled' : 'disabled'}` });
  };
  
  const handleScreenShareToggle = async () => {
    if (!user) return; 
    const newIsScreenSharing = !isScreenSharing;
    const youParticipant = participants.find(p => p.isLocal);

    if (newIsScreenSharing) {
        if (!youParticipant) return;
        try {
            if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
              const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } });
              stream.getVideoTracks()[0].addEventListener('ended', () => { 
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

  const handleEndCall = async (isLoggingOut = false) => {
    localCameraStream?.getTracks().forEach(track => track.stop());
    localScreenStream?.getTracks().forEach(track => track.stop());
    setLocalCameraStream(null);
    setLocalScreenStream(null);
    
    if (isLoggingOut) {
      await signOutUser();
      // router.push('/login'); // onAuthStateChange will handle this
    } else {
      toast({ title: 'Call Ended', description: 'You have left the meeting.' });
      router.push('/'); 
    }
    
    setMessages([]);
    setParticipants(initialParticipants.map(p => {
      const baseParticipant = {...p, mediaStream: null, isVideoEnabled: false, isMuted: false, isScreenSharing: false};
      if (p.isLocal) {
        // This part might be cleared by onAuthStateChange if logging out
        return {...baseParticipant, isVideoEnabled: false, isMuted: true}; 
      }
      return baseParticipant;
    }));
    setIsVideoEnabled(false);
    setIsMuted(true); 
    setIsScreenSharing(false);
    setHasCameraPermission(null); 
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
    // Simulate other participants' video status 
    if(p.id === 'p1') return {...p, isVideoEnabled: true, mediaStream: null } 
    if(p.id === 'p3') return {...p, isVideoEnabled: false, mediaStream: null } 
    return {...p, mediaStream: null}; 
  });

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden antialiased">
      <main className="flex-1 flex flex-col relative">
        <header className="p-2 border-b border-border flex-shrink-0 bg-card/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 transition-colors w-7 h-7">
                  <RadioTower className="w-5 h-5" />
                </Button>
            </Link>
            <div className="w-px h-5 bg-border mx-1.5"></div>
            <h1 className="text-base font-semibold text-foreground tracking-tight">FutureConf</h1>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
            <span className="hidden sm:inline">{currentTime}</span>
            <TooltipProvider delayDuration={100}>
               <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-7 h-7">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>AI Features (Soon)</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-7 h-7">
                      <Settings2 className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>Settings (Soon)</p></TooltipContent>
                </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-7 h-7" onClick={toggleFullScreen}>
                    <Maximize className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleLogout()}>
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Logout</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>
        
        {hasCameraPermission === false && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 p-3 w-full max-w-sm">
              <Alert variant="destructive" className="rounded-md shadow-md">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Camera & Mic Access Denied</AlertTitle>
                  <AlertDescription className="text-xs">
                      FutureConf needs camera and microphone access. Please enable permissions and refresh.
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
            onEndCall={() => handleEndCall(false)}
            onChatToggle={toggleChatPanel}
            hasCameraPermission={hasCameraPermission}
        />
      </main>
      {isChatPanelOpen && (
        <div className="w-full md:w-[280px] lg:w-[300px] xl:w-[320px] h-full flex flex-col border-l border-border bg-card/60 backdrop-blur-sm shadow-lg md:shadow-none">
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
