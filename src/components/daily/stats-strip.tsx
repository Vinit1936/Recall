'use client';

type StatsStripProps = {
  streak: number;
  totalProblems: number;
  masteredCount: number;
  dueCount: number;
  overdueCount?: number;
  todayCompleted?: boolean;
};

export function StatsStrip({
  streak,
  totalProblems,
  masteredCount,
  dueCount,
  overdueCount = 0,
  todayCompleted = false,
}: StatsStripProps) {
  const isFlameLit = streak > 0 || todayCompleted;

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Minimalist Hero Streak Display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 28, filter: isFlameLit ? 'none' : 'grayscale(1) opacity(0.4)', transition: 'filter 0.2s' }}>
          🔥
        </span>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 38,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {streak}
        </span>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#888', letterSpacing: '-0.01em' }}>
          {streak === 1 ? 'day streak' : 'day streak'}
        </span>
      </div>

      {/* Clean secondary inline metadata */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#777' }}>
        <span>
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 600, color: '#ececec' }}>
            {dueCount}
          </span>{' '}
          due today {overdueCount > 0 && <span style={{ color: '#666' }}>({overdueCount} overdue)</span>}
        </span>
        <span style={{ color: '#333' }}>·</span>
        <span>
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 600, color: '#ececec' }}>
            {totalProblems}
          </span>{' '}
          total problems
        </span>
        <span style={{ color: '#333' }}>·</span>
        <span>
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontWeight: 600, color: '#ececec' }}>
            {masteredCount}
          </span>{' '}
          mastered
        </span>
      </div>
    </div>
  );
}





