
'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { RadioTower, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const { user, signUpUser, signInWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formLoading, setFormLoading] = React.useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); // Redirect to dashboard if logged in
    }
  }, [user, authLoading, router]);

  const handleSignUp = async (data: { email: string; password: string }) => {
    setFormLoading(true);
    const signedUpUser = await signUpUser(data.email, data.password);
    if (signedUpUser) {
      // For Supabase, user might need to confirm email.
      // Redirecting to login or a "check your email" page might be better.
      // For now, if a user object is returned (even if not fully active),
      // the useEffect above will handle redirection if session gets established.
      // router.push('/'); // Or router.push('/login');
    }
    setFormLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setFormLoading(true);
    await signInWithGoogle();
    // OAuth redirects, so no direct user object or push here.
    setFormLoading(false); // In case of error before redirect
  };
  
  if (authLoading || (!authLoading && user && !formLoading)) { 
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-card p-4">
       <div className="mb-3 flex items-center space-x-1.5">
        <RadioTower className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">FutureConf</h1>
      </div>
      <AuthForm 
        isSignUp 
        onSubmit={handleSignUp} 
        onGoogleSignIn={handleGoogleSignUp}
        loading={formLoading || authLoading} 
      />
    </div>
  );
}
