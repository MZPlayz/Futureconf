import { Button } from '@/components/ui/button';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  PanelRightOpen,
  PanelRightClose,
  ScreenShareOff,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConferenceControlsProps {
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isChatPanelOpen: boolean;
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  onScreenShareToggle: () => void;
  onEndCall: () => void;
  onChatToggle: () => void;
  hasCameraPermission: boolean | null;
}

export function ConferenceControls({
  isMuted,
  isVideoEnabled,
  isScreenSharing,
  isChatPanelOpen,
  onMuteToggle,
  onVideoToggle,
  onScreenShareToggle,
  onEndCall,
  onChatToggle,
  hasCameraPermission,
}: ConferenceControlsProps) {
  const controlButtonClass = "rounded-full w-11 h-11 p-2.5 transition-colors duration-150 ease-in-out";
  const activeControlButtonClass = "bg-primary/20 text-primary hover:bg-primary/30";
  const permissionDenied = hasCameraPermission === false;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex justify-center items-center space-x-2 md:space-x-3 p-3 bg-card border-t border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              onClick={onMuteToggle}
              className={`${controlButtonClass} ${isMuted ? 'bg-destructive/80 hover:bg-destructive text-destructive-foreground' : 'hover:bg-muted'}`}
              aria-label={isMuted ? "Unmute" : "Mute"}
              disabled={permissionDenied}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{permissionDenied ? "Mic disabled" : (isMuted ? "Unmute" : "Mute")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={!isVideoEnabled ? "destructive" : "outline"}
              size="icon"
              onClick={onVideoToggle}
              className={`${controlButtonClass} ${!isVideoEnabled ? 'bg-destructive/80 hover:bg-destructive text-destructive-foreground' : 'hover:bg-muted'}`}
              aria-label={isVideoEnabled ? "Stop Video" : "Start Video"}
              disabled={permissionDenied}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{permissionDenied ? "Video disabled" : (isVideoEnabled ? "Stop Video" : "Start Video")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onScreenShareToggle}
              className={`${controlButtonClass} ${isScreenSharing ? activeControlButtonClass : 'hover:bg-muted'}`}
              aria-label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
            >
              {isScreenSharing ? <ScreenShareOff className="w-5 h-5 text-primary" /> : <ScreenShare className="w-5 h-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onChatToggle}
              className={`${controlButtonClass} ${isChatPanelOpen ? activeControlButtonClass : 'hover:bg-muted'}`}
              aria-label={isChatPanelOpen ? "Close Chat" : "Open Chat"}
            >
              {isChatPanelOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isChatPanelOpen ? "Hide Chat" : "Show Chat"}</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={onEndCall}
              className={`${controlButtonClass} bg-red-600 hover:bg-red-700 text-white`}
              aria-label="End Call"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>End Call</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
