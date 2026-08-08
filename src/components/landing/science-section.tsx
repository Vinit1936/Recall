'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';

const MILESTONES = [
  { day: 'Day 0', title: 'Solve', retention: '100%' },
  { day: 'Day 3', title: 'Review 1', retention: '95%' },
  { day: 'Day 7', title: 'Review 2', retention: '98%' },
  { day: 'Day 14', title: 'Review 3', retention: '99%' },
  { day: 'Day 30', title: 'Mastered', retention: '100%' },
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
        padding: '80px 32px',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div
        className="revision-section-grid"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '64px',
        }}
      >
        {/* Left Column (42%) — Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            flex: '0 0 42%',
            maxWidth: '42%',
          }}
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
              fontSize: 'clamp(32px, 3.8vw, 46px)',
              color: '#ffffff',
              lineHeight: 1.1,
              margin: '0 0 16px 0',
            }}
          >
            Why traditional cramming fails.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '14.5px',
              color: '#a1a1aa',
              lineHeight: 1.65,
              margin: '0 0 24px 0',
            }}
          >
            Hermann Ebbinghaus proved memory decays exponentially after solving a problem. Spaced repetition resets the curve before key concepts fade.
          </p>

          {/* Key Facts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e5e5e5', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              <span style={{ color: '#f87171', fontSize: '8px' }}>●</span>
              <span><strong>90% lost</strong> within 7 days without timely revision.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e5e5e5', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              <span style={{ color: '#4ade80', fontSize: '8px' }}>●</span>
              <span><strong>4 reviews</strong> build permanent pattern retention.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e5e5e5', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              <span style={{ color: '#60a5fa', fontSize: '8px' }}>●</span>
              <span><strong>Automated intervals</strong> recalculate based on confidence.</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column (58%) — Vibrant Compact Graph Visualizer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            flex: '0 0 58%',
            maxWidth: '58%',
          }}
        >
          <div
            style={{
              background: '#09090b',
              border: '1px solid #1a1a1e',
              borderRadius: '12px',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Graph Header / Legend */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '11px',
                  color: '#a1a1aa',
                  letterSpacing: '0.05em',
                }}
              >
                Forgetting Curve vs. Recall
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '2px', background: '#f87171' }} />
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', color: '#71717a' }}>
                    Decay
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '2px', background: '#4ade80' }} />
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', color: '#4ade80' }}>
                    Recall
                  </span>
                </div>
              </div>
            </div>

            {/* Vibrant SVG Graph Line */}
            <div style={{ position: 'relative', width: '100%', height: '160px', margin: '12px 0' }}>
              <svg
                viewBox="0 0 500 150"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
                preserveAspectRatio="none"
              >
                {/* Horizontal reference lines */}
                <line x1="0" y1="15" x2="500" y2="15" stroke="#16161a" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#16161a" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="135" x2="500" y2="135" stroke="#16161a" strokeWidth="1" strokeDasharray="3 3" />

                {/* Without Recall Line (Exponential Decay) */}
                <path
                  d="M 20 15 Q 100 120 500 135"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.7"
                />

                {/* Vibrant Glowing Recall Curve */}
                <path
                  d="M 20 15 Q 70 75 110 65 L 110 15 Q 180 50 230 40 L 230 15 Q 330 30 380 25 L 380 15 Q 440 18 500 16"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(74, 222, 128, 0.4))' }}
                />

                {/* Interactive Milestone Nodes */}
                {[
                  { x: 20, y: 15, index: 0 },
                  { x: 110, y: 15, index: 1 },
                  { x: 230, y: 15, index: 2 },
                  { x: 380, y: 15, index: 3 },
                  { x: 500, y: 16, index: 4 },
                ].map((pt) => (
                  <g key={pt.index} style={{ cursor: 'pointer' }} onClick={() => setActiveStep(pt.index)}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={activeStep === pt.index ? 5 : 3.5}
                      fill={activeStep === pt.index ? '#4ade80' : '#09090b'}
                      stroke="#4ade80"
                      strokeWidth="2"
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Compact Milestone Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '12px',
                borderTop: '1px solid #16161a',
                paddingTop: '12px',
              }}
            >
              {MILESTONES.map((m, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={m.day}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      background: isActive ? '#141418' : 'transparent',
                      border: isActive ? '1px solid #2e2e34' : '1px solid transparent',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        fontSize: '10px',
                        color: isActive ? '#4ade80' : '#71717a',
                        fontWeight: 600,
                      }}
                    >
                      {m.day}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-geist-sans), sans-serif',
                        fontSize: '11px',
                        color: isActive ? '#ffffff' : '#555555',
                        marginTop: '2px',
                      }}
                    >
                      {m.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
