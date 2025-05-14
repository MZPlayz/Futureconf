
'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { RadioTower, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const { user, signUpUser, signInWithGoogle, signInWithGitHub, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formLoading, setFormLoading] = React.useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); 
    }
  }, [user, authLoading, router]);

  const handleSignUp = async (data: { email: string; password: string }) => {
    setFormLoading(true);
    await signUpUser(data.email, data.password);
    // User might need to confirm email. 
    // AuthProvider toast already informs about email verification.
    setFormLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setFormLoading(true);
    await signInWithGoogle();
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-card/80 p-4">
       <div className="mb-6 flex flex-col items-center space-y-2">
        <RadioTower className="h-10 w-10 text-primary" /> {/* Adjusted size */}
        <h1 className="text-3xl font-bold text-foreground">FutureConf</h1>
      </div>
      <AuthForm 
        isSignUp 
        onSubmit={handleSignUp} 
        onGoogleSignIn={handleGoogleSignUp}
        onGitHubSignIn={handleGitHubSignUp} // Added
        loading={formLoading || authLoading} 
      />
    </div>
  );
}
