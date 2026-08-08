'use client';

import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { RevisionDemo } from './revision-demo';

export function RevisionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section style={{ position: 'relative' }}>
      {/* Section Container */}
      <div
        ref={containerRef}
        className="revision-section-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '120px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '80px',
        }}
      >
        {/* Left Column (58%) — Browser Chrome with Revision Demo */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            flex: '0 0 58%',
            maxWidth: '58%',
          }}
        >
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid #222228',
              background: '#0a0a0a',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px #1a1a1e, 0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Browser Toolbar Header */}
            <div
              style={{
                height: '36px',
                background: '#0d0d0d',
                borderBottom: '1px solid #222228',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                position: 'relative',
              }}
            >
              {/* Traffic Lights */}
              <div style={{ display: 'flex', gap: '8px', zIndex: 1 }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
              </div>

              {/* URL Bar */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '260px',
                  background: '#0a0a0a',
                  border: '1px solid #222228',
                  borderRadius: '6px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#71717a', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px' }}>
                  recall/daily
                </span>
              </div>
            </div>

            {/* Mockup Body Content */}
            <div style={{ minHeight: '420px', background: '#0a0a0b' }}>
              <RevisionDemo />
            </div>
          </div>
        </motion.div>

        {/* Right Column (42%) — Text */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            flex: '0 0 42%',
            maxWidth: '42%',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #2a2a2e',
              background: '#141416',
              borderRadius: '100px',
              padding: '4px 12px 4px 8px',
              marginBottom: '20px',
            }}
          >
            <span style={{ color: '#F7981E', fontSize: '11px' }}>✦</span>
            <span style={{ color: '#a1a1aa', fontSize: '12px', fontFamily: 'var(--font-geist-mono), monospace' }}>
              Daily revision queue
            </span>
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(48px, 5.5vw, 72px)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#f0f0f0',
              margin: 0,
            }}
          >
            Show up. Every day.
          </h2>

          {/* Subheadline */}
          <p
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '17px',
              color: '#a1a1aa',
              lineHeight: 1.65,
              maxWidth: '360px',
              marginTop: '24px',
              marginBottom: 0,
              fontWeight: 400,
            }}
          >
            Recall tells you exactly what to revise today. 2 to 3 problems, automatically selected by your schedule. Mark each one and you&apos;re done.
          </p>

          {/* CTA Button */}
          <div style={{ marginTop: '36px' }}>
            <Link
              href="/auth/login"
              style={{
                background: '#ffffff',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 600,
                height: '44px',
                padding: '0 24px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                transition: 'transform 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.01)';
                e.currentTarget.style.background = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              Get started free
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
