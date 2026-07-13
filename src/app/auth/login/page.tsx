'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Fake decorative heatmap for the left panel
function FakeHeatmap() {
  const cols = 20;
  const rows = 7;
  const levels = ['#1a1a1a', '#1a3a2a', '#1e5c3a', 'rgba(34,197,94,0.6)', '#22c55e'];
  const seed = (i: number) => (Math.sin(i * 9.301 + 0.5) * 43758.5453) % 1;

  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 24 }}>
      {Array.from({ length: cols }).map((_, ci) => (
        <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Array.from({ length: rows }).map((_, ri) => {
            const v = Math.abs(seed(ci * 7 + ri));
            const level = v < 0.5 ? 0 : v < 0.65 ? 1 : v < 0.8 ? 2 : v < 0.92 ? 3 : 4;
            return <div key={ri} style={{ width: 11, height: 11, borderRadius: 2, background: levels[level] }} />;
          })}
        </div>
      ))}
    </div>
  );
}

type Tab = 'signin' | 'signup';

function Input({ label, type, value, onChange, placeholder, error }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: '#1a1a1a',
          border: `1px solid ${focused ? '#444' : '#2a2a2a'}`,
          borderRadius: 6,
          color: '#fff',
          fontSize: 14,
          padding: '10px 14px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
      />
      {error && <div style={{ fontSize: 12, color: '#f87171', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function PrimaryButton({ children, onClick, loading, disabled }: { children: React.ReactNode; onClick?: () => void; loading?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        width: '100%',
        background: loading || disabled ? '#ccc' : '#fff',
        color: '#000',
        border: 'none',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        padding: '11px 0',
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'background 0.15s',
        marginBottom: 8,
      }}
    >
      {loading ? <span style={{ fontSize: 16 }}>⋯</span> : children}
    </button>
  );
}

function OAuthButton({ provider, icon, label, onClick }: { provider: string; icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: 'transparent',
        border: '1px solid #2a2a2a',
        borderRadius: 6,
        color: '#fff',
        fontSize: 14,
        padding: '10px 0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 8,
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#444')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
      <span style={{ fontSize: 12, color: '#555' }}>or</span>
      <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');

  // Sign in state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siError, setSiError] = useState('');
  const [siLoading, setSiLoading] = useState(false);

  // Sign up state
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suError, setSuError] = useState('');
  const [suLoading, setSuLoading] = useState(false);

  const handleSignIn = async () => {
    setSiError('');
    setSiLoading(true);
    try {
      const res = await signIn('credentials', {
        email: siEmail,
        password: siPassword,
        redirect: false,
      });
      if (res?.error) {
        setSiError('Invalid email or password.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setSiError('Something went wrong. Please try again.');
    } finally {
      setSiLoading(false);
    }
  };

  const handleSignUp = async () => {
    setSuError('');
    if (suPassword.length < 8) {
      setSuError('Password must be at least 8 characters.');
      return;
    }
    setSuLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: suName, email: suEmail, password: suPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSuError(json.error ?? 'Sign up failed.');
        return;
      }
      // Auto sign in
      const loginRes = await signIn('credentials', {
        email: suEmail,
        password: suPassword,
        redirect: false,
      });
      if (loginRes?.error) {
        setSuError('Account created but sign in failed. Please sign in manually.');
        setTab('signin');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setSuError('Something went wrong. Please try again.');
    } finally {
      setSuLoading(false);
    }
  };

  const inputStyle = {
    tabButton: (active: boolean): React.CSSProperties => ({
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 15,
      fontWeight: active ? 600 : 400,
      color: active ? '#fff' : '#555',
      padding: '0 0 10px 0',
      borderBottom: active ? '2px solid #fff' : '2px solid transparent',
      transition: 'color 0.15s, border-color 0.15s',
      marginRight: 24,
    }),
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel — branding */}
      <div
        style={{
          width: '50%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          {/* Wordmark */}
          <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 12, letterSpacing: '-0.03em' }}>
            recall<span style={{ color: '#444' }}>.</span>
          </div>
          {/* Tagline */}
          <div style={{ fontSize: 16, color: '#888', lineHeight: 1.5 }}>
            Never forget a problem you&apos;ve solved.
          </div>
          {/* Fake heatmap */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <FakeHeatmap />
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ position: 'absolute', bottom: 32, fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Track · Revise · Master
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          width: '50%',
          background: '#0f0f0f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', marginBottom: 32, borderBottom: '1px solid #1e1e1e', paddingBottom: 0 }}>
            <button style={inputStyle.tabButton(tab === 'signin')} onClick={() => setTab('signin')}>Sign in</button>
            <button style={inputStyle.tabButton(tab === 'signup')} onClick={() => setTab('signup')}>Sign up</button>
          </div>

          {tab === 'signin' ? (
            <>
              <Input label="Email" type="email" value={siEmail} onChange={setSiEmail} placeholder="you@example.com" />
              <Input label="Password" type="password" value={siPassword} onChange={setSiPassword} placeholder="••••••••" />
              {siError && <div style={{ fontSize: 13, color: '#f87171', marginBottom: 12, marginTop: -8 }}>{siError}</div>}
              <PrimaryButton onClick={handleSignIn} loading={siLoading}>Sign in →</PrimaryButton>
              <Divider />
              <OAuthButton provider="google" icon="G" label="Continue with Google" onClick={() => signIn('google', { callbackUrl: '/' })} />
              <OAuthButton provider="github" icon="⌥" label="Continue with GitHub" onClick={() => signIn('github', { callbackUrl: '/' })} />
              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#555' }}>
                Don&apos;t have an account?{' '}
                <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>Sign up</button>
              </div>
            </>
          ) : (
            <>
              <Input label="Name (optional)" type="text" value={suName} onChange={setSuName} placeholder="Your name" />
              <Input label="Email" type="email" value={suEmail} onChange={setSuEmail} placeholder="you@example.com" />
              <Input label="Password (min 8 characters)" type="password" value={suPassword} onChange={setSuPassword} placeholder="••••••••" />
              {suError && <div style={{ fontSize: 13, color: '#f87171', marginBottom: 12, marginTop: -8 }}>{suError}</div>}
              <PrimaryButton onClick={handleSignUp} loading={suLoading}>Create account →</PrimaryButton>
              <Divider />
              <OAuthButton provider="google" icon="G" label="Continue with Google" onClick={() => signIn('google', { callbackUrl: '/' })} />
              <OAuthButton provider="github" icon="⌥" label="Continue with GitHub" onClick={() => signIn('github', { callbackUrl: '/' })} />
              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#555' }}>
                Already have an account?{' '}
                <button onClick={() => setTab('signin')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>Sign in</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
