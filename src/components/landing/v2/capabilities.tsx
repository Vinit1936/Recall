'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

const CARDS = [
  {
    num: '01',
    category: 'Spaced Repetition Engine',
    title: 'Adaptive Intervals',
    desc: 'Automated 3 → 7 → 14 → 30 day revision queue that adapts dynamically based on your confidence rating. Clean advances the interval, Struggled resets it, and Shaky repeats.',
    badges: [
      { label: '+3d', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.08)' },
      { label: '+7d', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.08)' },
      { label: '+14d', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.08)' },
      { label: '+30d', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.08)' },
    ],
  },
  {
    num: '02',
    category: 'Automation & Metadata',
    title: 'Multi-Platform Sync',
    desc: 'Instant title, difficulty, and topic extraction for LeetCode (3,400+ problems indexed), Codeforces, HackerRank, GeeksForGeeks, and CodeChef.',
    platforms: ['LeetCode', 'Codeforces', 'GFG', 'HackerRank', 'CodeChef'],
  },
  {
    num: '03',
    category: 'Customization',
    title: 'Custom Columns & Tags',
    desc: 'Add custom fields to your tracker — Approach Summary, Time Complexity, Target Company, Patterns — visible across all views and problem details.',
    tags: ['Approach', 'O(N log N)', 'Two Pointers', 'Google / Meta'],
  },
  {
    num: '04',
    category: 'Privacy & Ownership',
    title: 'Your Data, Your Control',
    desc: 'No algorithmic noise, no gamification dark patterns, no daily streak anxiety. Just your problems, your revision schedule, your pace.',
    pills: ['100% Free', 'Local-First Data', 'Full Export'],
  },
];

export function Capabilities() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="capabilities" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px 120px' }}>
      <div ref={ref}>
        {/* Section Header */}
        <div style={{ marginBottom: '64px' }}>
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px',
              color: '#888',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Capabilities
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(32px, 4vw, 52px)',
              color: '#f0f0f0',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Built specifically for mastering DSA.
          </h2>
        </div>

        {/* 2×2 Grid */}
        <div
          className="capabilities-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
        >
          {CARDS.map((card, i) => {
            const isHovered = hoveredIndex === i;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'relative',
                  background: isHovered ? '#0e0e0e' : '#080808',
                  border: isHovered ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid #141414',
                  borderRadius: '12px',
                  padding: '44px 40px',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default',
                  overflow: 'hidden',
                  boxShadow: isHovered ? '0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' : 'none',
                }}
              >
                {/* Subtle top accent line on hover */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: isHovered ? 'linear-gradient(90deg, #ff6b00, rgba(255,107,0,0.2))' : 'transparent',
                    transition: 'background 0.25s ease',
                  }}
                />

                {/* Top bar: Number & Category + Arrow */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        fontSize: '11px',
                        color: isHovered ? '#ff6b00' : '#444',
                        fontWeight: 600,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {card.num}
                    </span>
                    <span style={{ color: '#222' }}>/</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-geist-mono), monospace',
                        fontSize: '10px',
                        color: isHovered ? '#888' : '#666',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {card.category}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono), monospace',
                      fontSize: '14px',
                      color: isHovered ? '#f0f0f0' : '#2a2a2a',
                      transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    ↗
                  </span>
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: '22px',
                    color: isHovered ? '#ffffff' : '#e5e5e5',
                    fontWeight: 500,
                    marginBottom: '14px',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {card.title}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: '14px',
                    color: isHovered ? '#888888' : '#555555',
                    lineHeight: 1.7,
                    margin: 0,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {card.desc}
                </p>

                {/* Visual Feature Badges */}
                <div style={{ marginTop: '28px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {card.badges &&
                    card.badges.map((b) => (
                      <span
                        key={b.label}
                        style={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '11px',
                          fontWeight: 500,
                          color: b.color,
                          background: b.bg,
                          border: `1px solid ${b.color}22`,
                          borderRadius: '6px',
                          padding: '3px 10px',
                        }}
                      >
                        {b.label}
                      </span>
                    ))}

                  {card.platforms &&
                    card.platforms.map((p) => (
                      <span
                        key={p}
                        style={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '10px',
                          color: isHovered ? '#aaa' : '#444',
                          background: '#111',
                          border: '1px solid #1a1a1a',
                          borderRadius: '6px',
                          padding: '3px 9px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {p}
                      </span>
                    ))}

                  {card.tags &&
                    card.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '10px',
                          color: isHovered ? '#818cf8' : '#444',
                          background: 'rgba(129, 140, 248, 0.05)',
                          border: '1px solid rgba(129, 140, 248, 0.12)',
                          borderRadius: '6px',
                          padding: '3px 9px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {t}
                      </span>
                    ))}

                  {card.pills &&
                    card.pills.map((pil) => (
                      <span
                        key={pil}
                        style={{
                          fontFamily: 'var(--font-geist-mono), monospace',
                          fontSize: '10px',
                          color: isHovered ? '#4ade80' : '#444',
                          background: 'rgba(74, 222, 128, 0.05)',
                          border: '1px solid rgba(74, 222, 128, 0.12)',
                          borderRadius: '6px',
                          padding: '3px 9px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {pil}
                      </span>
                    ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #capabilities { padding: 0 24px 80px !important; }
          .capabilities-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </section>
  );
}
