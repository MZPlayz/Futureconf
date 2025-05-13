
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Define your tables here, e.g.:
      // profiles: {
      //   Row: {
      //     id: string
      //     updated_at: string | null
      //     username: string | null
      //     avatar_url: string | null
      //     website: string | null
      //   }
      //   Insert: {
      //     id: string
      //     updated_at?: string | null
      //     username?: string | null
      //     avatar_url?: string | null
      //     website?: string | null
      //   }
      //   Update: {
      //     id?: string
      //     updated_at?: string | null
      //     username?: string | null
      //     avatar_url?: string | null
      //     website?: string | null
      //   }
      //   Relationships: [
      //     {
      //       foreignKeyName: "profiles_id_fkey"
      //       columns: ["id"]
      //       referencedRelation: "users"
      //       referencedColumns: ["id"]
      //     }
      //   ]
      // }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
// To generate types from your Supabase schema:
// 1. Install Supabase CLI: https://supabase.com/docs/guides/cli
// 2. Link your project: supabase link --project-ref YOUR_PROJECT_ID
// 3. Generate types: supabase gen types typescript --linked > src/types/supabase.ts
// Remember to replace YOUR_PROJECT_ID with your actual Supabase project ID.
