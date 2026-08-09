# Recall Landing Page v2 — Complete Rebuild

You are rebuilding the landing page from scratch on a new branch. The old landing page components exist but are being replaced. The animated demo components (`table-demo.tsx` and `revision-demo.tsx`) already exist and work — import them, do not rewrite them. Everything else is new.

Read `ui.md` before writing a single line of code.

---

## Design Philosophy

Two reference sites drive every decision:

**Relay** — confident asymmetric hero. Text occupies exactly 40% of viewport width. The visual takes the rest. No competition between left and right — they serve different jobs. Stats sit at the bottom like a foundation stone, not floating in the middle. Every element has a reason to exist.

**Lexion** — the footer wordmark treatment. The brand name at massive scale, barely visible, creates substance without noise. The dark footer card with rounded top corners slides over the light content above it — a layering technique that feels like physical depth.

Apply both: Relay's confidence and proportion to the hero. Lexion's wordmark depth to the CTA/footer. Our color stays pure dark throughout — no light sections.

**Design rules that cannot be broken:**
- Maximum 2 font sizes per section. One large, one small. Nothing in between.
- Every section has exactly one visual focus. Not two. Not three. One.
- Whitespace is not empty space — it is structure. Never fill it.
- Color appears only on: difficulty pills (Easy/Medium/Hard), status dots, platform logos. Everything else is black, white, or gray.
- No gradients. No glows. No shadows that try to be dramatic. Only `box-shadow: 0 0 0 1px #1a1a1a` style structural shadows.
- Border radius system: `4px` for pills/badges, `8px` for buttons, `10px` for browser chrome. Never `border-radius: 9999px` on anything except circular avatar elements.

---

## Tech Setup

```bash
npm install lenis
npm install motion
```

Fonts — in `src/app/(landing)/layout.tsx`:
```typescript
import { Instrument_Serif } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
})
```

CSS variables — add to landing layout global style:
```css
:root {
  --bg: #080808;
  --surface: #0f0f0f;
  --border: #1a1a1a;
  --border-subtle: #111111;
  --text-primary: #f0f0f0;
  --text-secondary: #888888;
  --text-tertiary: #444444;
  --text-disabled: #2a2a2a;

  /* Difficulty — only colors allowed in UI */
  --easy-bg: #1c3a1c;
  --easy-text: #4ade80;
  --easy-border: #2d5a2d;
  --medium-bg: #3a2a0d;
  --medium-text: #fb923c;
  --medium-border: #5a3d10;
  --hard-bg: #3a0f0f;
  --hard-text: #f87171;
  --hard-border: #5a1a1a;
}

* { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
html { scroll-behavior: auto; } /* Lenis handles scrolling */
body { background: var(--bg); color: var(--text-primary); margin: 0; overflow-x: hidden; }
::selection { background: rgba(255,255,255,0.08); }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
```

---

## Smooth Scroll — `src/components/landing/v2/smooth-scroll.tsx`

```typescript
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.75,
    })
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
  return null
}
```

---

## Shared Component — Browser Chrome

Create `src/components/landing/v2/chrome.tsx` — reused across all demo sections:

```typescript
type ChromeProps = {
  url: string
  children: React.ReactNode
  height?: number | string
}
```

Chrome specs:
- `border-radius: 10px`
- `border: 1px solid #1a1a1a`
- `background: #0a0a0a`
- `overflow: hidden`
- No box-shadow — the border does the work

Toolbar (top bar):
- `height: 36px`
- `background: #0f0f0f`
- `border-bottom: 1px solid #111111`
- `padding: 0 14px`
- `display: flex`, `align-items: center`, `gap: 10px`

Three traffic dots: `8px` circles. Colors: `#3a1a1a`, `#3a3010`, `#1a3a1a` — dark muted, not macOS-bright.

URL bar:
- `flex: 1`, `max-width: 220px`, `margin: 0 auto`
- `background: #080808`
- `border: 1px solid #1a1a1a`
- `border-radius: 4px`
- `height: 20px`
- Text: the `url` prop in Geist Mono `10px`, `#333`, centered

Content area: `height` prop, `overflow: hidden`.

---

## Section 1 — Navbar — `src/components/landing/v2/navbar.tsx`

**Inspired by Relay:** minimal, edge-to-edge, confident. No containing box. No border-radius on the navbar itself.

Position: `fixed`, `top: 0`, `left: 0`, `right: 0`, `z-index: 100`
Background: `rgba(8,8,8,0.85)`
Backdrop filter: `blur(16px) saturate(160%)`
Border bottom: `1px solid rgba(255,255,255,0.04)`
Height: `52px`

Inner: `max-width: 1280px`, `margin: 0 auto`, `padding: 0 40px`, `display: flex`, `align-items: center`, `justify-content: space-between`

**Left — wordmark only:**
`recall.` — Geist Mono, `15px`, `font-weight: 500`, `color: #f0f0f0`. Period: `color: #ff6b00` — a single touch of LeetCode orange, a nod to the platform. Only place this orange appears in the entire landing page.

**Center — nav links:**
`How it works` | `Science` | `FAQ`
Geist Sans, `13px`, `color: #555`, `letter-spacing: 0.02em`. Hover: `color: #e5e5e5`, `transition: color 0.12s`. Gap: `40px`. No underline.

**Right — two elements:**
- GitHub link: `↗ GitHub` in Geist Mono `12px`, `#444`, hover `#888`. Opens repo in new tab.
- `Sign in` button: `border: 1px solid #222`, `background: transparent`, `color: #888`, `font-size: 12px`, `height: 32px`, `padding: 0 16px`, `border-radius: 8px`. Hover: `border-color: #333`, `color: #e5e5e5`

Entrance animation (Motion): `opacity: 0, y: -8` → `opacity: 1, y: 0`, `duration: 0.5s`, `delay: 0.1s`.

---

## Section 2 — Hero — `src/components/landing/v2/hero.tsx`

**Inspired by Relay's hero:** confident asymmetric split. Text left, demo right. The demo does NOT live in a browser chrome on the hero — it IS the browser chrome, flush against the right edge, partially bleeding off-screen. This is the key Relay-inspired choice: the visual is not contained, it breaks the grid intentionally.

**Container:**
`min-height: 100vh`
`padding-top: 52px` (navbar height)
`display: grid`
`grid-template-columns: 420px 1fr`
`gap: 0`
`max-width: 1280px`, `margin: 0 auto`, `padding-left: 40px`
`align-items: center`
No padding-right — the demo bleeds to the edge.

**Left column (420px fixed):**
`padding-right: 48px`
`padding-top: 80px`
`padding-bottom: 80px`

Elements top to bottom, no margins between — use `display: flex`, `flex-direction: column`, `gap` to control spacing:

1. **Label** (`gap` after: `20px`):
Plain text, no pill, no border. Just: `✦ Spaced repetition for DSA`
Geist Mono, `11px`, `#444`, `letter-spacing: 0.1em`. The `✦` in `#333`.

2. **Headline** (`gap` after: `24px`):
Two lines, no `<br>` — natural wrapping at this column width:
`Never forget`
`what you solved.`
Font: `var(--font-display)` (Instrument Serif), `font-style: italic`, `font-size: 64px`, `line-height: 1.05`, `letter-spacing: -0.02em`, `color: #f0f0f0`, `font-weight: 400`.

A `1px solid #1e1e1e` horizontal rule between the two lines. `width: 100%`. This is the single most important typographic detail — it gives the headline editorial weight.

3. **Subheadline** (`gap` after: `40px`):
`Recall schedules your DSA revision automatically.`
Newline: `Solve once. Remember forever.`
Geist Sans, `15px`, `color: #555`, `line-height: 1.7`, `max-width: 320px`.

4. **Two CTA buttons** horizontal, `gap: 10px`:

Primary — `"Get started free"`:
`background: #f0f0f0`, `color: #080808`, `font-size: 13px`, `font-weight: 600`, `height: 40px`, `padding: 0 20px`, `border-radius: 8px`, Geist Sans.
Hover: `background: #ffffff`, `transform: translateY(-1px)`.
Transition: `all 0.15s ease`.

Secondary — `"View on GitHub ↗"`:
`background: transparent`, `border: 1px solid #1e1e1e`, `color: #555`, `font-size: 13px`, `height: 40px`, `padding: 0 18px`, `border-radius: 8px`.
Hover: `border-color: #2a2a2a`, `color: #888`.

5. **Social proof** (`gap` before: `32px`):
`"Built by a student, for students grinding DSA"`
Geist Mono, `10px`, `#2a2a2a`, `letter-spacing: 0.05em`.

**Left column entrance animation (Motion, staggered):**
Each child: `opacity: 0, y: 20` → `opacity: 1, y: 0`
Duration: `0.7s`, ease: `[0.16, 1, 0.3, 1]`
Stagger: `0.1s` between children. Start delay: `0.3s`.

**Right column — demo flush to right edge:**
`height: 100vh`
`padding-top: 52px` (navbar)
`display: flex`
`align-items: center`
`padding-left: 40px`

Inside: the `<Chrome url="app.recall.dev" height={480}>` component wrapping `<TableDemo />`.

The chrome is `width: 100%` and bleeds slightly — the right edge of the chrome goes beyond the container using `margin-right: -40px`. This intentional overflow is the Relay effect: the visual feels larger than the page, implying there's more beyond what you can see.

Chrome entrance animation: `opacity: 0, x: 40, scale: 0.97` → `opacity: 1, x: 0, scale: 1`. Duration: `0.9s`, ease: `[0.16, 1, 0.3, 1]`. Delay: `0.5s`.

**Bottom of hero — stats bar:**
Positioned at the very bottom of the hero section, `padding: 0 40px 32px`, `max-width: 1280px`, `margin: 0 auto`.

Three stats + a separator between them:
```
2,800+          ·          5 platforms          ·          +3 → +30 days
LeetCode problems indexed       supported              revision ladder
```

Layout: `display: flex`, `align-items: flex-end`, `gap: 48px`.

Each stat:
- Number: Instrument Serif italic, `36px`, `color: #e5e5e5`, `line-height: 1`
- Label: Geist Mono, `10px`, `color: #444`, `letter-spacing: 0.08em`, `margin-top: 4px`

Separators `·`: Geist Mono, `#222`, `20px`, `align-self: center`.

A `1px solid #111` line above the stats bar, full width of the hero.

---

## Section 3 — Revision Demo Section — `src/components/landing/v2/revision-section.tsx`

Different from the hero — the demo here is centered, full width, not bleeding. This creates rhythm variation: hero has an asymmetric bleeder, this section is centered and composed.

**Layout:**
`max-width: 1280px`, `margin: 0 auto`, `padding: 120px 40px`

**Top text — centered:**
Section label: `DAILY REVISION` — Geist Mono, `10px`, `#333`, `letter-spacing: 0.15em`, `text-align: center`, `margin-bottom: 24px`

Headline:
`Show up.`
`Every day.`
Instrument Serif italic, `56px`, `line-height: 1.1`, `text-align: center`, `color: #f0f0f0`
The same editorial rule between the two lines — `width: 240px`, centered horizontally, `margin: 0 auto`.

Subheadline: `"2–3 problems, automatically selected by your schedule. Mark each one and you're done."` — Geist Sans, `15px`, `#555`, `text-align: center`, `max-width: 400px`, `margin: 20px auto 48px`

**Demo — centered browser chrome:**
`max-width: 820px`, `margin: 0 auto`
`<Chrome url="recall/daily" height={420}><RevisionDemo /></Chrome>`

The chrome here does NOT bleed — it stays within its `max-width`. It should feel like a window into the product, composed and contained, contrasting with the hero's confident bleed.

**Section entrance animation:**
Text: `opacity: 0, y: 30` → `opacity: 1, y: 0`, triggered by `useInView`, `once: true`, `margin: "-80px"`.
Chrome: `opacity: 0, y: 40, scale: 0.98` → `opacity: 1, y: 0, scale: 1`, `delay: 0.15s` after text.

---

## Section 4 — How It Works — `src/components/landing/v2/how-it-works.tsx`

**Design:** Editorial three-column step layout. The numbers are large and typographic — not badges in boxes. Inspired by editorial magazine layouts where numbers are the visual anchor.

**Container:**
`border-top: 1px solid #111`
`border-bottom: 1px solid #111`
`padding: 100px 40px`
`max-width: 1280px`, `margin: 0 auto`

**Header:**
`HOW IT WORKS` — Geist Mono, `10px`, `#333`, `letter-spacing: 0.15em`, `margin-bottom: 64px`

**Three columns — `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 1px`, `background: #111` (the gap IS the border):**

Each column has `background: #080808`, `padding: 0 40px 0 0` (last column: `padding: 0`).

Column content:
- Step number: Instrument Serif, NOT italic, `80px`, `color: #1a1a1a`, `line-height: 1`, `font-weight: 400`. This is huge and dark — a typographic texture, not a label. `01`, `02`, `03`.
- Step title: Geist Sans, `22px`, `color: #e5e5e5`, `font-weight: 500`, `margin-top: 16px`, `margin-bottom: 12px`
- Step description: Geist Sans, `14px`, `color: #555`, `line-height: 1.75`

Content:
- `01` / `"Solve & add"` / `"Add any problem from LeetCode, Codeforces, GFG, HackerRank, or CodeChef. Title, difficulty, and topic fill in automatically."`
- `02` / `"Get scheduled"` / `"Recall assigns your first revision in 3 days. After that: 7, 14, 30. The interval adapts to your recall confidence."`
- `03` / `"Show up daily"` / `"Open Daily Revision. Mark each problem Clean, Shaky, or Struggled. The algorithm adjusts. Your streak builds."`

**Entrance:** columns fade in staggered on scroll, `y: 16 → 0`, `0.1s` stagger.

---

## Section 5 — Science — `src/components/landing/v2/science.tsx`

**Design:** Two columns. Left: editorial text with bold stats. Right: the Ebbinghaus curve chart in a browser chrome. This is the most intellectually rich section — it earns its place because it explains WHY the product exists.

**Container:**
`max-width: 1280px`, `margin: 0 auto`, `padding: 120px 40px`
`display: grid`, `grid-template-columns: 1fr 1fr`, `gap: 80px`, `align-items: center`

**Left column:**
Section label: `THE SCIENCE` — Geist Mono, `10px`, `#333`, `letter-spacing: 0.15em`, `margin-bottom: 24px`

Headline:
`Why traditional`
`cramming fails.`
Instrument Serif italic, `48px`, `line-height: 1.1`, `color: #f0f0f0`
Editorial rule between lines. `width: 100%`.

Body: `"Hermann Ebbinghaus proved memory decays exponentially after you learn something. Without timely revision, 90% is lost within a week. Spaced repetition interrupts the decay curve — each review resets the clock before the concept fades."` — Geist Sans, `14px`, `color: #555`, `line-height: 1.8`, `margin-top: 24px`, `max-width: 380px`

Three stat bullets (`margin-top: 32px`, `display: flex`, `flex-direction: column`, `gap: 16px`):

Each bullet: `display: flex`, `align-items: baseline`, `gap: 12px`
- Bullet marker: `4px` circle, different color per bullet: `#f87171`, `#4ade80`, `#818cf8`
- Bold label + normal description in Geist Sans `13px`
- `"90% lost"` in `#f87171`, `font-weight: 700` + `" within 7 days without timely revision."` in `#555`
- `"4 reviews"` in `#4ade80`, `font-weight: 700` + `" build permanent pattern retention."` in `#555`
- `"Adaptive intervals"` in `#818cf8`, `font-weight: 700` + `" recalculate based on confidence."` in `#555`

**Right column:**
`<Chrome url="recall/science" height={380}>` containing the existing Ebbinghaus curve SVG/component. If it doesn't exist as a standalone component, build it here:

Simple SVG chart showing:
- Red dashed decay curve starting high-left, curving exponentially down to low-right
- A colored spaced repetition curve that rises at each review point then dips before rising again, staying above the decay line
- 5 labeled points along the x-axis: `Day 0 · Initial Solve`, `Day 3 · 1st Review`, `Day 7 · 2nd Review`, `Day 14 · 3rd Review`, `Day 30 · Mastered`
- Chart background: `#0a0a0a`, grid lines: `#111`, stroke-width: 2

Animate the curves drawing in on scroll using SVG `stroke-dashoffset`. The decay curve draws first (1.5s), then the spaced curve draws (2s, 0.5s delay). `useInView` triggers animation once.

**Entrance:** left fades `x: -20 → 0`, right fades `x: 20 → 0`, both `opacity: 0 → 1`, triggered on scroll.

---

## Section 6 — Capabilities — `src/components/landing/v2/capabilities.tsx`

**Design:** 2×2 grid. Not 4 columns. 2 columns gives each card breathing room to actually say something. This is about quality over density.

**Container:**
`max-width: 1280px`, `margin: 0 auto`, `padding: 0 40px 120px`

**Header:**
`CAPABILITIES` — Geist Mono, `10px`, `#333`, `letter-spacing: 0.15em`, `margin-bottom: 64px`

**Grid:** `display: grid`, `grid-template-columns: repeat(2, 1fr)`, `gap: 1px`, `background: #111` (1px gap as border)

Each card: `background: #080808`, `padding: 48px`

Card content:
- Category label: Geist Mono, `10px`, `#333`, `letter-spacing: 0.12em`, `margin-bottom: 20px`
- Title: Geist Sans, `24px`, `color: #e5e5e5`, `font-weight: 500`, `margin-bottom: 14px`
- Description: Geist Sans, `14px`, `color: #555`, `line-height: 1.75`

Cards:
1. `SPACED REPETITION` / `"Adaptive Intervals"` / `"Automated 3 → 7 → 14 → 30 day revision queue that adapts based on your recall confidence. Clean advances the interval. Struggled resets it. Shaky repeats."`
2. `AUTOMATION` / `"Multi-Platform Sync"` / `"Instant title, difficulty, and topic extraction for LeetCode (2,800+ problems indexed), Codeforces, HackerRank, GFG, and CodeChef. Type the ID — everything fills in."`
3. `FLEXIBILITY` / `"Custom Columns"` / `"Add custom columns to your tracker — Approach Summary, Time Complexity, Companies Asked, Pattern — anything you need. Stored per-problem, visible everywhere."`
4. `OWNERSHIP` / `"Your Data"` / `"Every problem you track is yours. No algorithmic feed, no gamification dark patterns, no daily streak pressure. Just your problems, your schedule, your pace."`

**Entrance:** cards fade in `y: 20 → 0`, staggered `0.08s` in reading order (left-to-right, top-to-bottom) on scroll.

---

## Section 7 — FAQ — `src/components/landing/v2/faq.tsx`

**Design:** Clean accordion. The FAQ section is the single highest-value SEO section on the page — every question/answer is crawlable text that will index for long-tail queries. This must be semantic HTML: `<details>`/`<summary>` OR proper `role="list"` with aria-expanded.

**SEO note:** Wrap the entire FAQ section in an `<article>` with `itemScope itemType="https://schema.org/FAQPage"`. Each Q&A pair gets `itemScope itemType="https://schema.org/Question"`. Answer gets `itemScope itemType="https://schema.org/Answer"`. This enables rich results in Google Search.

**Container:**
`max-width: 780px`, `margin: 0 auto`, `padding: 120px 40px`

**Header — centered:**
Section label: `FAQ` — Geist Mono, `10px`, `#333`, `letter-spacing: 0.15em`, `text-align: center`, `margin-bottom: 20px`

Headline: `"Frequently asked questions."` — Instrument Serif italic, `48px`, `color: #f0f0f0`, `text-align: center`, `margin-bottom: 64px`

**Accordion items:**
`border-top: 1px solid #111` on each item. Last item also has `border-bottom: 1px solid #111`.

Each item: `padding: 24px 0`

Question row: `display: flex`, `justify-content: space-between`, `align-items: center`, `cursor: pointer`
- Question text: Geist Sans, `16px`, `color: #e5e5e5`, `font-weight: 400`
- Icon: `+` when closed, `−` when open. Geist Mono, `18px`, `color: #444`. Transition: `transform 0.2s` (rotate 45deg on open for `+`). Do NOT use `×` — use `+` that rotates to `×`.

Answer (visible when open): Geist Sans, `14px`, `color: #666`, `line-height: 1.8`, `padding-top: 16px`, `max-width: 640px`

Animate open/close with Motion `AnimatePresence` + `motion.div` with `height: 0 → auto` and `opacity: 0 → 1`.

**Eight FAQ questions (all SEO-targeted):**

1. `"How does Recall calculate when a problem is due for revision?"` — `"Recall uses a spaced repetition algorithm where problems are reviewed at increasing intervals: 3, 7, 14, and 30 days. When you mark a problem Clean, the interval advances to the next step. Marking Struggled resets it to day 3. Marking Shaky repeats the same interval. This mirrors how human memory consolidates — frequent early reviews, then longer gaps as the concept stabilizes."`

2. `"Which coding platforms does Recall support?"` — `"Recall supports LeetCode (with a local dataset of 2,800+ problems for instant auto-fill), Codeforces, GeeksForGeeks, HackerRank, and CodeChef. For LeetCode, you only need to enter the problem number — title, difficulty, and topic fill in automatically. For other platforms, paste the URL and Recall extracts the metadata."`

3. `"Is Recall free to use?"` — `"Yes. Recall is completely free with no credit card required. It runs on Neon PostgreSQL (free tier) and Vercel (hobby tier), so there are no infrastructure costs passed to users. The project is open source — you can also self-host it."`

4. `"What is spaced repetition and why does it work for DSA?"` — `"Spaced repetition is a learning technique based on the Ebbinghaus forgetting curve — the discovery that memory decays exponentially without reinforcement. By reviewing material at increasing intervals (3, 7, 14, 30 days), you intercept the forgetting curve just before a concept is lost. For DSA, this means you don't re-solve problems you've already mastered, and weak problems get more repetition until they're solid."`

5. `"How is this different from just using a Notion database?"` — `"A Notion database requires you to manually decide what to revise and when. Recall automates the scheduling — you add a problem once, and the system tells you when to revisit it based on your recall confidence. It also tracks revision history, calculates streaks, and surfaces overdue problems automatically. Think of it as Notion's table UI with a scheduling engine underneath."`

6. `"Can I add problems that aren't on LeetCode?"` — `"Yes. For Codeforces, GFG, HackerRank, and CodeChef, you paste the problem URL and Recall extracts the title and slug automatically. You manually select difficulty and topic. If a problem can't be found, you fill in the title manually. The platform logo appears in your tracker to distinguish problems by source."`

7. `"What happens to my streak if I miss a day?"` — `"Your streak resets to zero if you don't clear all due problems on a given day. Overdue problems carry forward to the next day — they accumulate in your Daily Revision list until you clear them. Missing a day doesn't change the scheduling of individual problems (they still get rescheduled from the date you actually revised them), only the streak counter resets."`

8. `"Can I import my existing problem list?"` — `"Direct CSV import is on the roadmap. Currently, you add problems manually via the inline row editor — type the problem number, press Enter, and the metadata fills in automatically for LeetCode problems. For other platforms, paste the URL. The process takes about 10 seconds per problem."`

---

## Section 8 — Final CTA + Wordmark — `src/components/landing/v2/final-cta.tsx`

**Inspired by Lexion:** a massive barely-visible wordmark creates brand substance. The CTA content floats above it. The wordmark is not decorative — it IS the section's visual weight.

**Container:**
`position: relative`
`overflow: hidden`
`border-top: 1px solid #111`
`padding: 120px 40px 0`

**Background wordmark:**
`position: absolute`
`bottom: -20px`
`left: 50%`
`transform: translateX(-50%)`
`white-space: nowrap`
`font-family: var(--font-display)` (Instrument Serif)
`font-style: italic`
`font-size: clamp(120px, 16vw, 220px)`
`color: rgba(255,255,255,0.025)`
`pointer-events: none`
`user-select: none`
`letter-spacing: -0.03em`
`line-height: 1`
Content: `recall.`

**Foreground content — centered above wordmark:**
`position: relative`, `z-index: 1`, `text-align: center`, `padding-bottom: 140px`

Thin vertical line: `width: 1px`, `height: 40px`, `background: #1e1e1e`, `margin: 0 auto 40px`

Headline: `"Start remembering"` — Instrument Serif italic, `clamp(40px, 5vw, 72px)`, `color: #f0f0f0`, `letter-spacing: -0.02em`

Subheadline: `"Free. No credit card. No nonsense."` — Geist Mono, `12px`, `#444`, `letter-spacing: 0.08em`, `margin-top: 16px`

CTA button (`margin-top: 36px`):
`"Get started free →"`
`background: #f0f0f0`, `color: #080808`, `font-size: 14px`, `font-weight: 600`, `height: 44px`, `padding: 0 28px`, `border-radius: 8px`
`max-width: fit-content`, `margin: 36px auto 0`
Hover: `background: #fff`, `transform: translateY(-1px)`

Sign in link (`margin-top: 20px`):
`"Already have an account? "` in `#333` + `"Sign in →"` as a link in `#555`, hover `#888`
Geist Sans, `13px`

---

## Section 9 — Footer — `src/components/landing/v2/footer.tsx`

Minimal. One line. The wordmark above does the heavy lifting.

`border-top: 1px solid #0d0d0d`
`padding: 20px 40px`
`max-width: 1280px`, `margin: 0 auto`
`display: flex`, `align-items: center`, `justify-content: space-between`

Left: `recall.` + ` © 2026` — Geist Mono, `11px`. `recall` in `#333`, `.` in `#ff6b00` (orange period again — bookends the navbar), `© 2026` in `#222`.

Right: `GitHub` · `Twitter` · `LinkedIn` — Geist Mono, `11px`, `#2a2a2a`, hover `#555`. Gap `24px`. All open in new tabs.

---

## Page Root — `src/app/(landing)/page.tsx`

```typescript
import dynamic from 'next/dynamic'
import { SmoothScroll } from '@/components/landing/v2/smooth-scroll'
import { Navbar } from '@/components/landing/v2/navbar'
import { Hero } from '@/components/landing/v2/hero'
import { RevisionSection } from '@/components/landing/v2/revision-section'
import { HowItWorks } from '@/components/landing/v2/how-it-works'
import { Science } from '@/components/landing/v2/science'
import { Capabilities } from '@/components/landing/v2/capabilities'
import { FAQ } from '@/components/landing/v2/faq'
import { FinalCTA } from '@/components/landing/v2/final-cta'
import { Footer } from '@/components/landing/v2/footer'

// Load demos client-side only to avoid SSR issues with animations
const TableDemo = dynamic(() => import('@/components/landing/table-demo').then(m => ({ default: m.TableDemo })), { ssr: false })
const RevisionDemo = dynamic(() => import('@/components/landing/revision-demo').then(m => ({ default: m.RevisionDemo })), { ssr: false })

export default function LandingPage() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero TableDemo={TableDemo} />
        <RevisionSection RevisionDemo={RevisionDemo} />
        <HowItWorks />
        <Science />
        <Capabilities />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  )
}
```

**SEO metadata — add to `src/app/(landing)/layout.tsx`:**
```typescript
export const metadata = {
  title: 'Recall — Never Forget What You Solved',
  description: 'Spaced repetition tracker for DSA problems. Automatically schedules LeetCode, Codeforces, GFG, HackerRank, and CodeChef problems for revision at +3, +7, +14, +30 day intervals.',
  keywords: ['DSA revision', 'spaced repetition', 'LeetCode tracker', 'Codeforces tracker', 'DSA preparation', 'coding interview prep', 'algorithm revision'],
  openGraph: {
    title: 'Recall — Never Forget What You Solved',
    description: 'Spaced repetition tracker for DSA problems.',
    type: 'website',
  },
}
```

---

## Mobile — Minimum Viable Responsiveness

At `max-width: 768px`:
- Hero: `grid-template-columns: 1fr`. Chrome demo: `display: none`. Left column: `padding: 80px 24px 40px`.
- Stats bar: `flex-wrap: wrap`, `gap: 24px`.
- Revision section: `padding: 80px 24px`.
- How it works: `grid-template-columns: 1fr`, each column `padding: 32px 0`, `border-bottom: 1px solid #111`.
- Science: `grid-template-columns: 1fr`, chart chrome `display: none` on mobile.
- Capabilities: `grid-template-columns: 1fr`.
- FAQ: `padding: 80px 24px`.
- Final CTA: `padding: 80px 24px`. Wordmark: `font-size: 72px`.
- All section padding: `80px 24px` on mobile.

---

## Definition of Done

- `/` renders the new landing page with zero console errors
- `/dashboard` still works (existing app untouched)
- Navbar: wordmark left with orange period, links center, GitHub + Sign in right
- Hero: asymmetric grid, table demo bleeding right edge, stats at bottom
- Revision section: centered chrome with revision demo
- How it works: 2×1px gap grid, large typographic numbers
- Science: Ebbinghaus chart animates on scroll
- Capabilities: 2×2 grid, no border-radius on grid cells
- FAQ: 8 questions, Schema.org markup, accordion animation
- Final CTA: `recall.` wordmark visible behind content
- Footer: orange period on the `recall.` wordmark
- Smooth scroll working (Lenis)
- All Motion animations trigger on `useInView`, `once: true`
- Mobile: doesn't break at 768px
- `npm run dev` — zero errors

Commit: `git add . && git commit -m "Landing page v2 — complete rebuild"`