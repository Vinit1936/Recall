'use client';

import useSWR from 'swr';
import { useState, useCallback, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TabBar } from './tab-bar';
import { Toolbar } from './toolbar';
import { ProblemRow } from './row';
import { NewRow } from './new-row';
import { getTopicColor } from '@/lib/topic-colors';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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
      <td style={{ width: 52, padding: '0 8px', textAlign: 'center' }}><Skeleton className="h-6 w-6 mx-auto rounded" /></td>
      <td style={{ padding: '0 12px' }}><Skeleton className="h-4 w-48 rounded" /></td>
      <td style={{ width: 100, padding: '0 8px' }}><Skeleton className="h-5 w-16 rounded" /></td>
      <td style={{ width: 130, padding: '0 8px' }}><Skeleton className="h-5 w-20 rounded" /></td>
      <td style={{ width: 120, padding: '0 8px' }}><Skeleton className="h-4 w-20 rounded" /></td>
      <td style={{ width: 44 }}><Skeleton className="h-4 w-4 mx-auto rounded" /></td>
      <td style={{ width: 130, padding: '0 8px' }}><Skeleton className="h-4 w-16 rounded" /></td>
      <td style={{ width: 180, padding: '0 12px' }}><Skeleton className="h-4 w-24 rounded" /></td>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ width: 140, padding: '0 8px' }}><Skeleton className="h-4 w-20 rounded" /></td>
      ))}
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
            style={{ background: '#1e1e3a', border: '1px solid #333', borderRadius: 4, color: '#818cf8', cursor: 'pointer', fontSize: 12, padding: '4px 12px', width: '100%' }}
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
            or click + New row at the bottom of the table.
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

  // Custom field save
  const handleCustomFieldSave = useCallback(async (id: string, columnName: string, value: string) => {
    try {
      await fetch(`/api/problems/${id}/custom-fields`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [columnName]: value }),
      });
      mutate();
    } catch {
      showToast('Failed to save field');
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

  const COLUMN_COUNT = columns.length;

  // Table header
  const TableHead = () => (
    <thead>
      <tr style={{ borderBottom: '1px solid #1c1c1c', height: 36 }}>
        <th style={{ width: 52, padding: '0 4px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleSelectAll}
              title={isAllSelected ? "Deselect all" : "Select all"}
              style={{
                width: 14,
                height: 14,
                cursor: 'pointer',
                accentColor: '#818cf8',
                borderRadius: 3,
                opacity: selectedIds.length > 0 ? 1 : 0.4,
                transition: 'opacity 0.15s',
              }}
            />
          </div>
        </th>
        {[
          { label: 'PROBLEM', width: undefined },
          { label: 'DIFFICULTY', width: 100 },
          { label: 'TOPIC', width: 130 },
          { label: 'STATUS', width: 120 },
          { label: '★', width: 44, center: true },
          { label: 'NEXT REVISION', width: 130 },
          { label: 'NOTES', width: 180 },
        ].map(({ label, width, center }) => (
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
          }}>
            {label}
          </th>
        ))}
        {columns.map((col) => (
          <th key={col.id} style={{ width: 140, padding: '0 8px', fontSize: 11, fontFamily: 'var(--font-geist-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', fontWeight: 500 }}>
            {col.name}
          </th>
        ))}
        <th style={{ padding: '0 8px' }}>
          <AddColumnPopover onSave={handleAddColumn} columns={columns} />
        </th>
      </tr>
    </thead>
  );

  const renderRows = (problems: any[]) =>
    problems.map((p) => (
      <ProblemRow
        key={p.id}
        problem={p}
        columns={columns}
        isSelected={selectedIds.includes(p.id)}
        onToggleSelect={handleToggleSelect}
        onStarToggle={handleStarToggle}
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
            <span style={{ color: '#818cf8', fontWeight: 600 }}>{selectedIds.length}</span> {selectedIds.length === 1 ? 'selected' : 'selected'}
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

      {/* Table */}
      <div
        onMouseEnter={() => setTableHovered(true)}
        onMouseLeave={() => setTableHovered(false)}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <TableHead />
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} columns={COLUMN_COUNT} />)
              : isEmpty ? <EmptyState />
              : activeTab === 'all' ? renderRows(sorted)
              : activeTab === 'status' ? renderByStatus()
              : renderByTopic()
            }
            {/* New row */}
            {showNewRow && (
              <NewRow
                onSave={handleNewProblemSave}
                onCancel={() => setShowNewRow(false)}
                columns={columns}
              />
            )}
            {/* + New row button at bottom */}
            {!showNewRow && (
              <tr style={{ borderTop: '1px solid #1c1c1c' }}>
                <td colSpan={8 + COLUMN_COUNT} style={{ padding: '8px 12px' }}>
                  <button
                    id="new-row-btn"
                    onClick={() => setShowNewRow(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: tableHovered ? '#666' : '#333',
                      cursor: 'pointer',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'color 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 15 }}>+</span> New row
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

