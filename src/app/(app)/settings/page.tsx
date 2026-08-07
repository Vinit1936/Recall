'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

const PLATFORMS = ['LEETCODE', 'CODEFORCES', 'GFG', 'HACKERRANK', 'CODECHEF'];

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [defaultPlatform, setDefaultPlatform] = useState('LEETCODE');
  const [dailyTarget, setDailyTarget] = useState('5');
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load local storage preferences
    const savedPlat = localStorage.getItem('recall_default_platform');
    if (savedPlat) setDefaultPlatform(savedPlat);

    const savedTarget = localStorage.getItem('recall_daily_target');
    if (savedTarget) setDailyTarget(savedTarget);

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveName = async () => {
    setSavingName(true);
    setSavedMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await updateSession();
        setSavedMessage('Name updated successfully');
        setTimeout(() => setSavedMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingName(false);
    }
  };

  const handlePlatformChange = (val: string) => {
    setDefaultPlatform(val);
    localStorage.setItem('recall_default_platform', val);
  };

  const handleTargetChange = (val: string) => {
    setDailyTarget(val);
    localStorage.setItem('recall_daily_target', val);
  };

  const handleExportData = () => {
    window.location.href = '/api/export';
  };

  const initial = name ? name.charAt(0).toUpperCase() : email ? email.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Settings
        </h1>
        <p style={{ fontSize: 13, color: '#666' }}>
          Manage your account profile, preferences, and data backup.
        </p>
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: '#666', fontFamily: 'var(--font-geist-mono), monospace' }}>
          Loading settings...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1: Account Profile */}
          <div
            style={{
              background: '#111112',
              border: '1px solid #1e1e1e',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 18 }}>
              Account Profile
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#222226',
                  border: '1px solid #2a2a30',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                {initial}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{name || 'User'}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 6 }}>
                  Display Name
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      flex: 1,
                      background: '#161618',
                      border: '1px solid #26262a',
                      borderRadius: 6,
                      padding: '7px 12px',
                      fontSize: 13,
                      color: '#fff',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    style={{
                      background: '#1f1f23',
                      border: '1px solid #2e2e34',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '0 14px',
                      cursor: 'pointer',
                    }}
                  >
                    {savingName ? 'Saving...' : 'Save'}
                  </button>
                </div>
                {savedMessage && (
                  <div style={{ fontSize: 12, color: '#10b981', marginTop: 6 }}>
                    {savedMessage}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="text"
                  value={email}
                  disabled
                  style={{
                    width: '100%',
                    background: '#141415',
                    border: '1px solid #202024',
                    borderRadius: 6,
                    padding: '7px 12px',
                    fontSize: 13,
                    color: '#555',
                    cursor: 'not-allowed',
                  }}
                />
              </div>

              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/login' })}
                  style={{
                    background: 'transparent',
                    border: '1px solid #2a2a2e',
                    borderRadius: 6,
                    color: '#ef4444',
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '7px 14px',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Preferences */}
          <div
            style={{
              background: '#111112',
              border: '1px solid #1e1e1e',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 18 }}>
              Preferences
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 6 }}>
                  Default Coding Platform
                </label>
                <select
                  value={defaultPlatform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#161618',
                    border: '1px solid #26262a',
                    borderRadius: 6,
                    padding: '7px 12px',
                    fontSize: 13,
                    color: '#fff',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: 11, color: '#555', marginTop: 4, display: 'block' }}>
                  Pre-selected platform when adding new problems.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 6 }}>
                  Daily Revision Goal
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={dailyTarget}
                  onChange={(e) => handleTargetChange(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#161618',
                    border: '1px solid #26262a',
                    borderRadius: 6,
                    padding: '7px 12px',
                    fontSize: 13,
                    color: '#fff',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: 11, color: '#555', marginTop: 4, display: 'block' }}>
                  Target number of problem revisions per day.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Data Export */}
          <div
            style={{
              background: '#111112',
              border: '1px solid #1e1e1e',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              Data Backup & Export
            </div>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
              Download a complete JSON export of all your tracked problems, notes, and revision history logs.
            </p>

            <button
              onClick={handleExportData}
              style={{
                background: '#1f1f23',
                border: '1px solid #2e2e34',
                borderRadius: 6,
                color: '#fff',
                fontSize: 12,
                fontWeight: 500,
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M4 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Export All Data (.json)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
