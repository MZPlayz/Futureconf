
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
  Headphones, // Added for Audio Only
  EarOff, // Alternative for Audio Only Off, or keep Headphones
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConferenceControlsProps {
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isChatPanelOpen: boolean;
  isAudioOnly: boolean; // Added
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  onScreenShareToggle: () => void;
  onEndCall: () => void;
  onChatToggle: () => void;
  onAudioOnlyToggle: () => void; // Added
  hasCameraPermission: boolean | null;
}

export function ConferenceControls({
  isMuted,
  isVideoEnabled,
  isScreenSharing,
  isChatPanelOpen,
  isAudioOnly, // Added
  onMuteToggle,
  onVideoToggle,
  onScreenShareToggle,
  onEndCall,
  onChatToggle,
  onAudioOnlyToggle, // Added
  hasCameraPermission,
}: ConferenceControlsProps) {
  const controlButtonClass = "rounded-full w-10 h-10 p-2 transition-colors duration-150 ease-in-out";
  const activeControlButtonClass = "bg-primary/20 text-primary hover:bg-primary/30";
  const permissionDenied = hasCameraPermission === false;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex justify-center items-center space-x-1.5 md:space-x-2 p-2 bg-card border-t border-border">
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
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{permissionDenied ? "Mic disabled" : (isMuted ? "Unmute" : "Mute")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={!isVideoEnabled || isAudioOnly ? "destructive" : "outline"}
              size="icon"
              onClick={onVideoToggle}
              className={`${controlButtonClass} ${(!isVideoEnabled || isAudioOnly) ? 'bg-destructive/80 hover:bg-destructive text-destructive-foreground' : 'hover:bg-muted'}`}
              aria-label={isVideoEnabled && !isAudioOnly ? "Stop Video" : "Start Video"}
              disabled={permissionDenied || isAudioOnly}
            >
              {(isVideoEnabled && !isAudioOnly) ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{permissionDenied ? "Video disabled" : isAudioOnly ? "Video off (Audio Only)" : (isVideoEnabled ? "Stop Video" : "Start Video")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onAudioOnlyToggle}
              className={`${controlButtonClass} ${isAudioOnly ? activeControlButtonClass : 'hover:bg-muted'}`}
              aria-label={isAudioOnly ? "Disable Audio Only" : "Enable Audio Only"}
              disabled={permissionDenied} // Mic permission is still relevant
            >
              {isAudioOnly ? <EarOff className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isAudioOnly ? "Switch to Video & Audio" : "Switch to Audio Only"}</p>
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
              {isScreenSharing ? <ScreenShareOff className="w-4 h-4 text-primary" /> : <ScreenShare className="w-4 h-4" />}
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
              {isChatPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
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
              <PhoneOff className="w-4 h-4" />
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
