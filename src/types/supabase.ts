
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // User ID from auth.users
          updated_at: string | null;
          username: string | null;
          first_name: string | null;
          last_name: string | null;
          full_name: string | null;
          avatar_url: string | null;
          // Add any other profile fields you need
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      meetings: {
        Row: {
          id: string; // UUID, primary key
          created_at: string;
          name: string;
          scheduled_at: string;
          created_by: string; // User ID from auth.users, foreign key to profiles.id
          status: "upcoming" | "ongoing" | "ended" | "cancelled";
          description: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          scheduled_at: string;
          created_by: string;
          status?: "upcoming" | "ongoing" | "ended" | "cancelled";
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          scheduled_at?: string;
          status?: "upcoming" | "ongoing" | "ended" | "cancelled";
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "meetings_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles"; 
            referencedColumns: ["id"];
          }
        ];
      };
      meeting_participants: {
        Row: {
          meeting_id: string; 
          user_id: string; 
          joined_at: string;
          // This role is specific to the meeting context (e.g. who is HOST of THIS meeting)
          // It can be different from a user's global roles.
          role: "host" | "participant" | "moderator"; 
        };
        Insert: {
          meeting_id: string;
          user_id: string;
          joined_at?: string;
          role?: "host" | "participant" | "moderator";
        };
        Update: {
          role?: "host" | "participant" | "moderator";
        };
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey";
            columns: ["meeting_id"];
            referencedRelation: "meetings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_participants_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles"; 
            referencedColumns: ["id"];
          }
        ];
      };
      // Conceptual: Table for global roles
      roles: {
        Row: {
          id: string; // UUID, primary key
          name: string;
          color: string; // Hex color string e.g., #FF0000
          permissions: Json | null; // JSONB for storing array of permission strings
          order: number | null; // For hierarchy
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          permissions?: Json | null;
          order?: number | null;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          permissions?: Json | null;
          order?: number | null;
        };
        Relationships: [];
      };
      // Conceptual: Join table for user global roles
      user_roles: {
        Row: {
          user_id: string; // Foreign key to auth.users.id or profiles.id
          role_id: string; // Foreign key to roles.id
        };
        Insert: {
          user_id: string;
          role_id: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_roles_role_id_fkey";
            columns: ["role_id"];
            referencedRelation: "roles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      // Example of how meeting_participant_role enum might be defined if used directly in DB
      // meeting_participant_role: "host" | "participant" | "moderator";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  }
}
// To generate types from your Supabase schema:
// 1. Install Supabase CLI: https://supabase.com/docs/guides/cli
// 2. Link your project: supabase link --project-ref YOUR_PROJECT_ID
// 3. Login: supabase login
// 4. Generate types: supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/supabase.ts
// Remember to replace YOUR_PROJECT_ID with your actual Supabase project ID.

