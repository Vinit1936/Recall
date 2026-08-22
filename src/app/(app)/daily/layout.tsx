import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Queue',
  description: 'Your scheduled spaced repetition revision queue for today.',
};

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
