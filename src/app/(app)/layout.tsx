import { Sidebar } from '@/components/sidebar';
import { Providers } from '@/components/providers';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main
          style={{
            marginLeft: 240,
            flex: 1,
            minHeight: '100vh',
            background: '#0f0f0f',
            padding: '32px 40px',
            overflowY: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </Providers>
  );
}
