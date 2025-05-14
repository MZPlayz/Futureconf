
'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { RadioTower, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, signInUser, signInWithGoogle, signInWithGitHub, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formLoading, setFormLoading] = React.useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); 
    }
  }, [user, authLoading, router]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setFormLoading(true);
    await signInUser(data.email, data.password);
    setFormLoading(false);
  };

  const handleGoogleLogin = async () => {
    setFormLoading(true);
    await signInWithGoogle();
    setFormLoading(false); 
  };

  const handleGitHubLogin = async () => {
    setFormLoading(true);
    await signInWithGitHub();
    setFormLoading(false);
  };

  if (authLoading || (!authLoading && user && !formLoading) ) { 
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background p-4"> {/* Changed background */}
      <div className="mb-8 flex flex-col items-center space-y-2"> {/* Increased mb */}
        <RadioTower className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">FutureConf</h1>
      </div>
      <AuthForm 
        onSubmit={handleLogin} 
        onGoogleSignIn={handleGoogleLogin}
        onGitHubSignIn={handleGitHubLogin}
        loading={formLoading || authLoading} 
      />
    </div>
  );
}
