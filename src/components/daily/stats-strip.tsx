'use client';

type StatsStripProps = {
  streak: number;
  totalProblems: number;
  masteredCount: number;
  dueCount: number;
};

function Dot() {
  return <span style={{ color: '#444', margin: '0 14px', fontSize: 14 }}>·</span>;
}

export function StatsStrip({ streak, totalProblems, masteredCount, dueCount }: StatsStripProps) {
  const streakColor = streak === 0 ? '#444' : '#fff';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 32,
        fontSize: 13,
      }}
    >
      {/* Streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 18 }}>🔥</span>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 20,
            fontWeight: 600,
            color: streakColor,
          }}
        >
          {streak}
        </span>
        <span style={{ color: '#888', fontSize: 13 }}>day streak</span>
      </div>

      <Dot />

      {/* Total */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 14, fontWeight: 600, color: '#fff' }}>
          {totalProblems}
        </span>
        <span style={{ color: '#888' }}>problems</span>
      </div>

      <Dot />

      {/* Mastered */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 14, fontWeight: 600, color: '#818cf8' }}>
          {masteredCount}
        </span>
        <span style={{ color: '#888' }}>mastered</span>
      </div>

      <Dot />

      {/* Due today */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 14,
            fontWeight: 600,
            color: dueCount > 0 ? '#fb923c' : '#fff',
          }}
        >
          {dueCount}
        </span>
        <span style={{ color: '#888' }}>due today</span>
      </div>
    </div>
  );
}
