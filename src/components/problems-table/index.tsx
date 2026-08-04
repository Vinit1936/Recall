'use client';

import useSWR from 'swr';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TabBar } from './tab-bar';
import { Toolbar, type SortOrder } from './toolbar';
import { ProblemRow } from './row';
import { NewRow } from './new-row';
import { CustomCheckbox } from '@/components/ui/custom-checkbox';
import { Star, MoreVertical, Trash2 } from 'lucide-react';
import { getTopicColor } from '@/lib/topic-colors';

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

function sortProblems(problems: any[], sort: string, sortOrder: SortOrder = 'asc') {
  const arr = [...problems];
  const mult = sortOrder === 'asc' ? 1 : -1;

  return arr.sort((a, b) => {
    let cmp = 0;
    switch (sort) {
      case 'dateAdded': {
        const timeA = new Date(a.dateSolved || a.createdAt).getTime();
        const timeB = new Date(b.dateSolved || b.createdAt).getTime();
        cmp = timeA - timeB;
        break;
      }
      case 'problemNumber': {
        const valA = typeof a.problemNumber === 'number' && a.problemNumber > 0 ? a.problemNumber : (a.code || a.title || '');
        const valB = typeof b.problemNumber === 'number' && b.problemNumber > 0 ? b.problemNumber : (b.code || b.title || '');
        if (typeof valA === 'number' && typeof valB === 'number') {
          cmp = valA - valB;
        } else {
          cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        }
        break;
      }
      case 'difficulty': {
        const order = { EASY: 1, MEDIUM: 2, HARD: 3 };
        const diffA = order[a.difficulty as keyof typeof order] ?? 0;
        const diffB = order[b.difficulty as keyof typeof order] ?? 0;
        cmp = diffA - diffB;
        break;
      }
      case 'status': {
        const order = { ACTIVE: 1, MASTERED: 2, RETIRED: 3 };
        const statA = order[a.status as keyof typeof order] ?? 0;
        const statB = order[b.status as keyof typeof order] ?? 0;
        cmp = statA - statB;
        break;
      }
      case 'topic': {
        const topA = (a.topic || '').toLowerCase();
        const topB = (b.topic || '').toLowerCase();
        cmp = topA.localeCompare(topB);
        break;
      }
      case 'nextRevision':
      default: {
        const timeA = a.nextRevisionAt ? new Date(a.nextRevisionAt).getTime() : Infinity;
        const timeB = b.nextRevisionAt ? new Date(b.nextRevisionAt).getTime() : Infinity;
        cmp = timeA - timeB;
        break;
      }
    }
    return cmp * mult;
  });
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
  const [sort, setSort] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showNewRow, setShowNewRow] = useState(false);
  const [toast, setToast] = useState('');
  const [tableHovered, setTableHovered] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Restore user sort preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recall_sort_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sortBy) setSort(parsed.sortBy);
        if (parsed.sortOrder) setSortOrder(parsed.sortOrder);
      }
    } catch {}
  }, []);

  const saveSortPreference = (newSort: string, newOrder: SortOrder) => {
    try {
      localStorage.setItem('recall_sort_config', JSON.stringify({ sortBy: newSort, sortOrder: newOrder }));
    } catch {}
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    saveSortPreference(newSort, sortOrder);
  };

  const handleSortOrderToggle = () => {
    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(nextOrder);
    saveSortPreference(sort, nextOrder);
  };

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
  const sorted = sortProblems(filtered, sort, sortOrder);

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

  // Notes save
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

  // New problem save
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
          { label: 'PROBLEM', width: 320, padding: '0 12px' },
          { label: 'DIFFICULTY', width: 100, padding: '0 8px' },
          { label: 'TOPIC', width: 130, padding: '0 8px' },
          { label: 'STATUS', width: 120, padding: '0 8px' },
          { label: 'STAR', icon: <Star size={13} strokeWidth={2} style={{ color: '#555' }} />, width: 44, center: true, padding: '0' },
          { label: 'NEXT REVISION', width: 130, padding: '0 8px' },
          { label: 'NOTES', width: 180, padding: '0 8px' },
        ].map(({ label, icon, width, center, padding }) => (
          <th key={label} style={{
            width,
            padding: padding ?? (center ? '0' : '0 8px'),
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
    const map = new Map<string, any[]>();
    sorted.forEach((p) => {
      const key = p.topic || 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries()).map(([topicName, problems]) => {
      const color = getTopicColor(topicName);
      return (
        <CollapsibleGroup key={topicName} title={topicName} count={problems.length} topicColor={color}>
          {renderRows(problems)}
        </CollapsibleGroup>
      );
    });
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#1a1a1a', border: '1px solid #333', borderRadius: 6,
          color: '#fff', fontSize: 13, padding: '10px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}>
          {toast}
        </div>
      )}

      {/* Floating action bar when rows selected */}
      {selectedIds.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 900,
          background: '#1a1a1c',
          border: '1px solid #2a2a2e',
          borderRadius: 8,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
          <span style={{ fontSize: 13, color: '#ccc', fontFamily: 'var(--font-geist-mono), monospace' }}>
            {selectedIds.length} {selectedIds.length === 1 ? 'selected' : 'selected'}
          </span>
          <div style={{ width: 1, height: 16, background: '#333' }} />
          <button
            onClick={handleBulkDelete}
            style={{
              background: '#2e1212',
              border: '1px solid #4a1818',
              borderRadius: 4,
              color: '#f87171',
              cursor: 'pointer',
              fontSize: 13,
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#3e1616')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2e1212')}
          >
            <Trash2 size={13} />
            Delete
          </button>
          <button
            onClick={() => setSelectedIds([])}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: 13,
              padding: 0,
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
          sort={sort} onSortChange={handleSortChange}
          sortOrder={sortOrder} onSortOrderToggle={handleSortOrderToggle}
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
            {showNewRow && (
              <NewRow
                onSave={handleNewProblemSave}
                onCancel={() => setShowNewRow(false)}
                columns={columns}
              />
            )}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={COLUMN_COUNT} />
              ))
            ) : sorted.length === 0 && !showNewRow ? (
              <EmptyState />
            ) : activeTab === 'status' ? (
              renderByStatus()
            ) : activeTab === 'topic' ? (
              renderByTopic()
            ) : (
              renderRows(sorted)
            )}
          </tbody>
        </table>

        {/* Bottom hover bar — Notion style + New row */}
        {!showNewRow && (
          <div
            onClick={() => setShowNewRow(true)}
            style={{
              padding: '8px 12px',
              borderTop: '1px solid #1c1c1c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: '#555',
              transition: 'background 0.15s, color 0.15s',
              background: '#0d0d0d',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#141414';
              e.currentTarget.style.color = '#aaa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0d0d0d';
              e.currentTarget.style.color = '#555';
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            <span>New row</span>
          </div>
        )}
      </div>
    </div>
  );
}
