import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/sidebar';
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
      <body style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex' }}>
        <TooltipProvider>
          <Sidebar />
          {/* Main content — offset by sidebar width */}
          <main
            style={{
              marginLeft: 240,
              flex: 1,
              minHeight: '100vh',
              background: '#0a0a0a',
              padding: '32px 40px',
              overflowY: 'auto',
            }}
          >
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
