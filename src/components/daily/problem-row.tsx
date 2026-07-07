'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getDifficultyStyle, getTopicColor, Pill } from '@/components/problems-table/columns';

type Confidence = 'CLEAN' | 'SHAKY' | 'STRUGGLED';

type ProblemRowProps = {
  problem: any;
  onRevised: (id: string) => void;
  onToast: (msg: string) => void;
};

// Confidence button colors
const CONF_COLORS: Record<Confidence, { done_bg: string; done_text: string; label: string }> = {
  CLEAN:     { done_bg: '#1a3a1a', done_text: '#4ade80', label: 'Clean' },
  SHAKY:     { done_bg: '#3a2a0a', done_text: '#fb923c', label: 'Shaky' },
  STRUGGLED: { done_bg: '#3a0a0a', done_text: '#f87171', label: 'Struggled' },
};

// LeetCode icon
function LCIcon({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        background: '#1a1209',
        border: '1px solid #3a2a0a',
        borderRadius: 4,
        fontSize: 8,
        fontWeight: 700,
        color: '#FFA116',
        fontFamily: 'var(--font-geist-mono), monospace',
        flexShrink: 0,
      }}
    >
      LC
    </span>
  );
}

export function ProblemRevisionRow({ problem, onRevised, onToast }: ProblemRowProps) {
  const [done, setDone] = useState(false);
  const [chosenConf, setChosenConf] = useState<Confidence | null>(null);
  const [loadingConf, setLoadingConf] = useState<Confidence | null>(null);
  const [hovered, setHovered] = useState(false);

  const diffStyle = getDifficultyStyle(problem.difficulty);
  const [topicBg, topicText] = getTopicColor(problem.topic);

  const handleConfidence = async (conf: Confidence) => {
    setLoadingConf(conf);
    try {
      const res = await fetch(`/api/problems/${problem.id}/revise`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confidence: conf }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? 'Failed');
      }
      setChosenConf(conf);
      setDone(true);
      onRevised(problem.id);
    } catch (e: any) {
      onToast(e.message ?? 'Failed to submit revision');
    } finally {
      setLoadingConf(null);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 52,
        background: done ? '#0d0d0d' : hovered ? '#161616' : '#111111',
        border: '1px solid #1e1e1e',
        borderRadius: 8,
        marginBottom: 6,
        padding: '0 16px',
        gap: 12,
        transition: 'background 0.1s',
      }}
    >
      {/* Left side */}
      <LCIcon size={20} />

      <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: '#666', flexShrink: 0 }}>
        {problem.problemNumber}
      </span>

      <span
        style={{
          fontSize: 14,
          color: done ? '#555' : '#fff',
          maxWidth: 320,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textDecoration: done ? 'line-through' : 'none',
          transition: 'color 0.2s, text-decoration 0.2s',
        }}
      >
        {problem.title}
      </span>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Pill bg={diffStyle.bg} text={diffStyle.text}>
          {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
        </Pill>

        <Pill bg={topicBg} text={topicText}>{problem.topic}</Pill>

        {/* Confidence buttons / done badge */}
        <AnimatePresence mode="wait">
          {done && chosenConf ? (
            <motion.span
              key="done-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                background: CONF_COLORS[chosenConf].done_bg,
                color: CONF_COLORS[chosenConf].done_text,
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                padding: '3px 10px',
              }}
            >
              {CONF_COLORS[chosenConf].label} ✓
            </motion.span>
          ) : (
            <motion.div
              key="conf-buttons"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', gap: 6 }}
            >
              {(['CLEAN', 'SHAKY', 'STRUGGLED'] as Confidence[]).map((conf) => (
                <button
                  key={conf}
                  onClick={() => handleConfidence(conf)}
                  disabled={loadingConf !== null}
                  style={{
                    background: 'none',
                    border: '1px solid #2a2a2a',
                    borderRadius: 5,
                    color: loadingConf === conf ? '#555' : '#888',
                    cursor: loadingConf !== null ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    padding: '3px 10px',
                    transition: 'color 0.1s, border-color 0.1s',
                  }}
                >
                  {loadingConf === conf ? '…' : conf.charAt(0) + conf.slice(1).toLowerCase()}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link icon */}
        {problem.url && (
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open problem"
            style={{
              color: '#444',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M8 1h5m0 0v5m0-5L7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
