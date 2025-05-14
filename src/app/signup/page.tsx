
'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { RadioTower, Loader2 } from 'lucide-react';

// Matches the FormData type in AuthForm for signup
interface SignUpPageFormData {
  email: string;
  password: string;
  firstName?: string; // Now optional here, as AuthForm will handle it
  lastName?: string;
  username?: string;
}

export default function SignUpPage() {
  const { user, signUpUser, signInWithGoogle, signInWithGitHub, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formLoading, setFormLoading] = React.useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); 
    }
  }, [user, authLoading, router]);

  const handleSignUp = async (data: SignUpPageFormData) => {
    setFormLoading(true);
    // Ensure all required fields for signUpUser are passed
    await signUpUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName || '', // Provide default if not present, though Zod should ensure they are
      lastName: data.lastName || '',
      username: data.username || '',
    });
    setFormLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setFormLoading(true);
    await signInWithGoogle();
    // For OAuth, profile creation would ideally happen after redirect if new user
    // or be handled by Supabase triggers/functions if possible.
    // For this iteration, manual profile creation post-OAuth is not implemented here.
    setFormLoading(false); 
  };

  const handleGitHubSignUp = async () => {
    setFormLoading(true);
    await signInWithGitHub();
    setFormLoading(false);
  };
  
  if (authLoading || (!authLoading && user && !formLoading)) { 
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background p-4">
       <div className="mb-8 flex flex-col items-center space-y-2">
        <RadioTower className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">FutureConf</h1>
      </div>
      <AuthForm 
        isSignUp 
        onSubmit={handleSignUp as any} // Cast to any to satisfy AuthForm's generic FormData type
        onGoogleSignIn={handleGoogleSignUp}
        onGitHubSignIn={handleGitHubSignUp}
        loading={formLoading || authLoading} 
      />
    </div>
  );
}
