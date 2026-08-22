import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In / Sign Up',
  description: 'Sign in or create your Recall account to track and retain DSA problems.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
