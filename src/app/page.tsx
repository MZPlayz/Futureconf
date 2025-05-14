
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  RadioTower, Video, Users, Settings, Sparkles, LogOut, Loader2, ArrowDown, UserCircle, 
  LayoutDashboard, MessageSquare, BarChart3, Users2, CalendarDays, PlusCircle,
  Home, Compass, Plus, MessageCircle // Added for server list
} from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Meeting, Server } from '@/types';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';


const dummyServers: Server[] = [
  { id: 'home', name: 'Home', isHome: true, iconText: 'H' },
  { id: 'server1', name: 'FutureConf HQ', imageUrl: 'https://placehold.co/48x48/008080/FFFFFF.png?text=FC', dataAiHint: 'company logo', unreadCount: 3 },
  { id: 'server2', name: 'Gaming Den', imageUrl: 'https://placehold.co/48x48/F97300/FFFFFF.png?text=GD', dataAiHint: 'joystick', unreadCount: 10 },
  { id: 'server3', name: 'Art Collective', imageUrl: 'https://placehold.co/48x48/FFFFFF/000000.png?text=AC', dataAiHint: 'paint palette' },
  { id: 'server4', name: 'Developer Hub', imageUrl: 'https://placehold.co/48x48/1A1A1D/F2F2F2.png?text=DH', dataAiHint: 'code terminal' },
  { id: 'add', name: 'Add a Server', action: 'add' },
  { id: 'explore', name: 'Explore Servers', action: 'explore' },
];


const DashboardHeaderContent = () => {
  const { user, signOutUser } = useAuth();
  const { toggleSidebar, isMobile } = useSidebar(); // Get toggleSidebar from context

  const handleLogout = async () => {
    await signOutUser();
  };

  if (!user) return null;

  return (
    <>
      {/* Left Side: Trigger, Logo and Title */}
      <div className="flex items-center space-x-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8" // Show only on mobile for this specific trigger
          onClick={toggleSidebar} 
          aria-label="Toggle server list"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
         <SidebarTrigger className="hidden md:flex h-8 w-8" /> {/* For desktop */}


        <RadioTower className="w-5 h-5 text-primary" />
        <h1 className="text-base sm:text-lg font-semibold text-foreground">
          FutureConf <span className="font-light text-primary/90 text-sm sm:text-base">Dashboard</span>
        </h1>
      </div>

      {/* Navigation Links - Centered */}
      <TooltipProvider delayDuration={100}>
        <nav className="hidden md:flex items-center space-x-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary h-8 w-8 rounded-md transition-all duration-200 hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs"><p>Overview</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary h-8 w-8 rounded-md transition-all duration-200 hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                onClick={() => document.getElementById('my-meetings-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Video className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs"><p>My Meetings</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary h-8 w-8 rounded-md transition-all duration-200 hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                disabled
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs"><p>Chat History (Soon)</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary h-8 w-8 rounded-md transition-all duration-200 hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                disabled
              >
                <Users2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs"><p>Contacts (Soon)</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary h-8 w-8 rounded-md transition-all duration-200 hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                onClick={() => document.getElementById('activity-feed-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BarChart3 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs"><p>Analytics</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary h-8 w-8 rounded-md transition-all duration-200 hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                disabled
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs"><p>Settings (Soon)</p></TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>

      {/* Right Side: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link href="/conference" passHref>
          <Button variant="default" size="sm" className="rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-2.5 sm:px-3 py-1 sm:py-1.5">
            <Video className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
            New Meeting
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${user.email?.charAt(0).toUpperCase() || 'U'}`} alt={user.email?.charAt(0).toUpperCase() || 'U'} data-ai-hint="user profile" />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase() || <UserCircle className="h-4 w-4 sm:h-5 sm:w-5" />}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs sm:text-sm font-medium leading-none text-foreground">
                  {user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] sm:text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-xs sm:text-sm" disabled>
              <Settings className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Account Settings (Soon)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-xs sm:text-sm">
              <LogOut className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleServerClick = (serverName: string) => {
    // Placeholder action
    console.log(`Clicked on server: ${serverName}`);
    // In a real app, this would navigate to the server's channels or specific view
  };
  
  const getIconForServer = (server: Server) => {
    if (server.isHome) return <MessageCircle className="h-5 w-5 text-sidebar-foreground group-data-[active=true]:text-sidebar-accent-foreground" />;
    if (server.action === 'add') return <Plus className="h-5 w-5 text-green-500 group-hover:text-white" />;
    if (server.action === 'explore') return <Compass className="h-5 w-5 text-green-500 group-hover:text-white" />;
    return null;
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        side="left"
        variant="sidebar" // Keeps it always visible on desktop unless collapsed
        collapsible="icon"
        className="border-r border-sidebar-border bg-sidebar" // Ensure sidebar styles are applied
        style={{ '--sidebar-width': '280px', '--sidebar-width-icon': '64px' } as React.CSSProperties}
      >
        <SidebarContent className="p-1.5 flex flex-col gap-1.5">
          {dummyServers.map((server) => (
            <SidebarMenuItem key={server.id} className="group/server-item">
              <SidebarMenuButton
                variant="default"
                size="lg" // Makes buttons taller
                className={cn(
                  "justify-center h-12 w-12 p-0 rounded-full data-[active=true]:bg-primary data-[active=true]:hover:bg-primary/90 group-data-[collapsible=icon]:rounded-xl",
                  "transition-all duration-200 ease-in-out",
                  "hover:rounded-xl",
                  (server.action === 'add' || server.action === 'explore') && "bg-muted hover:bg-green-500/80 text-green-500"
                )}
                tooltip={{
                  children: server.name,
                  side: "right",
                  align: "center",
                  className: "ml-2",
                }}
                onClick={() => handleServerClick(server.name)}
              >
                {server.imageUrl ? (
                  <Avatar className="h-10 w-10 transition-all duration-200 ease-in-out group-hover/server-item:rounded-lg">
                    <AvatarImage src={server.imageUrl} alt={server.name} data-ai-hint={server.dataAiHint} />
                    <AvatarFallback className="bg-muted text-muted-foreground group-hover/server-item:rounded-lg">
                      {server.iconText || server.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center">
                     {getIconForServer(server)}
                  </div>
                )}
                <span className="sr-only group-data-[state=expanded]:not-sr-only group-data-[state=expanded]:ml-2 truncate">
                  {server.name}
                </span>
                {server.unreadCount && server.unreadCount > 0 && !server.isHome && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full flex items-center">
                    <span className="h-4 w-1 bg-white rounded-r-full group-data-[collapsible=icon]:h-2 group-data-[collapsible=icon]:mt-0.5"/>
                   </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex flex-col min-h-screen text-foreground antialiased">
        <header className="p-2.5 border-b border-border flex-shrink-0 bg-card/80 shadow-sm sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center justify-between max-w-full sm:px-2 lg:px-3"> {/* Adjusted padding for inset header */}
            <DashboardHeaderContent />
          </div>
        </header>

        <GridBackground className="flex-1 flex flex-col overflow-y-auto">
          {/* Hero Section */}
          <section
            className="relative flex flex-col items-center justify-center text-center p-6 sm:p-10 md:p-16 flex-grow min-h-[calc(70vh-60px)]"
          >
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5 text-center">
                Welcome Back, <span className="text-primary">{user.email?.split('@')[0]}!</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 text-center">
                Experience the future of collaboration. Seamless, intelligent, and built for you.
              </p>
              <Button size="lg" variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm sm:text-base px-5 py-2 sm:px-6 sm:py-2.5 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105" onClick={() => document.getElementById('dashboard-content')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Dashboard <ArrowDown className="ml-1.5 h-4 w-4 animate-bounce" />
              </Button>
            </div>
          </section>

          {/* Dashboard Content Section */}
          <section id="dashboard-content" className="py-10 sm:py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
              <div className="mb-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Your Command Center</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                  Manage meetings, settings, and explore features.
                </p>
              </div>
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out">
                  <CardContent className="p-4 flex flex-col items-center text-center h-full">
                    <div className="mb-2 sm:mb-3 p-2.5 sm:p-3 bg-primary/10 rounded-full text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground mb-1">
                      New Meeting
                    </CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 leading-relaxed flex-grow px-1 sm:px-2">
                      Launch a new video conference instantly.
                    </CardDescription>
                    <Link href="/conference" passHref className="w-full mt-auto">
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-1 sm:py-1.5 rounded-sm text-[11px] sm:text-xs">
                        <Video className="mr-1 h-2.5 w-2.5 sm:mr-1.5 sm:h-3 sm:w-3" /> Start Meeting
                      </Button>
                    </Link>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Card>
                <Card className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out">
                  <CardContent className="p-4 flex flex-col items-center text-center h-full">
                    <div className="mb-2 sm:mb-3 p-2.5 sm:p-3 bg-muted/40 rounded-full text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground mb-1">
                      Participants Hub
                    </CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 leading-relaxed flex-grow px-1 sm:px-2">
                      Manage contacts and view participant history (soon).
                    </CardDescription>
                    <Button variant="outline" size="sm" className="w-full py-1 sm:py-1.5 rounded-sm text-[11px] sm:text-xs mt-auto" disabled>
                      <Users className="mr-1 h-2.5 w-2.5 sm:mr-1.5 sm:h-3 sm:w-3" /> View Participants
                    </Button>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Card>
                <Card className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out">
                  <CardContent className="p-4 flex flex-col items-center text-center h-full">
                    <div className="mb-2 sm:mb-3 p-2.5 sm:p-3 bg-muted/40 rounded-full text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground mb-1">
                      Account Settings
                    </CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 leading-relaxed flex-grow px-1 sm:px-2">
                      Configure your profile and application preferences.
                    </CardDescription>
                    <Button variant="outline" size="sm" className="w-full py-1 sm:py-1.5 rounded-sm text-[11px] sm:text-xs mt-auto" disabled>
                      <Settings className="mr-1 h-2.5 w-2.5 sm:mr-1.5 sm:h-3 sm:w-3" /> Go to Settings
                    </Button>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Card>
                <Card className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/70 backdrop-blur-md shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out">
                  <CardContent className="p-4 flex flex-col items-center text-center h-full">
                    <div className="mb-2 sm:mb-3 p-2.5 sm:p-3 bg-primary/10 rounded-full text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground mb-1">
                      Explore Features
                    </CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 leading-relaxed flex-grow px-1 sm:px-2">
                      Discover new tools and upcoming enhancements.
                    </CardDescription>
                    <Button variant="outline" size="sm" className="w-full py-1 sm:py-1.5 rounded-sm text-[11px] sm:text-xs mt-auto" disabled>
                      <Sparkles className="mr-1 h-2.5 w-2.5 sm:mr-1.5 sm:h-3 sm:w-3" /> Learn More
                    </Button>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Card>
              </div>
            </div>
          </section>

          {/* My Meetings Section */}
          <section id="my-meetings-section" className="py-10 sm:py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-6">
              <div className="mb-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">My Meetings</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                  View upcoming, running, and past meetings.
                </p>
              </div>
              <Card className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-md">
                <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
                  <div>
                    <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">Meeting Schedule</CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs text-muted-foreground">Manage your meetings here.</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs" disabled>
                    <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Schedule New (Soon)
                  </Button>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 min-h-[150px] flex items-center justify-center">
                  {meetings.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      <CalendarDays className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No meetings scheduled or recorded yet.</p>
                      <p className="text-xs">Start a new meeting or schedule one to see it here.</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Meeting list will appear here.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Activity Feed Section */}
          <section
            id="activity-feed-section"
            className="relative flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 min-h-[30vh] pb-10 sm:pb-12 md:pb-16"
          >
            <div className="relative z-10 max-w-2xl mx-auto w-full">
              <Card className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-md w-full">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground text-center">Activity Feed</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs text-center text-muted-foreground">Your recent platform engagement.</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 min-h-[250px] sm:min-h-[280px] lg:min-h-[300px]">
                  <ActivityChart />
                </CardContent>
              </Card>
            </div>
          </section>
        </GridBackground>

        <footer className="py-4 sm:py-6 text-center text-muted-foreground text-[10px] sm:text-xs border-t border-border bg-card">
          © {new Date().getFullYear()} FutureConf. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
