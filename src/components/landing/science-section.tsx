'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

const MILESTONES = [
  { day: 'Day 0', title: 'Initial Solve', color: '#f59e0b', stroke: '#f59e0b', retention: '100%' },
  { day: 'Day 3', title: '1st Review', color: '#06b6d4', stroke: '#06b6d4', retention: '95%' },
  { day: 'Day 7', title: '2nd Review', color: '#3b82f6', stroke: '#3b82f6', retention: '98%' },
  { day: 'Day 14', title: '3rd Review', color: '#10b981', stroke: '#10b981', retention: '99%' },
  { day: 'Day 30', title: 'Mastered', color: '#c084fc', stroke: '#c084fc', retention: '100%' },
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
    }, 2000);

    return () => clearInterval(interval);
  }, [isInView, isPaused]);

  // Handle manual interaction (pause autoplay temporarily)
  const handleSelectStep = (index: number) => {
    setActiveStep(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

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
          {/* Table-Chrome Outer Window Frame (100% theme matched with TableDemo & RevisionDemo) */}
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

              {/* Vibrant Animated SVG Curve Graph */}
              <div style={{ position: 'relative', width: '100%', height: '160px', margin: '12px 0' }}>
                <svg
                  viewBox="0 0 500 150"
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  <line x1="0" y1="15" x2="500" y2="15" stroke="#18181c" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#18181c" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="135" x2="500" y2="135" stroke="#18181c" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Red Dashed Decay Line */}
                  <path
                    d="M 20 15 Q 100 120 500 135"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    opacity="0.6"
                  />

                  {/* Multicolored Curve Segments */}
                  {/* Segment 1: Day 0 -> Day 3 (#f59e0b) */}
                  <motion.path
                    d="M 20 15 Q 65 75 110 65 L 110 15"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={activeStep >= 1 ? 2.5 : 1.5}
                    opacity={activeStep >= 1 ? 1 : 0.3}
                    transition={{ duration: 0.4 }}
                    style={{ filter: activeStep >= 1 ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))' : 'none' }}
                  />

                  {/* Segment 2: Day 3 -> Day 7 (#06b6d4) */}
                  <motion.path
                    d="M 110 15 Q 170 55 230 45 L 230 15"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth={activeStep >= 2 ? 2.5 : 1.5}
                    opacity={activeStep >= 2 ? 1 : 0.2}
                    transition={{ duration: 0.4 }}
                    style={{ filter: activeStep >= 2 ? 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))' : 'none' }}
                  />

                  {/* Segment 3: Day 7 -> Day 14 (#3b82f6) */}
                  <motion.path
                    d="M 230 15 Q 310 35 380 30 L 380 15"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={activeStep >= 3 ? 2.5 : 1.5}
                    opacity={activeStep >= 3 ? 1 : 0.2}
                    transition={{ duration: 0.4 }}
                    style={{ filter: activeStep >= 3 ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))' : 'none' }}
                  />

                  {/* Segment 4: Day 14 -> Day 30 (#c084fc) */}
                  <motion.path
                    d="M 380 15 Q 440 20 500 16"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth={activeStep >= 4 ? 2.5 : 1.5}
                    opacity={activeStep >= 4 ? 1 : 0.2}
                    transition={{ duration: 0.4 }}
                    style={{ filter: activeStep >= 4 ? 'drop-shadow(0 0 6px rgba(192, 132, 252, 0.5))' : 'none' }}
                  />

                  {/* Node Dots */}
                  {[
                    { x: 20, y: 15, index: 0 },
                    { x: 110, y: 15, index: 1 },
                    { x: 230, y: 15, index: 2 },
                    { x: 380, y: 15, index: 3 },
                    { x: 500, y: 16, index: 4 },
                  ].map((pt) => {
                    const item = MILESTONES[pt.index];
                    const isActive = activeStep === pt.index;
                    return (
                      <g key={pt.index} style={{ cursor: 'pointer' }} onClick={() => handleSelectStep(pt.index)}>
                        <motion.circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isActive ? 6 : 4}
                          fill={isActive ? item.color : '#0a0a0a'}
                          stroke={item.color}
                          strokeWidth="2"
                          animate={{ scale: isActive ? 1.25 : 1 }}
                          transition={{ duration: 0.2 }}
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
