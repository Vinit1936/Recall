'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListFilter, Calendar, Settings } from 'lucide-react';

const navItems = [
  {
    label: 'Lists',
    href: '/dashboard',
    icon: ListFilter,
  },
  {
    label: 'Daily',
    href: '/daily',
    icon: Calendar,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      data-mobile-nav
      style={{
        display: 'none', // Hidden on desktop by default
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        background: '#111111',
        borderTop: '1px solid #1a1a1a',
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        boxSizing: 'border-box',
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              flex: 1,
              height: '100%',
              color: isActive ? '#e5e5e5' : '#555555',
              textDecoration: 'none',
              fontSize: 10,
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontWeight: isActive ? 500 : 400,
              transition: 'color 0.15s ease',
            }}
          >
            <Icon size={18} color={isActive ? '#e5e5e5' : '#555555'} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
