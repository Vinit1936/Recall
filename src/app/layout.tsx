// Root layout — html/body/fonts/TooltipProvider only.
// App shell (sidebar + main) is in (app)/layout.tsx
// Auth pages have their own layout at auth/layout.tsx

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Recall — LeetCode Spaced Repetition Tracker',
  description: 'Track and revise your LeetCode problems with spaced repetition.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ background: '#0f0f0f', color: '#fff', minHeight: '100vh' }}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
