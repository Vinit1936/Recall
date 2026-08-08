'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

export function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const [count2800, setCount2800] = useState(0);
  const [count5, setCount5] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count30, setCount30] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1200; // 1200ms

    const easeOutQuad = (t: number) => t * (2 - t);

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeVal = easeOutQuad(progress);

      setCount2800(Math.floor(easeVal * 2800));
      setCount5(Math.floor(easeVal * 5));
      setCount3(Math.floor(easeVal * 3));
      setCount30(Math.floor(easeVal * 30));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView]);

  const formatted2800 = count2800.toLocaleString('en-US');

  return (
    <section
      ref={containerRef}
      style={{
        background: '#0d0d0d',
        borderTop: '1px solid #141414',
        borderBottom: '1px solid #141414',
        padding: '48px 32px',
      }}
    >
      <div
        className="stats-bar-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '80px',
        }}
      >
        {/* Stat 1 */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontStyle: 'italic',
              fontSize: '48px',
              color: '#e5e5e5',
              lineHeight: 1,
            }}
          >
            {formatted2800}+
          </div>
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#444444',
              marginTop: '8px',
            }}
          >
            LeetCode problems indexed
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontStyle: 'italic',
              fontSize: '48px',
              color: '#e5e5e5',
              lineHeight: 1,
            }}
          >
            {count5}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#444444',
              marginTop: '8px',
            }}
          >
            Platforms supported
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontStyle: 'italic',
              fontSize: '48px',
              color: '#e5e5e5',
              lineHeight: 1,
            }}
          >
            +{count3} → +{count30}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#444444',
              marginTop: '8px',
            }}
          >
            Day revision ladder
          </div>
        </div>
      </div>
    </section>
  );
}
