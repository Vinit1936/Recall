
# PROMPT 3 — Features Section, CTA, Footer, Polish

## Context

This is the final phase of the landing page. The navbar, hero, and animated demos are already built and working. This prompt adds everything below the hero: the revision section (text + revision demo), a features strip, a final CTA section, and a footer. Then applies final polish to the whole page.

Read `ui.md` before writing anything.

## Section 2 — Revision hero section

Same structure as the hero but mirrored — demo LEFT, text RIGHT.

**Layout:**
`max-width: 1200px`, `margin: 0 auto`, `padding: 120px 32px`. Two columns, left `55%`, right `45%`, `gap: 80px`, `align-items: center`.

**Left column — browser chrome with revision demo:**
Same browser chrome as hero (same border, shadow, toolbar specs). Inside: `<RevisionDemo />` built in Prompt 2. Content area height `420px`.

**Right column — text:**

Badge: `✦ Daily revision queue` — same badge style as hero badge.

Headline:
Line 1: `"Show up."` — Instrument Serif italic, same size as hero `clamp(48px, 5.5vw, 72px)`, `color: #f0f0f0`.
Thin `1px solid #1e1e1e` rule line between lines (same as hero).
Line 2: `"Every day."` — same style.

Subheadline: `"Recall tells you exactly what to revise today. 2 to 3 problems, automatically selected by your schedule. Mark each one and you're done."` — `#666`, `17px`, `line-height: 1.65`, `max-width: 360px`, `margin-top: 24px`.

One CTA button below: `"Get started free"` — same primary button style as hero. `margin-top: 36px`. Links to `/auth/login`.

**Section entrance animation:**
Both columns animate in on scroll (`useInView`, `once: true`, `margin: "-100px"`). Left: `opacity 0→1, x: -24→0`. Right: `opacity 0→1, x: 24→0`. Duration `0.7s`, ease `[0.16, 1, 0.3, 1]`. Stagger `0.1s`.

**Divider between hero and this section:**
A full-width `1px solid #111` line with `max-width: 1200px`, `margin: 0 auto`, `padding: 0 32px`. The line itself inside the padded container.

## Section 3 — How it works

Three-step horizontal layout showing the core loop. `max-width: 1200px`, `margin: 0 auto`, `padding: 100px 32px 0`.

**Section header:**
`"How it works"` — Geist Sans, `11px`, uppercase, monospace, `letter-spacing: 0.12em`, `color: #444`, `margin-bottom: 48px`, `text-align: center`.

**Three steps** in a row, `gap: 1px` (the gaps ARE the dividers — each step has a right border `1px solid #1a1a1a` except the last):

Each step: `flex: 1`, `padding: 32px 40px 32px 0`, (last step: no right border, no right padding).

Step number: `font-family: var(--font-geist-mono)`, `font-size: 11px`, `color: #333`, `margin-bottom: 20px`. Text: `"01"`, `"02"`, `"03"`.

Step title: Geist Sans, `18px`, `color: #e5e5e5`, `font-weight: 500`, `margin-bottom: 12px`.

Step description: Geist Sans, `14px`, `color: #555`, `line-height: 1.6`.

Content:
- `"01"` / `"Solve & add"` / `"Add any problem from LeetCode, Codeforces, GFG, HackerRank, or CodeChef. Title, difficulty, and topic fill in automatically."`
- `"02"` / `"Get a revision queue"` / `"Recall schedules your first revision in 3 days. Clear it — next one in 7. Then 14. Then 30. The schedule adapts to how well you remember."`
- `"03"` / `"Show up daily"` / `"Open Daily Revision every day. Mark each problem Clean, Shaky, or Struggled. The algorithm adjusts. Your streak builds."`

Animate in on scroll: steps fade in and slide up `y: 16→0`, staggered `0.12s` apart.

## Section 4 — Platform strip

A simple centered section showing supported platforms. `padding: 80px 32px`.

Header: `"Works with your favorite platforms"` — Geist Mono, `11px`, uppercase, `letter-spacing: 0.1em`, `color: #333`, `text-align: center`, `margin-bottom: 32px`.

Five platform badges in a row, centered, `gap: 24px`:
Each badge: `display: flex`, `align-items: center`, `gap: 8px`, `padding: 10px 20px`, `border: 1px solid #1a1a1a`, `border-radius: 8px`, `background: rgba(255,255,255,0.01)`.
Platform logo (same `PlatformLogo` component from `src/lib/platforms/logos.tsx`) + platform name in Geist Sans `13px` `#888`.

Platforms: LeetCode, Codeforces, GFG, HackerRank, CodeChef.

No animation needed here — static is fine.

## Section 5 — Stats bar

A full-width dark bar: `background: #0d0d0d`, `border-top: 1px solid #141414`, `border-bottom: 1px solid #141414`, `padding: 48px 32px`.

Three stats centered in a row, `gap: 80px`:

Each stat:
- Number: `font-family: var(--font-instrument-serif)`, `font-style: italic`, `font-size: 48px`, `color: #e5e5e5`, `line-height: 1`
- Label: Geist Mono, `11px`, uppercase, `letter-spacing: 0.1em`, `color: #444`, `margin-top: 8px`

Content:
- `"2,800+"` / `"LeetCode problems indexed"`
- `"5"` / `"Platforms supported"`
- `"+3 → +30"` / `"Day revision ladder"`

The number `"2,800+"` and `"+3 → +30"` use Instrument Serif italic. `"5"` also Instrument Serif.

Animate: numbers count up from 0 when scrolled into view. Use a simple counter animation with `useEffect` + `requestAnimationFrame`. Duration `1200ms`, ease out.

## Section 6 — Final CTA

`padding: 140px 32px`. Centered. `max-width: 640px`, `margin: 0 auto`, `text-align: center`.

Thin decorative line above: `width: 1px`, `height: 48px`, `background: linear-gradient(to bottom, transparent, #333)`, `margin: 0 auto 48px`.

Headline:
`"Start remembering"` — Instrument Serif italic, `clamp(40px, 5vw, 64px)`, `color: #f0f0f0`.

Subheadline: `"Free. No credit card. No nonsense."` — Geist Mono, `13px`, `color: #444`, `letter-spacing: 0.05em`, `margin-top: 16px`.

Button: `"Get started free"` — `background: #ffffff`, `color: #000`, `font-size: 15px`, `font-weight: 600`, `height: 52px`, `padding: 0 40px`, `border-radius: 10px`, `margin-top: 40px`. On hover: `transform: translateY(-1px)`, `box-shadow: 0 8px 24px rgba(255,255,255,0.08)`. Transition `all 0.2s ease`.

Below button: `"Already have an account?"` + `" Sign in →"` (link to `/auth/login`). Geist Sans, `13px`, `color: #444`. "Sign in →" color `#666`, hover `#e5e5e5`.

Animate: entire section fades in `opacity 0→1`, `y: 24→0` on scroll. Duration `0.8s`.

## Section 7 — Footer

`border-top: 1px solid #111`, `padding: 28px 32px`. `max-width: 1200px`, `margin: 0 auto`. `display: flex`, `align-items: center`, `justify-content: space-between`.

Left: `recall. © 2026` — Geist Mono, `12px`, `color: #333`. Period in `#222`.

Right: three links — `GitHub`, `Twitter`, `LinkedIn`. Geist Mono, `12px`, `color: #333`. Hover: `color: #888`. Gap `24px`. GitHub opens `https://github.com/Vinit1936/Recall`. Twitter opens `https://x.com/vinitpatil193`. LinkedIn opens `https://www.linkedin.com/in/vinitpatil19/`.

No animation on footer — static.

## Final polish — apply to the whole page

After building all sections, do these final polish passes:

**1. Scroll behavior:**
Add `html { scroll-behavior: smooth }` to the landing layout.

**2. Section spacing consistency:**
Every major section (hero, revision section, how it works, platform strip, stats bar, CTA) should have a `border-top: 1px solid #0f0f0f` (extremely subtle, almost invisible) as a visual separator. Do NOT use heavy dividers — just the faintest hint.

**3. Text selection color:**
Add to global CSS: `::selection { background: rgba(255,255,255,0.1); color: #fff; }`

**4. Scrollbar styling:**
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #080808; }
::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #2a2a2a; }
```

**5. Nav link anchors:**
`Features` nav link → scrolls to How it works section (add `id="features"` to that section).
`How it works` nav link → same section.
Both use `href="#features"` with smooth scroll.

**6. Performance:**
All images/heavy assets: use `loading="lazy"`. The demo components: wrap in `dynamic(() => import(...), { ssr: false })` in the page to avoid SSR issues with animation libraries.

**7. Mobile — bare minimum responsiveness:**
At `max-width: 768px`:
- Hero: stack columns vertically, browser chrome hidden (display none on mobile)
- Revision section: same, stack vertically, chrome hidden
- How it works: stack steps vertically
- Platform strip: wrap to 2-3 per row
- Stats bar: stack vertically, gap `40px`
This is NOT a full mobile design — just prevent it from being completely broken on mobile.

## Update `src/app/(landing)/page.tsx`

```typescript
import dynamic from 'next/dynamic'
import { NoiseTexture } from '@/components/landing/noise'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { RevisionSection } from '@/components/landing/revision-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { PlatformStrip } from '@/components/landing/platform-strip'
import { StatsBar } from '@/components/landing/stats-bar'
import { FinalCTA } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <>
      <NoiseTexture />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <RevisionSection />
        <HowItWorks />
        <PlatformStrip />
        <StatsBar />
        <FinalCTA />
        <Footer />
      </main>
    </>
  )
}
```

## Definition of done — Prompt 3

- All sections render correctly in order
- Revision section: browser chrome left, text right, animations triggered on scroll
- How it works: three steps with correct content and dividers
- Platform strip: all 5 platforms with logos
- Stats bar: numbers count up on scroll
- Final CTA: thin decorative line above, button with hover glow
- Footer: correct links, correct styling
- Smooth scroll working for nav links
- Mobile: doesn't break completely at 768px
- Scrollbar styled correctly
- Text selection color applied
- Demo components loaded with `dynamic` (no SSR issues)
- `npm run dev` — zero console errors on `/`
- Lighthouse performance score above 85 on desktop
- Commit: `git add . && git commit -m "Landing page — Phase 3: all sections + polish"`