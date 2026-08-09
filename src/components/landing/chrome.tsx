import React from 'react';

type ChromeProps = {
  url: string;
  children: React.ReactNode;
  height?: number | string;
};

export function Chrome({ url, children, height }: ChromeProps) {
  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid #1a1a1a',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          height: '36px',
          background: '#0f0f0f',
          borderBottom: '1px solid #111111',
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Traffic dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3a1a1a' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3a3010' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a3a1a' }} />
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            maxWidth: '220px',
            margin: '0 auto',
            background: '#080808',
            border: '1px solid #1a1a1a',
            borderRadius: '4px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#333',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.02em',
            }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ height: height ?? 'auto', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
