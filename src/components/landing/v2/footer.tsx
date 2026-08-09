export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #0d0d0d',
      }}
    >
      <div
        style={{
          padding: '20px 40px',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left — wordmark + copyright */}
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '11px',
          }}
        >
          <span style={{ color: '#333' }}>recall</span>
          <span style={{ color: '#ff6b00' }}>.</span>
          <span style={{ color: '#222' }}> © 2026</span>
        </span>

        {/* Right — links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[
            { label: 'GitHub', href: 'https://github.com/Vinit1936/Recall' },
            { label: 'Twitter', href: 'https://twitter.com/vinitpatil193' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '11px',
                color: '#2a2a2a',
                textDecoration: 'none',
                transition: 'color 0.12s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#555')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#2a2a2a')}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
