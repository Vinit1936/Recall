import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recall — Never forget what you solved',
  description: 'Spaced repetition tracker for DSA problems. Solve once, remember forever.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#080808', color: '#e5e5e5', minHeight: '100vh', overflowX: 'hidden' }}>
      {children}
    </div>
  );
}
