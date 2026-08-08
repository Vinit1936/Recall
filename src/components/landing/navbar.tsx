'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

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
        height: '50px',
        borderRadius: '12px',
        background: '#0a0a0b',
        border: '1px solid #1a1a1a',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
    >
      {/* Left: Dashboard Wordmark */}
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '15px',
          fontWeight: 600,
          color: '#ffffff',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        recall<span style={{ color: '#F7981E' }}>.</span>
      </Link>

      {/* Center: Clean Navigation Anchor Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        {[
          { label: 'Capabilities', href: '#capabilities' },
          { label: 'Science', href: '#science' },
          { label: 'How it works', href: '#how-it-works' },
          { label: 'FAQ', href: '#faq' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontSize: '12px',
              color: '#a1a1aa',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = '#141417';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a1a1aa';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Right: Simple White Sign In Button */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          href="/auth/login"
          style={{
            background: '#ffffff',
            color: '#000000',
            fontSize: '13px',
            fontWeight: 600,
            height: '32px',
            padding: '0 16px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
            fontFamily: 'var(--font-geist-sans), sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f4f4f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
          }}
        >
          Sign in
        </Link>
      </div>
    </motion.header>
  );
}
