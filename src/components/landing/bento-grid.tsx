'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const CAPABILITIES = [
  {
    tag: 'SPACED REPETITION',
    title: 'Adaptive Intervals',
    desc: 'Automated 3 → 7 → 14 → 30 day revision queue that adapts based on your recall confidence.',
  },
  {
    tag: 'AUTOMATION',
    title: 'Multi-Platform Sync',
    desc: 'Instant title, difficulty, and topic extraction for LeetCode, Codeforces, HackerRank, GFG, and CodeChef.',
  },
  {
    tag: 'FLEXIBILITY',
    title: 'Custom Attributes',
    desc: 'Add custom tags for Companies, Patterns, Complexity, or Takeaways tailored to your workflow.',
  },
  {
    tag: 'PORTABILITY',
    title: 'Data Ownership',
    desc: 'Export your entire problem database to CSV anytime. No vendor lock-in or proprietary formats.',
  },
];

export function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section
      id="capabilities"
      ref={containerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 32px 20px',
        borderTop: '1px solid #1a1a1a',
        scrollMarginTop: '80px',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#a1a1aa',
          marginBottom: '56px',
          textAlign: 'center',
        }}
      >
        Capabilities
      </div>

      {/* 4 Columns Row matching HowItWorks layout */}
      <div
        className="how-it-works-grid"
        style={{
          display: 'flex',
          gap: 0,
        }}
      >
        {CAPABILITIES.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === CAPABILITIES.length - 1;

          let paddingStyle = '32px 28px';
          if (isFirst) paddingStyle = '32px 28px 32px 0';
          else if (isLast) paddingStyle = '32px 0 32px 28px';

          return (
            <motion.div
              key={item.tag}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                flex: 1,
                padding: paddingStyle,
                borderRight: isLast ? 'none' : '1px solid #1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {/* Category Tag Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: '#a1a1aa',
                  background: '#18181c',
                  border: '1px solid #2e2e34',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  marginBottom: '20px',
                  width: 'fit-content',
                }}
              >
                {item.tag}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: '18px',
                  color: '#f0f0f0',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  marginBottom: '12px',
                  marginTop: 0,
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: '14px',
                  color: '#a1a1aa',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
