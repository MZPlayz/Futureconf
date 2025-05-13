
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioTower, Video, Users, Settings, Sparkles, LogOut, Loader2, ArrowDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import GridBackground from '@/components/ui/grid-background';

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
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-foreground antialiased">
      <header className="p-2.5 border-b border-border flex-shrink-0 bg-card/80 shadow-sm sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
          <div className="flex items-center space-x-1.5">
            <RadioTower className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              FutureConf <span className="font-light text-primary/90">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/conference" passHref>
              <Button variant="outline" size="sm" className="rounded-md text-xs">
                <Video className="mr-1 h-3.5 w-3.5" />
                Join Conference
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-md text-muted-foreground hover:text-primary text-xs">
              <LogOut className="mr-1 h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <GridBackground className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section 
          className="relative flex flex-col items-center justify-center text-center p-3 sm:p-5 md:p-6 flex-grow"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
              Welcome Back, <span className="text-primary">{user.email?.split('@')[0]}!</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Experience the future of collaboration. Seamless, intelligent, and built for you.
            </p>
            <Button size="lg" variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base px-6 py-2.5 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105" onClick={() => document.getElementById('dashboard-content')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Dashboard <ArrowDown className="ml-1.5 h-4 w-4 animate-bounce" />
            </Button>
          </div>
        </section>

        {/* Dashboard Content Section */}
        <section id="dashboard-content" className="py-10 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Your Command Center</h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                Manage meetings, settings, and explore features.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Card className="rounded-lg border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-primary/10 transition-all duration-300 ease-in-out transform hover:-translate-y-px">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    New Meeting
                  </CardTitle>
                  <Video className="h-3.5 w-3.5 text-primary" />
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <CardDescription className="text-xs text-muted-foreground mb-2.5">
                    Launch a new video conference instantly.
                  </CardDescription>
                  <Link href="/conference" passHref>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 rounded-sm text-xs">
                      <Video className="mr-1.5 h-3 w-3" /> Start Meeting
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="rounded-lg border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-primary/10 transition-all duration-300 ease-in-out transform hover:-translate-y-px">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Participants Hub
                  </CardTitle>
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <CardDescription className="text-xs text-muted-foreground mb-2.5">
                    Manage contacts and view participant history (soon).
                  </CardDescription>
                   <Button variant="outline" size="sm" className="w-full py-1.5 rounded-sm text-xs" disabled>
                    <Users className="mr-1.5 h-3 w-3" /> View Participants
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="rounded-lg border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-primary/10 transition-all duration-300 ease-in-out transform hover:-translate-y-px">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Account Settings
                  </CardTitle>
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <CardDescription className="text-xs text-muted-foreground mb-2.5">
                    Configure your profile and application preferences.
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full py-1.5 rounded-sm text-xs" disabled>
                    <Settings className="mr-1.5 h-3 w-3" /> Go to Settings
                  </Button>
                </CardContent>
              </Card>

               <Card className="rounded-lg border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-primary/10 transition-all duration-300 ease-in-out transform hover:-translate-y-px">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Explore Features
                  </CardTitle>
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <CardDescription className="text-xs text-muted-foreground mb-2.5">
                    Discover new tools and upcoming enhancements.
                  </CardDescription>
                   <Button variant="outline" size="sm" className="w-full py-1.5 rounded-sm text-xs" disabled>
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Activity Feed Section */}
        <section 
          className="relative flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 min-h-[40vh]"
        >
          <div className="relative z-10 max-w-2xl mx-auto w-full">
            <Card className="rounded-lg border border-border/50 bg-card/60 backdrop-blur-sm shadow-md w-full">
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold text-card-foreground text-center">Activity Feed</CardTitle>
                <CardDescription className="text-xs text-center text-muted-foreground">Recent activities and notifications (placeholder).</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 h-28 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </GridBackground>

      <footer className="py-6 text-center text-muted-foreground text-xs border-t border-border bg-card">
        © {new Date().getFullYear()} FutureConf. All rights reserved.
      </footer>
    </div>
  );
}

