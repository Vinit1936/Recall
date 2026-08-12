'use client';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { StatsStrip } from '@/components/daily/stats-strip';
import { NotionTableHeader } from '@/components/daily/table-header';
import { ProblemRevisionRow } from '@/components/daily/problem-row';
import { AllDone } from '@/components/daily/all-done';
import { EmptyState } from '@/components/daily/empty-state';
import { ContributionHeatmap } from '@/components/heatmap';

import { fetcher } from '@/lib/fetcher';

export default function DailyRevisionPage() {
  const { mutate } = useSWRConfig();
  const { data: dueProblems, isLoading: dueLoading } = useSWR('/api/problems/due', fetcher);
  const { data: allProblems } = useSWR('/api/problems', fetcher);
  const { data: streakData } = useSWR('/api/streak', fetcher);
  const { data: activity } = useSWR('/api/activity', fetcher);

  const [mounted, setMounted] = useState(false);
  const [revisedIds, setRevisedIds] = useState<Set<string>>(new Set());
  const [showAllOverdue, setShowAllOverdue] = useState(false);
  const [toast, setToast] = useState('');
  const OVERDUE_LIMIT = 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDailyLoading = !mounted || (dueLoading && !dueProblems);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRevised = (id: string) => {
    setRevisedIds((prev) => new Set(prev).add(id));
    mutate('/api/problems/due');
    mutate('/api/streak');
    mutate('/api/activity');
    mutate('/api/problems');
  };

  const dueList = Array.isArray(dueProblems) ? dueProblems : [];
  const allList = Array.isArray(allProblems) ? allProblems : [];

  const totalProblems = allList.length;
  const masteredCount = allList.filter((p: any) => p.status === 'MASTERED').length;
  const dueCount = dueList.length;
  const streak = streakData?.currentStreak ?? 0;

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const overdue = dueList.filter((p: any) => new Date(p.nextRevisionAt) < todayMidnight);
  const dueToday = dueList.filter((p: any) => new Date(p.nextRevisionAt) >= todayMidnight);

  const unrevisedDue = dueList.filter((p: any) => !revisedIds.has(p.id));
  const allDone = dueList.length > 0 && unrevisedDue.length === 0;
  const dateLabel = format(today, 'EEEE, MMMM d');

  return (
    <div style={{ maxWidth: 1150, margin: '0 auto', paddingBottom: 48 }}>
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#1a1a1e',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            borderRadius: 6,
            color: '#f87171',
            fontSize: 13,
            fontWeight: 500,
            padding: '8px 16px',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {toast}
        </div>
      )}

      {/* Notion-style Page Header */}
      <div data-daily-header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
          Daily Revision
        </h1>
        <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: '#666' }}>
          {dateLabel}
        </span>
      </div>

      {/* Minimal Inline Metadata Strip */}
      <StatsStrip
        streak={streak}
        totalProblems={totalProblems}
        masteredCount={masteredCount}
        dueCount={dueCount}
        overdueCount={overdue.length}
        todayCompleted={streakData?.todayCompleted}
      />

      {/* Hero Questions Table Area */}
      <AnimatePresence mode="wait">
        {isDailyLoading ? (
          <div style={{ border: '1px solid #1e1e1e', borderRadius: 8, background: '#111112', overflow: 'hidden' }}>
            <NotionTableHeader />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ height: 48, borderBottom: '1px solid #1c1c1e', background: '#141416', opacity: 0.5 }} />
              ))}
            </div>
          </div>
        ) : dueList.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState />
          </motion.div>
        ) : allDone ? (
          <AllDone key="done" streak={streak} />
        ) : (
          <motion.div
            key="table-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              border: '1px solid #1e1e1e',
              borderRadius: 8,
              background: '#111112',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <NotionTableHeader />

            {/* Overdue Section */}
            {overdue.length > 0 && (
              <div>
                <div
                  style={{
                    padding: '7px 16px',
                    background: '#131315',
                    borderBottom: '1px solid #1c1c1e',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#f87171', opacity: 0.8 }} />
                    Overdue ({overdue.length})
                  </div>
                  {overdue.length > OVERDUE_LIMIT && (
                    <button
                      onClick={() => setShowAllOverdue(!showAllOverdue)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f87171',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: 'none',
                        letterSpacing: 'normal',
                      }}
                    >
                      {showAllOverdue ? 'Hide extra ▲' : `Show all (${overdue.length}) ▼`}
                    </button>
                  )}
                </div>

                {(showAllOverdue ? overdue : overdue.slice(0, OVERDUE_LIMIT)).map((p: any) => (
                  <ProblemRevisionRow key={p.id} problem={p} onRevised={handleRevised} onToast={showToast} />
                ))}

                {overdue.length > OVERDUE_LIMIT && !showAllOverdue && (
                  <button
                    onClick={() => setShowAllOverdue(true)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: '#141416',
                      border: 'none',
                      borderBottom: '1px solid #1c1c1e',
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#a1a1aa',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = '#18181b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#a1a1aa';
                      e.currentTarget.style.background = '#141416';
                    }}
                  >
                    <span>Show all {overdue.length} overdue problems (+{overdue.length - OVERDUE_LIMIT} hidden)</span>
                    <span style={{ fontSize: 10 }}>▼</span>
                  </button>
                )}
              </div>
            )}

            {/* Due Today Section */}
            {dueToday.length > 0 && (
              <div>
                {overdue.length > 0 && (
                  <div
                    style={{
                      padding: '8px 16px',
                      background: '#131416',
                      borderBottom: '1px solid #1c1c1e',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Due Today ({dueToday.length})
                  </div>
                )}
                {dueToday.map((p: any) => (
                  <ProblemRevisionRow key={p.id} problem={p} onRevised={handleRevised} onToast={showToast} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heatmap Section */}
      <div style={{ marginTop: 40 }}>
        <ContributionHeatmap activity={Array.isArray(activity) ? activity : []} />
      </div>
    </div>
  );
}


