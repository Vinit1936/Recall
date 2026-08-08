'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        zIndex: 100,
        width: 'calc(100% - 32px)',
        maxWidth: '920px',
        height: '52px',
        borderRadius: '9999px',
        background: 'rgba(12, 12, 14, 0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px 0 24px',
      }}
    >
      {/* Left: Dashboard-Style Wordmark (Geist Mono + Orange Period) */}
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '17px',
          fontWeight: 600,
          color: '#ffffff',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        recall<span style={{ color: '#F7981E' }}>.</span>
      </Link>

      {/* Center: Navigation Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <a
          href="#features"
          style={{
            fontSize: '13px',
            color: '#888888',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
        >
          Features
        </a>
        <a
          href="#features"
          style={{
            fontSize: '13px',
            color: '#888888',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
        >
          How it works
        </a>
        <a
          href="https://github.com/Vinit1936/Recall"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#888888',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
          aria-label="GitHub Repository"
        >
          <GithubIcon size={18} />
        </a>
      </nav>

      {/* Right: CTA Pill Button with Green Status Dot */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          href="/auth/login"
          style={{
            background: '#ffffff',
            color: '#0a0a0b',
            fontSize: '13px',
            fontWeight: 600,
            height: '36px',
            padding: '0 18px',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.background = '#f4f4f4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = '#ffffff';
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#059669',
              display: 'inline-block',
            }}
          />
          Get started free
        </Link>
      </div>
    </motion.header>
  );
}
