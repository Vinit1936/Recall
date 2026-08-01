'use client';

import useSWR from 'swr';
import { useState, useCallback, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TabBar } from './tab-bar';
import { Toolbar } from './toolbar';
import { ProblemRow } from './row';
import { NewRow } from './new-row';
import { CustomCheckbox } from '@/components/ui/custom-checkbox';
import { Star, MoreVertical, Trash2 } from 'lucide-react';
import { getTopicColor } from '@/lib/topic-colors';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function ColumnHeaderMenu({ col, onDelete }: { col: any; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {col.name}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        style={{
          background: open ? 'rgba(255, 255, 255, 0.08)' : 'none',
          border: 'none',
          color: open ? '#ffffff' : hovered ? '#888' : 'transparent',
          cursor: 'pointer',
          padding: '2px 4px',
          borderRadius: 4,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s ease, background 0.15s ease',
          outline: 'none',
        }}
        title="Column settings"
      >
        <MoreVertical size={13} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: '#1a1a1c',
            border: '1px solid #2a2a2e',
            borderRadius: 6,
            padding: 4,
            zIndex: 100,
            width: 140,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete(col.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: 12,
              padding: '6px 10px',
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 4,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#2e1212')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <Trash2 size={13} />
            Delete column
          </button>
        </div>
      )}
    </div>
  );
}

function sortProblems(problems: any[], sort: string) {
  const arr = [...problems];
  switch (sort) {
    case 'problemNumber': return arr.sort((a, b) => a.problemNumber - b.problemNumber);
    case 'dateAdded':     return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'difficulty': {
      const order = { EASY: 0, MEDIUM: 1, HARD: 2 };
      return arr.sort((a, b) => (order[a.difficulty as keyof typeof order] ?? 0) - (order[b.difficulty as keyof typeof order] ?? 0));
    }
    default: // nextRevision
      return arr.sort((a, b) => {
        if (!a.nextRevisionAt) return 1;
        if (!b.nextRevisionAt) return -1;
        return new Date(a.nextRevisionAt).getTime() - new Date(b.nextRevisionAt).getTime();
      });
  }
}

function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr style={{ borderBottom: '1px solid #1c1c1c', height: 44 }}>
      <td style={{ width: 36, padding: '0 4px', textAlign: 'center' }}><Skeleton className="h-4 w-4 mx-auto rounded" /></td>
      <td style={{ width: 40, padding: '0 4px', textAlign: 'center' }}><Skeleton className="h-6 w-6 mx-auto rounded" /></td>
      <td style={{ width: 320, padding: '0 12px' }}><Skeleton className="h-4 w-48 rounded" /></td>
      <td style={{ width: 100, padding: '0 8px' }}><Skeleton className="h-5 w-16 rounded" /></td>
      <td style={{ width: 130, padding: '0 8px' }}><Skeleton className="h-5 w-20 rounded" /></td>
      <td style={{ width: 120, padding: '0 8px' }}><Skeleton className="h-4 w-20 rounded" /></td>
      <td style={{ width: 44, textAlign: 'center' }}><Skeleton className="h-4 w-4 mx-auto rounded" /></td>
      <td style={{ width: 130, padding: '0 8px' }}><Skeleton className="h-4 w-16 rounded" /></td>
      <td style={{ width: 180, padding: '0 12px' }}><Skeleton className="h-4 w-24 rounded" /></td>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ width: 140, padding: '0 8px' }}><Skeleton className="h-4 w-20 rounded" /></td>
      ))}
      <td style={{ width: 100 }} />
    </tr>
  );
}

function CollapsibleGroup({ title, count, topicColor, children }: {
  title: string;
  count: number;
  topicColor?: { bg: string; text: string; border: string };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <tr
        onClick={() => setOpen((o) => !o)}
        style={{ borderBottom: '1px solid #1c1c1c', height: 36, cursor: 'pointer', background: '#141414' }}
      >
        <td colSpan={100} style={{ padding: '0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              color: '#555',
              fontSize: 11,
              transition: 'transform 0.15s',
              display: 'inline-block',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            }}>▶</span>
            {topicColor ? (
              <span style={{
                fontSize: 12,
                fontWeight: 500,
                color: topicColor.text,
                background: topicColor.bg,
                border: `1px solid ${topicColor.border}`,
                borderRadius: 4,
                padding: '2px 8px',
              }}>{title}</span>
            ) : (
              <span style={{ fontSize: 12, color: '#888', fontWeight: 500, textTransform: 'uppercase', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.06em' }}>{title}</span>
            )}
            <span style={{ fontSize: 12, color: '#555', fontFamily: 'var(--font-geist-mono), monospace' }}>{count}</span>
          </div>
        </td>
      </tr>
      {open && children}
    </>
  );
}

function AddColumnPopover({ onSave, columns }: { onSave: (name: string) => void; columns: any[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const submit = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName('');
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 11, padding: '0 8px', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-geist-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        + Add column
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: 12, zIndex: 50, width: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Column name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setOpen(false); }}
            autoFocus
            style={{ background: '#111', border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 13, padding: '5px 8px', width: '100%', outline: 'none', marginBottom: 8 }}
            placeholder="e.g. Company"
          />
          <button
            onClick={submit}
            style={{ background: '#222222', border: '1px solid #333', borderRadius: 4, color: '#ffffff', cursor: 'pointer', fontSize: 12, padding: '4px 12px', width: '100%' }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={100}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: 12 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="40" height="40" rx="4" stroke="#333" strokeWidth="2"/>
            <line x1="4" y1="16" x2="44" y2="16" stroke="#333" strokeWidth="2"/>
            <line x1="4" y1="28" x2="44" y2="28" stroke="#333" strokeWidth="2"/>
            <line x1="16" y1="4" x2="16" y2="44" stroke="#333" strokeWidth="2"/>
          </svg>
          <div style={{ fontSize: 16, color: '#888', fontWeight: 500 }}>No problems yet</div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, textAlign: 'center', maxWidth: 320 }}>
            Add your first problem using the + New Problem button above,<br />
            or click + New row at the top of the table.
          </div>
        </div>
      </td>
    </tr>
  );
}

export function ProblemsTable() {
  const { data: allProblems, isLoading, mutate } = useSWR<any[]>('/api/problems', fetcher);
  const { data: rawColumns, mutate: mutateColumns } = useSWR('/api/columns', fetcher);
  const columns: any[] = Array.isArray(rawColumns) ? rawColumns : [];

  const [activeTab, setActiveTab] = useState<'all' | 'status' | 'topic'>('all');
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sort, setSort] = useState('nextRevision');
  const [showNewRow, setShowNewRow] = useState(false);
  const [toast, setToast] = useState('');
  const [tableHovered, setTableHovered] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Filter + sort
  const filtered = (Array.isArray(allProblems) ? allProblems : []).filter((p) => {
    const q = search.toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) && !String(p.problemNumber).includes(q)) return false;
    if (difficultyFilter.length && !difficultyFilter.includes(p.difficulty)) return false;
    if (statusFilter.length && !statusFilter.includes(p.status)) return false;
    return true;
  });
  const sorted = sortProblems(filtered, sort);

  const isAllSelected = sorted.length > 0 && sorted.every((p) => selectedIds.includes(p.id));

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sorted.map((p) => p.id));
    }
  }, [isAllSelected, sorted]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    const idsToDelete = [...selectedIds];

    // Optimistic update
    mutate(
      (prev: any[] | undefined) => prev?.filter((p) => !idsToDelete.includes(p.id)) ?? [],
      false
    );
    setSelectedIds([]);

    try {
      const res = await fetch('/api/problems', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      if (!res.ok) throw new Error('Failed to delete problems');
      showToast(`Deleted ${count} ${count === 1 ? 'problem' : 'problems'}`);
      mutate();
    } catch (e: any) {
      mutate(); // revert
      showToast(e.message ?? 'Failed to delete problems');
    }
  }, [selectedIds, mutate]);

  // Star toggle with optimistic update
  const handleStarToggle = useCallback(async (id: string, current: boolean) => {
    mutate(
      (prev: any[] | undefined) => prev?.map((p) => p.id === id ? { ...p, isFavorite: !current } : p) ?? [],
      false
    );
    try {
      await fetch(`/api/problems/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !current }),
      });
      mutate();
    } catch {
      mutate(); // revert
      showToast('Failed to update favorite');
    }
  }, [mutate]);

  // Custom field save — call PATCH /api/problems/[id]/custom-fields with { key: columnName, value }
  const handleCustomFieldSave = useCallback(async (id: string, columnName: string, value: string) => {
    try {
      const res = await fetch(`/api/problems/${id}/custom-fields`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: columnName, value }),
      });
      if (!res.ok) {
        throw new Error('Failed to save field');
      }
      await mutate();
    } catch (e: any) {
      showToast(e.message ?? 'Failed to save field');
      throw e;
    }
  }, [mutate]);

  // Notes save — Notion-style inline editable notes via PATCH /api/problems/[id] with { notes }
  const handleNotesSave = useCallback(async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/problems/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) {
        throw new Error('Failed to save notes');
      }
      await mutate();
    } catch (e: any) {
      showToast(e.message ?? 'Failed to save notes');
      throw e;
    }
  }, [mutate]);

  // New problem save — fixed Content-Type typo + always send dateSolved
  const handleNewProblemSave = useCallback(async (data: any) => {
    const payload = {
      ...data,
      dateSolved: data.dateSolved ?? new Date().toISOString(),
    };
    console.log('[handleNewProblemSave] sending payload', payload);
    const res = await fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    console.log('[handleNewProblemSave] response', res.status, json);
    if (!res.ok) throw new Error(json.error ?? 'Failed to create problem');
    setShowNewRow(false);
    mutate();
  }, [mutate]);

  // Add column
  const handleAddColumn = useCallback(async (name: string) => {
    const order = columns.length;
    await fetch('/api/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, order }),
    });
    mutateColumns();
    mutate();
  }, [columns.length, mutateColumns, mutate]);

  // Delete custom column
  const handleDeleteColumn = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/columns?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete column');
      mutateColumns();
      mutate();
    } catch {
      showToast('Failed to delete column');
    }
  }, [mutateColumns, mutate]);

  const COLUMN_COUNT = columns.length;

  // Table header
  const TableHead = () => (
    <thead>
      <tr style={{ borderBottom: '1px solid #1c1c1c', height: 36 }}>
        <th style={{ width: 36, padding: '0 4px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CustomCheckbox
              checked={isAllSelected}
              onChange={handleToggleSelectAll}
              title={isAllSelected ? "Deselect all" : "Select all"}
              opacity={selectedIds.length > 0 ? 1 : 0.4}
            />
          </div>
        </th>
        <th style={{ width: 40, padding: '0 4px' }} />
        {[
          { label: 'PROBLEM', width: 320 },
          { label: 'DIFFICULTY', width: 100 },
          { label: 'TOPIC', width: 130 },
          { label: 'STATUS', width: 120 },
          { label: 'STAR', icon: <Star size={13} strokeWidth={2} style={{ color: '#555' }} />, width: 44, center: true },
          { label: 'NEXT REVISION', width: 130 },
          { label: 'NOTES', width: 180 },
        ].map(({ label, icon, width, center }) => (
          <th key={label} style={{
            width,
            padding: center ? '0' : '0 12px',
            textAlign: center ? 'center' : 'left',
            fontSize: 11,
            fontFamily: 'var(--font-geist-mono), monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#555',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>
            {icon ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </div>
            ) : (
              label
            )}
          </th>
        ))}
        {columns.map((col) => (
          <th key={col.id} style={{ width: 140, padding: '0 8px', fontSize: 11, fontFamily: 'var(--font-geist-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
            <ColumnHeaderMenu col={col} onDelete={handleDeleteColumn} />
          </th>
        ))}
        <th style={{ width: 100, padding: '0 8px' }}>
          <AddColumnPopover onSave={handleAddColumn} columns={columns} />
        </th>
      </tr>
    </thead>
  );

  // Difficulty save
  const handleDifficultySave = useCallback(async (id: string, difficulty: string) => {
    try {
      const res = await fetch(`/api/problems/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty }),
      });
      if (!res.ok) {
        throw new Error('Failed to update difficulty');
      }
      await mutate();
    } catch (e: any) {
      showToast(e.message ?? 'Failed to update difficulty');
      throw e;
    }
  }, [mutate]);

  // Topic save
  const handleTopicSave = useCallback(async (id: string, topic: string) => {
    try {
      const res = await fetch(`/api/problems/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) {
        throw new Error('Failed to update topic');
      }
      await mutate();
    } catch (e: any) {
      showToast(e.message ?? 'Failed to update topic');
      throw e;
    }
  }, [mutate]);

  const renderRows = (problems: any[]) =>
    problems.map((p) => (
      <ProblemRow
        key={p.id}
        problem={p}
        columns={columns}
        isSelected={selectedIds.includes(p.id)}
        onToggleSelect={handleToggleSelect}
        onStarToggle={handleStarToggle}
        onDifficultySave={handleDifficultySave}
        onTopicSave={handleTopicSave}
        onNotesSave={handleNotesSave}
        onCustomFieldSave={handleCustomFieldSave}
      />
    ));

  const renderByStatus = () => {
    const groups = { ACTIVE: [] as any[], MASTERED: [] as any[], RETIRED: [] as any[] };
    sorted.forEach((p) => { if (p.status in groups) groups[p.status as keyof typeof groups].push(p); });
    return (
      <>
        <CollapsibleGroup title="Active" count={groups.ACTIVE.length}>{renderRows(groups.ACTIVE)}</CollapsibleGroup>
        <CollapsibleGroup title="Mastered" count={groups.MASTERED.length}>{renderRows(groups.MASTERED)}</CollapsibleGroup>
        <CollapsibleGroup title="Retired" count={groups.RETIRED.length}>{renderRows(groups.RETIRED)}</CollapsibleGroup>
      </>
    );
  };

  const renderByTopic = () => {
    const map: Record<string, any[]> = {};
    sorted.forEach((p) => { (map[p.topic] = map[p.topic] ?? []).push(p); });
    return Object.keys(map).sort().map((topic) => (
      <CollapsibleGroup key={topic} title={topic} count={map[topic].length} topicColor={getTopicColor(topic)}>
        {renderRows(map[topic])}
      </CollapsibleGroup>
    ));
  };

  const isEmpty = !isLoading && Array.isArray(allProblems) && allProblems.length === 0;

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#f87171', fontSize: 13, padding: '10px 16px', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          {toast}
        </div>
      )}

      {/* Floating Bulk Actions Toolbar (Notion Style) */}
      {selectedIds.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            zIndex: 100,
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ fontSize: 13, color: '#e5e5e5', fontFamily: 'var(--font-geist-mono), monospace' }}>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedIds.length}</span> {selectedIds.length === 1 ? 'selected' : 'selected'}
          </div>
          <div style={{ height: 16, width: 1, background: '#333' }} />
          <button
            onClick={handleBulkDelete}
            style={{
              background: '#3a0f0f',
              border: '1px solid #5a1a1a',
              borderRadius: 6,
              color: '#f87171',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h12M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4M6 7v5M10 7v5M3.5 4l.8 10a1 1 0 001 .9h5.4a1 1 0 001-.9l.8-10" />
            </svg>
            Delete
          </button>
          <button
            onClick={() => setSelectedIds([])}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: 16,
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
            title="Clear selection"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 14 }}>
          <span style={{ color: '#555' }}>recall</span>
          <span style={{ color: '#333', margin: '0 8px' }}>/</span>
          <span style={{ color: '#fff', fontWeight: 500 }}>All Problems</span>
        </div>
        <button
          id="new-problem-btn"
          onClick={() => setShowNewRow(true)}
          style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 13, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Problem
        </button>
      </div>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* Toolbar */}
      <div style={{ margin: '16px 0' }}>
        <Toolbar
          search={search} onSearchChange={setSearch}
          difficultyFilter={difficultyFilter} onDifficultyChange={setDifficultyFilter}
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
          sort={sort} onSortChange={setSort}
        />
      </div>

      {/* Table — Notion-style horizontal scroll container */}
      <div
        style={{
          overflowX: 'auto',
          maxWidth: '100%',
          borderRadius: 8,
          border: '1px solid #1c1c1c',
        }}
        onMouseEnter={() => setTableHovered(true)}
        onMouseLeave={() => setTableHovered(false)}
      >
        <table style={{ width: '100%', minWidth: 1060 + COLUMN_COUNT * 140, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <TableHead />
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} columns={COLUMN_COUNT} />)
            ) : isEmpty ? (
              <>
                {/* When empty, + New row trigger or inline row creation is at the top */}
                {showNewRow ? (
                  <NewRow
                    onSave={handleNewProblemSave}
                    onCancel={() => setShowNewRow(false)}
                    columns={columns}
                  />
                ) : (
                  <tr style={{ borderBottom: '1px solid #1c1c1c' }}>
                    <td style={{ width: 36 }} />
                    <td style={{ width: 40 }} />
                    <td style={{ width: 320, padding: '12px 12px' }}>
                      <button
                        id="new-row-btn"
                        onClick={() => setShowNewRow(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#444',
                          cursor: 'pointer',
                          fontSize: 13,
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
                      >
                        <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> New row
                      </button>
                    </td>
                    <td colSpan={7 + COLUMN_COUNT} />
                  </tr>
                )}
                <EmptyState />
              </>
            ) : (
              <>
                {/* When table has entries, problem rows first, then + New row at bottom */}
                {activeTab === 'all'
                  ? renderRows(sorted)
                  : activeTab === 'status'
                  ? renderByStatus()
                  : renderByTopic()}

                {showNewRow ? (
                  <NewRow
                    onSave={handleNewProblemSave}
                    onCancel={() => setShowNewRow(false)}
                    columns={columns}
                  />
                ) : (
                  <tr style={{ borderTop: '1px solid #1c1c1c' }}>
                    <td style={{ width: 36 }} />
                    <td style={{ width: 40 }} />
                    <td style={{ width: 320, padding: '12px 12px' }}>
                      <button
                        id="new-row-btn"
                        onClick={() => setShowNewRow(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#444',
                          cursor: 'pointer',
                          fontSize: 13,
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
                      >
                        <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> New row
                      </button>
                    </td>
                    <td colSpan={7 + COLUMN_COUNT} />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

