
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioTower, Video, Users, Settings, Sparkles, LogOut, Loader2, ArrowDown, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import GridBackground from '@/components/ui/grid-background';
import { ActivityChart } from '@/components/dashboard/activity-chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    // AuthProvider's onAuthStateChange will handle redirect to /login
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
          {/* Left Side: Logo and Title */}
          <div className="flex items-center space-x-1.5">
            <RadioTower className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              FutureConf <span className="font-light text-primary/90">Dashboard</span>
            </h1>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center space-x-3">
            <Link href="/conference" passHref>
              <Button variant="default" size="sm" className="rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                <Video className="mr-1.5 h-3.5 w-3.5" />
                New Meeting
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://picsum.photos/seed/${user.id}/40/40`} alt={user.email?.charAt(0).toUpperCase() || 'U'} data-ai-hint="user profile" />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || <UserCircle className="h-5 w-5"/>}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-not-allowed opacity-50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings (Soon)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <GridBackground className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section
          className="relative flex flex-col items-center justify-center text-center p-3 sm:p-5 md:p-6 flex-grow"
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5 text-center">
              Welcome Back, <span className="text-primary">{user.email?.split('@')[0]}!</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 text-center">
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
              <Card className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out">
                <CardContent className="p-4 flex flex-col items-center text-center h-full">
                  <div className="mb-3 p-3 bg-primary/10 rounded-full text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <Video className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base font-semibold text-card-foreground mb-1">
                    New Meeting
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mb-4 leading-relaxed flex-grow px-2">
                    Launch a new video conference instantly.
                  </CardDescription>
                  <Link href="/conference" passHref className="w-full mt-auto">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 rounded-sm text-xs">
                      <Video className="mr-1.5 h-3 w-3" /> Start Meeting
                    </Button>
                  </Link>
                </CardContent>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Card>

              <Card className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out">
                <CardContent className="p-4 flex flex-col items-center text-center h-full">
                  <div className="mb-3 p-3 bg-muted/40 rounded-full text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base font-semibold text-card-foreground mb-1">
                    Participants Hub
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mb-4 leading-relaxed flex-grow px-2">
                    Manage contacts and view participant history (soon).
                  </CardDescription>
                   <Button variant="outline" size="sm" className="w-full py-1.5 rounded-sm text-xs mt-auto" disabled>
                    <Users className="mr-1.5 h-3 w-3" /> View Participants
                  </Button>
                </CardContent>
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Card>
              
              <Card className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out">
                <CardContent className="p-4 flex flex-col items-center text-center h-full">
                  <div className="mb-3 p-3 bg-muted/40 rounded-full text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <Settings className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base font-semibold text-card-foreground mb-1">
                    Account Settings
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mb-4 leading-relaxed flex-grow px-2">
                    Configure your profile and application preferences.
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full py-1.5 rounded-sm text-xs mt-auto" disabled>
                    <Settings className="mr-1.5 h-3 w-3" /> Go to Settings
                  </Button>
                </CardContent>
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Card>

               <Card className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out">
                <CardContent className="p-4 flex flex-col items-center text-center h-full">
                 <div className="mb-3 p-3 bg-primary/10 rounded-full text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base font-semibold text-card-foreground mb-1">
                    Explore Features
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mb-4 leading-relaxed flex-grow px-2">
                    Discover new tools and upcoming enhancements.
                  </CardDescription>
                   <Button variant="outline" size="sm" className="w-full py-1.5 rounded-sm text-xs mt-auto" disabled>
                     <Sparkles className="mr-1.5 h-3 w-3" /> Learn More
                  </Button>
                </CardContent>
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Card>
            </div>
          </div>
        </section>

        {/* Activity Feed Section */}
        <section
          className="relative flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 min-h-[30vh] pb-10 sm:pb-12 md:pb-16"
        >
          <div className="relative z-10 max-w-2xl mx-auto w-full">
            <Card className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-md w-full">
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold text-card-foreground text-center">Activity Feed</CardTitle>
                <CardDescription className="text-xs text-center text-muted-foreground">Your recent platform engagement.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 min-h-[280px] lg:min-h-[300px]">
                <ActivityChart />
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

