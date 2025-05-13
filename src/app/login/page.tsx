
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
      // router.push('/'); // onAuthStateChange will trigger redirect via useEffect
    }
    setFormLoading(false);
  };

  const handleGoogleLogin = async () => {
    setFormLoading(true);
    await signInWithGoogle();
    // OAuth redirects, so no direct user object or push here.
    // setLoading(false) might not be reached if redirect is successful.
    setFormLoading(false); // In case of error before redirect
  };

  if (authLoading || (!authLoading && user && !formLoading) ) { 
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" /> {/* Reduced size */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-card p-4">
      <div className="mb-4 flex items-center space-x-2">  {/* Reduced mb */}
        <RadioTower className="h-7 w-7 text-primary" />  {/* Reduced size */}
        <h1 className="text-2xl font-bold text-foreground">FutureConf</h1>  {/* Reduced size */}
      </div>
      <AuthForm 
        onSubmit={handleLogin} 
        onGoogleSignIn={handleGoogleLogin}
        loading={formLoading || authLoading} 
      />
    </div>
  );
}
