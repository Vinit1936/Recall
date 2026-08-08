'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

import { TableDemo } from './table-demo';

const leftVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.2 + i * 0.08,
    },
  }),
};

export function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        paddingTop: '56px',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '32px',
        paddingRight: '32px',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="hero-grid"
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '80px',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        {/* Left Column (45%) */}
        <div style={{ flex: '0 0 45%', maxWidth: '45%' }}>
          {/* 1. Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={leftVariants}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #1e1e1e',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '100px',
              padding: '4px 12px 4px 8px',
            }}
          >
            <span style={{ color: '#555555', fontSize: '11px' }}>✦</span>
            <span
              style={{
                color: '#666666',
                fontSize: '12px',
                fontFamily: 'var(--font-geist-mono), monospace',
              }}
            >
              Spaced repetition for DSA
            </span>
          </motion.div>

          {/* 2. Headline */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={leftVariants}
            style={{ marginTop: '24px' }}
          >
            <h1
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
              Never forget
            </h1>
            <div
              style={{
                width: '100%',
                height: '1px',
                background: '#1e1e1e',
                margin: '2px 0',
              }}
            />
            <h1
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
              what you solved.
            </h1>
          </motion.div>

          {/* 3. Subheadline */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={leftVariants}
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '17px',
              color: '#666666',
              lineHeight: 1.65,
              maxWidth: '380px',
              marginTop: '28px',
              marginBottom: 0,
              fontWeight: 400,
            }}
          >
            Recall schedules your DSA revision automatically.
            <br />
            Solve once. Remember forever.
          </motion.p>

          {/* 4. CTA Buttons */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={leftVariants}
            style={{
              marginTop: '40px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
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
              Start tracking — it&apos;s free
            </Link>
            <a
              href="https://github.com/Vinit1936/Recall"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                border: '1px solid #222222',
                color: '#666666',
                fontSize: '14px',
                height: '44px',
                padding: '0 20px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#333333';
                e.currentTarget.style.color = '#e5e5e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#222222';
                e.currentTarget.style.color = '#666666';
              }}
            >
              View on GitHub ↗
            </a>
          </motion.div>

          {/* 5. Social Proof */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={leftVariants}
            style={{
              marginTop: '24px',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '11px',
              color: '#444444',
              letterSpacing: '0.03em',
            }}
          >
            Built by a student, for students grinding DSA
          </motion.div>
        </div>

        {/* Right Column (55%) */}
        <div style={{ flex: '0 0 55%', maxWidth: '55%' }}>
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as const,
              delay: 0.4,
            }}
            style={{
              borderRadius: '12px',
              border: '1px solid #1a1a1a',
              background: '#0a0a0a',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px #111111, 0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                height: '40px',
                background: '#111111',
                borderBottom: '1px solid #1a1a1a',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {/* Traffic light dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#3a1a1a',
                  }}
                />
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#3a3010',
                  }}
                />
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#1a3a1a',
                  }}
                />
              </div>

              {/* URL bar */}
              <div
                style={{
                  flex: 1,
                  maxWidth: '280px',
                  margin: '0 auto',
                  background: '#0a0a0a',
                  border: '1px solid #1e1e1e',
                  borderRadius: '6px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    color: '#444444',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '11px',
                  }}
                >
                  app.recall.dev
                </span>
              </div>
            </div>

            {/* Mockup Body */}
            <TableDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
