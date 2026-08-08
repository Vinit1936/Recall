import type { Metadata } from 'next';
import { SmoothScroll } from '@/components/landing/smooth-scroll';

export const metadata: Metadata = {
  title: 'Recall — Never forget what you solved',
  description: 'Spaced repetition tracker for DSA problems. Solve once, remember forever.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#080808', color: '#e5e5e5', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html {
          scroll-behavior: auto;
        }
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      <SmoothScroll />
      {children}
    </div>
  );
}
