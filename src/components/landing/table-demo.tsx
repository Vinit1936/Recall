'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { PlatformLogo } from '@/lib/platforms/logos';
import { getTopicColor, getDifficultyStyle } from './demo-styles';
import { FakeCursor, CursorHandle } from './fake-cursor';

const FAKE_PROBLEMS = [
  { id: 1, number: 1, title: 'Two Sum', difficulty: 'EASY', topic: 'Array', status: 'CLEAN', nextRevision: 'in 2 days', statusColor: '#4ade80' },
  { id: 2, number: 21, title: 'Merge Two Sorted Lists', difficulty: 'EASY', topic: 'Linked List', status: 'SHAKY', nextRevision: 'today', statusColor: '#fb923c' },
  { id: 3, number: 124, title: 'Binary Tree Max Path Sum', difficulty: 'HARD', topic: 'Binary Tree', status: 'STRUGGLED', nextRevision: 'overdue', statusColor: '#f87171' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function TableDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<CursorHandle>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  // References for cursor targets
  const newRowBtnRef = useRef<HTMLDivElement>(null);
  const platformCellRef = useRef<HTMLDivElement>(null);
  const dropdownOptionRef = useRef<HTMLDivElement>(null);
  const numberCellRef = useRef<HTMLDivElement>(null);
  const notesCellRef = useRef<HTMLDivElement>(null);

  // States
  const [newRowVisible, setNewRowVisible] = useState(false);
  const [newRowPlatform, setNewRowPlatform] = useState<'LEETCODE' | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newRowNumber, setNewRowNumber] = useState('');
  const [isTypingNumber, setIsTypingNumber] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [easyPillVisible, setEasyPillVisible] = useState(false);
  const [topicPillVisible, setTopicPillVisible] = useState(false);
  const [greenFlash, setGreenFlash] = useState(false);
  const [isTypingNotes, setIsTypingNotes] = useState(false);
  const [newRowNotes, setNewRowNotes] = useState('');
  const [rowFinalized, setRowFinalized] = useState(false);

  const getRelativePos = (el: HTMLElement | null) => {
    if (!el || !containerRef.current) return { x: 40, y: 350 };
    const cBox = containerRef.current.getBoundingClientRect();
    const eBox = el.getBoundingClientRect();
    return {
      x: eBox.left - cBox.left + eBox.width / 2,
      y: eBox.top - cBox.top + eBox.height / 2,
    };
  };

  const resetAll = () => {
    setNewRowVisible(false);
    setNewRowPlatform(null);
    setDropdownOpen(false);
    setNewRowNumber('');
    setIsTypingNumber(false);
    setIsShimmering(false);
    setTitleVisible(false);
    setEasyPillVisible(false);
    setTopicPillVisible(false);
    setGreenFlash(false);
    setIsTypingNotes(false);
    setNewRowNotes('');
    setRowFinalized(false);
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

      // t=800ms: cursor fades in at "+ New row" position
      const btnPos = getRelativePos(newRowBtnRef.current);
      cursorRef.current?.moveTo(btnPos.x - 10, btnPos.y + 10, 0);
      cursorRef.current?.show();

      // t=1200ms: cursor moves to "+ New row" (smooth 0.4s)
      await sleep(400);
      if (isCancelled) return;
      await cursorRef.current?.moveTo(btnPos.x, btnPos.y, 0.4);
      await sleep(400);
      if (isCancelled) return;

      // t=1600ms: cursor click -> new empty row 4 appears
      await cursorRef.current?.click();
      setNewRowVisible(true);
      await sleep(400);
      if (isCancelled) return;

      // t=2000ms: cursor moves to Platform cell of row 4
      const pCellPos = getRelativePos(platformCellRef.current);
      await cursorRef.current?.moveTo(pCellPos.x, pCellPos.y, 0.4);
      await sleep(300);
      if (isCancelled) return;

      // t=2300ms: click -> platform dropdown opens
      await cursorRef.current?.click();
      setDropdownOpen(true);
      await sleep(300);
      if (isCancelled) return;

      // t=2600ms: cursor moves to LeetCode option
      const dropPos = getRelativePos(dropdownOptionRef.current);
      await cursorRef.current?.moveTo(dropPos.x, dropPos.y, 0.3);
      await sleep(300);
      if (isCancelled) return;

      // t=2900ms: click -> dropdown closes, LeetCode badge appears
      await cursorRef.current?.click();
      setDropdownOpen(false);
      setNewRowPlatform('LEETCODE');
      await sleep(300);
      if (isCancelled) return;

      // t=3200ms: cursor moves to Problem Number cell
      const numPos = getRelativePos(numberCellRef.current);
      await cursorRef.current?.moveTo(numPos.x, numPos.y, 0.3);
      await sleep(300);
      if (isCancelled) return;

      // t=3500ms: click -> text cursor blinks in cell
      await cursorRef.current?.click();
      setIsTypingNumber(true);
      await sleep(100);

      // t=3600ms: "2" types in
      setNewRowNumber('2');
      await sleep(150);
      // t=3750ms: "3" types in
      setNewRowNumber('23');
      await sleep(150);
      // t=3900ms: "4" types in
      setNewRowNumber('234');
      await sleep(150);

      // t=4050ms: loading shimmer appears
      setIsTypingNumber(false);
      setIsShimmering(true);
      await sleep(300);

      // t=4350ms: shimmer disappears
      setIsShimmering(false);
      await sleep(10);
      // t=4360ms: title "Palindrome Linked List" appears
      setTitleVisible(true);
      await sleep(20);
      // t=4380ms: Easy pill fades in
      setEasyPillVisible(true);
      await sleep(120);
      // t=4500ms: "Linked List" topic pill fades in
      setTopicPillVisible(true);
      await sleep(50);

      // t=4550ms: green overlay flash on title/difficulty/topic cells
      setGreenFlash(true);
      await sleep(650);
      setGreenFlash(false);
      if (isCancelled) return;

      // t=5200ms: cursor moves to Notes cell
      const notesPos = getRelativePos(notesCellRef.current);
      await cursorRef.current?.moveTo(notesPos.x, notesPos.y, 0.4);
      await sleep(400);
      if (isCancelled) return;

      // t=5600ms: click
      await cursorRef.current?.click();
      setIsTypingNotes(true);
      await sleep(200);

      // Type "two pointer"
      const notesText = 'two pointer';
      for (let i = 1; i <= notesText.length; i++) {
        if (isCancelled) return;
        setNewRowNotes(notesText.slice(0, i));
        await sleep(150);
      }
      setIsTypingNotes(false);
      await sleep(500);
      if (isCancelled) return;

      // t=7800ms: cursor moves away, row finalizes
      setRowFinalized(true);
      const awayPos = { x: notesPos.x + 120, y: notesPos.y + 40 };
      await cursorRef.current?.moveTo(awayPos.x, awayPos.y, 0.4);
      await sleep(400);

      // t=8200ms: cursor fades out
      cursorRef.current?.hide();
      await sleep(800);
      if (isCancelled) return;

      // t=9000ms: row fades out gently
      setNewRowVisible(false);
      await sleep(500);

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
        userSelect: 'none',
      }}
    >
      <FakeCursor ref={cursorRef} />

      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '52px minmax(180px, 1.2fr) 90px 110px 100px 100px 1fr',
          height: '32px',
          alignItems: 'center',
          padding: '0 16px',
          background: '#0d0d0d',
          borderBottom: '1px solid #1a1a1a',
          fontSize: '11px',
          fontFamily: 'var(--font-geist-mono), monospace',
          color: '#444444',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        <div>Plat</div>
        <div>Problem</div>
        <div>Diff</div>
        <div>Topic</div>
        <div>Status</div>
        <div>Revision</div>
        <div>Notes</div>
      </div>

      {/* Rows List */}
      <div>
        {FAKE_PROBLEMS.map((prob) => {
          const diff = getDifficultyStyle(prob.difficulty);
          const topic = getTopicColor(prob.topic);

          return (
            <div
              key={prob.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px minmax(180px, 1.2fr) 90px 110px 100px 100px 1fr',
                height: '44px',
                alignItems: 'center',
                padding: '0 16px',
                background: '#0a0a0a',
                borderBottom: '1px solid #141414',
              }}
            >
              <div>
                <PlatformLogo platform="LEETCODE" size={18} padding={1} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <span style={{ fontFamily: 'var(--font-geist-mono), monospace', color: '#666666', fontSize: '12px' }}>
                  #{prob.number}
                </span>
                <span style={{ color: '#e5e5e5', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {prob.title}
                </span>
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: prob.statusColor }} />
                <span style={{ fontSize: '12px', color: '#888888' }}>{prob.status}</span>
              </div>
              <div style={{ fontSize: '12px', color: prob.nextRevision === 'overdue' ? '#f87171' : prob.nextRevision === 'today' ? '#fb923c' : '#666666' }}>
                {prob.nextRevision}
              </div>
              <div style={{ fontSize: '12px', color: '#444444', fontStyle: 'italic' }}>-</div>
            </div>
          );
        })}

        {/* Row 4 - Animated Interactive Row */}
        <AnimatePresence>
          {newRowVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 44 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px minmax(180px, 1.2fr) 90px 110px 100px 100px 1fr',
                alignItems: 'center',
                padding: '0 16px',
                background: rowFinalized ? '#0a0a0a' : '#111111',
                borderBottom: '1px solid #141414',
                borderLeft: rowFinalized ? 'none' : '2px solid #2a2a2a',
                position: 'relative',
              }}
            >
              {/* Green Overlay Flash on auto fill */}
              <AnimatePresence>
                {greenFlash && (
                  <motion.div
                    initial={{ opacity: 0.15 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#4ade80',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Cell 1: Platform */}
              <div ref={platformCellRef} style={{ position: 'relative' }}>
                {newRowPlatform ? (
                  <PlatformLogo platform={newRowPlatform} size={18} padding={1} />
                ) : (
                  <span style={{ color: '#333333', fontSize: '12px' }}>+</span>
                )}

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '28px',
                      left: 0,
                      background: '#161616',
                      border: '1px solid #2a2a2a',
                      borderRadius: '6px',
                      padding: '4px',
                      zIndex: 100,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div
                      ref={dropdownOptionRef}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        background: '#222222',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#ffffff',
                      }}
                    >
                      <PlatformLogo platform="LEETCODE" size={16} padding={1} />
                      LeetCode
                    </div>
                  </div>
                )}
              </div>

              {/* Cell 2: Problem title / number */}
              <div ref={numberCellRef} style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                {newRowNumber ? (
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', color: '#666666', fontSize: '12px' }}>
                    #{newRowNumber}
                    {isTypingNumber && (
                      <span style={{ display: 'inline-block', width: '2px', height: '12px', background: '#ffffff', marginLeft: '2px', animation: 'blink 1s infinite' }} />
                    )}
                  </span>
                ) : (
                  <span style={{ color: '#333333', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px' }}>#...</span>
                )}

                {isShimmering && (
                  <span style={{ color: '#555555', fontSize: '12px', fontStyle: 'italic', display: 'inline-flex', gap: '2px' }}>
                    fetching...
                  </span>
                )}

                {titleVisible && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    style={{ color: '#e5e5e5', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    Palindrome Linked List
                  </motion.span>
                )}
              </div>

              {/* Cell 3: Difficulty */}
              <div>
                {easyPillVisible && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: '#1c3a1c',
                      color: '#4ade80',
                      border: '1px solid #2d5a2d',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    EASY
                  </motion.span>
                )}
              </div>

              {/* Cell 4: Topic */}
              <div>
                {topicPillVisible && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: getTopicColor('Linked List').bg,
                      color: getTopicColor('Linked List').text,
                      border: `1px solid ${getTopicColor('Linked List').border}`,
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    Linked List
                  </motion.span>
                )}
              </div>

              {/* Cell 5: Status */}
              <div>
                {topicPillVisible && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                    <span style={{ fontSize: '12px', color: '#888888' }}>NEW</span>
                  </span>
                )}
              </div>

              {/* Cell 6: Revision */}
              <div>
                {topicPillVisible && <span style={{ fontSize: '12px', color: '#666666' }}>in 1 day</span>}
              </div>

              {/* Cell 7: Notes */}
              <div ref={notesCellRef}>
                {newRowNotes || isTypingNotes ? (
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '12px', color: '#aaaaaa' }}>
                    {newRowNotes}
                    {isTypingNotes && (
                      <span style={{ display: 'inline-block', width: '2px', height: '12px', background: '#ffffff', marginLeft: '2px' }} />
                    )}
                  </span>
                ) : (
                  <span style={{ color: '#333333', fontSize: '12px', fontStyle: 'italic' }}>add notes...</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "+ New row" Footer trigger */}
        <div
          ref={newRowBtnRef}
          style={{
            padding: '10px 16px',
            fontSize: '12px',
            fontFamily: 'var(--font-geist-mono), monospace',
            color: '#333333',
            display: 'inline-block',
          }}
        >
          + New row
        </div>
      </div>
    </div>
  );
}
