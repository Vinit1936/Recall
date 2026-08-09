'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Chrome } from './chrome';

function EbbinghausChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [animated, setAnimated] = useState(false);

  const W = 600;
  const H = 300;
  const PAD = { top: 20, right: 20, bottom: 50, left: 30 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  // Forgetting curve: exponential decay
  const decay = (x: number) => Math.exp(-3.5 * x);
  // Spaced repetition: rises at each review point
  const spaced = (x: number) => {
    const reviews = [0, 0.15, 0.35, 0.57, 0.83];
    let base = 0.2;
    for (let i = reviews.length - 1; i >= 0; i--) {
      if (x >= reviews[i]) {
        const progress = (x - reviews[i]) / (i < reviews.length - 1 ? reviews[i + 1] - reviews[i] : 0.17);
        const peak = 0.55 + i * 0.09;
        base = peak - progress * progress * 0.35;
        break;
      }
    }
    return Math.max(0.18, Math.min(0.95, base));
  };

  const toPath = (fn: (x: number) => number, steps = 120) => {
    const points = Array.from({ length: steps + 1 }, (_, i) => {
      const x = i / steps;
      const y = fn(x);
      return `${PAD.left + x * iW},${PAD.top + (1 - y) * iH}`;
    });
    return `M${points.join('L')}`;
  };

  const decayPath = toPath(decay);
  const spacedPath = toPath(spaced);

  const decayLen = 520;
  const spacedLen = 540;

  useEffect(() => {
    if (isInView && !animated) setAnimated(true);
  }, [isInView, animated]);

  const dayLabels = [
    { x: 0, label: 'Day 0', sub: 'Initial Solve' },
    { x: 0.15, label: 'Day 3', sub: '1st Review' },
    { x: 0.35, label: 'Day 7', sub: '2nd Review' },
    { x: 0.57, label: 'Day 14', sub: '3rd Review' },
    { x: 0.83, label: 'Day 30', sub: 'Mastered' },
  ];

  return (
    <div
      ref={containerRef}
      style={{ background: '#0a0a0a', padding: '20px 16px 12px', height: '100%' }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: '100%' }}
        aria-label="Ebbinghaus Forgetting Curve vs Spaced Repetition"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((v) => (
          <line
            key={v}
            x1={PAD.left}
            x2={PAD.left + iW}
            y1={PAD.top + v * iH}
            y2={PAD.top + v * iH}
            stroke="#111"
            strokeWidth="1"
          />
        ))}

        {/* Forgetting curve — red dashed */}
        <path
          d={decayPath}
          fill="none"
          stroke="#f87171"
          strokeWidth="2"
          strokeDasharray={`${decayLen} ${decayLen}`}
          strokeDashoffset={animated ? 0 : decayLen}
          style={{
            transition: animated ? 'stroke-dashoffset 1.5s ease-in-out' : 'none',
          }}
          opacity="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Spaced repetition curve — green */}
        <path
          d={spacedPath}
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.5"
          strokeDasharray={`${spacedLen} ${spacedLen}`}
          strokeDashoffset={animated ? 0 : spacedLen}
          style={{
            transition: animated ? 'stroke-dashoffset 2s ease-in-out 0.5s' : 'none',
          }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Review dots */}
        {dayLabels.slice(1).map((d) => {
          const cx = PAD.left + d.x * iW;
          const cy = PAD.top + (1 - spaced(d.x)) * iH;
          return (
            <circle
              key={d.label}
              cx={cx}
              cy={cy}
              r="4"
              fill="#4ade80"
              opacity={animated ? 0.9 : 0}
              style={{ transition: animated ? 'opacity 0.3s ease 2s' : 'none' }}
            />
          );
        })}

        {/* X-axis labels */}
        {dayLabels.map((d) => {
          const x = PAD.left + d.x * iW;
          return (
            <g key={d.label}>
              <line
                x1={x} y1={PAD.top + iH}
                x2={x} y2={PAD.top + iH + 5}
                stroke="#222" strokeWidth="1"
              />
              <text
                x={x}
                y={PAD.top + iH + 18}
                textAnchor="middle"
                fill="#333"
                fontSize="9"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {d.label}
              </text>
              <text
                x={x}
                y={PAD.top + iH + 30}
                textAnchor="middle"
                fill="#222"
                fontSize="8"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {d.sub}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g>
          <line x1={PAD.left} y1={12} x2={PAD.left + 20} y2={12} stroke="#f87171" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
          <text x={PAD.left + 26} y={16} fill="#555" fontSize="9" fontFamily="var(--font-geist-mono), monospace">Forgetting curve</text>
          <line x1={PAD.left + 120} y1={12} x2={PAD.left + 140} y2={12} stroke="#4ade80" strokeWidth="2.5" />
          <text x={PAD.left + 146} y={16} fill="#555" fontSize="9" fontFamily="var(--font-geist-mono), monospace">With spaced repetition</text>
        </g>
      </svg>
    </div>
  );
}

export function Science() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const BULLETS = [
    { color: '#f87171', bold: '90% lost', rest: ' within 7 days without timely revision.' },
    { color: '#4ade80', bold: '4 reviews', rest: ' build permanent pattern retention.' },
    { color: '#818cf8', bold: 'Adaptive intervals', rest: ' recalculate based on confidence.' },
  ];

  return (
    <section id="science" style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 40px' }}>
      <div
        ref={ref}
        className="science-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px',
              color: '#333',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            The Science
          </div>

          <h2 style={{ margin: 0 }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: 1.1,
                color: '#f0f0f0',
                paddingBottom: '8px',
              }}
            >
              Why traditional
            </span>
            <div style={{ width: '100%', height: '1px', background: '#1e1e1e', marginBottom: '8px' }} />
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: 1.1,
                color: '#f0f0f0',
                paddingTop: '4px',
              }}
            >
              cramming fails.
            </span>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '14px',
              color: '#555',
              lineHeight: 1.8,
              marginTop: '24px',
              maxWidth: '380px',
              margin: '24px 0 0',
            }}
          >
            Hermann Ebbinghaus proved memory decays exponentially after you learn something. Without timely
            revision, 90% is lost within a week. Spaced repetition interrupts the decay curve — each review
            resets the clock before the concept fades.
          </p>

          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {BULLETS.map((b) => (
              <div key={b.bold} style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: b.color,
                    flexShrink: 0,
                    marginTop: '2px',
                    alignSelf: 'center',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: '13px',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: b.color, fontWeight: 700 }}>{b.bold}</strong>
                  <span style={{ color: '#555' }}>{b.rest}</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — chart */}
        <motion.div
          className="science-chart"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <Chrome url="recall/science" height={380}>
            <EbbinghausChart />
          </Chrome>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #science { padding: 80px 24px !important; }
          .science-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .science-chart { display: none !important; }
        }
      `}</style>
    </section>
  );
}
