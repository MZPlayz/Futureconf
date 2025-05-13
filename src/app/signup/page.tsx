
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
      router.push('/');
    }
    setFormLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setFormLoading(true);
    const signedUpUser = await signInWithGoogle();
    if (signedUpUser) {
      router.push('/');
    }
    setFormLoading(false);
  };
  
  if (authLoading || (!authLoading && user && !formLoading)) { // Check formLoading to prevent flicker
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
        isSignUp 
        onSubmit={handleSignUp} 
        onGoogleSignIn={handleGoogleSignUp}
        loading={formLoading || authLoading} 
      />
    </div>
  );
}
