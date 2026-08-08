# Landing Page — Three Build Prompts

Run these in order. Do not start Prompt 2 until Prompt 1 is confirmed working. Do not start Prompt 3 until Prompt 2 is confirmed working. Each prompt is a complete, isolated task.

---

# PROMPT 1 — Foundation, Layout, Hero Section

## Context

You are building a world-class landing page for Recall — a DSA spaced repetition tracker. The design language is: pure dark, typographic, editorial. No gradients, no color glows, no purple/blue tints. Think Linear, Vercel, Resend landing pages — restraint is the aesthetic. The only colors that appear are the ones already in the app: Easy green, Medium amber, Hard red, and muted grays. Everything else is black and white.

Read `ui.md` before writing a single line.

Scroll experience — implement this before anything else

Install Lenis for smooth scrolling:

bash
npm install lenis

Create src/components/landing/smooth-scroll.tsx:

typescript
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return null
}

Add <SmoothScroll /> as the first child inside the <body> in src/app/(landing)/layout.tsx. It renders nothing visually — just initializes the scroll engine.

Also add this to the landing layout's global style:

css
html {
  scroll-behavior: auto; /* let Lenis handle it, not native smooth scroll */
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

The duration: 1.4 and the easing curve give it that heavy, cinematic scroll feel — content feels like it has weight. wheelMultiplier: 0.8 slows the scroll speed slightly so users read as they scroll rather than flying past sections.

## Route setup

The landing page lives at `/`. The actual app (problems table) currently lives at `/` — move it to `/dashboard`. Update:
- `src/app/page.tsx` → becomes the landing page (public, no auth required)
- `src/app/dashboard/page.tsx` → the problems table that was at `src/app/page.tsx`
- Update `src/middleware.ts` matcher to protect `/dashboard` and `/daily` but NOT `/` or `/auth`
- Update sidebar nav links: Home → `/dashboard`, Daily Revision → `/daily`
- Update any `router.push('/')` or `href="/"` in the app that should now point to `/dashboard`

## Install required packages

```bash
npm install motion
npm install @next/font
```

Instrument Serif from Google Fonts — add to `src/app/(landing)/layout.tsx`:
```typescript
import { Instrument_Serif } from 'next/font/google'
const instrumentSerif = Instrument_Serif({ 
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif'
})
```

## File structure for this prompt

```
src/app/(landing)/
  layout.tsx       ← standalone layout, NO sidebar, NO app shell
  page.tsx         ← landing page root

src/components/landing/
  navbar.tsx       ← floating navbar
  hero.tsx         ← hero section
  noise.tsx        ← noise texture overlay component
```

## Layout — `src/app/(landing)/layout.tsx`

This layout must be completely isolated from the app layout. No sidebar. No SessionProvider needed here since landing is public.

```typescript
import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  title: 'Recall — Never forget what you solved',
  description: 'Spaced repetition tracker for DSA problems. Solve once, remember forever.',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}>
      <body style={{ background: '#080808', color: '#e5e5e5', margin: 0, padding: 0, overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
```

## Noise texture component — `src/components/landing/noise.tsx`

A full-page fixed noise overlay. This adds the texture that separates premium dark UIs from flat black:

```typescript
'use client'
export function NoiseTexture() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
        opacity: 0.025,
        mixBlendMode: 'overlay',
      }}
    />
  )
}
```

## Navbar — `src/components/landing/navbar.tsx`

Fixed, floating, full width. Specs:

- Position: `fixed`, `top: 0`, `left: 0`, `right: 0`, `z-index: 100`
- Background: `rgba(8, 8, 8, 0.75)`
- Backdrop filter: `blur(20px) saturate(180%)`
- Border bottom: `1px solid rgba(255, 255, 255, 0.06)`
- Height: `56px`
- Inner container: `max-width: 1200px`, `margin: 0 auto`, `padding: 0 32px`, full height, `display: flex`, `align-items: center`, `justify-content: space-between`

**Left — wordmark:**
`recall.` — font: `var(--font-geist-mono)`, `font-size: 16px`, `font-weight: 500`, color: `#ffffff`. The period: color `#555`. This is the exact same wordmark as the sidebar. No logo icon. Just the text.

**Center — nav links:**
Three links: `Features`, `How it works`, `GitHub` (GitHub links to `https://github.com/Vinit1936/Recall`, opens new tab).
Style: `font-size: 13px`, `color: #666`, `font-family: var(--font-geist-sans)`, `letter-spacing: 0.01em`. On hover: `color: #e5e5e5`, transition `color 0.15s ease`. No underline, no background. Gap between links: `32px`.

**Right — two buttons:**
1. "Sign in" — ghost button: `border: 1px solid #222`, `background: transparent`, `color: #888`, `font-size: 13px`, `height: 34px`, `padding: 0 16px`, `border-radius: 6px`. Hover: `border-color: #333`, `color: #e5e5e5`. Links to `/auth/login`.
2. "Get started" — solid button: `background: #ffffff`, `color: #000000`, `font-size: 13px`, `font-weight: 600`, `height: 34px`, `padding: 0 16px`, `border-radius: 6px`. Hover: `background: #e5e5e5`. Links to `/auth/login`.
Gap between buttons: `8px`.

**Navbar entrance animation (Motion):**
On mount, animate from `opacity: 0, y: -12` to `opacity: 1, y: 0`. Duration `0.5s`, ease `easeOut`. Delay `0.1s`.

## Hero section — `src/components/landing/hero.tsx`

This is the most important section. It must be flawless.

**Container:**
- `min-height: 100vh`
- `padding-top: 56px` (navbar height)
- `display: flex`, `align-items: center`
- `max-width: 1200px`, `margin: 0 auto`, `padding-left: 32px`, `padding-right: 32px`
- Two columns: left `45%`, right `55%`, `gap: 80px`
- `padding-top: 80px`, `padding-bottom: 80px` additional on the inner row

**Left column:**

1. **Badge** (top, before headline):
A small pill: `display: inline-flex`, `align-items: center`, `gap: 6px`, `border: 1px solid #1e1e1e`, `background: rgba(255,255,255,0.02)`, `border-radius: 100px`, `padding: 4px 12px 4px 8px`.
Content: a small `✦` character in `#555` `11px` + text `"Spaced repetition for DSA"` in `#666` `12px` `font-family: var(--font-geist-mono)`.

2. **Headline** — two lines, no line breaks in the markup, let it flow:

Line 1: `"Never forget"` 
Line 2: `"what you solved."`

Both lines: `font-family: var(--font-instrument-serif)`, `font-style: italic`, `font-weight: 400`, `font-size: clamp(48px, 5.5vw, 72px)`, `line-height: 1.08`, `letter-spacing: -0.02em`, `color: #f0f0f0`. No gradient, no color. Pure white-ish. The restraint is the point.

A thin `1px solid #1e1e1e` rule line sits between the two headline lines — `width: 100%`, `margin: 2px 0`. This is a subtle editorial detail.

3. **Subheadline:**
`"Recall schedules your DSA revision automatically."` — newline — `"Solve once. Remember forever."`
`font-family: var(--font-geist-sans)`, `font-size: 17px`, `color: #666`, `line-height: 1.65`, `max-width: 380px`, `margin-top: 28px`, `font-weight: 400`.

4. **CTA buttons** (`margin-top: 40px`, `display: flex`, `gap: 12px`, `align-items: center`):

Primary: `"Start tracking — it's free"` — `background: #ffffff`, `color: #000`, `font-size: 14px`, `font-weight: 600`, `height: 44px`, `padding: 0 24px`, `border-radius: 8px`, `font-family: var(--font-geist-sans)`. Hover: subtle scale `1.01`, `background: #f0f0f0`.

Secondary: `"View on GitHub ↗"` — `background: transparent`, `border: 1px solid #222`, `color: #666`, `font-size: 14px`, `height: 44px`, `padding: 0 20px`, `border-radius: 8px`. Hover: `border-color: #333`, `color: #e5e5e5`.

5. **Social proof** (`margin-top: 24px`):
`"Built by a student, for students grinding DSA"` — `font-family: var(--font-geist-mono)`, `font-size: 11px`, `color: #444`, `letter-spacing: 0.03em`.

**Left column entrance animation (Motion, staggered):**
Each element (badge, headline, subheadline, buttons, social proof) animates from `opacity: 0, y: 24` to `opacity: 1, y: 0`. Duration `0.6s`, ease `[0.16, 1, 0.3, 1]` (custom spring-like ease). Stagger: `0.08s` between each element. Start delay: `0.2s`.

**Right column:**

A browser chrome mockup. This is a container — the actual demo component goes inside it (built in Prompt 2).

Browser chrome specs:
- `border-radius: 12px`
- `border: 1px solid #1a1a1a`
- `background: #0a0a0a`
- `overflow: hidden`
- `box-shadow: 0 0 0 1px #111, 0 32px 64px rgba(0,0,0,0.5)`

Browser toolbar (top bar of chrome):
- `height: 40px`
- `background: #111111`
- `border-bottom: 1px solid #1a1a1a`
- `padding: 0 16px`
- `display: flex`, `align-items: center`, `gap: 12px`

Three traffic light dots: circles `10px × 10px` each, `border-radius: 50%`
- Red: `#3a1a1a` (dark muted, not bright)
- Yellow: `#3a3010`
- Green: `#1a3a1a`
(Muted, not the bright macOS colors — subtler)

URL bar (centered in toolbar):
- `flex: 1`, `max-width: 280px`, `margin: 0 auto`
- `background: #0a0a0a`
- `border: 1px solid #1e1e1e`
- `border-radius: 6px`
- `height: 24px`
- `display: flex`, `align-items: center`, `justify-content: center`
- Text: `"app.recall.dev"` in `#444`, `font-family: var(--font-geist-mono)`, `font-size: 11px`

Inside the chrome below the toolbar: render `<TableDemo />` (placeholder div for now — built in Prompt 2). The content area height: `480px`.

Right column entrance animation: fade in from `opacity: 0, y: 32, scale: 0.97` to `opacity: 1, y: 0, scale: 1`. Duration `0.8s`, ease `[0.16, 1, 0.3, 1]`. Delay `0.4s`.

## Landing page root — `src/app/(landing)/page.tsx`

```typescript
import { NoiseTexture } from '@/components/landing/noise'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'

export default function LandingPage() {
  return (
    <>
      <NoiseTexture />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        {/* Sections 2, 3, 4 added in Prompt 2 and 3 */}
      </main>
    </>
  )
}
```

## Definition of done — Prompt 1

- `/` shows the landing page, not the app
- `/dashboard` shows the problems table (previously at `/`)
- `/daily` still works
- Middleware protects `/dashboard` and `/daily` but not `/`
- Navbar renders correctly: wordmark left, links center, buttons right
- Navbar is floating with blur backdrop
- Noise texture visible (subtle, not overwhelming)
- Hero headline renders in Instrument Serif italic
- Both CTA buttons work (link to `/auth/login`)
- Staggered entrance animations play on load
- Browser chrome mockup renders on the right with correct styling
- Zero console errors
- Commit: `git add . && git commit -m "Landing page — Phase 1: foundation, layout, hero"`
- STOP. Do not build the demo animations yet.
