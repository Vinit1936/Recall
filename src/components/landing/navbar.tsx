'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(8, 8, 8, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        height: '56px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left - Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '16px',
            fontWeight: 500,
            color: '#ffffff',
            textDecoration: 'none',
          }}
        >
          recall<span style={{ color: '#555555' }}>.</span>
        </Link>

        {/* Center - Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <a
            href="#features"
            style={{
              fontSize: '13px',
              color: '#666666',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e5e5e5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
          >
            Features
          </a>
          <a
            href="#features"
            style={{
              fontSize: '13px',
              color: '#666666',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e5e5e5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
          >
            How it works
          </a>
          <a
            href="https://github.com/Vinit1936/Recall"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '13px',
              color: '#666666',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e5e5e5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
          >
            GitHub
          </a>
        </nav>

        {/* Right - Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            href="/auth/login"
            style={{
              border: '1px solid #222222',
              background: 'transparent',
              color: '#888888',
              fontSize: '13px',
              height: '34px',
              padding: '0 16px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'border-color 0.15s ease, color 0.15s ease',
              fontFamily: 'var(--font-geist-sans), sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#333333';
              e.currentTarget.style.color = '#e5e5e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222222';
              e.currentTarget.style.color = '#888888';
            }}
          >
            Sign in
          </Link>
          <Link
            href="/auth/login"
            style={{
              background: '#ffffff',
              color: '#000000',
              fontSize: '13px',
              fontWeight: 600,
              height: '34px',
              padding: '0 16px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
              fontFamily: 'var(--font-geist-sans), sans-serif',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e5e5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
