'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { getDifficultyStyle, getTopicColor, DifficultyPickerCell, TopicPickerCell } from './columns';
import { PlatformLogo } from '@/lib/platforms/logos';

import { Pencil } from 'lucide-react';

type NewRowProps = {
  onSave: (data: {
    platform: string;
    problemNumber: number;
    title: string;
    difficulty: string;
    topic: string;
    url: string;
    notes?: string;
    customFields?: Record<string, string>;
    dateSolved: string;
  }) => Promise<void>;
  onCancel: () => void;
  columns: any[];
};

type AutoFillData = {
  title: string;
  difficulty: string;
  topic: string;
  url: string;
} | null;

const PLATFORMS = [
  { value: 'LEETCODE',   label: 'LeetCode' },
  { value: 'CODEFORCES', label: 'Codeforces' },
  { value: 'GFG',        label: 'GeeksForGeeks' },
  { value: 'HACKERRANK', label: 'HackerRank' },
  { value: 'CODECHEF',   label: 'CodeChef' },
];

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

// ---------------------------------------------------------------------------
// Slug → title heuristic for non-LeetCode platforms
// ---------------------------------------------------------------------------
function slugToTitle(url: string): string {
  try {
    const u = new URL(url);
    // Codeforces: /problemset/problem/1800/A → "1800A"
    const cfMatch = u.pathname.match(/\/problemset\/problem\/(\d+)\/([A-Z0-9]+)/i);
    if (cfMatch) return `${cfMatch[1]}${cfMatch[2].toUpperCase()}`;
    // CodeChef: /problems/MINSTACK → "MINSTACK"
    const ccMatch = u.pathname.match(/\/problems\/([^/]+)/i);
    if (u.hostname.includes('codechef') && ccMatch) return ccMatch[1].toUpperCase();
    // GFG / HackerRank: last path segment, slug → Title Case
    const parts = u.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    const slug = parts[parts.length - 1] ?? '';
    return slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Floating notes / text cell (unchanged from before)
// ---------------------------------------------------------------------------
function NewRowFloatingCell({
  value,
  placeholder,
  maxWidth = 180,
  autoOpen = false,
  onChange,
  onSaveRow,
  onCancelRow,
}: {
  value: string;
  placeholder: string;
  maxWidth?: number;
  autoOpen?: boolean;
  onChange: (val: string) => void;
  onSaveRow: () => void;
  onCancelRow: () => void;
}) {
  const [editing, setEditing] = useState(autoOpen);
  const [hovered, setHovered] = useState(false);
  const [localVal, setLocalVal] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalVal(value); }, [value]);
  useEffect(() => { if (autoOpen) setEditing(true); }, [autoOpen]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onChange(localVal);
        setEditing(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 10);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClickOutside); };
  }, [editing, localVal, onChange]);

  const handleInput = () => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onChange(localVal);
      setEditing(false);
      onSaveRow();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditing(false);
    }
  };

  const displayText = localVal.trim();
  const truncated = displayText.length > 40 ? displayText.slice(0, 40) + '…' : displayText;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setEditing(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={displayText || undefined}
        style={{
          fontSize: 13, color: displayText ? '#666' : '#444', cursor: 'text',
          minHeight: 26, padding: '3px 6px', borderRadius: 4,
          background: hovered ? '#1a1a1a' : 'transparent',
          transition: 'background 0.15s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', boxSizing: 'border-box',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, maxWidth: maxWidth - 24 }}>
          {truncated || placeholder}
        </span>
        {hovered && <Pencil size={12} style={{ color: '#444', flexShrink: 0, marginLeft: 4 }} />}
      </div>
      {editing && (
        <div
          ref={containerRef}
          style={{
            position: 'absolute', top: -4, left: -4,
            width: 'max(100% + 8px, 240px)', zIndex: 100,
            background: '#1a1a1c', border: '1px solid #2a2a2e',
            borderRadius: 6, padding: '8px 10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <textarea
            ref={textareaRef}
            value={localVal}
            onChange={(e) => { setLocalVal(e.target.value); onChange(e.target.value); handleInput(); }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={placeholder}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 13, fontFamily: 'inherit', lineHeight: '1.4',
              resize: 'none', overflow: 'hidden', padding: 0, margin: 0,
              display: 'block', boxSizing: 'border-box', caretColor: '#ffffff',
            }}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main NewRow component
// ---------------------------------------------------------------------------
export function NewRow({ onSave, onCancel, columns }: NewRowProps) {
  // Step 1: platform selection
  const [platform, setPlatform] = useState<string | null>(null);
  const [platformOpen, setPlatformOpen] = useState(true);

  // LeetCode flow state
  const [problemNumber, setProblemNumber] = useState('');
  const [autoFill, setAutoFill] = useState<AutoFillData>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [openNotesFloating, setOpenNotesFloating] = useState(false);
  const [flash, setFlash] = useState(false);

  // Other platform flow state
  const [otherUrl, setOtherUrl] = useState('');
  const [otherTitle, setOtherTitle] = useState('');
  const [otherDifficulty, setOtherDifficulty] = useState('');
  const [otherTopic, setOtherTopic] = useState('');

  // Shared
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const numRef = useRef<HTMLInputElement>(null);
  const otherUrlRef = useRef<HTMLInputElement>(null);
  const otherTitleRef = useRef<HTMLInputElement>(null);
  const otherTopicRef = useRef<HTMLInputElement>(null);

  const isLeetCode = platform === 'LEETCODE';
  const isOther = platform && !isLeetCode;
  const ready = isLeetCode ? !!autoFill : (isOther && !!otherUrl && !!otherTitle && !!otherDifficulty);

  // focus after platform picked
  useEffect(() => {
    if (!platform) return;
    if (isLeetCode) setTimeout(() => numRef.current?.focus(), 20);
    else setTimeout(() => otherUrlRef.current?.focus(), 20);
  }, [platform]);

  // ── LeetCode handlers ────────────────────────────────────────────────────
  const handleNumberKey = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { onCancel(); return; }
    if (e.key !== 'Enter') return;
    const num = parseInt(problemNumber, 10);
    if (isNaN(num)) return;
    setLoading(true); setNotFound(false); setAutoFill(null);
    try {
      const res = await fetch(`/api/leetcode/resolve?id=${num}`);
      const json = await res.json();
      if (json.found) {
        setAutoFill(json.data);
        setDifficulty(json.data.difficulty);
        setTopic(json.data.topic === 'General' ? '' : json.data.topic);
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
        setTimeout(() => setOpenNotesFloating(true), 50);
      } else {
        setNotFound(true);
      }
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  };

  const handleManualUrl = async (url: string) => {
    setManualUrl(url);
    const match = url.match(/leetcode\.com\/problems\/([^/]+)/);
    if (!match) return;
    const slug = match[1];
    try {
      const res = await fetch('/api/leetcode/lookup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleSlug: slug }),
      });
      const json = await res.json();
      if (!json.error) {
        setAutoFill(json);
        setDifficulty(json.difficulty);
        setTopic(json.topic === 'General' ? '' : json.topic);
        setNotFound(false);
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
        setTimeout(() => setOpenNotesFloating(true), 50);
      }
    } catch {}
  };

  // ── Other platform: URL paste → prefill title ───────────────────────────
  const handleOtherUrl = (url: string) => {
    setOtherUrl(url);
    if (!otherTitle) {
      const guessed = slugToTitle(url);
      if (guessed) setOtherTitle(guessed);
    }
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!platform) return;
    setSaving(true); setError('');
    try {
      if (isLeetCode && autoFill) {
        await onSave({
          platform,
          problemNumber: parseInt(problemNumber, 10),
          title: autoFill.title,
          difficulty: difficulty || autoFill.difficulty,
          topic: topic || (autoFill.topic === 'General' ? '' : autoFill.topic),
          url: autoFill.url,
          notes: notes || undefined,
          customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
          dateSolved: new Date().toISOString(),
        });
      } else if (isOther) {
        await onSave({
          platform,
          problemNumber: 0,  // non-LeetCode problems use 0
          title: otherTitle,
          difficulty: otherDifficulty,
          topic: otherTopic,
          url: otherUrl,
          notes: notes || undefined,
          customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
          dateSolved: new Date().toISOString(),
        });
      }
    } catch (e: any) {
      setError(e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const cellBg = flash ? 'rgba(74, 222, 128, 0.05)' : 'transparent';
  const inputStyle = {
    background: 'none', border: 'none', color: '#fff',
    fontFamily: 'var(--font-geist-mono), monospace',
    fontSize: 13, outline: 'none', width: '100%', caretColor: '#ffffff',
  } as React.CSSProperties;

  return (
    <>
      <tr style={{
        background: '#141414',
        borderBottom: '1px solid #1c1c1c',
        borderLeft: '1px solid #3a3a3a',
        height: 44,
        outline: 'none',
      }}>
        {/* Checkbox cell */}
        <td style={{ width: 36, textAlign: 'center', padding: '0 4px' }} />

        {/* Platform logo / selector cell */}
        <td style={{ width: 40, textAlign: 'center', padding: '0 4px', position: 'relative' }}>
          {platform ? (
            <button
              onClick={() => { setPlatform(null); setPlatformOpen(true); }}
              title="Change platform"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex' }}
            >
              <PlatformLogo platform={platform} />
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setPlatformOpen((o) => !o)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 24, height: 24, background: '#1e1e1e', borderRadius: 4,
                  border: '1px solid #333', cursor: 'pointer', color: '#888', fontSize: 14,
                }}
                title="Select platform"
              >
                +
              </button>
              {platformOpen && (
                <div style={{
                  position: 'absolute', top: 28, left: -4, zIndex: 200,
                  background: '#1a1a1c', border: '1px solid #2a2a2e',
                  borderRadius: 8, padding: 6, minWidth: 160,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}>
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => { setPlatform(p.value); setPlatformOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', background: 'none', border: 'none',
                        cursor: 'pointer', padding: '6px 8px', borderRadius: 4,
                        color: '#ccc', fontSize: 13, textAlign: 'left',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#252525')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <PlatformLogo platform={p.value} size={20} />
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </td>

        {/* ── LeetCode flow ── */}
        {isLeetCode && (
          <>
            {/* Problem Number + Title */}
            <td style={{ width: 320, padding: '0 12px', transition: 'background 0.4s', background: cellBg }}>
              {!autoFill ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    ref={numRef}
                    value={problemNumber}
                    onChange={(e) => setProblemNumber(e.target.value)}
                    onKeyDown={handleNumberKey}
                    placeholder="Problem number..."
                    style={inputStyle}
                  />
                  {loading && <span style={{ color: '#555', fontSize: 12, letterSpacing: 2 }}>...</span>}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: '#666', flexShrink: 0 }}>{problemNumber}</span>
                  <span style={{ fontSize: 14, color: '#e5e5e5', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{autoFill.title}</span>
                </div>
              )}
            </td>

            {/* Difficulty */}
            <td style={{ width: 100, padding: '0 8px', transition: 'background 0.4s', background: cellBg, position: 'relative' }}>
              {autoFill && (
                <DifficultyPickerCell difficulty={difficulty || autoFill.difficulty} onSave={(d) => setDifficulty(d)} />
              )}
            </td>

            {/* Topic */}
            <td style={{ width: 130, padding: '0 8px', transition: 'background 0.4s', background: cellBg, position: 'relative' }}>
              {autoFill && (
                <TopicPickerCell
                  topic={topic || (autoFill.topic === 'General' ? '' : autoFill.topic)}
                  onSave={(t) => setTopic(t)}
                />
              )}
            </td>

            {/* Status */}
            <td style={{ width: 120, padding: '0 8px', color: '#555', fontSize: 13, fontFamily: 'var(--font-geist-mono), monospace' }}>—</td>
            {/* Star */}
            <td style={{ width: 44, textAlign: 'center' }} />
            {/* Next Revision */}
            <td style={{ width: 130, padding: '0 8px', color: '#555', fontSize: 13, fontFamily: 'var(--font-geist-mono), monospace' }}>—</td>

            {/* Notes */}
            <td style={{ width: 180, padding: '0 8px', position: 'relative' }}>
              {autoFill && (
                <NewRowFloatingCell
                  value={notes}
                  placeholder="Notes (optional)"
                  maxWidth={180}
                  autoOpen={openNotesFloating}
                  onChange={(val) => setNotes(val)}
                  onSaveRow={handleSave}
                  onCancelRow={onCancel}
                />
              )}
            </td>

            {/* Custom columns */}
            {columns.map((col) => (
              <td key={col.id} style={{ width: 140, padding: '0 8px', position: 'relative' }}>
                {autoFill && (
                  <NewRowFloatingCell
                    value={customFields[col.name] ?? ''}
                    placeholder={col.name}
                    maxWidth={140}
                    onChange={(val) => setCustomFields((prev) => ({ ...prev, [col.name]: val }))}
                    onSaveRow={handleSave}
                    onCancelRow={onCancel}
                  />
                )}
              </td>
            ))}

            <td style={{ width: 100 }} />
          </>
        )}

        {/* ── Other platform flow ── */}
        {isOther && (
          <>
            {/* URL */}
            <td style={{ width: 220, padding: '0 12px' }}>
              <input
                ref={otherUrlRef}
                value={otherUrl}
                onChange={(e) => handleOtherUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); if (e.key === 'Tab') { e.preventDefault(); otherTitleRef.current?.focus(); } }}
                placeholder={`${PLATFORMS.find(p => p.value === platform)?.label} problem URL...`}
                style={inputStyle}
              />
            </td>

            {/* Title */}
            <td style={{ width: 200, padding: '0 8px' }}>
              <input
                ref={otherTitleRef}
                value={otherTitle}
                onChange={(e) => setOtherTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
                placeholder="Problem title..."
                style={inputStyle}
              />
            </td>

            {/* Difficulty dropdown */}
            <td style={{ width: 110, padding: '0 8px' }}>
              <select
                value={otherDifficulty}
                onChange={(e) => setOtherDifficulty(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
                style={{
                  background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 4,
                  color: otherDifficulty ? '#fff' : '#555', fontSize: 12,
                  padding: '3px 6px', outline: 'none', cursor: 'pointer', width: '100%',
                }}
              >
                <option value="" disabled>Difficulty</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </td>

            {/* Topic */}
            <td style={{ width: 130, padding: '0 8px' }}>
              <input
                ref={otherTopicRef}
                value={otherTopic}
                onChange={(e) => setOtherTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') { onCancel(); return; }
                  if (e.key === 'Enter') handleSave();
                }}
                placeholder="Topic (e.g. DP, Graphs...)"
                style={inputStyle}
              />
            </td>

            {/* Remaining empty cells to fill the row */}
            <td style={{ width: 120, padding: '0 8px', color: '#555', fontSize: 13, fontFamily: 'var(--font-geist-mono), monospace' }}>—</td>
            <td style={{ width: 44 }} />
            <td style={{ width: 130 }} />
            <td style={{ width: 180 }} />
            {columns.map((col) => <td key={col.id} style={{ width: 140 }} />)}
            <td style={{ width: 100 }} />
          </>
        )}

        {/* ── No platform selected yet ── */}
        {!platform && (
          <td colSpan={8 + columns.length} style={{ padding: '0 12px', color: '#444', fontSize: 13 }}>
            ← Select a platform
          </td>
        )}
      </tr>

      {/* LeetCode: not found → URL prompt */}
      {isLeetCode && notFound && (
        <tr style={{ background: '#141414', borderBottom: '1px solid #1c1c1c', borderLeft: '1px solid #3a3a3a' }}>
          <td colSpan={9 + columns.length} style={{ padding: '8px 68px' }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#888' }}>
                Problem #{problemNumber} not found. Paste the URL to continue, or press Esc to cancel.
              </span>
            </div>
            <input
              value={manualUrl}
              onChange={(e) => handleManualUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              onKeyDown={(e) => e.key === 'Escape' && onCancel()}
              style={{
                background: 'none', border: 'none', color: '#fff',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 12, padding: '0', outline: 'none', width: 320,
              }}
            />
            {error && <div style={{ fontSize: 12, color: '#f87171', marginTop: 4 }}>{error}</div>}
          </td>
        </tr>
      )}

      {/* Save/cancel hint */}
      {ready && (
        <tr style={{ background: '#141414', borderBottom: '1px solid #1c1c1c', borderLeft: '1px solid #3a3a3a' }}>
          <td colSpan={9 + columns.length} style={{ padding: '4px 68px' }}>
            <span style={{ fontSize: 11, color: '#444' }}>
              Press <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 3, padding: '1px 5px', fontSize: 10, color: '#666' }}>Enter</kbd> to save &nbsp;
              <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 3, padding: '1px 5px', fontSize: 10, color: '#666' }}>Esc</kbd> to cancel
              {saving && <span style={{ color: '#ffffff', marginLeft: 8 }}>saving...</span>}
              {error && <span style={{ color: '#f87171', marginLeft: 8 }}>{error}</span>}
            </span>
          </td>
        </tr>
      )}
    </>
  );
}
