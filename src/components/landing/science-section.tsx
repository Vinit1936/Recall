'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';

const MILESTONES = [
  { day: 'Day 0', title: 'Initial Solve', retention: '100%', desc: 'Problem solved and added to Recall.' },
  { day: 'Day 3', title: '1st Review', retention: '95%', desc: 'First memory refresh prevents steep 70% drop.' },
  { day: 'Day 7', title: '2nd Review', retention: '98%', desc: 'Reinforces pattern recognition into medium-term memory.' },
  { day: 'Day 14', title: '3rd Review', retention: '99%', desc: 'Decay curve flattens drastically.' },
  { day: 'Day 30', title: 'Mastered', retention: '100%', desc: 'Permanent long-term retention established.' },
];

export function ScienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section
      ref={containerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 32px 40px',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ textAlign: 'center', marginBottom: '56px' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#a1a1aa',
            marginBottom: '12px',
          }}
        >
          The Science
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Why traditional cramming fails.
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: '15px',
            color: '#a1a1aa',
            maxWidth: '520px',
            margin: '16px auto 0',
            lineHeight: 1.6,
          }}
        >
          Hermann Ebbinghaus proved memory exponentially decays without review. Spaced repetition flattens the forgetting curve.
        </p>
      </motion.div>

      {/* Interactive Ebbinghaus Forgetting Curve Graph Container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
        style={{
          background: '#0c0c0e',
          border: '1px solid #1c1c20',
          borderRadius: '12px',
          padding: '36px 32px',
          marginBottom: '64px',
        }}
      >
        {/* Legend & Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                color: '#ffffff',
              }}
            >
              Memory Retention Curve
            </div>
            <div
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '12px',
                color: '#71717a',
                marginTop: '4px',
              }}
            >
              Comparing unassisted memory decay vs. Recall spaced repetition
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '2px', background: '#f87171', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: '#a1a1aa' }}>
                Without Recall (Decay)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '2px', background: '#4ade80', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: '#a1a1aa' }}>
                With Recall (Spaced)
              </span>
            </div>
          </div>
        </div>

        {/* SVG Graph Visualizer */}
        <div style={{ position: 'relative', width: '100%', height: '220px', margin: '20px 0 10px' }}>
          <svg
            viewBox="0 0 800 200"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <line x1="0" y1="20" x2="800" y2="20" stroke="#1a1a1e" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="#1a1a1e" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#1a1a1e" strokeWidth="1" strokeDasharray="4 4" />

            {/* Y-axis Labels */}
            <text x="0" y="15" fill="#555" fontSize="10" fontFamily="monospace">100%</text>
            <text x="0" y="85" fill="#555" fontSize="10" fontFamily="monospace">50%</text>
            <text x="0" y="155" fill="#555" fontSize="10" fontFamily="monospace">10%</text>

            {/* Without Recall Line (Red Exponential Decay) */}
            <path
              d="M 40 20 Q 150 160 800 175"
              fill="none"
              stroke="#f87171"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.75"
            />

            {/* With Recall Line (Green Resets) */}
            {/* Day 0 (20) -> Day 3 (90) reset to (20) -> Day 7 (60) reset to (20) -> Day 14 (35) reset to (20) -> Day 30 flat (20) */}
            <path
              d="M 40 20 Q 120 100 180 90 L 180 20 Q 280 65 360 55 L 360 20 Q 520 38 600 32 L 600 20 Q 700 24 800 22"
              fill="none"
              stroke="#4ade80"
              strokeWidth="2.5"
            />

            {/* Nodes / Dots */}
            {[
              { x: 40, y: 20, index: 0 },
              { x: 180, y: 20, index: 1 },
              { x: 360, y: 20, index: 2 },
              { x: 600, y: 20, index: 3 },
              { x: 800, y: 22, index: 4 },
            ].map((pt) => (
              <g key={pt.index} style={{ cursor: 'pointer' }} onClick={() => setActiveStep(pt.index)}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={activeStep === pt.index ? 6 : 4}
                  fill={activeStep === pt.index ? '#4ade80' : '#141416'}
                  stroke="#4ade80"
                  strokeWidth="2"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* X-axis Milestone Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginTop: '24px',
            borderTop: '1px solid #1a1a1a',
            paddingTop: '20px',
          }}
        >
          {MILESTONES.map((m, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={m.day}
                onClick={() => setActiveStep(idx)}
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '8px',
                  background: isActive ? '#141417' : 'transparent',
                  border: isActive ? '1px solid #282830' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '11px',
                    color: isActive ? '#4ade80' : '#71717a',
                    fontWeight: 600,
                  }}
                >
                  {m.day}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: '13px',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    fontWeight: 500,
                    marginTop: '4px',
                  }}
                >
                  {m.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Milestone Highlight Explanation */}
        <div
          style={{
            marginTop: '16px',
            background: '#080809',
            border: '1px solid #18181c',
            borderRadius: '8px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: '13px',
          }}
        >
          <span style={{ color: '#e5e5e5' }}>{MILESTONES[activeStep].desc}</span>
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '11px',
              color: '#4ade80',
              background: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            Retention: {MILESTONES[activeStep].retention}
          </span>
        </div>
      </motion.div>

      {/* 3 Columns Takeaways Row matching HowItWorks architecture */}
      <div
        className="how-it-works-grid"
        style={{
          display: 'flex',
          gap: 0,
          borderTop: '1px solid #1a1a1a',
          paddingTop: '40px',
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '16px 40px 16px 0',
            borderRight: '1px solid #1a1a1a',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#71717a',
              marginBottom: '8px',
            }}
          >
            THE PROBLEM
          </div>
          <h3 style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: '16px', color: '#ffffff', margin: '0 0 6px 0' }}>
            90% Forgotten in 7 Days
          </h3>
          <p style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: '13px', color: '#a1a1aa', margin: 0, lineHeight: 1.55 }}>
            Without active revision intervals, most solved DSA problems fade completely from memory within a week.
          </p>
        </div>

        <div
          style={{
            flex: 1,
            padding: '16px 40px',
            borderRight: '1px solid #1a1a1a',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#71717a',
              marginBottom: '8px',
            }}
          >
            THE SOLUTION
          </div>
          <h3 style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: '16px', color: '#ffffff', margin: '0 0 6px 0' }}>
            4 Timely Touchpoints
          </h3>
          <p style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: '13px', color: '#a1a1aa', margin: 0, lineHeight: 1.55 }}>
            Only 4 spaced reviews are required to lock a complex pattern permanently into long-term recall.
          </p>
        </div>

        <div
          style={{
            flex: 1,
            padding: '16px 0 16px 40px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#71717a',
              marginBottom: '8px',
            }}
          >
            AUTOMATED
          </div>
          <h3 style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: '16px', color: '#ffffff', margin: '0 0 6px 0' }}>
            Zero Manual Math
          </h3>
          <p style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: '13px', color: '#a1a1aa', margin: 0, lineHeight: 1.55 }}>
            Recall calculates your next optimal review date automatically so you focus strictly on solving.
          </p>
        </div>
      </div>
    </section>
  );
}
