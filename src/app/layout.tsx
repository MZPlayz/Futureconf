
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google'; // Changed from Geist and Geist_Mono
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';

// Initialize JetBrains Mono
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '700'] // Adjust weights as needed
});

export const metadata: Metadata = {
  title: 'FutureConf',
  description: 'Next generation video conferencing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* Applied JetBrains Mono to the body */}
      <body className={`${jetbrainsMono.variable} font-sans antialiased h-full bg-background text-foreground`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
