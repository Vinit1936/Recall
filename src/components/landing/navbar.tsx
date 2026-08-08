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
        padding: '0 14px',
      }}
    >
      {/* Left: Table Chrome Dots + Dashboard Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1c1c1e', border: '1px solid #2a2a2d' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1c1c1e', border: '1px solid #2a2a2d' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1c1c1e', border: '1px solid #2a2a2d' }} />
        </div>

        <div style={{ width: '1px', height: '14px', background: '#1e1e1e' }} />

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
      </div>

      {/* Center: Table-Themed Navigation Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <a
          href="#features"
          style={{
            fontSize: '12px',
            color: '#888888',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            textDecoration: 'none',
            padding: '5px 12px',
            borderRadius: '6px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.background = '#141414';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#888888';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Features
        </a>
        <a
          href="#features"
          style={{
            fontSize: '12px',
            color: '#888888',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            textDecoration: 'none',
            padding: '5px 12px',
            borderRadius: '6px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.background = '#141414';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#888888';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          How it works
        </a>
      </nav>

      {/* Right: Table-Themed Action Button */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          href="/auth/login"
          style={{
            background: '#161618',
            color: '#e5e5e5',
            fontSize: '12px',
            fontWeight: 500,
            height: '32px',
            padding: '0 14px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            border: '1px solid #262626',
            transition: 'all 0.15s ease',
            fontFamily: 'var(--font-geist-sans), sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1f1f22';
            e.currentTarget.style.borderColor = '#333333';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#161618';
            e.currentTarget.style.borderColor = '#262626';
            e.currentTarget.style.color = '#e5e5e5';
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 6px rgba(74, 222, 128, 0.4)',
              display: 'inline-block',
            }}
          />
          Get started free
        </Link>
      </div>
    </motion.header>
  );
}
