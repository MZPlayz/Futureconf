
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, AuthError as SupabaseAuthError, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  error: SupabaseAuthError | null;
  signUpUser: (email: string, password: string) => Promise<SupabaseUser | null>;
  signInUser: (email: string, password: string) => Promise<SupabaseUser | null>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>; // Added GitHub
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<SupabaseAuthError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUpUser = async (email: string, password: string): Promise<SupabaseUser | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      
      toast({ 
        title: 'Account Created', 
        description: 'Please check your email to verify your account before logging in.' 
      });
      return data.user;
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
      toast({ title: 'Signed In', description: 'Successfully signed in!' });
      return data.user;
    } catch (err) {
      setError(err as SupabaseAuthError);
      if ((err as SupabaseAuthError).message !== 'Email not confirmed' && !(err as SupabaseAuthError).message.includes('Invalid login credentials')) {
      } else if ((err as SupabaseAuthError).message.includes('Invalid login credentials')) {
        toast({ variant: 'destructive', title: 'Sign In Error', description: 'Invalid login credentials.' });
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
    } catch (err) {
      setError(err as SupabaseAuthError);
      toast({ variant: 'destructive', title: 'Google Sign In Error', description: (err as SupabaseAuthError).message });
    } finally {
      // setLoading(false) is handled by onAuthStateChange
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
    } finally {
      // setLoading(false) is handled by onAuthStateChange
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
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
    loading,
    error,
    signUpUser,
    signInUser,
    signOutUser,
    signInWithGoogle,
    signInWithGitHub, // Added
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
