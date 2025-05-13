'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VideoGrid } from '@/components/conference/video-grid';
import { ConferenceControls } from '@/components/conference/conference-controls';
import { ChatPanel } from '@/components/chat/chat-panel';
import type { ChatMessage, Participant } from '@/types';
import { suggestReplies } from '@/ai/flows/suggest-replies';
import { useToast } from "@/hooks/use-toast";

const initialParticipants: Participant[] = [
  { id: 'p1', name: 'Alice', avatar: 'https://picsum.photos/seed/alice-conf/200/200', isHost: true, isSpeaking: false, dataAiHint: 'woman smiling' },
  { id: 'p2', name: 'You', avatar: 'https://picsum.photos/seed/you-conf/200/200', isHost: false, isSpeaking: true, dataAiHint: 'person happy' },
  { id: 'p3', name: 'Bob', avatar: 'https://picsum.photos/seed/bob-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'man thinking' },
  { id: 'p4', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'person glasses' },
  { id: 'p5', name: 'Diana', avatar: 'https://picsum.photos/seed/diana-conf/200/200', isHost: false, isSpeaking: false, dataAiHint: 'woman nature' },
];

const initialMessages: ChatMessage[] = [
  { id: '1', sender: 'Alice', text: 'Hey everyone, welcome to FutureConf!', timestamp: new Date(Date.now() - 1000 * 60 * 5), isOwn: false, avatar: 'https://picsum.photos/seed/alice-chat/40/40', },
  { id: '2', sender: 'Bob', text: 'Hi Alice! Glad to be here.', timestamp: new Date(Date.now() - 1000 * 60 * 4), isOwn: false, avatar: 'https://picsum.photos/seed/bob-chat/40/40' },
  { id: '3', sender: 'You', text: 'Hello! Looking forward to this meeting.', timestamp: new Date(Date.now() - 1000 * 60 * 3), isOwn: true, avatar: 'https://picsum.photos/seed/you-chat/40/40' },
  { id: '4', sender: 'Charlie', text: 'Can everyone hear me okay?', timestamp: new Date(Date.now() - 1000 * 60 * 2), isOwn: false, avatar: 'https://picsum.photos/seed/charlie-chat/40/40' },
];

export default function FutureConfPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [smartReplySuggestions, setSmartReplySuggestions] = useState<string[]>([]);
  const [isSmartRepliesLoading, setIsSmartRepliesLoading] = useState(false);
  
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  
  // Conference states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenSharingParticipantId, setScreenSharingParticipantId] = useState<string | null>(null);


  const { toast } = useToast();

  const handleSendMessage = useCallback((text: string) => {
    if (text.trim() === '') return;
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: 'You',
      text,
      timestamp: new Date(),
      isOwn: true,
      avatar: 'https://picsum.photos/seed/you-chat/40/40'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setCurrentMessage('');
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (messages.length === 0 || !isChatPanelOpen) {
        setSmartReplySuggestions([]);
        return;
      }
      
      setIsSmartRepliesLoading(true);
      const chatHistoryText = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
      try {
        const result = await suggestReplies({ chatHistory: chatHistoryText });
        setSmartReplySuggestions(result.suggestions);
      } catch (error) {
        console.error('Error fetching smart replies:', error);
        setSmartReplySuggestions([]);
        toast({
          title: "Smart Replies Error",
          description: "Could not fetch smart replies.",
          variant: "destructive",
        });
      } finally {
        setIsSmartRepliesLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 500); // Debounce
    return () => clearTimeout(timer);
  }, [messages, isChatPanelOpen, toast]);

  const handleSmartReplyClick = (reply: string) => {
    setCurrentMessage(reply);
    // Optionally, send the message directly:
    // handleSendMessage(reply); 
  };

  const toggleChatPanel = () => setIsChatPanelOpen(prev => !prev);

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
    const youParticipant = participants.find(p => p.name === 'You');
    if (youParticipant) {
      setParticipants(prev => prev.map(p => p.id === youParticipant.id ? {...p, isMuted: !isMuted} : p));
    }
    toast({ title: `Microphone ${!isMuted ? 'muted' : 'unmuted'}` });
  };

  const handleVideoToggle = () => {
    setIsVideoEnabled(prev => !prev);
    const youParticipant = participants.find(p => p.name === 'You');
    if (youParticipant) {
      setParticipants(prev => prev.map(p => p.id === youParticipant.id ? {...p, isVideoEnabled: !isVideoEnabled} : p));
    }
    toast({ title: `Video ${!isVideoEnabled ? 'disabled' : 'enabled'}` });
  };
  
  const handleScreenShareToggle = () => {
    const newIsScreenSharing = !isScreenSharing;
    setIsScreenSharing(newIsScreenSharing);
    const youParticipant = participants.find(p => p.name === 'You');

    if (newIsScreenSharing && youParticipant) {
      setScreenSharingParticipantId(youParticipant.id);
    } else {
      setScreenSharingParticipantId(null);
    }
    toast({ title: `Screen sharing ${newIsScreenSharing ? 'started' : 'stopped'}` });
  };

  const handleEndCall = () => {
    toast({ title: 'Call Ended', description: 'You have left the meeting.' });
    // Reset states or redirect
    setMessages([]);
    setParticipants([]);
  };

  // Update 'You' participant based on local state
  useEffect(() => {
    setParticipants(prev => prev.map(p => {
      if (p.name === 'You') {
        return {
          ...p,
          isMuted,
          isVideoEnabled,
        };
      }
      return p;
    }));
  }, [isMuted, isVideoEnabled]);


  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col">
        <header className="p-4 border-b border-border flex-shrink-0 bg-card shadow-sm">
          <h1 className="text-2xl font-bold text-primary">FutureConf</h1>
        </header>
        <VideoGrid 
            participants={participants} 
            isScreenSharingActive={isScreenSharing}
            screenSharingParticipantId={screenSharingParticipantId}
        />
        <ConferenceControls
            isMuted={isMuted}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            isChatPanelOpen={isChatPanelOpen}
            onMuteToggle={handleMuteToggle}
            onVideoToggle={handleVideoToggle}
            onScreenShareToggle={handleScreenShareToggle}
            onEndCall={handleEndCall}
            onChatToggle={toggleChatPanel}
        />
      </main>
      {isChatPanelOpen && (
        <div className="w-full md:max-w-sm md:min-w-[320px] h-full flex flex-col">
           <ChatPanel
            messages={messages}
            smartReplies={smartReplySuggestions}
            isSmartRepliesLoading={isSmartRepliesLoading}
            currentMessage={currentMessage}
            onSendMessage={handleSendMessage}
            onSmartReplyClick={handleSmartReplyClick}
            setCurrentMessage={setCurrentMessage}
          />
        </div>
      )}
    </div>
  );
}