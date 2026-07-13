'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
        <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
        <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  },
  {
    label: 'Daily Revision',
    href: '/daily',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="8" cy="11" r="1.5" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        background: '#111111',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        zIndex: 10,
      }}
    >
      {/* Wordmark */}
      <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 18, fontWeight: 600, color: '#ffffff', paddingLeft: 12, marginBottom: 32, letterSpacing: '-0.02em' }}>
        recall<span style={{ color: '#444' }}>.</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 6, fontSize: 13.5, fontWeight: isActive ? 500 : 400, color: isActive ? '#ffffff' : '#666', background: isActive ? '#1e1e1e' : 'transparent', textDecoration: 'none', transition: 'color 0.15s, background 0.15s' }}>
              <span style={{ color: isActive ? '#fff' : '#555' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* Settings — disabled */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', borderRadius: 6, fontSize: 13.5, color: '#333', cursor: 'not-allowed' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Settings
        </div>
      </nav>

      {/* User + Sign out */}
      <div style={{ paddingLeft: 12, paddingRight: 12 }}>
        {session?.user && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>
              {session.user.name || session.user.email}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              style={{ background: 'none', border: '1px solid #222', borderRadius: 5, color: '#555', cursor: 'pointer', fontSize: 12, padding: '4px 10px', width: '100%', textAlign: 'left', transition: 'color 0.15s, border-color 0.15s' }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
