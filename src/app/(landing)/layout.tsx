import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';
import '@/app/mobile.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    absolute: 'Recall — Never Forget What You Solved',
  },
  description:
    'Automated spaced repetition queue for LeetCode, Codeforces, GFG, HackerRank, and CodeChef. Never forget what you solved.',
  keywords: [
    'DSA revision',
    'spaced repetition',
    'LeetCode tracker',
    'LeetCode spaced repetition',
    'Codeforces tracker',
    'GeeksforGeeks tracker',
    'HackerRank tracker',
    'CodeChef tracker',
    'DSA preparation',
    'coding interview prep',
    'algorithm revision',
    'Blind 75 revision',
    'NeetCode 150',
    'NeetCode 250',
    'Striver SDE sheet',
    'Striver A2Z DSA',
    'Grind 75',
    'active recall coding',
    'Ebbinghaus forgetting curve',
    'dynamic programming practice',
    'FAANG interview prep',
  ],
  openGraph: {
    type: 'website',
    url: 'https://recallx.tech',
    siteName: 'Recall',
    title: 'Recall — Never Forget What You Solved',
    description:
      'Automated spaced repetition queue for LeetCode, Codeforces, GFG, HackerRank, and CodeChef.',
    images: [
      {
        url: 'https://recallx.tech/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Recall — Never Forget What You Solved',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recall — Never Forget What You Solved',
    description:
      'Automated spaced repetition queue for LeetCode, Codeforces, GFG, HackerRank, and CodeChef.',
    images: ['https://recallx.tech/og-image.png'],
    creator: '@vinitpatil193',
    site: '@vinitpatil193',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={instrumentSerif.variable}
      style={{
        background: '#080808',
        color: '#f0f0f0',
        minHeight: '100vh',
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        :root {
          --bg: #080808;
          --surface: #0f0f0f;
          --border: #1a1a1a;
          --border-subtle: #111111;
          --text-primary: #f0f0f0;
          --text-secondary: #888888;
          --text-tertiary: #444444;
          --text-disabled: #2a2a2a;
          --easy-bg: #1c3a1c;
          --easy-text: #4ade80;
          --easy-border: #2d5a2d;
          --medium-bg: #3a2a0d;
          --medium-text: #fb923c;
          --medium-border: #5a3d10;
          --hard-bg: #3a0f0f;
          --hard-text: #f87171;
          --hard-border: #5a1a1a;
        }
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        html { scroll-behavior: auto; }
        body { background: var(--bg); color: var(--text-primary); margin: 0; overflow-x: hidden; }
        ::selection { background: rgba(255,255,255,0.08); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
      `}</style>
      {children}
    </div>
  );
}
