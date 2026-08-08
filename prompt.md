Looking at all 7 screenshots carefully and analytically. Let me call out every specific issue I see:

**Hero (Image 1):**
- The browser chrome demo is getting cut off on the right — the STATUS column and beyond are clipped. The demo needs to be contained within visible bounds.
- The hero has too much empty space below the CTA buttons and above the demo. The two columns aren't vertically centered together — the left text sits high while the demo floats in the middle.
- "Get started for free" button has no secondary button next to it anymore — the "View on GitHub" ghost button from the spec is missing. This makes the CTA feel lonely and the left column bottom-heavy with just one button then a lot of white space.
- The badge `✦ Spaced repetition for DSA` is fine but the `✦` glyph is rendering slightly misaligned vertically with the text.
- The dot grid is noticeably denser in the hero right side behind the demo — creates an unintentional two-tone feel.

**Daily Revision section (Image 2):**
- The browser chrome on the left has a visible thick rounded border that looks like a card component, not a floating chrome mockup. The border radius is too large — looks like a panel, not a browser window.
- "Show up. Every day." is running off the right edge of the viewport — the text is overflowing. This is a critical layout bug.
- The right column text is not vertically centered with the left chrome. Text starts at the top while the chrome is much taller.
- The "Sign in" CTA button in this section is too wide and too tall — takes up disproportionate space compared to the text above it.
- The streak number "14" in the demo looks great but "day streak" text next to it is too large — almost as big as the number itself.

**Capabilities (Image 3):**
- The ghost numbers `01`, `02`, `03`, `04` behind the card titles are rendering too large and too visible — `rgba(255,255,255,0.02)` should be nearly invisible but they're clearly legible. Reduce opacity further or remove them — they're becoming visual noise rather than a subtle depth element.
- Too much vertical whitespace above "CAPABILITIES" label — the section feels like it starts too late.
- The vertical dividers between the four columns are inconsistent — some appear darker than others.
- Body text color is too close to white — should be `#777` to create hierarchy between titles and descriptions.

**Science/Ebbinghaus section (Image 4):**
- This is the strongest section. The chart is beautiful. Only issues:
- The browser chrome here correctly has a smaller border-radius — inconsistent with the Daily Revision section chrome which is too rounded.
- The "Day 3" marker is highlighted in teal/blue which looks great, but the highlighted day box at bottom should animate through the days rather than sitting static on Day 3.
- Left column text body `#777` color is too light against the dark background — slightly hard to read at normal distance.

**How It Works + Platform strip (Image 5):**
- The `→` arrows between steps are too small and too low — they're positioned at the vertical divider line midpoint but look accidental, not intentional. They need to be more deliberately placed, either horizontally centered between step titles or removed entirely.
- The platform badge buttons are inconsistent width — "GeeksForGeeks" is much wider than "LeetCode" because the name is longer. Either truncate names or use fixed widths.
- Too much vertical gap between How It Works and Works With platforms sections — feels disconnected.

**FAQ (Image 6):**
- The open answer has `border-left` applied correctly but the left border color is barely visible — needs to be `#2a2a2a` minimum.
- Answer text `color` is too dark — reading `#555` or darker against the black background at `15px` is straining. Bring it to `#888`.
- The `−` close icon on the open question is properly sized but sits too high — not vertically centered with the question text.
- Spacing between FAQ items is uneven — the open item has more bottom padding than the closed items.

**Final CTA (Image 7):**
- "Get started free →" button is too wide — it's nearly the full content width on a centered section. Max-width should be `220px`, not stretching.
- The button border-radius is too large — `border-radius: 100px` makes it look pill-shaped, which conflicts with the `border-radius: 6px` on navbar buttons. Consistency matters — pick one radius system.
- `recall. © 2026` in the footer bottom-left — the `recall.` wordmark here is too small and the period is same color as text. Should match the navbar wordmark treatment exactly.
- Too much empty space between "Start remembering" headline and the button — the section feels vertically padded to fill space rather than breathe.

Here's the fix prompt:

---

Fix all UI/spacing issues on the landing page. Read `ui.md` first. Do not add new sections or features — fix what exists only.

**Fix 1 — Hero demo getting clipped**

The browser chrome mockup on the right is overflowing its container. The demo content (table) is wider than the chrome bounds. Fix:
- Set `overflow: hidden` on the browser chrome content area
- Reduce the demo table's column widths proportionally so all columns fit within the chrome width
- The REVISION/NOTES columns should be hidden inside the chrome — the table should only show PLAT, PROBLEM, DIFF, TOPIC, STATUS columns within the visible chrome width
- Chrome width: `min(580px, 50vw)`

**Fix 2 — Hero layout vertical alignment**

Both columns must be vertically centered relative to each other. The left column text currently sits near the top while the right demo is taller. Fix:
- Add `align-items: center` to the hero two-column flex container
- Add back the secondary "View on GitHub ↗" ghost button next to "Get started for free" — it was in the original spec but is missing. `border: 1px solid #222`, `color: #666`, `height: 40px`, `padding: 0 18px`, `border-radius: 6px`, `font-size: 13px`

**Fix 3 — Daily Revision section: text overflow**

"Show up. Every day." is overflowing the right column. Fix:
- Add `overflow: hidden` and `word-break: break-word` to the right column container
- Reduce headline font-size: `clamp(36px, 4vw, 56px)` — it's currently too large for the column width
- Add `max-width: 100%` to the headline element

**Fix 4 — Daily Revision section: chrome border**

The browser chrome border-radius is inconsistent with the hero section. Standardize ALL browser chrome mockups across the page:
- `border-radius: 10px` on every chrome container (hero, daily revision, science section)
- `border: 1px solid #1e1e1e`
- `box-shadow: 0 0 0 1px #111, 0 24px 48px rgba(0,0,0,0.4)`
- No exceptions — all three chrome mockups must look identical structurally

**Fix 5 — Daily Revision section: CTA button**

The "Sign in" button in the daily revision right column:
- Change text to "Get started free"
- Width: `auto`, not full width — `display: inline-block`
- Height: `44px`, `padding: 0 24px`
- `border-radius: 6px`
- `font-size: 14px`, `font-weight: 600`

**Fix 6 — Capabilities section: ghost numbers**

The `01`/`02`/`03`/`04` background numbers are too visible. Either:
- Reduce opacity to `rgba(255,255,255,0.015)` — nearly invisible
- OR remove them entirely if they still look prominent at that opacity

Also fix body text color in capability cards: `color: #666`, `font-size: 14px`, `line-height: 1.7`. Currently too bright.

Also remove the extra vertical whitespace above "CAPABILITIES" label — reduce top padding of the section from current value to `80px`.

**Fix 7 — How It Works: arrows**

The `→` arrows between steps are too small and positioned awkwardly. Replace them with a more intentional treatment:
- Position each arrow horizontally centered between the vertical divider and the next step's content
- Size: `18px`, color: `#2a2a2a`
- Vertically align at the same level as the step number badge (`01`, `02`)
- If they still look accidental, remove entirely — empty space between steps is cleaner than a weak arrow

**Fix 8 — Platform strip: consistent badge widths**

Platform badges have inconsistent widths because names differ in length. Fix:
- Set `min-width: 140px` on each badge with `justify-content: center`
- This makes all five badges the same width regardless of name length
- Reduce badge height to `36px`, font-size `12px`, logo `16px`

**Fix 9 — FAQ: spacing and text**

- Open answer text color: `#777`, `line-height: 1.8`, `font-size: 14px`
- Left border on open answer: `border-left: 2px solid #222`, `padding-left: 20px`
- The `−` close icon: ensure `vertical-align: middle` with the question text — currently sits too high
- Standardize spacing between all FAQ items: `padding: 24px 0` on each item regardless of open/closed state
- Remove the extra bottom padding that appears on the open item

**Fix 10 — Final CTA button width and shape**

- Button max-width: `200px` — it should NOT stretch to content width or be full-width
- `border-radius: 8px` — not pill-shaped, consistent with rest of page buttons
- Reduce vertical padding around the entire CTA section: `padding: 100px 32px` (currently too much empty space above and below)
- Thin decorative line above section: `width: 40px` (shorter, more elegant), `height: 1px`, `background: #222`, `margin: 0 auto 48px`

**Fix 11 — Footer wordmark**

`recall. © 2026` — the wordmark should match the navbar exactly:
- `recall` in Geist Mono, `13px`, `color: #e5e5e5`, font-weight 500
- `.` in `#555`
- ` © 2026` in `#333`, same size
- GitHub, Twitter, LinkedIn links: `#444`, hover `#888`, `13px`, Geist Mono

**Fix 12 — Global spacing consistency**

Every major section currently has inconsistent top/bottom padding. Standardize:
- All section top padding: `100px`
- All section bottom padding: `100px`
- Exception: hero is `min-height: 100vh` so no fixed padding needed
- This creates a predictable rhythm as you scroll — each section takes the same "breath"

**Fix 13 — Dot grid density**

The dot grid appears denser behind the demo in the hero and behind certain sections. This should be uniform:
- Single dot grid component, single opacity, same density everywhere
- If there are multiple instances or the opacity varies by section, consolidate to one fixed background applied to the `<body>` or the main `<main>` container — not repeated per section

Commit: `git add . && git commit -m "Landing page UI fixes — spacing, overflow, consistency, polish"`