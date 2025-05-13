
'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { RadioTower, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, signInUser, signInWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formLoading, setFormLoading] = React.useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); // Redirect to dashboard if logged in
    }
  }, [user, authLoading, router]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setFormLoading(true);
    const loggedInUser = await signInUser(data.email, data.password);
    if (loggedInUser) {
      router.push('/');
    }
    setFormLoading(false);
  };

  const handleGoogleLogin = async () => {
    setFormLoading(true);
    const loggedInUser = await signInWithGoogle();
    if (loggedInUser) {
      router.push('/');
    }
    setFormLoading(false);
  };

  if (authLoading || (!authLoading && user && !formLoading) ) { // Check formLoading to prevent flicker if auth is fast
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-card p-4">
      <div className="mb-6 flex items-center space-x-2"> {/* Reduced mb, space-x */}
        <RadioTower className="h-8 w-8 text-primary" /> {/* Reduced size */}
        <h1 className="text-3xl font-bold text-foreground">FutureConf</h1> {/* Reduced size */}
      </div>
      <AuthForm 
        onSubmit={handleLogin} 
        onGoogleSignIn={handleGoogleLogin}
        loading={formLoading || authLoading} 
      />
    </div>
  );
}
