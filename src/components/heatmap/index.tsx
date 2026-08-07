'use client';

import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

type ActivityEntry = { date: string; count: number };

type HeatmapProps = {
  activity: ActivityEntry[];
};

// LeetCode dark mode green color scale tuned for app dark UI
function getColor(count: number): string {
  if (count === 0) return '#1e1e20';
  if (count === 1) return '#0e4429';
  if (count <= 3) return '#006d32';
  if (count <= 6) return '#26a641';
  return '#39d353';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ContributionHeatmap({ activity }: HeatmapProps) {
  const { weeks, monthLabels, todayStr, totalSubmissions, totalActiveDays, maxStreak } = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Build activity map
    const actMap: Record<string, number> = {};
    let totalSubmissions = 0;
    let totalActiveDays = 0;

    for (const entry of activity) {
      actMap[entry.date] = entry.count;
      totalSubmissions += entry.count;
      if (entry.count > 0) totalActiveDays++;
    }

    // Start from 52 weeks ago
    const start = new Date(today);
    start.setDate(start.getDate() - 52 * 7 - start.getDay());

    const weeks: { date: string; count: number }[][] = [];
    const monthLabels: { month: string; col: number }[] = [];

    let current = new Date(start);
    let lastMonth = -1;
    let currentStreak = 0;
    let maxStreak = 0;

    // Calculate max streak & build grid
    for (let w = 0; w < 53; w++) {
      const week: { date: string; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().split('T')[0];
        const count = actMap[dateStr] ?? 0;
        week.push({ date: dateStr, count });

        // Max streak tracking
        if (dateStr <= todayStr) {
          if (count > 0) {
            currentStreak++;
            if (currentStreak > maxStreak) maxStreak = currentStreak;
          } else {
            currentStreak = 0;
          }
        }

        // Track month label changes
        const m = current.getMonth();
        if (d === 0 && m !== lastMonth) {
          monthLabels.push({ month: MONTHS[m], col: w });
          lastMonth = m;
        }
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    return { weeks, monthLabels, todayStr, totalSubmissions, totalActiveDays, maxStreak };
  }, [activity]);

  const CELL = 11;
  const GAP = 3;
  const DAY_LABEL_W = 28;

  return (
    <TooltipProvider delay={0}>
      <div
        style={{
          background: '#111112',
          border: '1px solid #1e1e1e',
          borderRadius: 8,
          padding: '20px 24px',
        }}
      >
        {/* LeetCode Header Stats Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Left: Total Submissions */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 14, color: '#aaa' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-geist-mono), monospace' }}>
              {totalSubmissions}
            </span>
            <span>revisions in the past one year</span>
          </div>

          {/* Right: Total Active Days & Max Streak */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, color: '#aaa' }}>
            <div>
              Total active days:{' '}
              <strong style={{ color: '#fff', fontWeight: 600, fontFamily: 'var(--font-geist-mono), monospace' }}>
                {totalActiveDays}
              </strong>
            </div>
            <div>
              Max streak:{' '}
              <strong style={{ color: '#fff', fontWeight: 600, fontFamily: 'var(--font-geist-mono), monospace' }}>
                {maxStreak}
              </strong>
            </div>
          </div>
        </div>

        {/* Grid Container */}
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content', margin: '0 auto' }}>
            {/* Month labels */}
            <div style={{ display: 'flex', marginLeft: DAY_LABEL_W, marginBottom: 6 }}>
              {weeks.map((_, wi) => {
                const label = monthLabels.find((m) => m.col === wi);
                return (
                  <div key={wi} style={{ width: CELL + GAP, flexShrink: 0 }}>
                    {label && (
                      <span style={{ fontSize: 11, color: '#777', fontFamily: 'var(--font-geist-mono), monospace' }}>
                        {label.month}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div style={{ display: 'flex', gap: 0 }}>
              {/* Day labels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 6, width: DAY_LABEL_W - 6, flexShrink: 0 }}>
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <div key={d} style={{ height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {[1, 3, 5].includes(d) && (
                      <span style={{ fontSize: 10, color: '#666', fontFamily: 'var(--font-geist-mono), monospace' }}>
                        {DAYS[d].slice(0, 3)}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div style={{ display: 'flex', gap: GAP }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                    {week.map((day) => {
                      const isToday = day.date === todayStr;
                      const isFuture = day.date > todayStr;
                      return (
                        <Tooltip key={day.date}>
                          <TooltipTrigger>
                            <div
                              style={{
                                width: CELL,
                                height: CELL,
                                borderRadius: 2.5,
                                background: isFuture ? 'transparent' : getColor(day.count),
                                border: isToday ? '1px solid #fff' : '1px solid transparent',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'transform 0.1s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.25)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            style={{
                              background: '#1c1c1f',
                              border: '1px solid #2e2e34',
                              color: '#fff',
                              padding: '6px 12px',
                              borderRadius: 6,
                              fontSize: 12,
                              boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
                              whiteSpace: 'nowrap',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                color: day.count > 0 ? '#34d399' : '#888',
                                fontFamily: 'var(--font-geist-mono), monospace',
                              }}
                            >
                              {day.count === 0 ? 'No' : day.count} {day.count === 1 ? 'revision' : 'revisions'}
                            </span>
                            <span style={{ color: '#777' }}>on {formatDate(day.date)}</span>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 14 }}>
              <span style={{ fontSize: 11, color: '#777', fontFamily: 'var(--font-geist-mono), monospace' }}>Less</span>
              {[0, 1, 2, 4, 7].map((count) => (
                <div key={count} style={{ width: CELL, height: CELL, borderRadius: 2.5, background: getColor(count) }} />
              ))}
              <span style={{ fontSize: 11, color: '#777', fontFamily: 'var(--font-geist-mono), monospace' }}>More</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

