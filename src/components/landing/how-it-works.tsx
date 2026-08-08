'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Solve & add',
    desc: 'Add any problem from LeetCode, Codeforces, GFG, HackerRank, or CodeChef. Title, difficulty, and topic fill in automatically.',
  },
  {
    num: '02',
    title: 'Get a revision queue',
    desc: 'Recall schedules your first revision in 3 days. Clear it — next one in 7. Then 14. Then 30. The schedule adapts to how well you remember.',
  },
  {
    num: '03',
    title: 'Show up daily',
    desc: 'Open Daily Revision every day. Mark each problem Clean, Shaky, or Struggled. The algorithm adjusts. Your streak builds.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section
      id="features"
      ref={containerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 32px 0',
        borderTop: '1px solid #0f0f0f',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#444444',
          marginBottom: '48px',
          textAlign: 'center',
        }}
      >
        How it works
      </div>

      {/* 3 Steps Row */}
      <div
        className="how-it-works-grid"
        style={{
          display: 'flex',
          gap: '1px',
        }}
      >
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;

          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                flex: 1,
                padding: isLast ? '32px 0 32px 0' : '32px 40px 32px 0',
                borderRight: isLast ? 'none' : '1px solid #1a1a1a',
              }}
            >
              {/* Step Number */}
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '11px',
                  color: '#333333',
                  marginBottom: '20px',
                }}
              >
                {step.num}
              </div>

              {/* Step Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: '18px',
                  color: '#e5e5e5',
                  fontWeight: 500,
                  marginBottom: '12px',
                  marginTop: 0,
                }}
              >
                {step.title}
              </h3>

              {/* Step Description */}
              <p
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: '14px',
                  color: '#555555',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
