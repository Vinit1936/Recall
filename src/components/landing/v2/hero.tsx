'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Chrome } from './chrome';
import type { ComponentType } from 'react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 + i * 0.1 },
  }),
};

interface HeroProps {
  TableDemo: ComponentType;
}

export function Hero({ TableDemo }: HeroProps) {
  return (
    <section style={{ position: 'relative' }}>
      {/* Main grid */}
      <div
        className="hero-v2-grid"
        style={{
          minHeight: '100vh',
          paddingTop: '52px',
          display: 'grid',
          gridTemplateColumns: '420px 1fr',
          gap: 0,
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '40px',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Left column */}
        <div
          style={{
            paddingRight: '48px',
            paddingTop: '80px',
            paddingBottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* Label */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={itemVariants} style={{ marginBottom: '20px' }}>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '11px',
                color: '#444',
                letterSpacing: '0.1em',
              }}
            >
              <span style={{ color: '#333' }}>✦</span> Spaced repetition for DSA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={itemVariants} style={{ marginBottom: '24px' }}>
            <h1 style={{ margin: 0, padding: 0 }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: '64px',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: '#f0f0f0',
                  paddingBottom: '10px',
                }}
              >
                Never forget
              </span>
              {/* Editorial rule between lines */}
              <div style={{ width: '100%', height: '1px', background: '#1e1e1e', marginBottom: '10px' }} />
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: '64px',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: '#f0f0f0',
                  paddingTop: '4px',
                }}
              >
                what you solved.
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '15px',
              color: '#555',
              lineHeight: 1.7,
              maxWidth: '320px',
              margin: 0,
              marginBottom: '40px',
            }}
          >
            Recall schedules your DSA revision automatically.
            <br />
            Solve once. Remember forever.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <Link
              href="/auth/login"
              style={{
                background: '#f0f0f0',
                color: '#080808',
                fontSize: '13px',
                fontWeight: 600,
                height: '40px',
                padding: '0 20px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get started free
            </Link>
            <a
              href="https://github.com/Vinit1936/Recall"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                border: '1px solid #1e1e1e',
                color: '#555',
                fontSize: '13px',
                height: '40px',
                padding: '0 18px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.color = '#888';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1e1e1e';
                e.currentTarget.style.color = '#555';
              }}
            >
              View on GitHub ↗
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            style={{ marginTop: '32px' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '10px',
                color: '#2a2a2a',
                letterSpacing: '0.05em',
              }}
            >
              Built by a student, for students grinding DSA
            </span>
          </motion.div>
        </div>

        {/* Right column — demo bleeds right edge */}
        <div
          className="hero-v2-right"
          style={{
            height: '100vh',
            paddingTop: '52px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '40px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 }}
            style={{ width: '100%', marginRight: '-40px' }}
          >
            <Chrome url="app.recall.dev" height={480}>
              <TableDemo />
            </Chrome>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          borderTop: '1px solid #111',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px 32px',
          paddingTop: '28px',
        }}
      >
        <div
          className="hero-v2-stats"
          style={{ display: 'flex', alignItems: 'flex-end', gap: '48px' }}
        >
          {[
            { number: '2,800+', label: 'LeetCode problems indexed' },
            null,
            { number: '5 platforms', label: 'supported' },
            null,
            { number: '+3 → +30 days', label: 'revision ladder' },
          ].map((item, i) =>
            item === null ? (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: '#222',
                  fontSize: '20px',
                  alignSelf: 'center',
                }}
              >
                ·
              </span>
            ) : (
              <div key={i}>
                <div
                  style={{
                    fontFamily: 'var(--font-display), Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: '36px',
                    color: '#e5e5e5',
                    lineHeight: 1,
                  }}
                >
                  {item.number}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '10px',
                    color: '#444',
                    letterSpacing: '0.08em',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-v2-grid {
            grid-template-columns: 1fr !important;
            padding-left: 0 !important;
          }
          .hero-v2-right { display: none !important; }
          .hero-v2-grid > div:first-child {
            padding: 80px 24px 40px !important;
          }
          .hero-v2-stats {
            flex-wrap: wrap !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
