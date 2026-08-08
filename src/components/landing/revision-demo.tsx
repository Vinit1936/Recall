'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { PlatformLogo } from '@/lib/platforms/logos';
import { getTopicColor, getDifficultyStyle, CONF_BUTTONS } from './demo-styles';
import { FakeCursor, CursorHandle } from './fake-cursor';

const FAKE_DUE = [
  { id: 1, number: 123, title: 'Best Time to Buy and Sell Stock III', difficulty: 'HARD', topic: 'Two Pointers' },
  { id: 2, number: 21, title: 'Merge Two Sorted Lists', difficulty: 'EASY', topic: 'Linked List' },
  { id: 3, number: 55, title: 'Jump Game', difficulty: 'MEDIUM', topic: 'Greedy' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function RevisionDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<CursorHandle>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  // Refs for buttons
  const r1CleanRef = useRef<HTMLButtonElement>(null);
  const r2StruggledRef = useRef<HTMLButtonElement>(null);
  const r3ShakyRef = useRef<HTMLButtonElement>(null);

  // States
  const [row1Badge, setRow1Badge] = useState<keyof typeof CONF_BUTTONS | null>(null);
  const [row2Badge, setRow2Badge] = useState<keyof typeof CONF_BUTTONS | null>(null);
  const [row3Badge, setRow3Badge] = useState<keyof typeof CONF_BUTTONS | null>(null);

  const [row1Hover, setRow1Hover] = useState<string | null>(null);
  const [row2Hover, setRow2Hover] = useState<string | null>(null);
  const [row3Hover, setRow3Hover] = useState<string | null>(null);

  const [problemListVisible, setProblemListVisible] = useState(true);
  const [allDoneVisible, setAllDoneVisible] = useState(false);
  const [streakVal, setStreakVal] = useState(3);
  const [streakFlipping, setStreakFlipping] = useState(false);

  const getRelativePos = (el: HTMLElement | null) => {
    if (!el || !containerRef.current) return { x: 40, y: 200 };
    const cBox = containerRef.current.getBoundingClientRect();
    const eBox = el.getBoundingClientRect();
    return {
      x: eBox.left - cBox.left + eBox.width / 2,
      y: eBox.top - cBox.top + eBox.height / 2,
    };
  };

  const resetAll = () => {
    setRow1Badge(null);
    setRow2Badge(null);
    setRow3Badge(null);
    setRow1Hover(null);
    setRow2Hover(null);
    setRow3Hover(null);
    setProblemListVisible(true);
    setAllDoneVisible(false);
    setStreakVal(3);
    setStreakFlipping(false);
    cursorRef.current?.hide();
  };

  useEffect(() => {
    if (!isInView) {
      resetAll();
      return;
    }

    let isCancelled = false;

    const runSequence = async () => {
      resetAll();
      await sleep(800);
      if (isCancelled) return;

      // t=800ms: cursor fades in near first row's Clean button
      const r1Pos = getRelativePos(r1CleanRef.current);
      cursorRef.current?.moveTo(r1Pos.x + 40, r1Pos.y + 40, 0);
      cursorRef.current?.show();

      // t=1200ms: cursor moves to row 1 "Clean" button
      await cursorRef.current?.moveTo(r1Pos.x, r1Pos.y, 0.4);
      await sleep(400);
      if (isCancelled) return;

      // t=1600ms: hover highlight
      setRow1Hover('CLEAN');
      await sleep(300);
      if (isCancelled) return;

      // t=1900ms: click
      await cursorRef.current?.click();
      setRow1Hover(null);
      // t=2000ms: green Clean badge appears
      setRow1Badge('CLEAN');
      await sleep(800);
      if (isCancelled) return;

      // t=2800ms: cursor moves to row 2 "Struggled" button
      const r2Pos = getRelativePos(r2StruggledRef.current);
      await cursorRef.current?.moveTo(r2Pos.x, r2Pos.y, 0.4);
      await sleep(400);
      if (isCancelled) return;

      // t=3200ms: hover highlight
      setRow2Hover('STRUGGLED');
      await sleep(300);
      if (isCancelled) return;

      // t=3500ms: click
      await cursorRef.current?.click();
      setRow2Hover(null);
      // t=3600ms: red Struggled badge appears
      setRow2Badge('STRUGGLED');
      await sleep(800);
      if (isCancelled) return;

      // t=4400ms: cursor moves to row 3 "Shaky" button
      const r3Pos = getRelativePos(r3ShakyRef.current);
      await cursorRef.current?.moveTo(r3Pos.x, r3Pos.y, 0.4);
      await sleep(400);
      if (isCancelled) return;

      // t=4800ms: hover highlight
      setRow3Hover('SHAKY');
      await sleep(300);
      if (isCancelled) return;

      // t=5100ms: click
      await cursorRef.current?.click();
      setRow3Hover(null);
      // t=5200ms: amber Shaky badge appears
      setRow3Badge('SHAKY');
      await sleep(800);
      if (isCancelled) return;

      // t=6000ms: all 3 rows show badges
      cursorRef.current?.hide();
      await sleep(200);
      if (isCancelled) return;

      // t=6200ms: problem list fades out (300ms)
      setProblemListVisible(false);
      await sleep(300);
      if (isCancelled) return;

      // t=6500ms: all done state fades in (400ms)
      setAllDoneVisible(true);
      await sleep(100);
      if (isCancelled) return;

      // t=6600ms: streak counter animates "3" -> "4"
      setStreakFlipping(true);
      await sleep(400);
      setStreakVal(4);
      setStreakFlipping(false);
      await sleep(1900);
      if (isCancelled) return;

      // t=8500ms: all done state fades out
      setAllDoneVisible(false);
      await sleep(300);
      if (isCancelled) return;

      // t=8800ms: problem list fades back in, badges reset
      resetAll();
      await sleep(700);

      // t=9500ms: loop restarts
      if (!isCancelled) {
        runSequence();
      }
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '480px',
        width: '100%',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-geist-sans), sans-serif',
        fontSize: '13px',
        color: '#e5e5e5',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      <FakeCursor ref={cursorRef} />

      {/* Top Stats Strip */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '12px',
          color: '#888888',
          borderBottom: '1px solid #141414',
        }}
      >
        <span>🔥 <strong style={{ color: '#ffffff' }}>{streakVal}</strong></span>
        <span style={{ color: '#333333' }}>·</span>
        <span><strong style={{ color: '#ffffff' }}>19</strong> problems</span>
        <span style={{ color: '#333333' }}>·</span>
        <span><strong style={{ color: '#ffffff' }}>1</strong> mastered</span>
        <span style={{ color: '#333333' }}>·</span>
        <span><strong style={{ color: '#ffffff' }}>3</strong> due today</span>
      </div>

      {/* Page Title Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 12px',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#ffffff' }}>
          ⌈ Daily Revision ⌋
        </div>
        <div style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: '#555555' }}>
          Friday, August 7
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: '0 16px', position: 'relative', minHeight: '340px' }}>
        {/* Problem List */}
        <AnimatePresence>
          {problemListVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              {FAKE_DUE.map((prob) => {
                const diff = getDifficultyStyle(prob.difficulty);
                const topic = getTopicColor(prob.topic);

                let badgeKey: keyof typeof CONF_BUTTONS | null = null;
                let hoverKey: string | null = null;
                let cleanRef: any = null;
                let struggledRef: any = null;
                let shakyRef: any = null;

                if (prob.id === 1) {
                  badgeKey = row1Badge;
                  hoverKey = row1Hover;
                  cleanRef = r1CleanRef;
                } else if (prob.id === 2) {
                  badgeKey = row2Badge;
                  hoverKey = row2Hover;
                  struggledRef = r2StruggledRef;
                } else if (prob.id === 3) {
                  badgeKey = row3Badge;
                  hoverKey = row3Hover;
                  shakyRef = r3ShakyRef;
                }

                return (
                  <div
                    key={prob.id}
                    style={{
                      height: '48px',
                      background: '#111111',
                      border: '1px solid #1a1a1a',
                      borderRadius: '6px',
                      padding: '0 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Left: Logo, Number, Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1 }}>
                      <PlatformLogo platform="LEETCODE" size={18} padding={1} />
                      <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px', color: '#555555' }}>
                        #{prob.number}
                      </span>
                      <span style={{ color: '#e5e5e5', fontSize: '13px', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {prob.title}
                      </span>
                    </div>

                    {/* Right: Difficulty, Topic, Confidence Buttons/Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          background: diff.bg,
                          color: diff.text,
                          border: `1px solid ${diff.border}`,
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {prob.difficulty}
                      </span>
                      <span
                        style={{
                          background: topic.bg,
                          color: topic.text,
                          border: `1px solid ${topic.border}`,
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 500,
                        }}
                      >
                        {prob.topic}
                      </span>

                      {/* Confidence actions */}
                      <div style={{ marginLeft: '4px', minWidth: '170px', display: 'flex', justifyContent: 'flex-end' }}>
                        {badgeKey ? (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              background: CONF_BUTTONS[badgeKey].doneBg,
                              border: `1px solid ${CONF_BUTTONS[badgeKey].doneBorder}`,
                              color: CONF_BUTTONS[badgeKey].doneText,
                              borderRadius: '5px',
                              padding: '4px 10px',
                              fontSize: '11px',
                              fontFamily: 'var(--font-geist-mono), monospace',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {CONF_BUTTONS[badgeKey].label} {CONF_BUTTONS[badgeKey].symbol}
                          </motion.span>
                        ) : (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              ref={cleanRef}
                              style={{
                                border: hoverKey === 'CLEAN' ? `1px solid ${CONF_BUTTONS.CLEAN.hoverBorder}` : '1px solid #222222',
                                background: 'transparent',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                color: hoverKey === 'CLEAN' ? CONF_BUTTONS.CLEAN.doneText : '#666666',
                                fontFamily: 'var(--font-geist-mono), monospace',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              Clean
                            </button>
                            <button
                              ref={shakyRef}
                              style={{
                                border: hoverKey === 'SHAKY' ? `1px solid ${CONF_BUTTONS.SHAKY.hoverBorder}` : '1px solid #222222',
                                background: 'transparent',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                color: hoverKey === 'SHAKY' ? CONF_BUTTONS.SHAKY.doneText : '#666666',
                                fontFamily: 'var(--font-geist-mono), monospace',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              Shaky
                            </button>
                            <button
                              ref={struggledRef}
                              style={{
                                border: hoverKey === 'STRUGGLED' ? `1px solid ${CONF_BUTTONS.STRUGGLED.hoverBorder}` : '1px solid #222222',
                                background: 'transparent',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                color: hoverKey === 'STRUGGLED' ? CONF_BUTTONS.STRUGGLED.doneText : '#666666',
                                fontFamily: 'var(--font-geist-mono), monospace',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              Struggled
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Done State */}
        <AnimatePresence>
          {allDoneVisible && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 0',
                gap: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: '#4ade80', fontSize: '32px', lineHeight: 1 }}>✓</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#ffffff' }}>
                All done for today
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '13px',
                  color: '#888888',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>🔥</span>
                {/* Vertical digit flip counter animation */}
                <div style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', height: '20px', width: '12px' }}>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={streakVal}
                      initial={{ y: streakFlipping ? 20 : 0, opacity: streakFlipping ? 0 : 1 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ position: 'absolute', left: 0, top: 0, fontWeight: 600, color: '#ffffff' }}
                    >
                      {streakVal}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span>day streak</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
