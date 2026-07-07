# Task: Build the Daily Revision page

Read `ui.md` in the project root before writing any UI code. This page shares the same app shell (sidebar + layout) already built in Phase 5 — do not modify the sidebar or layout.tsx.

---

## 0. Route
Page lives at `src/app/daily/page.tsx`
Accessible via the "Daily Revision" nav link in the sidebar (already links to `/daily`).

---

## 1. Page layout — top to bottom

```
[ Stats strip ]
[ Page title + date ]
[ Overdue section — if any overdue problems ]
[ Due today section ]
[ All done state — if everything is marked ]
[ Contribution heatmap ]
```

No sidebar modifications needed — this page uses the same shell.
Page horizontal padding: same as problems table (`40px`).
Page top padding: `32px`.

---

## 2. Stats strip — very top of page

A single horizontal row showing three numbers:

```
🔥 [streak]     [total] problems     [mastered] mastered     [due] due today
```

- Flame emoji + streak number: white, monospace font, `20px`. If streak is 0, show `🔥 0` in muted gray instead of white.
- Separator between stats: a single `·` character in muted gray `#444`
- "X problems": total problem count across all statuses
- "X mastered": count of problems with status MASTERED
- "X due today": count from the due problems list
- All numbers: white, monospace. Labels: muted gray `#888`, normal font, `13px`
- Strip background: none — sits directly on page background
- Bottom margin below strip: `32px`

Fetch streak from `GET /api/streak`. Fetch problem counts from `GET /api/problems` (already fetched for the due list anyway — derive counts from that).

---

## 3. Page title

```
⌈ Daily Revision ⌋          Monday, July 7
```

- Left: section title wrapped in bracket accents `⌈ Daily Revision ⌋` — use actual Unicode characters `⌈` (U+2308) and `⌋` (U+230B). White text, `22px`, slightly bold.
- Right: today's date formatted as `"Weekday, Month Day"` (e.g. "Monday, July 7"). Monospace, muted gray `#666`, `14px`.
- These sit on the same line, space-between.
- Bottom margin: `24px`

---

## 4. Problem list — the core of the page

Fetch problems from `GET /api/problems/due` — returns ACTIVE problems where `nextRevisionAt <= now()`.

Split the returned list into two groups:
- **Overdue**: `nextRevisionAt` is before today's date (not just before now — before the start of today)
- **Due today**: `nextRevisionAt` is today (same calendar date as today)

### Overdue section (only render if overdue.length > 0)

Header:
```
Overdue (3)
```
- Text: `#f87171` (red), `12px`, uppercase, monospace, with a small warning icon before it
- Bottom margin below header: `8px`

Render overdue problems first, before due-today problems.

### Due today section

Header:
```
Today (2)
```
- Text: muted gray `#888`, `12px`, uppercase, monospace
- Bottom margin below header: `8px`

### Problem row structure

Each problem is a compact list row — NOT a card. Think of it like a table row but without the full table chrome.

```
[ Platform icon ]  [ Number ] Problem Title  [ Difficulty pill ]  [ Topic pill ]  [ Clean ] [ Shaky ] [ Struggled ]  [ Link icon ]
```

Row specs:
- Height: `52px`
- Background: `#111111`
- Border: `1px solid #1e1e1e`
- Border radius: `8px`
- Margin between rows: `6px`
- Horizontal padding: `16px`
- On hover: background shifts to `#161616` — instant, no animation

Left side of row (flex, gap `12px`, align center):
- Platform icon: same LeetCode logo used in the table, `20px`
- Problem number: monospace, `#666`, `12px`
- Problem title: white, `14px`, normal weight, max-width `320px`, truncate with ellipsis if longer

Right side of row (flex, gap `8px`, align center, pushed to the right with `margin-left: auto`):
- Difficulty pill: same colors as the main table (dark muted green/amber/red)
- Topic pill: same deterministic color system as the main table — import and reuse the same color utility function, do not re-implement it
- Three confidence buttons: `Clean`, `Shaky`, `Struggled`
- Link icon button: opens problem URL in new tab, muted gray, becomes white on hover. If URL is null, hide this button.

### Confidence buttons

Three buttons side by side. Before a problem is marked:
- `Clean`: outline button, border `#2a2a2a`, text `#888`, `12px`
- `Shaky`: same style
- `Struggled`: same style

When user clicks one:
1. Immediately show a loading state on the clicked button (spinner or subtle pulse)
2. Call `PATCH /api/problems/[id]/revise` with `{ confidence }`
3. On success:
   - The row gets a "done" state: title gets a strikethrough, all three buttons are replaced by a single colored badge showing which confidence was selected (e.g. a green "Clean ✓" badge)
   - Row background shifts to `#0d0d0d` (slightly dimmer to signal it's done)
   - Use a subtle fade transition (Motion, ~200ms opacity) for the button → badge swap
4. On error: show a brief toast, revert to normal state

Once ALL problems in the list are marked (both overdue + due today):
- The problem list area is replaced by an "all done" state (see section 5)
- The streak number in the stats strip updates (re-fetch from `/api/streak`)

### Empty state (no problems due today)

If `GET /api/problems/due` returns an empty array:

```
⌈ You're all caught up ⌋

No problems due today. Come back tomorrow,
or add new problems from the table.

[ Go to problems table →]
```

- Centered vertically in the space where the list would be
- Title: bracket accent style, white, `18px`
- Subtitle: muted gray, `14px`, `line-height: 1.6`
- Button: ghost style, links to `/`

---

## 5. All done state

When all due problems are marked (after the last one is submitted):

Animate the problem list out (Motion: fade + slight upward translate, ~300ms), then show:

```
        ✓

  All done for today

  Come back tomorrow to keep your streak alive.

  🔥 [streak] day streak
```

- Checkmark: large, `#4ade80` (green), `48px`
- Title: white, `20px`, slightly bold
- Subtitle: muted gray `#888`, `14px`
- Streak line: flame + streak number, monospace, white, `16px`
- Everything centered, with generous vertical padding
- Animate in with Motion: fade + slight scale from 0.95 → 1.0, ~300ms

---

## 6. Contribution heatmap — full width, bottom of page

### What it shows
A GitHub-style calendar heatmap. Each square = one calendar day. Color intensity = number of revisions done that day.

### Data source
Fetch revision activity from a new API route: `GET /api/activity`

Create this route: returns an array of `{ date: string (YYYY-MM-DD), count: number }` for the last 365 days. Query the `Revision` table grouped by date:

```typescript
// Pseudocode for the query
SELECT DATE(revisedAt) as date, COUNT(*) as count
FROM Revision
WHERE problemId IN (SELECT id FROM Problem WHERE userId = devUserId)
  AND revisedAt >= NOW() - INTERVAL '365 days'
GROUP BY DATE(revisedAt)
```

Use Prisma's `groupBy` or a raw query — whichever is cleaner.

### Heatmap rendering
- 53 columns × 7 rows = ~371 squares (52 full weeks + partial current week)
- Each square: `12px × 12px`, `2px` gap between squares, `2px` border radius
- Color scale (5 levels):
  - 0 revisions: `#1a1a1a` (empty, very dark)
  - 1 revision: `#1a3a2a`
  - 2-3 revisions: `#1e5c3a`
  - 4-6 revisions: `#22c55e` at 60% opacity
  - 7+ revisions: `#22c55e` (full green)
- Month labels above the grid: `Jan`, `Feb` etc. in monospace `#555`, `11px`
- Day labels to the left: `Mon`, `Wed`, `Fri` in monospace `#555`, `11px`
- Tooltip on hover: show `"3 revisions on Jul 7"` using shadcn Tooltip
- Today's square: subtle white border `1px solid #444` to highlight it

### Heatmap layout
- Full width of the content area
- Section header above it: `⌈ Activity ⌋` — same bracket accent style, `16px`, `#888`
- Top margin above heatmap section: `48px`
- Bottom padding below heatmap: `48px`

Build the heatmap as a standalone component `src/components/heatmap/index.tsx`. Do not use any external heatmap library — build it as a simple CSS grid of divs. It's ~50 lines of straightforward rendering logic.

---

## 7. Data fetching

```typescript
// On page mount, fetch in parallel:
const { data: dueProblems } = useSWR('/api/problems/due', fetcher)
const { data: allProblems } = useSWR('/api/problems', fetcher)  // for counts
const { data: streak } = useSWR('/api/streak', fetcher)
const { data: activity } = useSWR('/api/activity', fetcher)
```

After submitting a revision, call `mutate('/api/problems/due')` and `mutate('/api/streak')` to revalidate those two.

---

## 8. New API route needed

`GET /api/activity` — returns revision activity for the last 365 days for the hardcoded dev user. Add `// TODO: replace hardcoded userId with session user` comment. Returns:

```json
[
  { "date": "2026-07-01", "count": 3 },
  { "date": "2026-07-02", "count": 1 },
  ...
]
```

Only include dates that have at least 1 revision — the frontend fills in zeros for missing dates.

---

## 9. File structure expected

```
src/
  app/
    daily/
      page.tsx                  ← Daily Revision page
    api/
      activity/
        route.ts                ← NEW: GET /api/activity
  components/
    daily/
      stats-strip.tsx           ← streak + counts row
      problem-row.tsx           ← single revision row
      all-done.tsx              ← completion state
      empty-state.tsx           ← no problems due state
    heatmap/
      index.tsx                 ← contribution heatmap
```

---

## Definition of done

- `/daily` route renders without errors
- Stats strip shows streak + problem counts (even if all zeros with stub user)
- Due problems list renders with correct row structure
- Confidence buttons work end to end — clicking Clean/Shaky/Struggled calls the API and shows the done state on that row
- All done state appears and animates in when all problems are marked
- Empty state shows when no problems are due
- Heatmap renders (will be empty with stub user, that's fine — the grid should still show)
- `GET /api/activity` route exists and returns correct shape
- `npm run dev` shows no console errors on `/daily`
- Commit: `git add . && git commit -m "Build Daily Revision page (Phase 6)"`
- Stop here — do not build auth, landing page, or any other screen