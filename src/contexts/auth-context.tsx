
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import type { User, AuthError } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signUpUser: (email: string, password: string) => Promise<User | null>;
  signInUser: (email: string, password: string) => Promise<User | null>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUpUser = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      toast({ title: 'Account Created', description: 'Successfully signed up!' });
      return userCredential.user;
    } catch (err) {
      setError(err as AuthError);
      toast({ variant: 'destructive', title: 'Sign Up Error', description: (err as AuthError).message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      toast({ title: 'Signed In', description: 'Successfully signed in!' });
      return userCredential.user;
    } catch (err) {
      setError(err as AuthError);
      toast({ variant: 'destructive', title: 'Sign In Error', description: (err as AuthError).message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setUser(userCredential.user);
      toast({ title: 'Signed In with Google', description: 'Successfully signed in!' });
      return userCredential.user;
    } catch (err) {
      setError(err as AuthError);
      toast({ variant: 'destructive', title: 'Google Sign In Error', description: (err as AuthError).message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      toast({ title: 'Signed Out', description: 'Successfully signed out.' });
    } catch (err) {
      setError(err as AuthError);
      toast({ variant: 'destructive', title: 'Sign Out Error', description: (err as AuthError).message });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signUpUser,
    signInUser,
    signOutUser,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

