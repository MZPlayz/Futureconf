
export type UserRoleType = {
  name: string;
  color: string; // Hex color code
  order?: number; // For potential future sorting/hierarchy
};

export interface Participant {
  id: string; // user_id
  name: string;
  avatar?: string;
  isHost?: boolean;
  isSpeaking?: boolean;
  isVideoEnabled?: boolean;
  isMuted?: boolean;
  isScreenSharing?: boolean;
  mediaStream?: MediaStream | null;
  dataAiHint?: string;
  isLocal?: boolean;
  role?: UserRoleType; // Updated to use UserRoleType
  status?: 'online' | 'offline' | 'idle'; // For presence
}

export interface ChatMessage {
  id:string;
  sender: string; // user's name or id
  text: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
}

export interface Meeting {
  id: string; // UUID from meetings table
  name: string;
  scheduled_at: Date;
  created_by: string; // User ID of creator
  status: "upcoming" | "ongoing" | "ended" | "cancelled";
  description?: string | null;
  participants?: MeetingParticipant[]; 
}

// This is for Supabase-specific participant data, potentially different from live Participant interface
export interface MeetingParticipant {
  user_id: string;
  name: string; 
  avatar_url?: string | null;
  role: "host" | "participant" | "moderator"; // Kept simple for meeting context
  joined_at: Date;
}
