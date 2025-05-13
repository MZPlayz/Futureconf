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
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-foreground antialiased">
      <header className="p-3 border-b border-border flex-shrink-0 bg-card/80 shadow-sm sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <GridBackground className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section 
          className="relative flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8 flex-grow" // Use flex-grow for hero to take space
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Welcome Back, <span className="text-primary">{user.email?.split('@')[0]}!</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Experience the future of collaboration. Seamless, intelligent, and built for you.
            </p>
            <Button size="lg" variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-3 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105" onClick={() => document.getElementById('dashboard-content')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Dashboard <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </section>

        {/* Dashboard Content Section */}
        <section id="dashboard-content" className="py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-bold tracking-tight text-foreground">Your Command Center</h3>
              <p className="text-md text-muted-foreground mt-2">
                Manage meetings, settings, and explore features.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Card className="rounded-lg border-border shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                  <CardTitle className="text-md font-semibold text-card-foreground">
                    New Meeting
                  </CardTitle>
                  <Video className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Launch a new video conference instantly.
                  </p>
                  <Link href="/conference" passHref>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-md">
                      <Video className="mr-2 h-4 w-4" /> Start Meeting
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="rounded-lg border-border shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                  <CardTitle className="text-md font-semibold text-card-foreground">
                    Participants Hub
                  </CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage contacts and view participant history (soon).
                  </p>
                   <Button variant="outline" size="sm" className="w-full py-2 rounded-md" disabled>
                    <Users className="mr-2 h-4 w-4" /> View Participants
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="rounded-lg border-border shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                  <CardTitle className="text-md font-semibold text-card-foreground">
                    Account Settings
                  </CardTitle>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure your profile and application preferences.
                  </p>
                  <Button variant="outline" size="sm" className="w-full py-2 rounded-md" disabled>
                    <Settings className="mr-2 h-4 w-4" /> Go to Settings
                  </Button>
                </CardContent>
              </Card>

               <Card className="rounded-lg border-border shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                  <CardTitle className="text-md font-semibold text-card-foreground">
                    Explore Features
                  </CardTitle>
                  <Sparkles className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover new tools and upcoming enhancements.
                  </p>
                   <Button variant="outline" size="sm" className="w-full py-2 rounded-md" disabled>
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Activity Feed Section */}
        <section 
          className="relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 min-h-[50vh]" // Adjusted min-height
        >
          <div className="relative z-10 max-w-3xl mx-auto w-full">
            <Card className="rounded-lg border-border shadow-xl bg-card/80 backdrop-blur-md w-full">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl font-semibold text-card-foreground text-center">Activity Feed</CardTitle>
                <CardDescription className="text-sm text-center text-muted-foreground">Recent activities and notifications (placeholder).</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 h-40 flex items-center justify-center">
                <p className="text-md text-muted-foreground">No recent activity.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </GridBackground>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border bg-card">
        © {new Date().getFullYear()} FutureConf. All rights reserved.
      </footer>
    </div>
  );
}
