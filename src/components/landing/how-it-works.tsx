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
        padding: '100px 32px 20px',
        borderTop: '1px solid #1a1a1a',
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
        How it works
      </div>

      {/* 3 Steps Row with equal gutters */}
      <div
        className="how-it-works-grid"
        style={{
          display: 'flex',
          gap: 0,
        }}
      >
        {STEPS.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === STEPS.length - 1;

          let paddingStyle = '32px 40px';
          if (isFirst) paddingStyle = '32px 40px 32px 0';
          else if (isLast) paddingStyle = '32px 0 32px 40px';

          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                flex: 1,
                padding: paddingStyle,
                borderRight: isLast ? 'none' : '1px solid #1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {/* Step Number Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '11px',
                  color: '#a1a1aa',
                  background: '#18181c',
                  border: '1px solid #2e2e34',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  marginBottom: '20px',
                  width: 'fit-content',
                }}
              >
                {step.num}
              </div>

              {/* Step Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: '19px',
                  color: '#f0f0f0',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
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
                  color: '#a1a1aa',
                  lineHeight: 1.65,
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
