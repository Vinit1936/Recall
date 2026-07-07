'use client';

import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ActivityEntry = { date: string; count: number };

type HeatmapProps = {
  activity: ActivityEntry[];
};

function getColor(count: number): string {
  if (count === 0)   return '#1a1a1a';
  if (count === 1)   return '#1a3a2a';
  if (count <= 3)    return '#1e5c3a';
  if (count <= 6)    return 'rgba(34, 197, 94, 0.6)';
  return '#22c55e';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ContributionHeatmap({ activity }: HeatmapProps) {
  const { weeks, monthLabels, todayStr } = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Build activity map
    const actMap: Record<string, number> = {};
    for (const entry of activity) actMap[entry.date] = entry.count;

    // Start from 52 weeks + current week ago (Sunday)
    const start = new Date(today);
    start.setDate(start.getDate() - (52 * 7) - start.getDay());

    // Build weeks array: each week is 7 days (Sun–Sat)
    const weeks: { date: string; count: number }[][] = [];
    const monthLabels: { month: string; col: number }[] = [];

    let current = new Date(start);
    let lastMonth = -1;

    for (let w = 0; w < 53; w++) {
      const week: { date: string; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().split('T')[0];
        week.push({ date: dateStr, count: actMap[dateStr] ?? 0 });

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

    return { weeks, monthLabels, todayStr };
  }, [activity]);

  const CELL = 12;
  const GAP = 2;
  const DAY_LABEL_W = 30;
  const cellStep = CELL + GAP;

  return (
    <div>
      {/* Section header */}
      <div style={{ fontSize: 16, color: '#888', marginBottom: 16, fontWeight: 500 }}>
        ⌈ Activity ⌋
      </div>

      <div style={{ overflowX: 'auto' }}>
        {/* Month labels */}
        <div style={{ display: 'flex', marginLeft: DAY_LABEL_W, marginBottom: 4 }}>
          {weeks.map((_, wi) => {
            const label = monthLabels.find((m) => m.col === wi);
            return (
              <div key={wi} style={{ width: cellStep, flexShrink: 0 }}>
                {label && (
                  <span style={{ fontSize: 11, color: '#555', fontFamily: 'var(--font-geist-mono), monospace' }}>
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
                  <span style={{ fontSize: 10, color: '#555', fontFamily: 'var(--font-geist-mono), monospace' }}>
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
                            borderRadius: 2,
                            background: isFuture ? 'transparent' : getColor(day.count),
                            border: isToday ? '1px solid #444' : '1px solid transparent',
                            cursor: 'default',
                            flexShrink: 0,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" style={{ fontSize: 12 }}>
                        {day.count === 0
                          ? `No revisions on ${formatDate(day.date)}`
                          : `${day.count} revision${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, marginLeft: DAY_LABEL_W }}>
          <span style={{ fontSize: 11, color: '#555', fontFamily: 'var(--font-geist-mono), monospace' }}>Less</span>
          {[0, 1, 2, 4, 7].map((count) => (
            <div key={count} style={{ width: CELL, height: CELL, borderRadius: 2, background: getColor(count) }} />
          ))}
          <span style={{ fontSize: 11, color: '#555', fontFamily: 'var(--font-geist-mono), monospace' }}>More</span>
        </div>
      </div>
    </div>
  );
}
