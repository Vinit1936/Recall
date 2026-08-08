'use client';

import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={containerRef}
      style={{
        padding: '140px 32px',
        maxWidth: '640px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        {/* Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(40px, 5vw, 64px)',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Start remembering
        </h2>

        {/* Subheadline */}
        <div
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '13px',
            color: '#a1a1aa',
            letterSpacing: '0.05em',
            marginTop: '16px',
          }}
        >
          Free. No credit card. No nonsense.
        </div>

        {/* Primary CTA Button */}
        <div style={{ marginTop: '40px' }}>
          <Link
            href="/auth/login"
            style={{
              background: '#ffffff',
              color: '#000000',
              fontSize: '15px',
              fontWeight: 600,
              height: '52px',
              padding: '0 40px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Secondary Link */}
        <div
          style={{
            marginTop: '20px',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: '13px',
            color: '#71717a',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/auth/login"
            style={{
              color: '#e5e5e5',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#e5e5e5')}
          >
            Sign in →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
