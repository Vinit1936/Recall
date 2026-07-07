// (app) route group layout — adds the sidebar shell to all app pages

import { Sidebar } from '@/components/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
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
    </div>
  );
}
