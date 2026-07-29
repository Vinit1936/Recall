# Task: Fix and rebuild the problems table completely

The problems table has multiple critical issues. Fix all of them. Read `ui.md` before touching any code. Reference the Notion tracker screenshot for visual direction — that's the target feel.

Do not add new features. Fix what exists. Every fix listed below must be verified working before marking done.

---

## 0. Critical bug — new row not saving to database

This is the most important fix. Currently adding a new row via inline creation does nothing to the database.

Debug and fix the full inline row creation flow:

1. Check `POST /api/problems` — does it actually receive the request when Enter is pressed? Add a `console.log` at the top of the route to confirm it's being hit.
2. Check the request body — is `platform`, `problemNumber`, `title`, `difficulty`, `topic`, `url`, `dateSolved` all being sent correctly?
3. Check the response — is it returning a 200 with the created problem, or an error?
4. Check the frontend — after the API responds successfully, is `mutate()` being called to revalidate the SWR cache?
5. Fix whatever is broken in this chain. The flow must work end to end:
   - User types `32` in the problem number field → presses Enter
   - App calls local resolver → gets back "Longest Valid Parentheses", HARD, Stack/String, URL
   - App calls `POST /api/problems` with all fields including `dateSolved: new Date().toISOString()`
   - On 200 response → `mutate()` is called → table reloads → new row appears with all fields populated
   - On error → show a toast with the error message, keep the draft row so user doesn't lose input

The `dateSolved` field is required in the schema — make sure it's always sent, defaulting to today if the user doesn't specify.

---

## 1. Visual overhaul — match Notion tracker feel

The current table looks sparse and broken. The target is the Notion tracker screenshot — warm, colorful, data-dense, refined.

### Background and spacing
- Page background: `#0f0f0f`
- Sidebar background: `#111111`
- Table area background: same as page `#0f0f0f` — no card/panel around the table
- Row height: `44px` — compact, not tall
- Column header height: `36px`
- Column header text: `11px`, uppercase, monospace, color `#555`, letter-spacing `0.08em`
- Row separator: `1px solid #1c1c1c`
- Row hover: `#161616` background, instant

### Typography
- Problem number: monospace, `#666`, `13px`, font-weight 400
- Problem title: `#e5e5e5`, `14px`, font-weight 500, hover: underline, cursor pointer (links to problem URL)
- All pill text: `12px`, font-weight 500
- All metadata (dates, counts): monospace, `13px`

---

## 2. Fix every column — exact specs

### Column 1 — Platform (width: `52px`, centered)
- Show ONLY the platform logo icon, nothing else
- LeetCode: an orange `#FFA116` square `24px × 24px` with rounded corners `4px`, containing white text "LC" in monospace bold `10px`, centered
- Column header: a small grid icon `#555`, no text
- This must be its own column, not merged with the problem name

### Column 2 — Problem (width: `flex, min 260px`)
- Format: `[number]  [title]`
- Number and title on the SAME line, separated by a single space
- Number: monospace, `#666`, `13px`
- Title: `#e5e5e5`, `14px`, `font-weight 500`
- The entire title is clickable — `cursor: pointer`, opens problem URL in new tab
- On hover: title gets `text-decoration: underline`
- If `url` is null: title is NOT clickable, show a small `🔗` icon with strikethrough after it in `#444`
- Column header text: "PROBLEM"

### Column 3 — Difficulty (width: `100px`)
Pill style — match these EXACTLY (same as LeetCode's color scheme but dark/muted):
- Easy: background `#1c3a1c`, text `#4ade80`, border `1px solid #2d5a2d`
- Medium: background `#3a2a0d`, text `#fb923c`, border `1px solid #5a3d10`
- Hard: background `#3a0f0f`, text `#f87171`, border `1px solid #5a1a1a`
- Pill shape: `border-radius: 4px`, padding `2px 8px`, `font-size: 12px`, `font-weight: 600`
- Column header text: "DIFFICULTY"

### Column 4 — Topic (width: `130px`)
- Single pill, same shape as difficulty pill
- Deterministic color from topic name — use this exact hash function, do not change it:

```typescript
export function getTopicColor(topic: string): { bg: string; text: string; border: string } {
  const palette = [
    { bg: '#1a1a3a', text: '#818cf8', border: '#2a2a5a' },
    { bg: '#1a3a2a', text: '#34d399', border: '#2a5a3a' },
    { bg: '#3a1a3a', text: '#c084fc', border: '#5a2a5a' },
    { bg: '#3a3a0f', text: '#facc15', border: '#5a5a1a' },
    { bg: '#0f2a3a', text: '#38bdf8', border: '#1a3a5a' },
    { bg: '#3a0f1a', text: '#fb7185', border: '#5a1a2a' },
    { bg: '#1a3a1a', text: '#4ade80', border: '#2a5a2a' },
    { bg: '#2a1a3a', text: '#a78bfa', border: '#3a2a5a' },
    { bg: '#3a2a0a', text: '#fdba74', border: '#5a3a1a' },
    { bg: '#1a1a2a', text: '#94a3b8', border: '#2a2a3a' },
    { bg: '#1a3a2a', text: '#86efac', border: '#2a5a3a' },
    { bg: '#3a1a1a', text: '#fca5a5', border: '#5a2a2a' },
  ];
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}
```

Put this function in `src/lib/topic-colors.ts` and import it in both the problems table AND the daily revision page — same file, same colors everywhere.

- Column header text: "TOPIC"

### Column 5 — Status (width: `120px`)
This column is currently broken — shows nothing. Fix it completely.

Status is derived from TWO things: the problem's `status` field AND the latest revision's `confidence`:
- If `status === 'ACTIVE'` and `revisionCount === 0`: show gray dot `#555` + label "Not started" in `#666`
- If `status === 'ACTIVE'` and latest confidence is `CLEAN`: green dot `#4ade80` + "Clean" in `#4ade80`
- If `status === 'ACTIVE'` and latest confidence is `SHAKY`: amber dot `#fb923c` + "Shaky" in `#fb923c`
- If `status === 'ACTIVE'` and latest confidence is `STRUGGLED`: red dot `#f87171` + "Struggled" in `#f87171`
- If `status === 'MASTERED'`: purple dot `#a78bfa` + "Mastered" in `#a78bfa`
- If `status === 'RETIRED'`: gray dot `#444` + "Retired" in `#555`

To get the latest confidence, update `GET /api/problems` to include the most recent revision:
```typescript
include: {
  revisions: {
    orderBy: { revisedAt: 'desc' },
    take: 1,
  }
}
```

Then derive the display status from `problem.status` + `problem.revisions[0]?.confidence`.

Dot size: `8px` circle, `margin-right: 6px`
Label: `13px`, monospace
Column header text: "STATUS"

### Column 6 — Star (width: `44px`, centered)
Currently broken — shows nothing. Fix it.

- Show a star icon always — filled `★` in `#facc15` when `isFavorite = true`, outline `☆` in `#444` when false
- Clicking toggles immediately (optimistic update)
- Calls `PATCH /api/problems/[id]` with `{ isFavorite: !current }`
- On hover: outline star becomes `#888`
- Column header: `★` icon in `#555`, no text

### Column 7 — Next Revision (width: `130px`)
Currently broken — shows nothing. Fix it.

Use `date-fns` `formatDistanceToNow` with `addSuffix: true`:
- Overdue: "3 days ago" in `#f87171` (red)
- Due today: "today" in `#fb923c` (amber)
- Future: "in 14 days" in `#888` (muted)
- MASTERED: show "Mastered ✓" in `#a78bfa`
- RETIRED: show "—" in `#444`

Column header text: "NEXT REVISION"

### Column 8 — Notes (width: `180px`)
- Plain text, `#666`, `13px`
- Truncate at 40 chars with ellipsis
- Empty: show nothing (no placeholder text)
- Column header text: "NOTES"

---

## 3. Fix inline row creation — make it feel like Notion

The current inline row creation looks and feels wrong. Rebuild it to match Notion's behavior exactly.

### Trigger
Both `+ New Problem` button (top right) AND a `+ New row` text at the very bottom of the table trigger this. The `+ New row` text: muted `#444`, `13px`, left-aligned with the problem column, shows on table hover, has a `+` icon before it.

### New row appearance
- Same height as regular rows `44px`
- Background `#141414` — very slightly different from regular rows to indicate edit state
- A thin `1px` left border `#3a3a3a` on the row to signal "active"
- NO big highlighted block like currently shown

### Flow step by step

**Step 1 — Platform cell:**
- Shows a small dropdown immediately on row creation
- Dropdown options: just `LeetCode` for now with the LC logo
- Auto-selects LeetCode and moves to step 2 (since it's the only option, skip the dropdown entirely — just set platform to LEETCODE and focus the number field)

**Step 2 — Problem number input:**
- A plain text input inside the Problem cell, no border, transparent background, white text, monospace, `13px`
- Placeholder: `"Problem number..."` in `#444`
- User types `32` and presses `Enter`

**Step 3 — Auto-fetch (while fetching):**
- Show a subtle loading indicator in the title area — three dots `...` animating, color `#555`
- Call `GET /api/leetcode/resolve?id=32`

**Step 4a — Found:**
- Silently fill in: Problem title, Difficulty pill, Topic pill in the row cells
- A very subtle green flash on the filled cells (Motion: opacity 0→1 on a green `#4ade80` at 5% opacity overlay, 400ms, then fade out) — barely noticeable, just a hint of confirmation
- Focus moves to the Notes cell

**Step 4b — Not found:**
- Show inline below the row: `"Problem #32 not found. Paste the URL to continue, or press Esc to cancel."`
- Text color `#888`, `12px`
- A URL input appears below: same style as number input
- User pastes `https://leetcode.com/problems/longest-valid-parentheses/`
- Extract slug from URL → call `POST /api/leetcode/lookup` with `{ titleSlug: "longest-valid-parentheses" }`
- If found: fill cells same as 4a
- If still not found: let user manually type the title. Show inputs for title, difficulty (dropdown), topic (text input)

**Step 5 — Save:**
- User presses `Enter` in the Notes cell (or any cell) OR clicks outside the row
- Collect all data: `{ platform: 'LEETCODE', problemNumber: 32, title, difficulty, topic, url, dateSolved: new Date().toISOString(), notes }`
- Call `POST /api/problems`
- On 200: call `mutate('/api/problems')`, remove the draft row, the real row appears in the table
- On 409 (duplicate): show inline error "You've already added this problem" in `#f87171` below the row, keep draft
- On other error: show toast, keep draft

**Step 6 — Cancel:**
- `Escape` at any point removes the draft row with no API call
- Clicking `+ New row` while a draft exists: do nothing (don't create a second draft)

---

## 4. Tab views — fix grouping

### By Status tab
Groups: `Active` / `Mastered` / `Retired`
Each group header:
- Background `#141414`, full width
- Left: group name in `#888`, `12px`, uppercase, monospace
- Right: count in `#555`, `12px`, monospace
- A `▼` / `▶` chevron for collapse/expand
- `8px` vertical padding
- Problems within each group render as normal rows

### By Topic tab
Same pattern — group by `topic` field, alphabetical, each topic gets its colored pill as the group header instead of plain text.

---

## 5. Search and filter — verify they work

Search: filter on `title` (case insensitive) and `problemNumber` (string contains). Debounce 150ms.

Filter dropdown — fix the UI:
- Shows checkboxes for Difficulty: Easy / Medium / Hard
- Shows checkboxes for Status: Active / Mastered / Retired
- Applied filters show as small pills below the toolbar with an `×` to remove each one
- "Clear all" link if any filters active

Sort dropdown — options:
- Next Revision (default) — ascending
- Problem Number — ascending
- Date Added — descending
- Difficulty — Easy first

---

## 6. Empty state

When no problems exist yet (fresh account):
```
No problems yet

Add your first problem using the + New Problem button above,
or click + New row at the bottom of the table.
```
- Centered in the table area
- Icon: a simple grid/table icon in `#333`, `48px`
- Title: `#888`, `16px`
- Subtitle: `#555`, `13px`, `line-height 1.6`

---

## 7. API fixes needed

### `GET /api/problems` — include latest revision
```typescript
include: {
  revisions: {
    orderBy: { revisedAt: 'desc' },
    take: 1,
  }
}
```

### `PATCH /api/problems/[id]` — generic update
Make sure this route exists and handles `{ isFavorite }` correctly. It should accept any partial Problem fields and update only those provided.

### `GET /api/leetcode/resolve` — verify it works
Add a console.log to confirm it's being hit and returning the right shape `{ found: boolean, data?: ProblemMeta }`.

---

## 8. File to create — `src/lib/topic-colors.ts`

```typescript
export function getTopicColor(topic: string): { bg: string; text: string; border: string } {
  const palette = [
    { bg: '#1a1a3a', text: '#818cf8', border: '#2a2a5a' },
    { bg: '#1a3a2a', text: '#34d399', border: '#2a5a3a' },
    { bg: '#3a1a3a', text: '#c084fc', border: '#5a2a5a' },
    { bg: '#3a3a0f', text: '#facc15', border: '#5a5a1a' },
    { bg: '#0f2a3a', text: '#38bdf8', border: '#1a3a5a' },
    { bg: '#3a0f1a', text: '#fb7185', border: '#5a1a2a' },
    { bg: '#1a3a1a', text: '#4ade80', border: '#2a5a3a' },
    { bg: '#2a1a3a', text: '#a78bfa', border: '#3a2a5a' },
    { bg: '#3a2a0a', text: '#fdba74', border: '#5a3a1a' },
    { bg: '#1a1a2a', text: '#94a3b8', border: '#2a2a3a' },
    { bg: '#1a3a2a', text: '#86efac', border: '#2a5a3a' },
    { bg: '#3a1a1a', text: '#fca5a5', border: '#5a2a2a' },
  ];
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}
```

Import this in the problems table AND daily revision page. Same function, same colors, consistent everywhere.

---

## Definition of done — verify EVERY item

- [ ] Adding problem number `1` → Enter → "Two Sum" auto-fills → Enter → row appears in table AND exists in Neon database (check Neon dashboard → Tables → Problem)
- [ ] Adding problem number `99999` → shows "not found" message → URL input appears
- [ ] All 8 columns visible with correct data
- [ ] Difficulty pills match LeetCode colors (dark muted green/amber/red)
- [ ] Topic pills use deterministic colors from `getTopicColor`
- [ ] Status column shows correct dot + label for each state
- [ ] Star toggle works — clicking changes icon, persists after page refresh
- [ ] Next Revision shows relative date in correct color
- [ ] By Status tab groups correctly
- [ ] By Topic tab groups correctly
- [ ] Search filters rows as user types
- [ ] Filter dropdown works
- [ ] Empty state shows when no problems exist
- [ ] `npm run dev` — zero console errors
- [ ] Commit: `git add . && git commit -m "Fix problems table — row creation, columns, styling (Phase 5 fix)"`
- [ ] Stop here — do not touch Daily Revision or auth
ENDOFFILE
