'use client';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { StatsStrip } from '@/components/daily/stats-strip';
import { ProblemRevisionRow } from '@/components/daily/problem-row';
import { AllDone } from '@/components/daily/all-done';
import { EmptyState } from '@/components/daily/empty-state';
import { ContributionHeatmap } from '@/components/heatmap';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DailyRevisionPage() {
  const { mutate } = useSWRConfig();
  const { data: dueProblems, isLoading: dueLoading } = useSWR('/api/problems/due', fetcher);
  const { data: allProblems } = useSWR('/api/problems', fetcher);
  const { data: streakData } = useSWR('/api/streak', fetcher);
  const { data: activity } = useSWR('/api/activity', fetcher);

  const [revisedIds, setRevisedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRevised = (id: string) => {
    const next = new Set(revisedIds).add(id);
    setRevisedIds(next);
    // Revalidate due list and streak once per revision
    mutate('/api/problems/due');
    mutate('/api/streak');
  };

  // Safely extract arrays
  const dueList = Array.isArray(dueProblems) ? dueProblems : [];
  const allList = Array.isArray(allProblems) ? allProblems : [];

  // Derived counts
  const totalProblems = allList.length;
  const masteredCount = allList.filter((p: any) => p.status === 'MASTERED').length;
  const dueCount = dueList.length;
  const streak = streakData?.currentStreak ?? 0;

  // Split into overdue vs today
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const overdue = dueList.filter((p: any) => new Date(p.nextRevisionAt) < todayMidnight);
  const dueToday = dueList.filter((p: any) => new Date(p.nextRevisionAt) >= todayMidnight);

  // All done when every problem in the due list has been revised this session
  const allDone = dueList.length > 0 && dueList.every((p: any) => revisedIds.has(p.id));

  const dateLabel = format(today, 'EEEE, MMMM d');

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#f87171', fontSize: 13, padding: '10px 16px', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          {toast}
        </div>
      )}

      {/* Stats strip */}
      <StatsStrip
        streak={streak}
        totalProblems={totalProblems}
        masteredCount={masteredCount}
        dueCount={dueCount}
      />

      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0 }}>
          ⌈ Daily Revision ⌋
        </h1>
        <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 14, color: '#666' }}>
          {dateLabel}
        </span>
      </div>

      {/* Problem list area */}
      <AnimatePresence mode="wait">
        {dueLoading ? (
          // Skeleton
          <div key="skeleton" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 52, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, opacity: 0.6 }} />
            ))}
          </div>
        ) : dueList.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState />
          </motion.div>
        ) : allDone ? (
          <AllDone key="done" streak={streak} />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overdue section */}
            {overdue.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#f87171' }}>⚠</span>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Overdue ({overdue.length})
                  </span>
                </div>
                {overdue.map((p: any) => (
                  <ProblemRevisionRow
                    key={p.id}
                    problem={p}
                    onRevised={handleRevised}
                    onToast={showToast}
                  />
                ))}
              </div>
            )}

            {/* Due today section */}
            {dueToday.length > 0 && (
              <div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Today ({dueToday.length})
                  </span>
                </div>
                {dueToday.map((p: any) => (
                  <ProblemRevisionRow
                    key={p.id}
                    problem={p}
                    onRevised={handleRevised}
                    onToast={showToast}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contribution heatmap */}
      <div style={{ marginTop: 48, paddingBottom: 48 }}>
        <ContributionHeatmap activity={Array.isArray(activity) ? activity : []} />
      </div>
    </div>
  );
}
