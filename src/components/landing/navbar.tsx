'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export function Navbar() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        if (typeof window !== 'undefined' && window.__lenis) {
          window.__lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
        } else {
          const navOffset = 60;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        height: '52px',
      }}
    >
      <div
        data-nav-container
        style={{
          maxWidth: 'clamp(1280px, 92vw, 1800px)',
          margin: '0 auto',
          padding: '0 40px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left — wordmark */}
        <Link
          data-nav-logo
          href="/dashboard"
          style={{
            textDecoration: 'none',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '15px',
            fontWeight: 500,
            color: '#f0f0f0',
            letterSpacing: '-0.01em',
            cursor: 'pointer',
          }}
        >
          recall<span style={{ color: '#ff6b00' }}>.</span>
        </Link>

        {/* Center — nav links */}
        <div data-nav-center style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Science', href: '#science' },
            { label: 'FAQ', href: '#faq' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '13px',
                color: '#555',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                transition: 'color 0.12s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e5e5e5')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right — GitHub + Sign in */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a
            data-nav-github
            href="https://github.com/Vinit1936/Recall"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            title="GitHub"
            style={{
              color: '#888',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
          >
            <svg
              height="18"
              width="18"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ display: 'block' }}
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
          </a>

          <Link
            data-nav-signin
            href="/auth/login"
            style={{
              border: '1px solid #222',
              background: 'transparent',
              color: '#888',
              fontSize: '12px',
              height: '32px',
              padding: '0 16px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              transition: 'border-color 0.12s ease, color 0.12s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#e5e5e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222';
              e.currentTarget.style.color = '#888';
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
