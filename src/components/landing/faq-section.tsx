'use client';

import { motion, AnimatePresence, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';

const FAQS = [
  {
    question: 'How does Recall calculate when a problem is due for revision?',
    answer:
      'Recall uses an adaptive spaced repetition algorithm inspired by cognitive science. After solving a problem, it schedules your first review in 3 days. When you mark your confidence score as Clean, the interval scales (3 → 7 → 14 → 30 days). If you mark it as Struggled, the schedule automatically resets to ensure weak concepts get reinforced before you forget them.',
  },
  {
    question: 'Which coding platforms are supported for automatic metadata extraction?',
    answer:
      'Recall currently supports automatic title, difficulty, and topic tag resolution for LeetCode, Codeforces, GeeksForGeeks (GFG), HackerRank, and CodeChef. Simply paste any problem URL, and Recall populates the metadata instantly.',
  },
  {
    question: 'Is Recall completely free to use?',
    answer:
      'Yes, Recall is 100% free with no credit card required, no artificial rate limits, and zero hidden subscriptions. Our goal is to provide the best DSA retention tool for developers.',
  },
  {
    question: 'Can I import my existing problem list or spreadsheet via CSV?',
    answer:
      'Yes! You can import your existing LeetCode, Notion, or Excel spreadsheet lists via CSV in one click. You can also export your complete problem catalog to CSV at any time with zero vendor lock-in.',
  },
  {
    question: 'How does the Daily Revision Queue work?',
    answer:
      'Every day when you open Recall, your Daily Revision Queue displays only the 2 to 4 problems that are due for revision based on your memory curve. This prevents overwhelm so you can complete your reviews in under 15 minutes a day.',
  },
  {
    question: 'Can I add custom Notion-style columns to my problems table?',
    answer:
      'Yes. Recall supports custom fields so you can add attributes like Target Company (e.g. Meta, Google), Algorithm Pattern (e.g. Two Pointers, Dynamic Programming), Time Complexity, or personal code notes.',
  },
];

export function FAQSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      ref={containerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 32px',
        borderTop: '1px solid #1a1a1a',
        scrollMarginTop: '80px',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ textAlign: 'center', marginBottom: '64px' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#a1a1aa',
            marginBottom: '12px',
          }}
        >
          FAQ
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Frequently asked questions.
        </h2>
      </motion.div>

      {/* Bordered Horizontal Line Accordion (Matching reference design 1:1) */}
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto',
        }}
      >
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          const isFirst = index === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                borderTop: isFirst ? '1px solid #1a1a1a' : 'none',
                borderBottom: '1px solid #1a1a1a',
              }}
            >
              {/* Question Header Button */}
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  padding: '24px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: '17px',
                    fontWeight: 500,
                    color: '#ffffff',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {faq.question}
                </span>

                {/* Minimal Plus Icon that rotates smoothly */}
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  style={{
                    color: isOpen ? '#ffffff' : '#71717a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Plus size={20} strokeWidth={1.5} />
                </motion.span>
              </button>

              {/* Answer Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        paddingBottom: '24px',
                        fontFamily: 'var(--font-geist-sans), sans-serif',
                        fontSize: '14.5px',
                        color: '#a1a1aa',
                        lineHeight: 1.65,
                      }}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
