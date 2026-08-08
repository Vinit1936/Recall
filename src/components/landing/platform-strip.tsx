'use client';

import { PlatformLogo } from '@/lib/platforms/logos';

const PLATFORMS = [
  { id: 'LEETCODE', name: 'LeetCode' },
  { id: 'CODEFORCES', name: 'Codeforces' },
  { id: 'GFG', name: 'GeeksForGeeks' },
  { id: 'HACKERRANK', name: 'HackerRank' },
  { id: 'CODECHEF', name: 'CodeChef' },
];

export function PlatformStrip() {
  return (
    <section
      style={{
        padding: '80px 32px',
        borderTop: '1px solid #0f0f0f',
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#333333',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        Works with your favorite platforms
      </div>

      {/* 5 Platform Badges Row */}
      <div
        className="platform-badges-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {PLATFORMS.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              border: '1px solid #1a1a1a',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.01)',
            }}
          >
            <PlatformLogo platform={p.id} size={18} padding={1} />
            <span
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '13px',
                color: '#888888',
                fontWeight: 400,
              }}
            >
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
