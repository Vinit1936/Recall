import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Recall — Never Forget What You Solved',
  description:
    'Spaced repetition tracker for DSA problems. Automatically schedules LeetCode, Codeforces, GFG, HackerRank, and CodeChef problems for revision at +3, +7, +14, +30 day intervals.',
  keywords: [
    'DSA revision',
    'spaced repetition',
    'LeetCode tracker',
    'Codeforces tracker',
    'DSA preparation',
    'coding interview prep',
    'algorithm revision',
  ],
  openGraph: {
    title: 'Recall — Never Forget What You Solved',
    description: 'Spaced repetition tracker for DSA problems.',
    type: 'website',
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
