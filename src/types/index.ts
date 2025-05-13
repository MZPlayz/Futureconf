export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
  isSpeaking?: boolean;
  isVideoEnabled?: boolean; // For camera status
  isMuted?: boolean;
  isScreenSharing?: boolean; // True if this participant is actively sharing their screen in the main view
  mediaStream?: MediaStream | null; // Can be camera or screen share stream
  dataAiHint?: string;
  isLocal?: boolean; // To identify the current user
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
}
