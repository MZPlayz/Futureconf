
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioTower, Video, Users, Settings, Sparkles, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading, signOutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOutUser();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground antialiased">
      <header className="p-4 border-b border-border flex-shrink-0 bg-card shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <RadioTower className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">
              FutureConf <span className="font-light text-primary/90">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/conference" passHref>
              <Button variant="outline" className="font-medium rounded-md">
                <Video className="mr-2 h-4 w-4" />
                Join Conference
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="font-medium rounded-md text-muted-foreground hover:text-primary">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back, {user.email}!</h2>
            <p className="text-muted-foreground">Here's an overview of your FutureConf space.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card className="rounded-lg border-border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                  New Meeting
                </CardTitle>
                <Video className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Launch a new video conference instantly.
                </p>
                <Link href="/conference" passHref>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-md">
                    <Video className="mr-2 h-5 w-5" /> Start Meeting
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                  Participants Hub
                </CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage contacts and view participant history (coming soon).
                </p>
                 <Button variant="outline" className="w-full font-medium py-3 rounded-md" disabled>
                  <Users className="mr-2 h-5 w-5" /> View Participants
                </Button>
              </CardContent>
            </Card>
            
            <Card className="rounded-lg border-border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                  Account Settings
                </CardTitle>
                <Settings className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure your profile and application preferences.
                </p>
                <Button variant="outline" className="w-full font-medium py-3 rounded-md" disabled>
                  <Settings className="mr-2 h-5 w-5" /> Go to Settings
                </Button>
              </CardContent>
            </Card>

             <Card className="rounded-lg border-border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                  Explore Features
                </CardTitle>
                <Sparkles className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover new tools and upcoming enhancements.
                </p>
                 <Button variant="outline" className="w-full font-medium py-3 rounded-md" disabled>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card className="rounded-lg border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">Activity Feed</CardTitle>
                <CardDescription>Recent activities and notifications (placeholder).</CardDescription>
              </CardHeader>
              <CardContent className="h-32 flex items-center justify-center">
                <p className="text-muted-foreground">No recent activity.</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
