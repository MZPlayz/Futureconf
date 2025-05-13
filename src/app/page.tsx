
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    // router.push('/login'); // onAuthStateChange will trigger redirect
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground antialiased">
      <header className="p-3 border-b border-border flex-shrink-0 bg-card shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <RadioTower className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">
              FutureConf <span className="font-light text-primary/90">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/conference" passHref>
              <Button variant="outline" size="sm" className="rounded-md">
                <Video className="mr-1.5 h-4 w-4" />
                Join Conference
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-md text-muted-foreground hover:text-primary">
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back, {user.email?.split('@')[0]}!</h2>
            <p className="text-sm text-muted-foreground">Here's an overview of your FutureConf space.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card className="rounded-md border-border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                <CardTitle className="text-sm font-semibold text-foreground">
                  New Meeting
                </CardTitle>
                <Video className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  Launch a new video conference instantly.
                </p>
                <Link href="/conference" passHref>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-md">
                    <Video className="mr-2 h-4 w-4" /> Start Meeting
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="rounded-md border-border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Participants Hub
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  Manage contacts and view participant history (soon).
                </p>
                 <Button variant="outline" size="sm" className="w-full py-2 rounded-md" disabled>
                  <Users className="mr-2 h-4 w-4" /> View Participants
                </Button>
              </CardContent>
            </Card>
            
            <Card className="rounded-md border-border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Account Settings
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  Configure your profile and application preferences.
                </p>
                <Button variant="outline" size="sm" className="w-full py-2 rounded-md" disabled>
                  <Settings className="mr-2 h-4 w-4" /> Go to Settings
                </Button>
              </CardContent>
            </Card>

             <Card className="rounded-md border-border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Explore Features
                </CardTitle>
                <Sparkles className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  Discover new tools and upcoming enhancements.
                </p>
                 <Button variant="outline" size="sm" className="w-full py-2 rounded-md" disabled>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <Card className="rounded-md border-border shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold text-foreground">Activity Feed</CardTitle>
                <CardDescription className="text-xs">Recent activities and notifications (placeholder).</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 h-28 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
