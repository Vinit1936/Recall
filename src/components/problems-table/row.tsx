'use client';

import { formatDistanceToNow, isToday, isPast, startOfDay } from 'date-fns';
import { getDifficultyStyle, getTopicColor, Pill } from './columns';
import { useState, useRef, useEffect } from 'react';

// LeetCode logo monogram
function LCIcon() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        background: '#1a1209',
        border: '1px solid #3a2a0a',
        borderRadius: 5,
        fontSize: 9,
        fontWeight: 700,
        color: '#FFA116',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '-0.5px',
      }}
    >
      LC
    </span>
  );
}

// Status dot + label
function StatusCell({ problem }: { problem: any }) {
  if (problem.status === 'MASTERED') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#818cf8' }}>Mastered</span>
      </div>
    );
  }
  if (problem.status === 'RETIRED') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#555', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#555' }}>Retired</span>
      </div>
    );
  }
  if (problem.revisionCount === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#555', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#555' }}>Not started</span>
      </div>
    );
  }
  // Determine from last revision confidence — for now derive from step
  // step 0 = struggled/new, step 1/2 = shaky/mid, step 3 = clean
  const step = problem.currentStep;
  if (step === 3) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#4ade80' }}>Clean</span>
    </div>
  );
  if (step >= 1) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fb923c', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#fb923c' }}>Shaky</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#f87171' }}>Struggled</span>
    </div>
  );
}

// Next revision date cell
function NextRevisionCell({ problem }: { problem: any }) {
  if (problem.status === 'MASTERED') {
    return <span style={{ fontSize: 13, color: '#818cf8' }}>Mastered ✓</span>;
  }
  if (problem.status === 'RETIRED' || !problem.nextRevisionAt) {
    return <span style={{ fontSize: 13, color: '#444' }}>—</span>;
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

  return <span style={{ fontSize: 13, color, fontVariantNumeric: 'tabular-nums' }}>{text}</span>;
}

// Star toggle
function StarCell({ problem, onToggle }: { problem: any; onToggle: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}
      title={problem.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {problem.isFavorite ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="#facc15">
          <path d="M8 1l1.854 3.756 4.146.603-3 2.924.708 4.131L8 10.5l-3.708 1.914.708-4.131-3-2.924 4.146-.603L8 1z"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#444" strokeWidth="1.2">
          <path d="M8 1l1.854 3.756 4.146.603-3 2.924.708 4.131L8 10.5l-3.708 1.914.708-4.131-3-2.924 4.146-.603L8 1z"/>
        </svg>
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
  const [topicBg, topicText] = getTopicColor(problem.topic);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#141414' : 'transparent',
        borderBottom: '1px solid #1a1a1a',
        height: 44,
      }}
    >
      {/* Platform */}
      <td style={{ width: 48, textAlign: 'center', padding: '0 8px' }}>
        <LCIcon />
      </td>

      {/* Problem Name */}
      <td style={{ padding: '0 12px', minWidth: 280 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: '#666' }}>
            {problem.problemNumber}
          </span>
          {problem.url ? (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 14,
                color: '#fff',
                textDecoration: 'none',
                borderBottom: hovered ? '1px solid #555' : '1px solid transparent',
                transition: 'border-color 0.1s',
              }}
            >
              {problem.title}
            </a>
          ) : (
            <span style={{ fontSize: 14, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
              {problem.title}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#555" style={{ flexShrink: 0 }}>
                <path d="M2 6h8M6 2l4 4-4 4" stroke="#555" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
          )}
        </div>
      </td>

      {/* Difficulty */}
      <td style={{ width: 90, padding: '0 8px' }}>
        <Pill bg={diffStyle.bg} text={diffStyle.text}>
          {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
        </Pill>
      </td>

      {/* Topic */}
      <td style={{ width: 130, padding: '0 8px' }}>
        <Pill bg={topicBg} text={topicText}>{problem.topic}</Pill>
      </td>

      {/* Status */}
      <td style={{ width: 110, padding: '0 8px' }}>
        <StatusCell problem={problem} />
      </td>

      {/* Star */}
      <td style={{ width: 44, textAlign: 'center', padding: 0 }}>
        <StarCell problem={problem} onToggle={() => onStarToggle(problem.id, problem.isFavorite)} />
      </td>

      {/* Next Revision */}
      <td style={{ width: 120, padding: '0 8px' }}>
        <NextRevisionCell problem={problem} />
      </td>

      {/* Notes */}
      <td style={{ width: 160, padding: '0 12px' }}>
        {problem.notes && (
          <span style={{ fontSize: 13, color: '#888', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
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
