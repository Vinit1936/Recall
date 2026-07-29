'use client';

import { formatDistanceToNow, startOfDay } from 'date-fns';
import { getDifficultyStyle, getTopicColor, Pill } from './columns';
import { useState, useRef, useEffect } from 'react';

// LeetCode logo — orange square with white LC text per spec
function LCIcon() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        background: '#FFA116',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        color: '#fff',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '-0.5px',
        flexShrink: 0,
      }}
    >
      LC
    </span>
  );
}

// Status dot + label — derives from problem.status and revisions[0].confidence
function StatusCell({ problem }: { problem: any }) {
  if (problem.status === 'MASTERED') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#a78bfa', fontFamily: 'var(--font-geist-mono), monospace' }}>Mastered</span>
      </div>
    );
  }
  if (problem.status === 'RETIRED') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#444', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#555', fontFamily: 'var(--font-geist-mono), monospace' }}>Retired</span>
      </div>
    );
  }

  const latestConfidence = problem.revisions?.[0]?.confidence ?? null;

  if (!latestConfidence || problem.revisionCount === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#555', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#666', fontFamily: 'var(--font-geist-mono), monospace' }}>Not started</span>
      </div>
    );
  }

  if (latestConfidence === 'CLEAN') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#4ade80', fontFamily: 'var(--font-geist-mono), monospace' }}>Clean</span>
      </div>
    );
  }
  if (latestConfidence === 'SHAKY') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fb923c', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#fb923c', fontFamily: 'var(--font-geist-mono), monospace' }}>Shaky</span>
      </div>
    );
  }
  // STRUGGLED
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#f87171', fontFamily: 'var(--font-geist-mono), monospace' }}>Struggled</span>
    </div>
  );
}

// Next revision date cell
function NextRevisionCell({ problem }: { problem: any }) {
  if (problem.status === 'MASTERED') {
    return <span style={{ fontSize: 13, color: '#a78bfa', fontFamily: 'var(--font-geist-mono), monospace' }}>Mastered ✓</span>;
  }
  if (problem.status === 'RETIRED' || !problem.nextRevisionAt) {
    return <span style={{ fontSize: 13, color: '#444', fontFamily: 'var(--font-geist-mono), monospace' }}>—</span>;
  }

  const date = new Date(problem.nextRevisionAt);
  const now = new Date();
  const todayStart = startOfDay(now);
  const dateStart = startOfDay(date);

  const label = formatDistanceToNow(date, { addSuffix: true });
  const isOverdue = dateStart < todayStart;
  const isDueToday = dateStart.getTime() === todayStart.getTime();

  const color = isOverdue ? '#f87171' : isDueToday ? '#fb923c' : '#888';
  const text = isDueToday ? 'today' : label;

  return <span style={{ fontSize: 13, color, fontFamily: 'var(--font-geist-mono), monospace', fontVariantNumeric: 'tabular-nums' }}>{text}</span>;
}

// Star toggle — filled ★ yellow when favorite, outline ☆ #444 when not
function StarCell({ problem, onToggle }: { problem: any; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontSize: 16, lineHeight: 1 }}
      title={problem.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {problem.isFavorite ? (
        <span style={{ color: '#facc15' }}>★</span>
      ) : (
        <span style={{ color: hovered ? '#888' : '#444' }}>☆</span>
      )}
    </button>
  );
}

// Editable custom field cell
function CustomFieldCell({ problem, columnName, onSave }: { problem: any; columnName: string; onSave: (val: string) => void }) {
  const [editing, setEditing] = useState(false);
  const fields = (problem.customFields as Record<string, string>) ?? {};
  const [value, setValue] = useState(fields[columnName] ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => { setEditing(false); onSave(value); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { setEditing(false); onSave(value); } if (e.key === 'Escape') setEditing(false); }}
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 4,
          color: '#fff',
          fontSize: 13,
          padding: '2px 6px',
          width: '100%',
          outline: 'none',
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      style={{ fontSize: 13, color: '#888', cursor: 'text', minHeight: 20, padding: '1px 0' }}
    >
      {value || <span style={{ color: '#333' }}>—</span>}
    </div>
  );
}

type ProblemRowProps = {
  problem: any;
  columns: any[];
  onStarToggle: (id: string, current: boolean) => void;
  onCustomFieldSave: (id: string, columnName: string, value: string) => void;
};

export function ProblemRow({ problem, columns, onStarToggle, onCustomFieldSave }: ProblemRowProps) {
  const [hovered, setHovered] = useState(false);
  const diffStyle = getDifficultyStyle(problem.difficulty);
  const topicColor = getTopicColor(problem.topic);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#161616' : 'transparent',
        borderBottom: '1px solid #1c1c1c',
        height: 44,
        transition: 'background 0s',
      }}
    >
      {/* Platform */}
      <td style={{ width: 52, textAlign: 'center', padding: '0 8px' }}>
        <LCIcon />
      </td>

      {/* Problem: number + title on same line */}
      <td style={{ padding: '0 12px', minWidth: 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: '#666', fontWeight: 400, flexShrink: 0 }}>
            {problem.problemNumber}
          </span>
          {problem.url ? (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 14,
                color: '#e5e5e5',
                fontWeight: 500,
                textDecoration: hovered ? 'underline' : 'none',
                cursor: 'pointer',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {problem.title}
            </a>
          ) : (
            <span style={{ fontSize: 14, color: '#e5e5e5', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
              {problem.title}
              <span style={{ color: '#444', fontSize: 12, textDecoration: 'line-through' }}>🔗</span>
            </span>
          )}
        </div>
      </td>

      {/* Difficulty */}
      <td style={{ width: 100, padding: '0 8px' }}>
        <Pill bg={diffStyle.bg} text={diffStyle.text} border={diffStyle.border}>
          {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
        </Pill>
      </td>

      {/* Topic */}
      <td style={{ width: 130, padding: '0 8px' }}>
        <Pill bg={topicColor.bg} text={topicColor.text} border={topicColor.border}>{problem.topic}</Pill>
      </td>

      {/* Status */}
      <td style={{ width: 120, padding: '0 8px' }}>
        <StatusCell problem={problem} />
      </td>

      {/* Star */}
      <td style={{ width: 44, textAlign: 'center', padding: 0 }}>
        <StarCell problem={problem} onToggle={() => onStarToggle(problem.id, problem.isFavorite)} />
      </td>

      {/* Next Revision */}
      <td style={{ width: 130, padding: '0 8px' }}>
        <NextRevisionCell problem={problem} />
      </td>

      {/* Notes — truncated at 40 chars */}
      <td style={{ width: 180, padding: '0 12px' }}>
        {problem.notes && (
          <span style={{ fontSize: 13, color: '#666', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
            {problem.notes.length > 40 ? problem.notes.slice(0, 40) + '…' : problem.notes}
          </span>
        )}
      </td>

      {/* Custom columns */}
      {columns.map((col) => (
        <td key={col.id} style={{ width: 140, padding: '0 8px' }}>
          <CustomFieldCell
            problem={problem}
            columnName={col.name}
            onSave={(val) => onCustomFieldSave(problem.id, col.name, val)}
          />
        </td>
      ))}
    </tr>
  );
}
