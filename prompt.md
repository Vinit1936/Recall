# PROMPT 2 — Animated Table Demo + Revision Demo

## Context

This prompt builds the two animated demo components that live inside the browser chrome mockups on the landing page. These are self-contained React components with hardcoded fake data and scripted animations. They are NOT iframes of the real app. They must be pixel-perfect replicas of the actual UI.

Read `ui.md`. Import `getTopicColor` from `src/lib/topic-colors.ts` — use the exact same function the real app uses so topic pill colors are identical.

## Important: reuse exact styles from the real app

Do NOT invent new styles for these demos. Copy the exact className or style values from:
- `src/components/problems-table/` for difficulty pills, topic pills, status dots
- `src/components/daily/` for confidence buttons, problem rows

Create a shared file `src/components/landing/demo-styles.ts` that exports the exact same pill/badge style objects used in the real app. If the real app uses Tailwind classes, copy them. If it uses style objects, copy those. The demos must look identical to screenshots of the real app.

## Fake cursor component — `src/components/landing/fake-cursor.tsx`

```typescript
'use client'
import { motion, useAnimation } from 'motion/react'
import { forwardRef, useImperativeHandle } from 'react'

export type CursorHandle = {
  moveTo: (x: number, y: number, duration?: number) => Promise<void>
  click: () => Promise<void>
  hide: () => void
  show: () => void
}

const FakeCursor = forwardRef<CursorHandle>((_, ref) => {
  const controls = useAnimation()

  useImperativeHandle(ref, () => ({
    async moveTo(x, y, duration = 0.5) {
      await controls.start({ x, y, transition: { duration, ease: [0.25, 0.1, 0.25, 1] } })
    },
    async click() {
      await controls.start({ scale: 0.75, transition: { duration: 0.08 } })
      await controls.start({ scale: 1, transition: { duration: 0.12 } })
    },
    hide() { controls.start({ opacity: 0, transition: { duration: 0.2 } }) },
    show() { controls.start({ opacity: 1, transition: { duration: 0.2 } }) },
  }))

  return (
    <motion.div
      animate={controls}
      initial={{ x: 40, y: 200, opacity: 0 }}
      style={{
        position: 'absolute',
        width: 20,
        height: 20,
        zIndex: 999,
        pointerEvents: 'none',
      }}
    >
      {/* Custom cursor SVG — arrow shape, not a circle */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 2L16 9.5L10.5 11L8 17L4 2Z" fill="white" stroke="#000" strokeWidth="1"/>
      </svg>
    </motion.div>
  )
})
FakeCursor.displayName = 'FakeCursor'
export { FakeCursor }
```

## Table demo — `src/components/landing/table-demo.tsx`

### Hardcoded fake data

```typescript
const FAKE_PROBLEMS = [
  { id: 1, number: 1, title: 'Two Sum', difficulty: 'EASY', topic: 'Array', status: 'CLEAN', nextRevision: 'in 2 days' },
  { id: 2, number: 21, title: 'Merge Two Sorted Lists', difficulty: 'EASY', topic: 'Linked List', status: 'SHAKY', nextRevision: 'today' },
  { id: 3, number: 124, title: 'Binary Tree Max Path Sum', difficulty: 'HARD', topic: 'Binary Tree', status: 'STRUGGLED', nextRevision: 'overdue' },
]
```

### Table structure

Render an exact replica of the problems table. Same columns, same proportions:
- Platform column `52px`: LeetCode LC orange badge
- Problem column `flex`: number in monospace `#666` + title in `#e5e5e5`
- Difficulty: colored pill (same exact colors as real app)
- Topic: colored pill using `getTopicColor(topic)`
- Status: dot + label
- Next Revision: relative date, colored by urgency

Column headers: `11px`, uppercase, monospace, `#444`, `border-bottom: 1px solid #1a1a1a`, `height: 32px`.

Row height: `44px`. Row separator: `1px solid #141414`. Row background: `#0a0a0a`.

At the bottom of the table rows: a `+ New row` text in `#333`, `12px`, monospace, `padding: 10px 16px`.

### New row state

The animation sequence adds a 4th row. This row has three visual states:
1. **Empty** — just a highlighted row `background: #111`, thin left border `2px solid #2a2a2a`
2. **Typing** — platform set to LeetCode (LC badge visible), problem number typing in monospace input cell
3. **Filled** — all cells populated, brief green flash overlay on auto-filled cells

### Animation sequence

Use `useEffect` with `async/await` + `setTimeout` wrapped in promises. Use `useInView` from `motion/react` to trigger when scrolled into view. Loop by resetting state at the end.

```typescript
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
```

Implement this exact sequence:

```
t=0ms    → table visible with 3 rows, cursor hidden
t=800ms  → cursor fades in at position of "+ New row" text
t=1200ms → cursor moves to "+ New row" (smooth, 0.4s)
t=1600ms → cursor.click() — new empty row 4 appears (fade in 200ms)
t=2000ms → cursor moves to Platform cell of row 4
t=2300ms → cursor.click() — platform dropdown opens (small dropdown appears)
t=2600ms → cursor moves to LeetCode option in dropdown
t=2900ms → cursor.click() — dropdown closes, LeetCode LC badge appears in cell
t=3200ms → cursor moves to Problem Number cell
t=3500ms → cursor.click() — text cursor blinks in cell
t=3600ms → "2" types in (typewriter, 150ms/char)
t=3750ms → "3" types in
t=3900ms → "4" types in
t=4050ms → loading shimmer appears in title cell (3 dots or skeleton)
t=4350ms → shimmer disappears
t=4360ms → title cell: "Palindrome Linked List" appears instantly
t=4380ms → Easy pill fades in (opacity 0→1, 200ms)
t=4500ms → "Linked List" topic pill fades in with getTopicColor result
t=4550ms → brief green overlay flash on title/difficulty/topic cells (opacity 0.08 green, 400ms, then fade)
t=5200ms → cursor moves to Notes cell
t=5600ms → cursor.click()
t=5800ms → "t" types
t=5950ms → "w" types
t=6100ms → "o" types
t=6250ms → " " types
t=6400ms → "p" types
t=6550ms → "o" types
t=6700ms → "i" types
t=6850ms → "n" types
t=7000ms → "t" types
t=7150ms → "e" types
t=7300ms → "r" types
t=7800ms → cursor moves away, row finalizes (background normalizes to match other rows)
t=8200ms → cursor fades out
t=9000ms → new row fades out gently (200ms), table back to 3 rows
t=9500ms → loop restarts from t=0
```

### State management

Use `useState` for:
- `demoStep: number` — which step we're on
- `newRowVisible: boolean`
- `newRowPlatform: 'LEETCODE' | null`
- `newRowNumber: string` — builds up character by character
- `newRowFilled: boolean` — true when auto-fill fires
- `newRowNotes: string` — builds up character by character
- `dropdownOpen: boolean`
- `greenFlash: boolean`
- `cursorRef: RefObject<CursorHandle>`

Position all cursor coordinates relative to the component's own bounding rect using `useRef` on key elements (the `+ New row` div, the platform cell, the number cell, etc.) and `getBoundingClientRect()` relative to the container.

## Revision demo — `src/components/landing/revision-demo.tsx`

### Hardcoded fake data

```typescript
const FAKE_DUE = [
  { id: 1, number: 123, title: 'Best Time to Buy and Sell Stock III', difficulty: 'HARD', topic: 'Two Pointers' },
  { id: 2, number: 21, title: 'Merge Two Sorted Lists', difficulty: 'EASY', topic: 'Linked List' },
  { id: 3, number: 55, title: 'Jump Game', difficulty: 'MEDIUM', topic: 'Greedy' },
]
```

### Page replica structure

Render a pixel-perfect replica of the Daily Revision page inside the browser chrome. Include:

**Stats strip** (top):
`🔥 3` · `19 problems` · `1 mastered` · `3 due today`
Font: Geist Mono, `12px`, `#888`. Numbers white. Separator `·` in `#333`. `padding: 12px 16px`.

**Page title row**:
Left: `[ Daily Revision ]` — bracket chars `⌈⌋`, white, `16px`, Geist Sans, font-weight 500.
Right: `"Friday, August 7"` — Geist Mono, `12px`, `#555`.
`padding: 0 16px 12px`.

**Problem rows** — each row:
- Height: `48px`
- Background: `#111111`
- Border: `1px solid #1a1a1a`
- Border radius: `6px`
- Margin bottom: `6px`
- Horizontal padding: `12px`
- Layout: `display: flex`, `align-items: center`, `gap: 10px`

Left: platform logo (LeetCode LC badge, `18px`), problem number (monospace `#555` `11px`), title (`#e5e5e5` `13px` truncated).
Right: difficulty pill, topic pill, then THREE confidence buttons.

**Confidence buttons** (before any are clicked):
Each button: `border: 1px solid #222`, `background: transparent`, `border-radius: 5px`, `padding: 4px 10px`, `font-size: 11px`, `color: #666`, `font-family: var(--font-geist-mono)`. Text: "Clean", "Shaky", "Struggled". Gap between buttons: `4px`.

**Confidence badges** (after clicked — replace the three buttons):
- Clean: `background: rgba(74, 222, 128, 0.1)`, `border: 1px solid rgba(74, 222, 128, 0.3)`, `color: #4ade80`, text: "Clean ✓"
- Shaky: `background: rgba(251, 146, 60, 0.1)`, `border: 1px solid rgba(251, 146, 60, 0.3)`, `color: #fb923c`, text: "Shaky ~"
- Struggled: `background: rgba(248, 113, 113, 0.1)`, `border: 1px solid rgba(248, 113, 113, 0.3)`, `color: #f87171`, text: "Struggled ✗"
Same padding/border-radius as buttons. Transition: `opacity 0→1` over `200ms`.

**All done state** (after all three marked):
Replaces the problem list with a centered block:
- `✓` checkmark: `#4ade80`, `32px`
- `"All done for today"`: white, `15px`, Geist Sans, font-weight 500
- `"🔥 4 day streak"`: Geist Mono, `13px`, `#888`
Animate in: `opacity 0→1`, `y: 8→0`, duration `400ms`.

### Revision demo animation sequence

```
t=0ms    → page shows, 3 rows visible with confidence buttons, cursor hidden
t=800ms  → cursor fades in near first row's Clean button
t=1200ms → cursor moves to row 1 "Clean" button (smooth 0.4s)
t=1600ms → cursor hovers — Clean button border brightens to #4ade80 (CSS hover state)
t=1900ms → cursor.click()
t=2000ms → row 1 buttons replaced by green "Clean ✓" badge (200ms fade)
t=2800ms → cursor moves to row 2 "Struggled" button
t=3200ms → cursor hovers — Struggled button border brightens to #f87171
t=3500ms → cursor.click()
t=3600ms → row 2 buttons replaced by red "Struggled ✗" badge
t=4400ms → cursor moves to row 3 "Shaky" button
t=4800ms → cursor hovers — Shaky button border brightens to #fb923c
t=5100ms → cursor.click()
t=5200ms → row 3 buttons replaced by amber "Shaky ~" badge
t=6000ms → all 3 rows show badges
t=6200ms → problem list fades out (opacity 1→0, 300ms)
t=6500ms → all done state fades in (opacity 0→1, 400ms)
t=6600ms → streak counter animates: "3" → "4" (number flip animation — count up over 400ms)
t=8500ms → all done state fades out
t=8800ms → problem list fades back in, badges reset to buttons
t=9200ms → loop restarts from t=0
```

### Streak counter animation

When transitioning from 3 to 4: use a brief vertical flip animation. The digit `3` slides up and fades out while `4` slides in from below. Duration `400ms`. Implement with two overlapping spans and Motion `animate`.

## Definition of done — Prompt 2

- Table demo plays the full sequence correctly, loops
- Fake cursor is a proper arrow shape, not a circle
- Cursor moves smoothly between targets (no jumps)
- "Palindrome Linked List" auto-fill fires at the right moment with green flash
- Typewriter effect for both number and notes fields
- Revision demo plays the full sequence correctly, loops
- All three confidence badges replace buttons on click in the animation
- All done state appears correctly with streak counter flip
- Both demos triggered by `useInView` (only plays when visible)
- Both components use `getTopicColor` from `src/lib/topic-colors.ts`
- Styles are identical to the real app
- Zero console errors
- Commit: `git add . && git commit -m "Landing page — Phase 2: animated demos"`
- STOP. Do not build the features section or footer yet.

---
