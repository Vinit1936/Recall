'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

type NewRowProps = {
  onSave: (data: {
    platform: string;
    problemNumber: number;
    title: string;
    difficulty: string;
    topic: string;
    url: string;
    notes?: string;
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
    try {
      await onSave({
        platform,
        problemNumber: parseInt(problemNumber, 10),
        title: autoFill.title,
        difficulty: autoFill.difficulty,
        topic: autoFill.topic,
        url: autoFill.url,
        notes: notes || undefined,
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

  const cellBg = flash ? 'rgba(74, 222, 128, 0.08)' : 'transparent';

  return (
    <>
      <tr style={{ background: '#111', borderBottom: '1px solid #1a1a1a', height: 44 }}>
        {/* Platform */}
        <td style={{ width: 48, textAlign: 'center', padding: '0 8px' }}>
          <span style={{ fontSize: 10, color: '#FFA116', fontFamily: 'monospace', fontWeight: 700, background: '#1a1209', border: '1px solid #3a2a0a', borderRadius: 4, padding: '2px 4px' }}>LC</span>
        </td>

        {/* Problem Number + Name */}
        <td style={{ padding: '0 12px', minWidth: 280, transition: 'background 0.3s', background: cellBg }}>
          {!autoFill ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                ref={numRef}
                value={problemNumber}
                onChange={(e) => setProblemNumber(e.target.value)}
                onKeyDown={handleNumberKey}
                placeholder="Problem #"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: 13,
                  outline: 'none',
                  width: 90,
                  caretColor: '#818cf8',
                }}
              />
              {loading && (
                <span style={{ color: '#555', fontSize: 12 }}>looking up...</span>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13, color: '#666' }}>{problemNumber}</span>
              <span style={{ fontSize: 14, color: '#fff' }}>{autoFill.title}</span>
            </div>
          )}
        </td>

        {/* Difficulty */}
        <td style={{ width: 90, padding: '0 8px', transition: 'background 0.3s', background: cellBg }}>
          {autoFill && (
            <span style={{
              background: autoFill.difficulty === 'EASY' ? '#1a3a1a' : autoFill.difficulty === 'MEDIUM' ? '#3a2a0a' : '#3a0a0a',
              color: autoFill.difficulty === 'EASY' ? '#4ade80' : autoFill.difficulty === 'MEDIUM' ? '#fb923c' : '#f87171',
              borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 500,
            }}>
              {autoFill.difficulty.charAt(0) + autoFill.difficulty.slice(1).toLowerCase()}
            </span>
          )}
        </td>

        {/* Topic */}
        <td style={{ width: 130, padding: '0 8px', transition: 'background 0.3s', background: cellBg }}>
          {autoFill && (
            <span style={{ background: '#1a1a3a', color: '#818cf8', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}>
              {autoFill.topic}
            </span>
          )}
        </td>

        {/* Status */}
        <td style={{ width: 110, padding: '0 8px', color: '#555', fontSize: 13 }}>—</td>

        {/* Star */}
        <td style={{ width: 44 }} />

        {/* Next Revision */}
        <td style={{ width: 120, padding: '0 8px', color: '#555', fontSize: 13 }}>—</td>

        {/* Notes */}
        <td style={{ width: 160, padding: '0 12px' }}>
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
        <tr style={{ background: '#111', borderBottom: '1px solid #1a1a1a' }}>
          <td colSpan={8 + columns.length} style={{ padding: '8px 68px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#888' }}>
                Couldn&apos;t find problem #{problemNumber}. Paste the URL to continue, or press Escape to cancel.
              </span>
              <input
                value={manualUrl}
                onChange={(e) => handleManualUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                onKeyDown={(e) => e.key === 'Escape' && onCancel()}
                style={{
                  background: '#1a1a1a', border: '1px solid #333', borderRadius: 4,
                  color: '#fff', fontSize: 12, padding: '3px 8px', outline: 'none', width: 280,
                }}
              />
            </div>
            {error && <div style={{ fontSize: 12, color: '#f87171', marginTop: 4 }}>{error}</div>}
          </td>
        </tr>
      )}

      {/* Save/cancel hint */}
      {autoFill && (
        <tr style={{ background: '#0e0e0e', borderBottom: '1px solid #1a1a1a' }}>
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
