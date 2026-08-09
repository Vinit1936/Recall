'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';

const FAQS = [
  {
    q: 'How does Recall calculate when a problem is due for revision?',
    a: 'Recall uses a spaced repetition algorithm where problems are reviewed at increasing intervals: 3, 7, 14, and 30 days. When you mark a problem Clean, the interval advances to the next step. Marking Struggled resets it to day 3. Marking Shaky repeats the same interval. This mirrors how human memory consolidates — frequent early reviews, then longer gaps as the concept stabilizes.',
  },
  {
    q: 'Which coding platforms does Recall support?',
    a: 'Recall supports LeetCode (with a local dataset of 2,800+ problems for instant auto-fill), Codeforces, GeeksForGeeks, HackerRank, and CodeChef. For LeetCode, you only need to enter the problem number — title, difficulty, and topic fill in automatically. For other platforms, paste the URL and Recall extracts the metadata.',
  },
  {
    q: 'Is Recall free to use?',
    a: 'Yes. Recall is completely free with no credit card required. It runs on Neon PostgreSQL (free tier) and Vercel (hobby tier), so there are no infrastructure costs passed to users. The project is open source — you can also self-host it.',
  },
  {
    q: 'What is spaced repetition and why does it work for DSA?',
    a: 'Spaced repetition is a learning technique based on the Ebbinghaus forgetting curve — the discovery that memory decays exponentially without reinforcement. By reviewing material at increasing intervals (3, 7, 14, 30 days), you intercept the forgetting curve just before a concept is lost. For DSA, this means you don\'t re-solve problems you\'ve already mastered, and weak problems get more repetition until they\'re solid.',
  },
  {
    q: 'How is this different from just using a Notion database?',
    a: 'A Notion database requires you to manually decide what to revise and when. Recall automates the scheduling — you add a problem once, and the system tells you when to revisit it based on your recall confidence. It also tracks revision history, calculates streaks, and surfaces overdue problems automatically. Think of it as Notion\'s table UI with a scheduling engine underneath.',
  },
  {
    q: 'Can I add problems that aren\'t on LeetCode?',
    a: 'Yes. For Codeforces, GFG, HackerRank, and CodeChef, you paste the problem URL and Recall extracts the title and slug automatically. You manually select difficulty and topic. If a problem can\'t be found, you fill in the title manually. The platform logo appears in your tracker to distinguish problems by source.',
  },
  {
    q: 'What happens to my streak if I miss a day?',
    a: 'Your streak resets to zero if you don\'t clear all due problems on a given day. Overdue problems carry forward to the next day — they accumulate in your Daily Revision list until you clear them. Missing a day doesn\'t change the scheduling of individual problems (they still get rescheduled from the date you actually revised them), only the streak counter resets.',
  },
  {
    q: 'Can I import my existing problem list?',
    a: 'Direct CSV import is on the roadmap. Currently, you add problems manually via the inline row editor — type the problem number, press Enter, and the metadata fills in automatically for LeetCode problems. For other platforms, paste the URL. The process takes about 10 seconds per problem.',
  },
];

function FAQItem({
  q,
  a,
  index,
  isLast,
}: {
  q: string;
  a: string;
  index: number;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      itemScope
      itemType="https://schema.org/Question"
      style={{
        borderTop: '1px solid #111',
        ...(isLast ? { borderBottom: '1px solid #111' } : {}),
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '16px',
        }}
      >
        <span
          itemProp="name"
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontSize: '16px',
            color: '#e5e5e5',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {q}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '18px',
            color: '#444',
            flexShrink: 0,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            display: 'inline-block',
          }}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
            itemScope
            itemType="https://schema.org/Answer"
          >
            <p
              itemProp="text"
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '14px',
                color: '#666',
                lineHeight: 1.8,
                paddingTop: '0',
                paddingBottom: '24px',
                margin: 0,
                maxWidth: '640px',
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <article
      id="faq"
      itemScope
      itemType="https://schema.org/FAQPage"
      style={{ maxWidth: '780px', margin: '0 auto', padding: '120px 40px' }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '10px',
            color: '#333',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          FAQ
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '48px',
            color: '#f0f0f0',
            textAlign: 'center',
            marginBottom: '64px',
            margin: '0 0 64px',
            lineHeight: 1.15,
          }}
        >
          Frequently asked questions.
        </h2>

        <div>
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              index={i}
              isLast={i === FAQS.length - 1}
            />
          ))}
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          #faq { padding: 80px 24px !important; }
        }
      `}</style>
    </article>
  );
}
