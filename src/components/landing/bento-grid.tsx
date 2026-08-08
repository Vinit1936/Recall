'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { PlatformLogo } from '@/lib/platforms/logos';
import { Download, Sparkles, Sliders, Layers } from 'lucide-react';

export function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={containerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 32px',
        borderTop: '1px solid #0f0f0f',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ textAlign: 'center', marginBottom: '64px' }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid #2a2a2e',
            background: '#141416',
            borderRadius: '100px',
            padding: '4px 12px 4px 8px',
            marginBottom: '16px',
          }}
        >
          <span style={{ color: '#F7981E', fontSize: '11px' }}>✦</span>
          <span
            style={{
              color: '#a1a1aa',
              fontSize: '12px',
              fontFamily: 'var(--font-geist-mono), monospace',
            }}
          >
            Everything you need
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Built for serious DSA preparation.
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: '16px',
            color: '#a1a1aa',
            maxWidth: '520px',
            margin: '16px auto 0',
            lineHeight: 1.6,
          }}
        >
          Every feature is engineered to eliminate friction, automate tracking, and maximize long-term retention.
        </p>
      </motion.div>

      {/* Bento Grid (2x2 Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Card 1: Spaced Repetition Memory Ladder */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            background: '#0a0a0b',
            border: '1px solid #1a1a1a',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(247, 152, 30, 0.1)',
                border: '1px solid rgba(247, 152, 30, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F7981E',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={18} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '20px',
                fontWeight: 500,
                color: '#ffffff',
                margin: '0 0 8px 0',
              }}
            >
              Adaptive Memory Ladder
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '14px',
                color: '#a1a1aa',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Recall reschedules problems based on confidence. Rates of Clean, Shaky, or Struggled adjust intervals from +3 to +30 days.
            </p>
          </div>

          {/* Graphic Preview */}
          <div
            style={{
              marginTop: '32px',
              background: '#111114',
              border: '1px solid #222226',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {[
              { label: '+3d', status: 'Clean', color: '#4ade80' },
              { label: '+7d', status: 'Shaky', color: '#fb923c' },
              { label: '+14d', status: 'Clean', color: '#4ade80' },
              { label: '+30d', status: 'Mastered', color: '#c084fc' },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '11px',
                    color: item.color,
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: item.color,
                    margin: '0 auto',
                    boxShadow: `0 0 10px ${item.color}`,
                  }}
                />
              </div>
            ))}
            {/* Connecting line */}
            <div
              style={{
                position: 'absolute',
                top: '58%',
                left: '30px',
                right: '30px',
                height: '2px',
                background: '#222226',
                zIndex: 1,
              }}
            />
          </div>
        </motion.div>

        {/* Card 2: Multi-Platform Auto-Fill */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            background: '#0a0a0b',
            border: '1px solid #1a1a1a',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                marginBottom: '20px',
              }}
            >
              <Layers size={18} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '20px',
                fontWeight: 500,
                color: '#ffffff',
                margin: '0 0 8px 0',
              }}
            >
              Automatic Metadata Fetch
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '14px',
                color: '#a1a1aa',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Paste any URL from LeetCode, Codeforces, HackerRank, CodeChef, or GFG. Problem title, difficulty, and topic fill in automatically.
            </p>
          </div>

          {/* Graphic Preview */}
          <div
            style={{
              marginTop: '32px',
              background: '#111114',
              border: '1px solid #222226',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#a1a1aa',
                fontFamily: 'var(--font-geist-mono), monospace',
                marginBottom: '12px',
              }}
            >
              <span>Auto-resolving platforms</span>
              <span style={{ color: '#4ade80' }}>● Live</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <PlatformLogo platform="LEETCODE" size={18} />
              <PlatformLogo platform="CODEFORCES" size={18} />
              <PlatformLogo platform="GFG" size={18} />
              <PlatformLogo platform="HACKERRANK" size={18} />
              <PlatformLogo platform="CODECHEF" size={18} />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Custom Notion-Style Columns */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            background: '#0a0a0b',
            border: '1px solid #1a1a1a',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc',
                marginBottom: '20px',
              }}
            >
              <Sliders size={18} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '20px',
                fontWeight: 500,
                color: '#ffffff',
                margin: '0 0 8px 0',
              }}
            >
              Custom Tag Fields & Columns
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '14px',
                color: '#a1a1aa',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Create custom attributes for Company tags, Space Complexity, Key Takeaways, or Revision Notes just like Notion databases.
            </p>
          </div>

          {/* Graphic Preview */}
          <div
            style={{
              marginTop: '32px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { text: 'Company: Meta', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' },
              { text: 'Company: Google', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', color: '#f87171' },
              { text: 'Complexity: O(N)', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' },
              { text: 'Pattern: Two Pointers', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)', color: '#4ade80' },
            ].map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: tag.bg,
                  border: `1px solid ${tag.border}`,
                  color: tag.color,
                }}
              >
                {tag.text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Card 4: CSV Import & Export */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            background: '#0a0a0b',
            border: '1px solid #1a1a1a',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4ade80',
                marginBottom: '20px',
              }}
            >
              <Download size={18} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '20px',
                fontWeight: 500,
                color: '#ffffff',
                margin: '0 0 8px 0',
              }}
            >
              Zero Lock-In CSV Export
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '14px',
                color: '#a1a1aa',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Your data is always yours. Backup or export your complete problem catalog with a single click as CSV format anytime.
            </p>
          </div>

          {/* Graphic Preview */}
          <div
            style={{
              marginTop: '32px',
              background: '#111114',
              border: '1px solid #222226',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '12px',
                color: '#a1a1aa',
              }}
            >
              recall-problems-2026.csv
            </span>
            <span
              style={{
                fontSize: '11px',
                color: '#4ade80',
                fontFamily: 'var(--font-geist-mono), monospace',
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              Exported
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
