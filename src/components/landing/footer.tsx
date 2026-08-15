export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #0d0d0d',
      }}
    >
      <div
        data-footer-container
        style={{
          padding: '20px 40px',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left — wordmark + author copyright */}
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '11px',
            color: '#666',
          }}
        >
          recall<span style={{ color: '#ff6b00' }}>.</span> © 2026 · Created by{' '}
          <a
            href="https://github.com/Vinit1936"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#888', textDecoration: 'none', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
          >
            Vinit Patil
          </a>
        </span>

        {/* Right — social links */}
        <div data-footer-links style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Feedback', href: 'https://forms.gle/gZHJsswXm4G3rQ9s6' },
            { label: 'GitHub', href: 'https://github.com/Vinit1936/Recall' },
            { label: 'Twitter', href: 'https://twitter.com/vinitpatil193' },
            { label: 'Instagram', href: 'https://instagram.com/vinit.patil19' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vinitpatil19/' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '11px',
                color: '#555',
                textDecoration: 'none',
                transition: 'color 0.12s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#aaaaaa')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
