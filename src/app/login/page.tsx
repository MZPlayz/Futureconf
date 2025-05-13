
'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { RadioTower, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, signInUser, loading: authLoading } = useAuth();
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

  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-card p-4">
      <div className="mb-8 flex items-center space-x-3">
        <RadioTower className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">FutureConf</h1>
      </div>
      <AuthForm onSubmit={handleLogin} loading={formLoading || authLoading} />
    </div>
  );
}
