
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
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
      if (profileError.message.includes('relation "public.profiles" does not exist')) {
        toast({
          variant: 'destructive',
          title: 'Database Setup Incomplete',
          description: 'The "profiles" table is missing. Please create it in your Supabase dashboard.',
        });
      } else {
        // Generic error for other profile fetching issues
        // toast({ variant: 'destructive', title: 'Profile Error', description: 'Could not load your profile data.' });
      }
    }
    setProfile(userProfile || null); // Ensure profile is null if userProfile is undefined/null
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
        setLoading(true); // Set loading true while auth state changes and profile is fetched
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
          // Optimistically set profile here, actual fetch will happen on auth state change
          setProfile({
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
      // Profile will be fetched by onAuthStateChange or initial load
      if (data.user) {
        await fetchProfileForUser(data.user); // Fetch profile immediately after sign-in
      }
      toast({ title: 'Signed In', description: 'Successfully signed in!' });
      return data.user;
    } catch (err) {
      setError(err as SupabaseAuthError);
      if ((err as SupabaseAuthError).message !== 'Email not confirmed' && !(err as SupabaseAuthError).message.includes('Invalid login credentials')) {
         // Error already handled by toast inside the try block or generic toast if desired
      } else if ((err as SupabaseAuthError).message.includes('Invalid login credentials')) {
        // This specific message is already handled by toast inside try block
      }
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
      // Profile fetching will be handled by onAuthStateChange
    } catch (err) {
      setError(err as SupabaseAuthError);
      toast({ variant: 'destructive', title: 'Google Sign In Error', description: (err as SupabaseAuthError).message });
    } finally {
      // setLoading(false) is handled by onAuthStateChange or initial fetch
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
      // Profile fetching will be handled by onAuthStateChange
    } catch (err) {
      setError(err as SupabaseAuthError);
      toast({ variant: 'destructive', title: 'GitHub Sign In Error', description: (err as SupabaseAuthError).message });
    } finally {
      // setLoading(false) is handled by onAuthStateChange or initial fetch
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null); // Explicitly set user to null
      setSession(null); // Explicitly set session to null
      setProfile(null); // Clear profile on sign out
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
    