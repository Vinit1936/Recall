'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
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
    <div
      data-mobile-nav
      style={{
        display: 'none', // Hidden on desktop by default, overridden to flex on mobile via @media
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        borderRadius: '24px',
        background: 'rgba(18, 18, 20, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        gap: '4px',
        width: 'max-content',
        maxWidth: 'calc(100vw - 32px)',
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
            style={{ textDecoration: 'none', position: 'relative' }}
          >
            <motion.div
              whileTap={{ scale: 0.92 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 20px',
                borderRadius: '18px',
                position: 'relative',
                color: isActive ? '#ffffff' : '#777777',
                transition: 'color 0.2s ease',
                gap: '3px',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="dock-active-pill"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '18px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    zIndex: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={isActive ? '#ffffff' : '#777777'} />
              </div>

              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '10px',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '0.02em',
                }}
              >
                {item.label}
              </span>

              {/* Active Orange Accent Dot */}
              {isActive && (
                <motion.div
                  layoutId="dock-active-dot"
                  style={{
                    position: 'absolute',
                    bottom: '3px',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: '#ff6b00',
                    boxShadow: '0 0 6px #ff6b00',
                    zIndex: 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
