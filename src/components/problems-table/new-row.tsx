'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { getDifficultyStyle, getTopicColor } from './columns';

type NewRowProps = {
  onSave: (data: {
    platform: string;
    problemNumber: number;
    title: string;
    difficulty: string;
    topic: string;
    url: string;
    notes?: string;
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

export function NewRow({ onSave, onCancel, columns }: NewRowProps) {
  const [platform] = useState('LEETCODE');
  const [problemNumber, setProblemNumber] = useState('');
  const [autoFill, setAutoFill] = useState<AutoFillData>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const numRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLInputElement>(null);

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
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
        setTimeout(() => notesRef.current?.focus(), 50);
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
        setNotFound(false);
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
        setTimeout(() => notesRef.current?.focus(), 50);
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
        difficulty: autoFill.difficulty,
        topic: autoFill.topic,
        url: autoFill.url,
        notes: notes || undefined,
        dateSolved: new Date().toISOString(),
      });
    } catch (e: any) {
      setError(e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleNotesKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') onCancel();
  };

  const cellBg = flash ? 'rgba(74, 222, 128, 0.05)' : 'transparent';

  // Derive pill styles from autofill data
  const diffStyle = autoFill ? getDifficultyStyle(autoFill.difficulty) : null;
  const topicColor = autoFill ? getTopicColor(autoFill.topic) : null;

  return (
    <>
      <tr style={{
        background: '#141414',
        borderBottom: '1px solid #1c1c1c',
        borderLeft: '1px solid #3a3a3a',
        height: 44,
        outline: 'none',
      }}>
        {/* Platform */}
        <td style={{ width: 52, textAlign: 'center', padding: '0 8px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, background: '#FFA116', borderRadius: 4,
            fontSize: 10, fontWeight: 700, color: '#fff',
            fontFamily: 'var(--font-geist-mono), monospace',
          }}>LC</span>
        </td>

        {/* Problem Number + Title */}
        <td style={{ padding: '0 12px', minWidth: 260, transition: 'background 0.4s', background: cellBg }}>
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
                  width: 160,
                  caretColor: '#818cf8',
                }}
              />
              {loading && (
                <span style={{ color: '#555', fontSize: 12, letterSpacing: 2 }}>...</span>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: '#666' }}>{problemNumber}</span>
              <span style={{ fontSize: 14, color: '#e5e5e5', fontWeight: 500 }}>{autoFill.title}</span>
            </div>
          )}
        </td>

        {/* Difficulty */}
        <td style={{ width: 100, padding: '0 8px', transition: 'background 0.4s', background: cellBg }}>
          {diffStyle && (
            <span style={{
              background: diffStyle.bg,
              color: diffStyle.text,
              border: `1px solid ${diffStyle.border}`,
              borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600,
            }}>
              {autoFill!.difficulty.charAt(0) + autoFill!.difficulty.slice(1).toLowerCase()}
            </span>
          )}
        </td>

        {/* Topic */}
        <td style={{ width: 130, padding: '0 8px', transition: 'background 0.4s', background: cellBg }}>
          {topicColor && autoFill && (
            <span style={{
              background: topicColor.bg,
              color: topicColor.text,
              border: `1px solid ${topicColor.border}`,
              borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600,
            }}>
              {autoFill.topic}
            </span>
          )}
        </td>

        {/* Status */}
        <td style={{ width: 120, padding: '0 8px', color: '#555', fontSize: 13, fontFamily: 'var(--font-geist-mono), monospace' }}>—</td>

        {/* Star */}
        <td style={{ width: 44 }} />

        {/* Next Revision */}
        <td style={{ width: 130, padding: '0 8px', color: '#555', fontSize: 13, fontFamily: 'var(--font-geist-mono), monospace' }}>—</td>

        {/* Notes */}
        <td style={{ width: 180, padding: '0 12px' }}>
          {autoFill && (
            <input
              ref={notesRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={handleNotesKey}
              placeholder="Notes (optional)"
              style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, outline: 'none', width: '100%', caretColor: '#818cf8' }}
            />
          )}
        </td>

        {/* Custom columns */}
        {columns.map((col) => <td key={col.id} style={{ width: 140 }} />)}
      </tr>

      {/* Not found message row */}
      {notFound && (
        <tr style={{ background: '#141414', borderBottom: '1px solid #1c1c1c', borderLeft: '1px solid #3a3a3a' }}>
          <td colSpan={8 + columns.length} style={{ padding: '8px 68px' }}>
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
          <td colSpan={8 + columns.length} style={{ padding: '4px 68px' }}>
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
