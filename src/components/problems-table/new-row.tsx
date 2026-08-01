'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { getDifficultyStyle, getTopicColor, DifficultyPickerCell, TopicPickerCell } from './columns';

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

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  useEffect(() => {
    if (autoOpen) {
      setEditing(true);
    }
  }, [autoOpen]);

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
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
      {/* Display mode cell */}
      <div
        onClick={() => setEditing(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={displayText ? displayText : undefined}
        style={{
          fontSize: 13,
          color: displayText ? '#666' : '#444',
          cursor: 'text',
          minHeight: 26,
          padding: '3px 6px',
          borderRadius: 4,
          background: hovered ? '#1a1a1a' : 'transparent',
          transition: 'background 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            maxWidth: maxWidth - 24,
          }}
        >
          {truncated || placeholder}
        </span>
        {hovered && (
          <Pencil
            size={12}
            style={{ color: '#444', flexShrink: 0, marginLeft: 4 }}
          />
        )}
      </div>

      {/* Floating popover editor */}
      {editing && (
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            width: 'max(100% + 8px, 240px)',
            zIndex: 100,
            background: '#1a1a1c',
            border: '1px solid #2a2a2e',
            borderRadius: 6,
            padding: '8px 10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <textarea
            ref={textareaRef}
            value={localVal}
            onChange={(e) => {
              setLocalVal(e.target.value);
              onChange(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={placeholder}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 13,
              fontFamily: 'inherit',
              lineHeight: '1.4',
              resize: 'none',
              overflow: 'hidden',
              padding: 0,
              margin: 0,
              display: 'block',
              boxSizing: 'border-box',
              caretColor: '#818cf8',
            }}
          />
        </div>
      )}
    </div>
  );
}

export function NewRow({ onSave, onCancel, columns }: NewRowProps) {
  const [platform] = useState('LEETCODE');
  const [problemNumber, setProblemNumber] = useState('');
  const [autoFill, setAutoFill] = useState<AutoFillData>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [openNotesFloating, setOpenNotesFloating] = useState(false);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const numRef = useRef<HTMLInputElement>(null);

  useEffect(() => { numRef.current?.focus(); }, []);

  const handleNumberKey = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { onCancel(); return; }
    if (e.key !== 'Enter') return;
    const num = parseInt(problemNumber, 10);
    if (isNaN(num)) return;

    setLoading(true);
    setNotFound(false);
    setAutoFill(null);

    try {
      const res = await fetch(`/api/leetcode/resolve?id=${num}`);
      const json = await res.json();
      if (json.found) {
        setAutoFill(json.data);
        setDifficulty(json.data.difficulty);
        setTopic(json.data.topic);
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
        setTimeout(() => setOpenNotesFloating(true), 50);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualUrl = async (url: string) => {
    setManualUrl(url);
    const match = url.match(/leetcode\.com\/problems\/([^/]+)/);
    if (!match) return;
    const slug = match[1];
    try {
      const res = await fetch('/api/leetcode/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleSlug: slug }),
      });
      const json = await res.json();
      if (!json.error) {
        setAutoFill(json);
        setDifficulty(json.difficulty);
        setTopic(json.topic);
        setNotFound(false);
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
        setTimeout(() => setOpenNotesFloating(true), 50);
      }
    } catch {}
  };

  const handleSave = async () => {
    if (!autoFill || !problemNumber) return;
    setSaving(true);
    setError('');
    try {
      await onSave({
        platform,
        problemNumber: parseInt(problemNumber, 10),
        title: autoFill.title,
        difficulty: difficulty || autoFill.difficulty,
        topic: topic || autoFill.topic,
        url: autoFill.url,
        notes: notes || undefined,
        customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
        dateSolved: new Date().toISOString(),
      });
    } catch (e: any) {
      setError(e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const cellBg = flash ? 'rgba(74, 222, 128, 0.05)' : 'transparent';

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

        {/* Platform logo cell */}
        <td style={{ width: 40, textAlign: 'center', padding: '0 4px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, background: '#0F0F0F', borderRadius: 4,
            padding: 3, flexShrink: 0,
          }}>
            <img
              src="/LeetCode.png"
              alt="LeetCode"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </span>
        </td>

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
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 13,
                  outline: 'none',
                  width: '100%',
                  caretColor: '#818cf8',
                }}
              />
              {loading && (
                <span style={{ color: '#555', fontSize: 12, letterSpacing: 2 }}>...</span>
              )}
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
            <DifficultyPickerCell
              difficulty={difficulty || autoFill.difficulty}
              onSave={(newDiff) => setDifficulty(newDiff)}
            />
          )}
        </td>

        {/* Topic */}
        <td style={{ width: 130, padding: '0 8px', transition: 'background 0.4s', background: cellBg, position: 'relative' }}>
          {autoFill && (
            <TopicPickerCell
              topic={topic || autoFill.topic}
              onSave={(newTopic) => setTopic(newTopic)}
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

        {/* Trailing cell */}
        <td style={{ width: 100 }} />
      </tr>

      {/* Not found message row */}
      {notFound && (
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
      {autoFill && (
        <tr style={{ background: '#141414', borderBottom: '1px solid #1c1c1c', borderLeft: '1px solid #3a3a3a' }}>
          <td colSpan={9 + columns.length} style={{ padding: '4px 68px' }}>
            <span style={{ fontSize: 11, color: '#444' }}>
              Press <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 3, padding: '1px 5px', fontSize: 10, color: '#666' }}>Enter</kbd> to save &nbsp;
              <kbd style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 3, padding: '1px 5px', fontSize: 10, color: '#666' }}>Esc</kbd> to cancel
              {saving && <span style={{ color: '#818cf8', marginLeft: 8 }}>saving...</span>}
              {error && <span style={{ color: '#f87171', marginLeft: 8 }}>{error}</span>}
            </span>
          </td>
        </tr>
      )}
    </>
  );
}
