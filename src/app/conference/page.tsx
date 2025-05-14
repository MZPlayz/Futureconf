
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VideoGrid } from '@/components/conference/video-grid';
import { ConferenceControls } from '@/components/conference/conference-controls';
import { ChatPanel } from '@/components/chat/chat-panel';
import type { ChatMessage, Participant } from '@/types';
import { suggestReplies } from '@/ai/flows/suggest-replies';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RadioTower, Maximize, Zap, Settings2, Loader2, LogOut, Minimize, Moon, Sun, ChevronsLeftRight, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';


const initialParticipants: Participant[] = [];
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
  const [isAudioOnly, setIsAudioOnly] = useState(false); // New state for audio-only mode
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
  const [chatPanelWidth, setChatPanelWidth] = useState(300); 


  useEffect(() => {
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
        isHost: true, 
        isSpeaking: false, 
        dataAiHint: 'person happy',
        isLocal: true,
        isVideoEnabled: false, 
        isMuted: false, 
      };
      setParticipants(prev => {
        const existingLocal = prev.find(p => p.isLocal);
        if (existingLocal) {
          return prev.map(p => p.isLocal ? {...localParticipant, ...p } : p);
        }
        return [localParticipant, ...prev.filter(p => !p.isLocal)];
      });
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
            if (!isAudioOnly) setIsVideoEnabled(true); // Only enable video if not in audio-only
            setIsMuted(false); 
            setParticipants(prev => prev.map(p => p.isLocal ? {...p, isVideoEnabled: !isAudioOnly, isMuted: false } : p));
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
  }, [toast, user, isAudioOnly]); // Added isAudioOnly to dependencies


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
    if (!user || isAudioOnly) {
      if(isAudioOnly) {
        toast({ title: "Video Disabled", description: "Audio-only mode is active."});
      }
      return;
    }
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

  const handleAudioOnlyToggle = () => {
    if (!user) return;
    const newIsAudioOnly = !isAudioOnly;
    setIsAudioOnly(newIsAudioOnly);

    if (newIsAudioOnly) {
      // Turn off video if it's on
      if (isVideoEnabled && localCameraStream) {
        localCameraStream.getVideoTracks().forEach(track => track.enabled = false);
      }
      setIsVideoEnabled(false); // Explicitly set video to off
      setParticipants(prev => prev.map(p => p.isLocal ? { ...p, isVideoEnabled: false } : p));
      toast({ title: "Audio Only Mode Enabled", description: "Video has been turned off." });
    } else {
      // Turning off audio-only doesn't automatically turn video back on.
      // User needs to toggle video separately if desired.
      // isVideoEnabled state will retain its previous value before audio-only was turned on,
      // or remain false if it was already false.
      toast({ title: "Audio Only Mode Disabled", description: "You can now enable video if you wish." });
    }
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
                  // If video was enabled (and not in audio-only), re-enable camera video track
                  if (isVideoEnabled && localCameraStream && !isAudioOnly) { 
                     localCameraStream.getVideoTracks().forEach(track => track.enabled = true);
                  }
                  setParticipants(prev => prev.map(p => p.isLocal ? {...p, isScreenSharing: false} : p));
                  toast({ title: "Screen sharing stopped" });
              });
              setLocalScreenStream(stream);
              setIsScreenSharing(true);
              setScreenSharingParticipantId(youParticipant.id);
              // Disable camera video track if video was enabled (and not in audio-only)
              if (isVideoEnabled && localCameraStream && !isAudioOnly) { 
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
        // If video was enabled (and not in audio-only), re-enable camera video track
        if (isVideoEnabled && localCameraStream && !isAudioOnly) { 
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
    } else {
      toast({ title: 'Call Ended', description: 'You have left the meeting.' });
      router.push('/'); 
    }
    
    setMessages([]);
    setParticipants(prev => prev.filter(p => p.isLocal).map(p => ({
        ...p, 
        mediaStream: null, 
        isVideoEnabled: false, 
        isMuted: true, 
        isScreenSharing: false
    })));
    setIsVideoEnabled(false);
    setIsAudioOnly(false); // Reset audio-only mode
    setIsMuted(true); 
    setIsScreenSharing(false);
    setScreenSharingParticipantId(null);
    setHasCameraPermission(null); 
  };

  const processedParticipants = participants.map(p => {
    if (p.isLocal) {
        let mediaStreamToUse: MediaStream | null = null;
        const isCurrentlyScreenSharing = isScreenSharing && p.id === screenSharingParticipantId;
        // Video is enabled only if not in audio-only mode and video is toggled on
        const actualIsVideoEnabled = isVideoEnabled && !isAudioOnly;

        if (isCurrentlyScreenSharing && localScreenStream) {
            mediaStreamToUse = localScreenStream;
        } else if (actualIsVideoEnabled && localCameraStream) {
            mediaStreamToUse = localCameraStream;
        }
        
        return {
            ...p,
            isMuted: isMuted, 
            isVideoEnabled: isCurrentlyScreenSharing ? false : actualIsVideoEnabled, 
            mediaStream: mediaStreamToUse,
            isScreenSharing: isCurrentlyScreenSharing,
        };
    }
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
      if (newWidth < 200) newWidth = 200; 
      if (newWidth > window.innerWidth / 2) newWidth = window.innerWidth / 2; 
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
            isAudioOnly={isAudioOnly}
            onMuteToggle={handleMuteToggle}
            onVideoToggle={handleVideoToggle}
            onScreenShareToggle={handleScreenShareToggle}
            onEndCall={() => handleEndCall(false)}
            onChatToggle={toggleChatPanel}
            onAudioOnlyToggle={handleAudioOnlyToggle}
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
