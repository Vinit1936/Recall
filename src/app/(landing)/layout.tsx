import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { SmoothScroll } from '@/components/landing/smooth-scroll';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});

export const metadata: Metadata = {
  title: 'Recall — Never forget what you solved',
  description: 'Spaced repetition tracker for DSA problems. Solve once, remember forever.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <head>
        <style>{`
          html {
            scroll-behavior: auto;
          }
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}</style>
      </head>
      <body style={{ background: '#080808', color: '#e5e5e5', margin: 0, padding: 0, overflowX: 'hidden' }}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
