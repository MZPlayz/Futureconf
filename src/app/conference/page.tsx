
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VideoGrid } from '@/components/conference/video-grid';
import { ConferenceControls } from '@/components/conference/conference-controls';
import { ChatPanel } from '@/components/chat/chat-panel';
import type { ChatMessage, Participant } from '@/types';
import { suggestReplies } from '@/ai/flows/suggest-replies';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RadioTower, Maximize, Zap, Settings2, Loader2, LogOut, Minimize, Moon, Sun, GripVertical, ChevronsLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';


// No initial participants, they will be added dynamically or it's just the local user.
const initialParticipants: Participant[] = [];

// No initial messages, chat starts empty.
const initialMessages: ChatMessage[] = [];

export default function FutureConfPage() {
  const { user, loading: authLoading, signOutUser } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [smartReplySuggestions, setSmartReplySuggestions] = useState<string[]>([]);
  const [isSmartRepliesLoading, setIsSmartRepliesLoading] = useState(false);
  
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  
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
  const [theme, setTheme] = useState('dark');

  const [isResizing, setIsResizing] = useState(false);
  const [chatPanelWidth, setChatPanelWidth] = useState(300); // Initial width


  useEffect(() => {
    // Theme management
    const storedTheme = localStorage.getItem('futureconf-theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('futureconf-theme', newTheme);
  };


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      const localParticipant: Participant = {
        id: user.id, 
        name: user.email?.split('@')[0] || 'You',
        avatar: `https://picsum.photos/seed/${user.id}/200/200`, 
        isHost: true, // The first user to join/create a meeting can be host
        isSpeaking: false, 
        dataAiHint: 'person happy',
        isLocal: true,
        isVideoEnabled: false, 
        isMuted: false, 
      };
      // If participants list is empty (e.g. from initialParticipants), add the local user.
      // If it already contains participants (e.g. due to re-render or other logic), ensure local user is primary.
      setParticipants(prev => {
        const existingLocal = prev.find(p => p.isLocal);
        if (existingLocal) {
          return prev.map(p => p.isLocal ? {...localParticipant, ...p } : p); // Update existing local
        }
        return [localParticipant, ...prev.filter(p => !p.isLocal)]; // Add new local
      });
      
      // Messages should start empty for a new meeting
      setMessages([]); 
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
    
    setMessages([]); // Clear messages on end call
    setParticipants(prev => prev.filter(p => p.isLocal).map(p => ({ // Keep only local, reset state
        ...p, 
        mediaStream: null, 
        isVideoEnabled: false, 
        isMuted: true, // Mute local user on end call
        isScreenSharing: false
    })));
    setIsVideoEnabled(false);
    setIsMuted(true); 
    setIsScreenSharing(false);
    setScreenSharingParticipantId(null);
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
    // For non-local participants, their state (isVideoEnabled, mediaStream) would
    // typically be managed by a signaling server in a real application.
    // Since we removed initialParticipants, this map will mainly process the local user.
    // If other participants were to be added via a backend, their properties would be set there.
    return {...p, mediaStream: null}; 
  });

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true);
    mouseDownEvent.preventDefault();
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      let newWidth = window.innerWidth - mouseMoveEvent.clientX;
      if (newWidth < 200) newWidth = 200; // Min width
      if (newWidth > window.innerWidth / 2) newWidth = window.innerWidth / 2; // Max width
      setChatPanelWidth(newWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    if(isResizing){
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
    }
    return () => {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden antialiased">
      <main className="flex-1 flex flex-col relative">
         <header className="p-1 border-b border-border flex-shrink-0 bg-card/80 backdrop-blur-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-1.5">
            <Link href="/" passHref>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 transition-colors w-6 h-6 rounded-sm">
                      <RadioTower className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs"><p>Dashboard</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-xs font-semibold text-foreground tracking-tight">FutureConf Meeting</h1>
          </div>
          
          <div className="flex items-center space-x-0.5 text-xs text-muted-foreground">
            <span className="hidden sm:inline px-1.5 py-0.5 bg-muted rounded-sm text-[10px]">{currentTime}</span>
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="w-6 h-6 rounded-sm" onClick={toggleTheme}>
                       {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs"><p>Toggle Theme</p></TooltipContent>
                </Tooltip>

               <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-6 h-6 rounded-sm">
                      <Zap className="w-3 h-3 text-yellow-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs"><p>AI Features (Soon)</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-6 h-6 rounded-sm">
                      <Settings2 className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs"><p>Settings (Soon)</p></TooltipContent>
                </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-6 h-6 rounded-sm" onClick={toggleFullScreen}>
                    {isFullScreen ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p>{isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</p>
                </TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-4 mx-0.5" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-6 h-6 text-red-500 hover:text-red-600 rounded-sm" onClick={() => handleLogout()}>
                    <LogOut className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs"><p>Logout</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>
        
        {hasCameraPermission === false && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 p-2 w-full max-w-md">
              <Alert variant="destructive" className="rounded-md shadow-lg text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  <AlertTitle className="text-xs font-semibold">Camera & Mic Access Denied</AlertTitle>
                  <AlertDescription className="text-[11px]">
                      FutureConf needs camera and microphone access. Please enable permissions in your browser settings and refresh the page.
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
        <>
        <div 
            onMouseDown={startResizing}
            className={cn(
                "hidden md:flex items-center justify-center w-2.5 cursor-col-resize group hover:bg-primary/20 transition-colors duration-150",
                isResizing && "bg-primary/30"
            )}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize chat panel"
        >
            <ChevronsLeftRight className={cn("h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors", isResizing && "text-primary")} />
        </div>
        <div 
          className="h-full flex flex-col border-l border-border bg-card/50 backdrop-blur-md shadow-xl md:shadow-lg"
          style={{ width: `${chatPanelWidth}px`}}
        >
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
        </>
      )}
    </div>
  );
}

