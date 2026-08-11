'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { localStorageProvider } from '@/lib/swr-cache';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          provider: localStorageProvider,
          revalidateOnFocus: false,
          revalidateIfStale: true,
          dedupingInterval: 2000,
          focusThrottleInterval: 30000,
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
