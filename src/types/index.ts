
export type UserRole = "host" | "participant" | "moderator";

export interface Participant {
  id: string; // user_id
  name: string;
  avatar?: string;
  isHost?: boolean; // Consider deriving from role in MeetingParticipant
  isSpeaking?: boolean;
  isVideoEnabled?: boolean;
  isMuted?: boolean;
  isScreenSharing?: boolean;
  mediaStream?: MediaStream | null;
  dataAiHint?: string;
  isLocal?: boolean;
  role?: UserRole;
}

export interface ChatMessage {
  id: string;
  sender: string; // user's name or id
  text: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
}

export interface Meeting {
  id: string; // UUID from meetings table
  name: string;
  scheduled_at: Date; // Changed from string to Date
  created_by: string; // User ID of creator
  status: "upcoming" | "ongoing" | "ended" | "cancelled";
  description?: string | null;
  participants?: MeetingParticipant[]; // For detailed participant info including roles
}

export interface MeetingParticipant {
  user_id: string;
  name: string; // Fetched from profiles
  avatar_url?: string | null; // Fetched from profiles
  role: UserRole;
  joined_at: Date;
}
