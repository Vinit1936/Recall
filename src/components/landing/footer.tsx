'use client';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #111111',
        padding: '28px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      {/* Left Branding */}
      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '12px',
          color: '#333333',
        }}
      >
        recall<span style={{ color: '#222222' }}>.</span> © 2026
      </div>

      {/* Right Social / Project Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '12px',
        }}
      >
        <a
          href="https://github.com/Vinit1936/Recall"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#333333', textDecoration: 'none', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#888888')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#333333')}
        >
          GitHub
        </a>
        <a
          href="https://x.com/vinitpatil193"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#333333', textDecoration: 'none', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#888888')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#333333')}
        >
          Twitter
        </a>
        <a
          href="https://www.linkedin.com/in/vinitpatil19/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#333333', textDecoration: 'none', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#888888')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#333333')}
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
