'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { DifficultyPickerCell, TopicPickerCell } from './columns';
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

// ---------------------------------------------------------------------------
// Floating notes / text cell
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
      e.preventDefault(); onChange(localVal); setEditing(false); onSaveRow();
    } else if (e.key === 'Escape') {
      e.preventDefault(); setEditing(false);
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
  const [platform, setPlatform] = useState<string | null>(null);
  const [platformOpen, setPlatformOpen] = useState(true);

  // Shared autofill / pickers state
  const [autoFill, setAutoFill] = useState<AutoFillData>(null);
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState(false);
  const [openNotesFloating, setOpenNotesFloating] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // LeetCode-specific
  const [problemNumber, setProblemNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [lcUrl, setLcUrl] = useState('');

  // Other platforms: simple URL + Title inputs
  const [otherUrl, setOtherUrl] = useState('');
  const [otherTitle, setOtherTitle] = useState('');

  const numRef = useRef<HTMLInputElement>(null);
  const lcUrlRef = useRef<HTMLInputElement>(null);
  const otherUrlRef = useRef<HTMLInputElement>(null);
  const otherTitleRef = useRef<HTMLInputElement>(null);

  const isLeetCode = platform === 'LEETCODE';
  const isOther = platform && !isLeetCode;

  // For other platforms, difficulty/topic pickers are always visible once platform is picked
  const otherReady = !!isOther;

  useEffect(() => {
    if (!platform) return;
    if (isLeetCode) setTimeout(() => numRef.current?.focus(), 20);
    else setTimeout(() => otherUrlRef.current?.focus(), 20);
  }, [platform]);

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
    setTimeout(() => setOpenNotesFloating(true), 50);
  };

  // ── LeetCode: number → resolve ─────────────────────────────────────────
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
        triggerFlash();
      } else {
        setNotFound(true);
        setTimeout(() => lcUrlRef.current?.focus(), 20);
      }
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  };

  // ── LeetCode: URL fallback → LC GraphQL ───────────────────────────────
  const handleLcUrl = async (url: string) => {
    setLcUrl(url);
    const match = url.match(/leetcode\.com\/problems\/([^/]+)/);
    if (!match) return;
    try {
      const res = await fetch('/api/leetcode/lookup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleSlug: match[1] }),
      });
      const json = await res.json();
      if (!json.error) {
        setAutoFill(json);
        setDifficulty(json.difficulty);
        setTopic(json.topic === 'General' ? '' : json.topic);
        setNotFound(false);
        triggerFlash();
      }
    } catch {}
  };

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!platform) return;
    if (isLeetCode && !autoFill) return;
    if (isOther && (!otherTitle || !otherUrl)) {
      setError('Title and URL are required.');
      return;
    }
    if (isOther && !difficulty) {
      setError('Please select a difficulty.');
      return;
    }
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
          problemNumber: 0,
          title: otherTitle,
          difficulty,
          topic,
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

  const resetState = () => {
    setPlatform(null); setPlatformOpen(true);
    setAutoFill(null); setNotFound(false);
    setLcUrl(''); setProblemNumber('');
    setOtherUrl(''); setOtherTitle('');
    setDifficulty(''); setTopic('');
    setError('');
  };

  return (
    <>
      <tr style={{
        background: '#141414',
        borderBottom: '1px solid #1c1c1c',
        borderLeft: '1px solid #3a3a3a',
        height: 44,
        outline: 'none',
      }}>
        {/* Checkbox */}
        <td style={{ width: 36, textAlign: 'center', padding: '0 4px' }} />

        {/* Platform logo / selector */}
        <td style={{ width: 40, textAlign: 'center', padding: '0 4px', position: 'relative' }}>
          {platform ? (
            <button
              onClick={resetState}
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
                  position: 'absolute', bottom: 28, left: -4, zIndex: 200,
                  background: '#1a1a1c', border: '1px solid #2a2a2e',
                  borderRadius: 8, padding: 6, minWidth: 160,
                  boxShadow: '0 -8px 24px rgba(0,0,0,0.6)',
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

        {/* Title / number area */}
        <td style={{ width: 320, padding: '0 12px', transition: 'background 0.4s', background: cellBg }}>
          {!platform ? (
            <span style={{ fontSize: 13, color: '#444' }}>← Select a platform</span>
          ) : isLeetCode ? (
            !autoFill ? (
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
                <a
                  href={autoFill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 14, color: '#e5e5e5', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {autoFill.title}
                </a>
              </div>
            )
          ) : (
            // Other platforms — title shown as hyperlink if URL is set
            otherTitle && otherUrl ? (
              <a
                href={otherUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#e5e5e5', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none', display: 'block' }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                {otherTitle}
              </a>
            ) : (
              <span style={{ fontSize: 13, color: '#444' }}>Fill in URL and title below...</span>
            )
          )}
        </td>

        {/* Difficulty */}
        <td style={{ width: 100, padding: '0 8px', transition: 'background 0.4s', background: cellBg, position: 'relative' }}>
          {(autoFill || otherReady) && (
            <DifficultyPickerCell
              difficulty={difficulty || (autoFill?.difficulty ?? '')}
              onSave={(d) => setDifficulty(d)}
            />
          )}
        </td>

        {/* Topic */}
        <td style={{ width: 130, padding: '0 8px', transition: 'background 0.4s', background: cellBg, position: 'relative' }}>
          {(autoFill || otherReady) && (
            <TopicPickerCell
              topic={topic || (autoFill?.topic === 'General' ? '' : (autoFill?.topic ?? ''))}
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
          {(autoFill || otherReady) && (
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
            {(autoFill || otherReady) && (
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
      </tr>

      {/* ── LeetCode: number not found → URL fallback ── */}
      {isLeetCode && notFound && (
        <tr style={{ background: '#141414', borderBottom: '1px solid #1c1c1c', borderLeft: '1px solid #3a3a3a' }}>
          <td colSpan={9 + columns.length} style={{ padding: '8px 68px' }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#888' }}>
                Problem #{problemNumber} not found. Paste the URL to continue, or press Esc to cancel.
              </span>
            </div>
            <input
              ref={lcUrlRef}
              value={lcUrl}
              onChange={(e) => handleLcUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              onKeyDown={(e) => e.key === 'Escape' && onCancel()}
              style={{
                background: 'none', border: 'none', color: '#fff',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: 12, padding: 0, outline: 'none', width: 380, caretColor: '#ffffff',
              }}
            />
          </td>
        </tr>
      )}

      {/* ── Other platforms: URL + Title inputs ── */}
      {isOther && (
        <tr style={{ background: '#141414', borderBottom: '1px solid #1c1c1c', borderLeft: '1px solid #3a3a3a' }}>
          <td colSpan={9 + columns.length} style={{ padding: '8px 68px' }}>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10, color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>URL</span>
                <input
                  ref={otherUrlRef}
                  value={otherUrl}
                  onChange={(e) => setOtherUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { onCancel(); return; }
                    if (e.key === 'Tab') { e.preventDefault(); otherTitleRef.current?.focus(); }
                    if (e.key === 'Enter') { otherTitleRef.current?.focus(); }
                  }}
                  placeholder={`${PLATFORMS.find(p => p.value === platform)?.label} problem URL...`}
                  style={{
                    background: 'none', border: 'none', color: '#fff',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: 12, padding: 0, outline: 'none', width: 300, caretColor: '#ffffff',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10, color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Title</span>
                <input
                  ref={otherTitleRef}
                  value={otherTitle}
                  onChange={(e) => setOtherTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { onCancel(); return; }
                    if (e.key === 'Enter') handleSave();
                  }}
                  placeholder="Problem title..."
                  style={{
                    background: 'none', border: 'none', color: '#fff',
                    fontFamily: 'inherit', fontSize: 13, padding: 0,
                    outline: 'none', width: 220, caretColor: '#ffffff',
                  }}
                />
              </div>
            </div>
            {error && <div style={{ fontSize: 12, color: '#f87171', marginTop: 6 }}>{error}</div>}
          </td>
        </tr>
      )}

      {/* ── Save / cancel hint ── */}
      {(autoFill || (isOther && (otherTitle || otherUrl))) && (
        <tr style={{ background: '#141414', borderBottom: '1px solid #1c1c1c', borderLeft: '1px solid #3a3a3a' }}>
          <td colSpan={9 + columns.length} style={{ padding: '4px 68px' }}>
            <span style={{ fontSize: 11, color: '#444' }}>
              Press <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 3, padding: '1px 5px', fontSize: 10, color: '#666' }}>Enter</kbd> to save &nbsp;
              <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 3, padding: '1px 5px', fontSize: 10, color: '#666' }}>Esc</kbd> to cancel
              {saving && <span style={{ color: '#ffffff', marginLeft: 8 }}>saving...</span>}
              {error && !isOther && <span style={{ color: '#f87171', marginLeft: 8 }}>{error}</span>}
            </span>
          </td>
        </tr>
      )}
    </>
  );
}
