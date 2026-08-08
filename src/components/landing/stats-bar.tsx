'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { PlatformLogo } from '@/lib/platforms/logos';

const STATS = [
  {
    tag: 'DATABASE',
    valueSuffix: '+',
    targetNumber: 2800,
    isFormatted: true,
    label: 'LeetCode problems indexed',
    type: 'count',
  },
  {
    tag: 'COVERAGE',
    targetNumber: 5,
    label: 'Platforms supported',
    type: 'platforms',
  },
  {
    tag: 'RETENTION',
    label: 'Spaced revision ladder',
    type: 'ladder',
  },
];

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
    const duration = 1200;

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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px',
      }}
    >
      <div
        className="how-it-works-grid"
        style={{
          display: 'flex',
          gap: 0,
          borderTop: '1px solid #1a1a1a',
          borderBottom: '1px solid #1a1a1a',
          padding: '64px 0',
        }}
      >
        {/* Stat 1 */}
        <div
          style={{
            flex: 1,
            padding: '0 40px 0 0',
            borderRight: '1px solid #1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#71717a',
              marginBottom: '16px',
            }}
          >
            {STATS[0].tag}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(44px, 5vw, 60px)',
              color: '#ffffff',
              lineHeight: 1,
              marginBottom: '12px',
            }}
          >
            {formatted2800}+
          </div>

          <div
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '14px',
              color: '#a1a1aa',
            }}
          >
            {STATS[0].label}
          </div>
        </div>

        {/* Stat 2 */}
        <div
          style={{
            flex: 1,
            padding: '0 40px',
            borderRight: '1px solid #1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#71717a',
                marginBottom: '16px',
              }}
            >
              {STATS[1].tag}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-instrument-serif), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(44px, 5vw, 60px)',
                color: '#ffffff',
                lineHeight: 1,
                marginBottom: '12px',
              }}
            >
              {count5}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '14px',
                color: '#a1a1aa',
              }}
            >
              {STATS[1].label}
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <PlatformLogo platform="LEETCODE" size={14} />
              <PlatformLogo platform="CODEFORCES" size={14} />
              <PlatformLogo platform="GFG" size={14} />
              <PlatformLogo platform="HACKERRANK" size={14} />
              <PlatformLogo platform="CODECHEF" size={14} />
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div
          style={{
            flex: 1,
            padding: '0 0 0 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#71717a',
                marginBottom: '16px',
              }}
            >
              {STATS[2].tag}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-instrument-serif), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(44px, 5vw, 60px)',
                color: '#ffffff',
                lineHeight: 1,
                marginBottom: '12px',
              }}
            >
              +{count3}d → +{count30}d
            </div>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '14px',
              color: '#a1a1aa',
            }}
          >
            {STATS[2].label}
          </div>
        </div>
      </div>
    </section>
  );
}
