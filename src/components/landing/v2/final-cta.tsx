'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #111',
        padding: '60px 40px 0',
      }}
    >
      {/* Background wordmark — high z-index & pointer-events for hover */}
      <div
        className="shiny-wordmark-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          bottom: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontWeight: 700,
          fontSize: 'clamp(90px, 12vw, 180px)',
          userSelect: 'none',
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
          cursor: 'pointer',
          zIndex: 2,
          pointerEvents: 'auto',
        }}
      >
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span className={`shiny-wordmark-text ${isHovered ? 'active-shine' : ''}`}>
            recall
          </span>
          <span
            className="shiny-wordmark-dot"
            style={{
              color: isHovered ? '#ff6b00' : 'rgba(255, 107, 0, 0.4)',
              textShadow: isHovered
                ? '0 0 24px rgba(255, 107, 0, 0.95), 0 0 48px rgba(255, 107, 0, 0.6)'
                : 'none',
              transition: 'all 0.4s ease',
            }}
          >
            .
          </span>
        </span>
      </div>

      {/* Foreground content — pointerEvents: none so mouse reaches wordmark underneath */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          paddingBottom: '140px',
          pointerEvents: 'none',
        }}
      >
        {/* Flying White Shooting Star Line — Taller & Prominent */}
        <div
          style={{
            position: 'relative',
            width: '1.5px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.08)',
            margin: '0 auto 32px',
            overflow: 'hidden',
            borderRadius: '2px',
            pointerEvents: 'auto',
          }}
        >
          <motion.div
            animate={{
              y: ['-100%', '260%'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.16, 1, 0.3, 1],
              repeatDelay: 0.4,
            }}
            style={{
              width: '100%',
              height: '36px',
              background: 'linear-gradient(to bottom, transparent, #ffffff 75%, #ffffff)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 1), 0 0 18px rgba(255, 255, 255, 0.5)',
            }}
          />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(40px, 5vw, 72px)',
            color: '#f0f0f0',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.1,
            pointerEvents: 'auto',
          }}
        >
          Start remembering
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '12px',
            color: '#888',
            letterSpacing: '0.08em',
            marginTop: '16px',
            textTransform: 'uppercase',
            pointerEvents: 'auto',
          }}
        >
          Free. No credit card. No nonsense.
        </p>

        <div style={{ marginTop: '36px', pointerEvents: 'auto' }}>
          <Link
            href="/auth/login"
            style={{
              background: '#f0f0f0',
              color: '#080808',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              padding: '14px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
              boxShadow: '0 0 24px rgba(255,255,255,0.06)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 0 32px rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f0f0f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(255,255,255,0.06)';
            }}
          >
            Start for free
            <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
          </Link>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: '13px',
            marginTop: '20px',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ color: '#333' }}>Already have an account? </span>
          <Link
            href="/auth/login"
            style={{
              color: '#555',
              textDecoration: 'none',
              transition: 'color 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
          >
            Sign in →
          </Link>
        </p>
      </motion.div>

      <style>{`
        .shiny-wordmark-text {
          color: rgba(255, 255, 255, 0.08);
          transition: color 0.4s ease;
          display: inline-block;
        }
        .shiny-wordmark-text.active-shine {
          background: linear-gradient(
            110deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.5) 30%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 255, 255, 0.5) 70%,
            rgba(255, 255, 255, 0.12) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shineSweep 1.6s ease-in-out infinite;
        }
        .shiny-wordmark-dot {
          position: absolute;
          left: 100%;
          bottom: 0;
        }
        @keyframes shineSweep {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @media (max-width: 768px) {
          section[style*="padding"] {
            padding: 40px 20px 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
