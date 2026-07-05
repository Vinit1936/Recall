'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type ToolbarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  difficultyFilter: string[];
  onDifficultyChange: (v: string[]) => void;
  statusFilter: string[];
  onStatusChange: (v: string[]) => void;
  sort: string;
  onSortChange: (v: string) => void;
};

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const STATUSES = ['ACTIVE', 'MASTERED', 'RETIRED'];
const SORT_OPTIONS = [
  { value: 'nextRevision', label: 'Next Revision (default)' },
  { value: 'problemNumber', label: 'Problem Number' },
  { value: 'dateAdded', label: 'Date Added' },
  { value: 'difficulty', label: 'Difficulty' },
];

function DropdownMenu({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 6,
          color: '#888',
          cursor: 'pointer',
          fontSize: 13,
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 4,
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            padding: '6px',
            zIndex: 50,
            minWidth: 160,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 8px',
        cursor: 'pointer',
        borderRadius: 4,
        fontSize: 13,
        color: '#ccc',
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: '#818cf8' }} />
      {label.charAt(0) + label.slice(1).toLowerCase()}
    </label>
  );
}

export function Toolbar({
  search, onSearchChange,
  difficultyFilter, onDifficultyChange,
  statusFilter, onStatusChange,
  sort, onSortChange,
}: ToolbarProps) {
  const toggleDifficulty = (d: string) => {
    onDifficultyChange(difficultyFilter.includes(d)
      ? difficultyFilter.filter((x) => x !== d)
      : [...difficultyFilter, d]);
  };
  const toggleStatus = (s: string) => {
    onStatusChange(statusFilter.includes(s)
      ? statusFilter.filter((x) => x !== s)
      : [...statusFilter, s]);
  };

  const [searchVal, setSearchVal] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (v: string) => {
    setSearchVal(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearchChange(v), 150);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }}>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          value={searchVal}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search problems..."
          style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 6,
            color: '#fff',
            fontSize: 13,
            padding: '6px 12px 6px 32px',
            outline: 'none',
            width: 220,
          }}
        />
      </div>

      {/* Filter dropdown */}
      <DropdownMenu label={difficultyFilter.length + statusFilter.length > 0 ? `Filters (${difficultyFilter.length + statusFilter.length})` : 'Filter'}>
        <div style={{ padding: '2px 4px 6px', fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Difficulty</div>
        {DIFFICULTIES.map((d) => (
          <CheckItem key={d} label={d} checked={difficultyFilter.includes(d)} onChange={() => toggleDifficulty(d)} />
        ))}
        <div style={{ borderTop: '1px solid #2a2a2a', margin: '6px 0' }} />
        <div style={{ padding: '2px 4px 6px', fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</div>
        {STATUSES.map((s) => (
          <CheckItem key={s} label={s} checked={statusFilter.includes(s)} onChange={() => toggleStatus(s)} />
        ))}
      </DropdownMenu>

      {/* Sort dropdown */}
      <DropdownMenu label={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'}>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            style={{
              display: 'block',
              width: '100%',
              background: sort === opt.value ? '#252525' : 'none',
              border: 'none',
              borderRadius: 4,
              color: sort === opt.value ? '#fff' : '#ccc',
              cursor: 'pointer',
              fontSize: 13,
              padding: '5px 8px',
              textAlign: 'left',
            }}
          >
            {opt.label}
          </button>
        ))}
      </DropdownMenu>
    </div>
  );
}
