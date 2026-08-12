'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Chrome } from './chrome';
import { PlatformLogo } from '@/lib/platforms/logos';

export function TableDemoMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '-50px' });

  // Sequence state
  const [step, setStep] = useState(0);
  const [typedNumber, setTypedNumber] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let timeoutId: NodeJS.Timeout;

    // t=0ms: Reset
    setStep(0);
    setTypedNumber('');
    setConfirmed(false);

    // t=600ms: Platform LC
    const t1 = setTimeout(() => setStep(1), 600);

    // t=1200ms: Focus Number input
    const t2 = setTimeout(() => setStep(2), 1200);

    // t=1400ms: Type "2"
    const t3 = setTimeout(() => setTypedNumber('2'), 1400);
    // t=1520ms: Type "23"
    const t4 = setTimeout(() => setTypedNumber('23'), 1520);
    // t=1640ms: Type "234"
    const t5 = setTimeout(() => setTypedNumber('234'), 1640);

    // t=1900ms: Loading shimmer
    const t6 = setTimeout(() => setStep(3), 1900);

    // t=2200ms: Title & Metadata fade in
    const t7 = setTimeout(() => setStep(4), 2200);

    // t=2600ms: Green confirmation flash
    const t8 = setTimeout(() => setConfirmed(true), 2600);

    // t=4200ms: Fade out & restart
    const t9 = setTimeout(() => setStep(5), 4200);

    // t=4500ms: Loop reset
    const t10 = setTimeout(() => {
      setStep(0);
      setTypedNumber('');
      setConfirmed(false);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      clearTimeout(t10);
    };
  }, [isInView, step === 5]);

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
      <Chrome url="recallx.tech" height={280}>
        <div
          style={{
            height: '100%',
            background: '#0a0a0b',
            padding: '16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            fontFamily: 'var(--font-geist-sans), sans-serif',
          }}
        >
          {/* Card Wrapper */}
          <motion.div
            animate={{ opacity: step === 5 ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: '#121214',
              border: `1px solid ${confirmed ? '#2d5a2d' : step === 2 ? '#3a3a3e' : '#1e1e22'}`,
              borderRadius: '12px',
              padding: '16px',
              boxShadow: confirmed ? '0 0 20px rgba(74, 222, 128, 0.15)' : '0 8px 24px rgba(0, 0, 0, 0.4)',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Confirmation Flash Banner */}
            {confirmed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(74, 222, 128, 0.2)',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                borderBottom: '1px solid #1a1a1e',
                paddingBottom: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '10px',
                  color: '#666',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                + New Problem
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '10px', color: '#555', fontFamily: 'var(--font-geist-mono), monospace' }}>
                  Platform:
                </span>
                {step >= 1 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <PlatformLogo platform="LEETCODE" size={18} />
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#e5e5e5',
                        fontFamily: 'var(--font-geist-sans), sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      LeetCode
                    </span>
                  </motion.div>
                ) : (
                  <span style={{ fontSize: '10px', color: '#444', fontFamily: 'var(--font-geist-mono), monospace' }}>
                    —
                  </span>
                )}
              </div>
            </div>

            {/* Number Input Display */}
            <div
              style={{
                background: '#09090a',
                border: `1px solid ${step === 2 || typedNumber ? '#333338' : '#18181c'}`,
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease',
              }}
            >
              <span style={{ fontSize: '11px', color: '#555', fontFamily: 'var(--font-geist-mono), monospace' }}>
                Problem #
              </span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: typedNumber ? '#ffffff' : '#333333',
                    letterSpacing: '0.05em',
                  }}
                >
                  {typedNumber || '___'}
                </span>
                {(step === 2 || (typedNumber && step < 4)) && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    style={{
                      display: 'inline-block',
                      width: '2px',
                      height: '20px',
                      background: '#ff6b00',
                      marginLeft: '2px',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Loading Shimmer Bar */}
            {step === 3 && (
              <div style={{ height: '3px', width: '100%', background: '#1a1a20', borderRadius: '2px', overflow: 'hidden', marginBottom: '14px' }}>
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  style={{ width: '40%', height: '100%', background: 'linear-gradient(to right, transparent, #ff6b00, transparent)' }}
                />
              </div>
            )}

            {/* Auto-filled details */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 6 }}
              transition={{ duration: 0.3 }}
            >
              {/* Problem Title */}
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#f0f0f0',
                  marginBottom: '12px',
                  lineHeight: 1.3,
                }}
              >
                Palindrome Linked List
              </div>

              {/* Badges / Pills Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Easy Pill */}
                <span
                  style={{
                    background: '#1c3a1c',
                    color: '#4ade80',
                    border: '1px solid #2d5a2d',
                    fontSize: '11px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-geist-mono), monospace',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  Easy
                </span>

                {/* Topic Pill */}
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    fontSize: '11px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-geist-mono), monospace',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  Linked List
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Chrome>
    </div>
  );
}
