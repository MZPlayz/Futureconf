
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, AuthError as SupabaseAuthError, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface SignUpUserDetails {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}
interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: SupabaseAuthError | null;
  signUpUser: (details: SignUpUserDetails) => Promise<SupabaseUser | null>;
  signInUser: (email: string, password: string) => Promise<SupabaseUser | null>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<SupabaseAuthError | null>(null);
  const { toast } = useToast();

  const fetchProfileForUser = async (currentUser: SupabaseUser) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') { // "JSON object requested, multiple (or no) rows returned"
          // This means .single() found 0 or >1 rows.
          // If 0 rows, it's often a user who exists in auth.users but not in profiles.
          // This is not a critical app error if the app can handle null profiles.
          console.warn(`Profile fetch issue for user ${currentUser.id}: ${profileError.message}. This is expected if no profile exists or if there are multiple (which indicates a data issue).`);
          setProfile(null); // Ensure profile is null
        } else if (profileError.message.includes('relation "public.profiles" does not exist')) {
          console.error('Database setup error: "profiles" table does not exist.', profileError);
          toast({
            variant: 'destructive',
            title: 'Database Setup Incomplete',
            description: 'The "profiles" table is missing. Please ensure it has been created in your Supabase dashboard.',
          });
          setProfile(null);
        } else {
          // For other, unexpected Supabase errors during profile fetch
          console.error('Supabase error fetching profile:', profileError);
          toast({
            variant: 'destructive',
            title: 'Profile Load Error',
            description: `Could not load profile: ${profileError.message}`,
          });
          setProfile(null);
        }
      } else {
        // Success, userProfile might be null if the query somehow succeeded but returned null 
        // (though .single() should error before this if no row is found), or it contains the profile data.
        setProfile(userProfile || null);
      }
    } catch (e) {
      // Catch any other unexpected errors during the fetch process
      console.error('Unexpected error in fetchProfileForUser:', e);
      toast({
        variant: 'destructive',
        title: 'Application Error',
        description: 'An unexpected error occurred while trying to load user profile.',
      });
      setProfile(null);
    }
  };


  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setError(sessionError);
        setLoading(false);
        return;
      }
      
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfileForUser(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setLoading(true); 
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfileForUser(currentUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUpUser = async ({ email, password, firstName, lastName, username }: SignUpUserDetails): Promise<SupabaseUser | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: authData.user.id, 
            first_name: firstName,
            last_name: lastName,
            username: username,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating/updating profile:', profileError);
          if (profileError.message.includes('relation "public.profiles" does not exist')) {
             toast({ 
                variant: 'destructive', 
                title: 'Database Setup Incomplete', 
                description: 'Account created, but profile cannot be saved. The "profiles" table is missing.' 
              });
          } else {
            toast({ 
              variant: 'destructive', 
              title: 'Profile Creation Error', 
              description: 'Your account was created, but profile details could not be saved: ' + profileError.message 
            });
          }
        } else {
          toast({ 
            title: 'Account Created', 
            description: 'Please check your email to verify your account before logging in.' 
          });
          setProfile({ // Optimistically set profile
            id: authData.user.id,
            first_name: firstName || null,
            last_name: lastName || null,
            username: username || null,
            updated_at: new Date().toISOString(),
            avatar_url: null, 
            full_name: null,
          });
        }
        return authData.user;
      }
      return null;
    } catch (err) {
      setError(err as SupabaseAuthError);
      toast({ variant: 'destructive', title: 'Sign Up Error', description: (err as SupabaseAuthError).message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email: string, password: string): Promise<SupabaseUser | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        if (signInError.message === 'Email not confirmed') {
           toast({ variant: 'destructive', title: 'Sign In Error', description: 'Please verify your email address before logging in. Check your inbox for a verification link.' });
        } else {
          toast({ variant: 'destructive', title: 'Sign In Error', description: signInError.message });
        }
        throw signInError;
      }
      if (data.user) {
        await fetchProfileForUser(data.user); 
      }
      toast({ title: 'Signed In', description: 'Successfully signed in!' });
      return data.user;
    } catch (err) {
      setError(err as SupabaseAuthError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err as SupabaseAuthError);
      toast({ variant: 'destructive', title: 'Google Sign In Error', description: (err as SupabaseAuthError).message });
    }
  };

  const signInWithGitHub = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err as SupabaseAuthError);
      toast({ variant: 'destructive', title: 'GitHub Sign In Error', description: (err as SupabaseAuthError).message });
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null); 
      setSession(null); 
      setProfile(null); 
      toast({ title: 'Signed Out', description: 'Successfully signed out.' });
    } catch (err) {
      setError(err as SupabaseAuthError);
      toast({ variant: 'destructive', title: 'Sign Out Error', description: (err as SupabaseAuthError).message });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    signUpUser,
    signInUser,
    signOutUser,
    signInWithGoogle,
    signInWithGitHub,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
    
