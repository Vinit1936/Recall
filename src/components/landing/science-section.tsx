'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

const MILESTONES = [
  { day: 'Day 0', title: 'Initial Solve', color: '#f59e0b', retention: '100%' },
  { day: 'Day 3', title: '1st Review', color: '#06b6d4', retention: '95%' },
  { day: 'Day 7', title: '2nd Review', color: '#3b82f6', retention: '98%' },
  { day: 'Day 14', title: '3rd Review', color: '#10b981', retention: '99%' },
  { day: 'Day 30', title: 'Mastered', color: '#c084fc', retention: '100%' },
];

export function ScienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Autoplay loop cycling through milestones smoothly
  useEffect(() => {
    if (!isInView || isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % MILESTONES.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [isInView, isPaused]);

  // Handle manual interaction (pause autoplay temporarily)
  const handleSelectStep = (index: number) => {
    setActiveStep(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const NODE_POINTS = [
    { x: 20, y: 20 },
    { x: 110, y: 20 },
    { x: 230, y: 20 },
    { x: 380, y: 20 },
    { x: 480, y: 20 },
  ];

  return (
    <section
      id="science"
      ref={containerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 32px',
        borderTop: '1px solid #1a1a1a',
        scrollMarginTop: '80px',
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
              <span style={{ color: '#ef4444', fontSize: '8px' }}>●</span>
              <span><strong>90% lost</strong> within 7 days without timely revision.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e5e5e5', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              <span style={{ color: '#10b981', fontSize: '8px' }}>●</span>
              <span><strong>4 reviews</strong> build permanent pattern retention.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e5e5e5', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              <span style={{ color: '#c084fc', fontSize: '8px' }}>●</span>
              <span><strong>Automated intervals</strong> recalculate based on confidence.</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column (58%) — Table Chrome Themed Animated Graph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            flex: '0 0 58%',
            maxWidth: '58%',
          }}
        >
          {/* Table-Chrome Outer Window Frame */}
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid #222228',
              background: '#0a0a0a',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px #1a1a1e, 0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Window Chrome Header Bar */}
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
                  width: '240px',
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
                  recall/science
                </span>
              </div>
            </div>

            {/* Main Window Body Content */}
            <div style={{ padding: '24px 28px', background: '#0a0a0b' }}>
              {/* Legend Bar */}
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
                  Retention Curve Engine
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '2px', background: '#ef4444' }} />
                    <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', color: '#71717a' }}>
                      Decay
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '2px', background: MILESTONES[activeStep].color }} />
                    <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '10px', color: MILESTONES[activeStep].color }}>
                      Spaced
                    </span>
                  </div>
                </div>
              </div>

              {/* Ultra-Smooth SVG Curve Graph */}
              <div style={{ position: 'relative', width: '100%', height: '160px', margin: '12px 0' }}>
                <svg
                  viewBox="0 0 500 150"
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Multicolored Gradient for Spaced Curve */}
                    <linearGradient id="spacedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="25%" stopColor="#06b6d4" />
                      <stop offset="55%" stopColor="#3b82f6" />
                      <stop offset="80%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>

                    {/* Gradient Fill under Decay Curve */}
                    <linearGradient id="decayArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#18181c" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#18181c" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="135" x2="500" y2="135" stroke="#18181c" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Red Decay Area Fill */}
                  <path d="M 20 20 C 120 110, 240 135, 480 138 L 480 145 L 20 145 Z" fill="url(#decayArea)" />

                  {/* Red Dashed Decay Line (Smooth Cubic Bézier) */}
                  <path
                    d="M 20 20 C 120 110, 240 135, 480 138"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />

                  {/* Ultra-Smooth Multicolored Spaced Repetition Curve (Continuous Smooth Cubic Bézier Spline) */}
                  <motion.path
                    d="M 20 20 C 55 90, 85 90, 110 20 C 150 70, 190 70, 230 20 C 290 50, 330 50, 380 20 C 420 30, 450 30, 480 20"
                    fill="none"
                    stroke="url(#spacedGrad)"
                    strokeWidth="2.5"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.35))' }}
                  />

                  {/* Node Dots at exact peak points (Y = 20) */}
                  {NODE_POINTS.map((pt, idx) => {
                    const item = MILESTONES[idx];
                    const isActive = activeStep === idx;
                    return (
                      <g key={idx} style={{ cursor: 'pointer' }} onClick={() => handleSelectStep(idx)}>
                        {/* Outer Glow Ring when Active */}
                        {isActive && (
                          <motion.circle
                            cx={pt.x}
                            cy={pt.y}
                            r="10"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="1"
                            opacity="0.5"
                            initial={{ scale: 0.8, opacity: 0.2 }}
                            animate={{ scale: 1.3, opacity: 0.6 }}
                            transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
                          />
                        )}
                        {/* Core Dot */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isActive ? 5.5 : 3.5}
                          fill={isActive ? item.color : '#0a0a0b'}
                          stroke={item.color}
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Milestone Pills Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  borderTop: '1px solid #1c1c22',
                  paddingTop: '14px',
                }}
              >
                {MILESTONES.map((m, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={m.day}
                      onClick={() => handleSelectStep(idx)}
                      style={{
                        background: isActive ? '#141418' : 'transparent',
                        border: isActive ? `1px solid ${m.color}66` : '1px solid transparent',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '10px',
                          color: isActive ? m.color : '#71717a',
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
