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

function OAuthButton({ provider, label, onClick }: { provider: 'google' | 'github'; label: string; onClick: () => void }) {
  const isGoogle = provider === 'google';
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
      {isGoogle ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      )}
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
      fontWeight: 500,
      color: active ? '#fff' : '#555',
      padding: '0 0 10px 0',
      borderBottom: active ? '2px solid #fff' : '2px solid transparent',
      transition: 'color 0.15s, border-color 0.15s',
      marginRight: 24,
    }),
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel — inspiration design with download.jpg */}
      <div
        style={{
          width: '50%',
          backgroundImage: 'url("/login-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 48px',
          boxSizing: 'border-box',
        }}
      >
        {/* Dark subtle overlay for crisp text contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.65) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Brand Logo */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>✦</span> recall<span style={{ color: '#F7981E' }}>.</span>
          </div>
        </div>

        {/* Bottom Hero Headline */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 12, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            Spaced Repetition Tracker
          </div>
          <h2
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Your personal hub for problem solving, revision, and mastery
          </h2>
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
        <div style={{ width: '100%', maxWidth: 400, minHeight: 530 }}>
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
              <OAuthButton provider="google" label="Continue with Google" onClick={() => signIn('google', { callbackUrl: '/' })} />
              <OAuthButton provider="github" label="Continue with GitHub" onClick={() => signIn('github', { callbackUrl: '/' })} />
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
              <OAuthButton provider="google" label="Continue with Google" onClick={() => signIn('google', { callbackUrl: '/' })} />
              <OAuthButton provider="github" label="Continue with GitHub" onClick={() => signIn('github', { callbackUrl: '/' })} />
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
