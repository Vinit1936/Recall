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
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#a1a1aa',
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
              border: '1px solid #2e2e34',
              borderRadius: '8px',
              background: '#121215',
            }}
          >
            <PlatformLogo platform={p.id} size={18} padding={1} />
            <span
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '13px',
                color: '#e5e5e5',
                fontWeight: 500,
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
