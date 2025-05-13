export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
  isSpeaking?: boolean;
  isVideoEnabled?: boolean;
  isMuted?: boolean;
  isScreenSharing?: boolean;
  dataAiHint?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
}