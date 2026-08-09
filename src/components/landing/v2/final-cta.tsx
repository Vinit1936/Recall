'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #111',
        padding: '60px 40px 0',
      }}
    >
      {/* Background wordmark */}
      <div
        className="shiny-wordmark-container"
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
          cursor: 'default',
          zIndex: 0,
        }}
      >
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span className="shiny-wordmark-text">recall</span>
          <span className="shiny-wordmark-dot">.</span>
        </span>
      </div>

      {/* Foreground content */}
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
          }}
        >
          Free. No credit card. No nonsense.
        </p>

        <div style={{ marginTop: '36px' }}>
          <Link
            href="/auth/login"
            style={{
              background: '#f0f0f0',
              color: '#080808',
              fontSize: '14px',
              fontWeight: 600,
              height: '44px',
              padding: '0 28px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f0f0f0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get started free →
          </Link>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: '13px',
            marginTop: '20px',
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
          color: rgba(255, 255, 255, 0.075);
          transition: all 0.4s ease;
          display: inline-block;
        }
        .shiny-wordmark-dot {
          position: absolute;
          left: 100%;
          bottom: 0;
          color: rgba(255, 107, 0, 0.4);
          transition: all 0.4s ease;
        }
        .shiny-wordmark-container:hover .shiny-wordmark-text {
          background: linear-gradient(
            110deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.5) 30%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 255, 255, 0.5) 70%,
            rgba(255, 255, 255, 0.15) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shineSweep 1.8s ease-in-out infinite;
        }
        .shiny-wordmark-container:hover .shiny-wordmark-dot {
          color: #ff6b00 !important;
          text-shadow: 0 0 20px rgba(255, 107, 0, 0.9), 0 0 40px rgba(255, 107, 0, 0.5);
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
