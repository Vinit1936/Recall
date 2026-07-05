# Task: Build the main problems table (home screen)

Read `ui.md` in the project root before writing any UI code. Follow all resource and styling guidance there.

---

## 0. Setup before writing any component

### Install required packages
```bash
npx shadcn@latest init   # if not already done — choose dark theme, CSS variables yes
npx shadcn@latest add button badge dropdown-menu input tooltip skeleton
npm install swr
npm install date-fns     # for relative date formatting ("in 3 days", "2 days ago")
```

### Prisma schema addition — do this FIRST before any UI
Add one missing field to the Problem model and migrate:
```prisma
isFavorite Boolean @default(false)
```
Run: `npx prisma migrate dev --name add_is_favorite`
Run: `npx prisma generate`
Do this before building anything else.

---

## 1. Global layout — app shell

Create `src/app/layout.tsx` as the root layout wrapping all pages with a left sidebar + main content area.

### Left sidebar
- Fixed width: `240px`
- Background: `#111111` (slightly lighter than page bg so it reads as a panel)
- Top of sidebar: app name `recall.` in monospace font, white, ~18px, with a subtle period styled differently (dimmer color) — this is the wordmark
- Below wordmark: nav links with icons
  - `Home` (grid/table icon) → `/` — the problems table
  - `Daily Revision` (calendar/flame icon) → `/daily`
  - Future: Settings (gear icon) → greyed out, not clickable yet
- Active nav link: slightly lighter background pill behind it, white text
- Inactive nav link: muted gray text, no background
- Bottom of sidebar: a small muted text showing "dev mode" since auth isn't built yet — just a reminder. Style it as a tiny badge.
- No border on sidebar — use the background color difference to separate it from content

### Main content area
- Background: `#0a0a0a` (true near-black)
- Takes remaining width after sidebar
- Has its own scroll, sidebar stays fixed
- Top padding: `32px`, horizontal padding: `40px`

---

## 2. Page header area (inside main content, above table)

```
recall / All Problems                    [ + New Problem ]
```

- Left: breadcrumb-style page title. "recall" in muted color, "/" separator, "All Problems" in white. Monospace font.
- Right: `+ New Problem` button — dark border, white text, small, no fill (ghost style). Clicking this triggers the same inline row creation as clicking "+ New row" at the bottom of the table.

Below header, the tab bar:
- Three tabs: `All Problems` | `By Status` | `By Topic`
- Tab style: no background on inactive, white text + a bottom border accent on active tab
- Gap between header and tabs: `16px`
- Gap between tabs and toolbar: `16px`

Below tabs, the toolbar row:
- Left side: search input (magnifying glass icon inside, placeholder "Search problems..."), filter dropdown, sort dropdown
- Right side: nothing for now
- Search input style: dark background `#1a1a1a`, subtle border `#2a2a2a`, white text, no shadow
- Filter dropdown: filters by Difficulty (Easy / Medium / Hard) and Status (Active / Mastered / Retired) — multi-select, checkboxes inside dropdown
- Sort dropdown: options are "Next Revision (default)", "Problem Number", "Date Added", "Difficulty"

---

## 3. The problems table

### Table container
- Background: `#0a0a0a` (same as page, no card elevation)
- No outer border radius
- Column headers: `12px` uppercase monospace text, muted gray `#555`, `1px` bottom border `#1e1e1e`
- Row height: `44px`
- Row hover: subtle background `#141414` — no animation needed, instant
- Row separator: `1px` border `#1a1a1a` between rows, very subtle

### Column definitions — build in this exact order left to right

**Column 1 — Platform (width: 48px)**
- Show platform logo icon only, no text label
- LeetCode logo: use an SVG icon (find one or use a simple "LC" monogram in a small rounded square with LeetCode's orange `#FFA116`)
- Centered in cell
- No header text — just a grid/platform icon in the column header

**Column 2 — Problem Name (width: flex, takes remaining space, min 280px)**
- Format: `[number] title`
- Number: monospace font, muted gray `#666`, smaller size `13px`
- Title: normal weight, white, `14px`, clicking opens problem URL in a new tab
- Title has a subtle underline on hover only
- If URL is null (user didn't provide one): title is not clickable, show a small "no link" icon next to it in muted color

**Column 3 — Difficulty (width: 90px)**
- Colored pill, rounded-full, small padding
- Easy: background `#1a3a1a`, text `#4ade80` (green)
- Medium: background `#3a2a0a`, text `#fb923c` (orange/amber)  
- Hard: background `#3a0a0a`, text `#f87171` (red)
- These are dark muted versions of LeetCode's colors — not bright, not washed out

**Column 4 — Topic (width: 130px)**
- Colored pill, same shape as difficulty
- Colors: assign a color from a fixed palette of 12 muted dark tones when a topic is first seen
- Use a deterministic color assignment based on topic name (hash the string to pick from the palette) so the same topic always gets the same color across renders without needing state
- Palette suggestion (dark muted tones): `#1a1a3a`/`#818cf8`, `#1a3a3a`/`#34d399`, `#3a1a3a`/`#c084fc`, `#3a3a1a`/`#facc15`, `#1a2a3a`/`#38bdf8`, `#3a1a1a`/`#fb7185`, `#1a3a2a`/`#4ade80`, `#2a1a3a`/`#a78bfa`, `#3a2a1a`/`#fdba74`, `#1a1a2a`/`#94a3b8`, `#2a3a1a`/`#86efac`, `#3a2a2a`/`#fca5a5`
- Each pair is (background, text color)
- No user interaction on this cell yet (editing topic comes later)

**Column 5 — Status (width: 110px)**
- Colored dot (8px circle) + label text
- Clean: dot `#4ade80`, text "Clean", text color `#4ade80`
- Shaky: dot `#fb923c`, text "Shaky", text color `#fb923c`
- Struggled: dot `#f87171`, text "Struggled", text color `#f87171`
- For MASTERED problems: dot `#818cf8` (purple), text "Mastered"
- For RETIRED problems: dot `#555`, text "Retired", muted gray
- For ACTIVE problems with no revisions yet: dot `#555`, text "Not started"

**Column 6 — Star (width: 44px)**
- Star icon, centered
- Filled gold star `#facc15` when `isFavorite = true`
- Outline star `#444` when `isFavorite = false`
- Clicking toggles immediately (optimistic update) + calls `PATCH /api/problems/[id]` with `{ isFavorite: !current }`
- On API error: revert the optimistic update and show a brief toast error

**Column 7 — Next Revision (width: 120px)**
- Show relative date using date-fns `formatDistanceToNow`
- Format examples: "in 3 days", "today", "in 14 days", "30 days ago"
- Color rules:
  - Overdue (past): text `#f87171` (red), no background
  - Due today: text `#fb923c` (amber), slightly emphasized
  - Future: text `#888` (muted gray)
- For MASTERED problems: show "Mastered ✓" in purple `#818cf8`
- For RETIRED problems: show "—" in muted gray

**Column 8 — Notes (width: 160px)**
- Plain text, muted gray `#888`, `13px`
- Truncate at 40 chars with ellipsis
- Empty state: show nothing (no placeholder text in the table cell)

**Column 9+ — Custom columns**
- Fetch `GET /api/columns` on page load
- Render each UserColumnConfig as an additional column
- Cell content: the matching key from `problem.customFields` JSON, plain text
- Editable inline on click: clicking a custom field cell shows a text input in place, blur or Enter saves via `PATCH /api/problems/[id]/custom-fields`
- Column header: the column name from UserColumnConfig

**Last column header — "+ Add column"**
- At the very end of the column headers row
- Shows `+` icon + "Add column" text, muted gray, smaller than other headers
- Clicking shows a small inline popover with a text input "Column name" and a Save button
- On save: calls `POST /api/columns` with `{ name, order }`, then refetches columns and problems

---

## 4. Inline row creation — critical, must work exactly like this

When user clicks `+ New Problem` (top right) OR `+ New row` (bottom of table):

**Step 1:** A new row appears at the bottom of the table with a subtle `#1a1a1a` background to distinguish it as "being created". All cells are empty except Platform which shows the platform dropdown immediately.

**Step 2 — Platform dropdown:**
- Shows a small dropdown with platform options
- For MVP: only `LeetCode` (with logo)
- Selecting a platform moves focus to the Problem Number cell

**Step 3 — Problem Number input:**
- Monospace text input, no border (inline feel), dark background matching the row
- Placeholder: "Problem #"
- User types a number (e.g. `234`) and presses Enter

**Step 4 — Auto-fetch:**
- Show a small loading spinner in the Problem Name cell while fetching
- Call the local resolver via a client-side fetch to `/api/leetcode/resolve?id=234` (create this lightweight GET route that wraps the local resolver — returns `{ found, data }`)
- If `found: true`: auto-fill Problem Name, Difficulty, Topic cells in the row instantly. Show a subtle green flash on the auto-filled cells (one-time, ~300ms opacity animation using Motion).
- If `found: false`: show inline message below the row: "Couldn't find problem #234. Paste the URL to continue, or press Escape to cancel." with a URL input field. If user pastes a URL like `https://leetcode.com/problems/palindrome-linked-list/`, extract the slug (`palindrome-linked-list`), call `POST /api/leetcode/lookup` with `{ titleSlug }`, and auto-fill from that response.

**Step 5 — Remaining fields:**
- After auto-fill, focus moves to Notes cell (optional, user can skip)
- Tab or Enter saves the row

**Step 6 — Save:**
- Call `POST /api/problems` with all collected data
- On success: row becomes a normal table row, edit mode exits, success is silent (no toast needed — the row appearing is confirmation enough)
- On error: show a brief toast with the error message, keep the row in edit mode so user doesn't lose their input
- Escape at any point: removes the draft row, no API call

---

## 5. Skeleton loading state

While `GET /api/problems` is in flight on initial load, show 8 skeleton rows. Each skeleton row:
- Same height as real rows (`44px`)
- Each cell has a skeleton block matching roughly the width of that column's content
- Use shadcn's `<Skeleton>` component
- Background: `#1a1a1a`, animated shimmer
- Do NOT show the table headers during skeleton — show headers immediately, only the rows are skeletons

---

## 6. Tab behavior

**All Problems tab:** render all problems, no grouping, default sort by nextRevisionAt ascending

**By Status tab:** group problems into three sections — Active, Mastered, Retired. Each section has a collapsible header showing the group name + count (e.g. "Active (12)"). Sections collapsed/expanded state is local React state. Default: all expanded.

**By Topic tab:** group problems by their `topic` field. Each topic gets a collapsible section with the topic pill as the header + count. Sort topics alphabetically. Default: all expanded.

Grouping and filtering all happen client-side on the already-fetched data — no extra API calls per tab switch.

---

## 7. Search and filter behavior

Search: filter `problems` array client-side as user types in the search input. Match against both `title` (case-insensitive) and `problemNumber` (string match). Debounce by 150ms.

Filter: when difficulty or status filters are active, additionally filter the array. Filters are additive within a category (selecting Easy + Medium shows both), restrictive across categories.

Sort: re-sort the filtered array based on selected sort option. All of this is pure client-side array manipulation on the SWR-cached data.

---

## 8. Data fetching with SWR

```
const { data: problems, mutate } = useSWR('/api/problems', fetcher)
const { data: columns } = useSWR('/api/columns', fetcher)
```

After any mutation (create, update star, save custom field), call `mutate()` to revalidate. Use optimistic updates for the star toggle specifically (update local data immediately, revalidate after).

---

## 9. New lightweight API route needed

Create `GET /api/leetcode/resolve?id=[number]` — a thin wrapper around the local LeetCode resolver:
- Takes `id` query param
- Calls `leetcodeResolver.resolve(id)`
- Returns `{ found: true, data: ProblemMeta }` or `{ found: false }`
- This is a server route — the resolver runs server-side, never expose the JSON data bundle to the client directly

Also create:
- `PATCH /api/problems/[id]` — generic update route for single fields (used for isFavorite toggle). Accepts a partial Problem object and updates only the provided fields.

---

## 10. File structure expected

```
src/
  app/
    layout.tsx              ← root layout with sidebar
    page.tsx                ← home page, renders ProblemsTable
    api/
      problems/
        route.ts            ← GET + POST (already exists)
        [id]/
          route.ts          ← PATCH (new — generic update)
          revise/route.ts   ← already exists
          retire/route.ts   ← already exists
          revise-again/route.ts ← already exists
          custom-fields/route.ts ← already exists
      columns/
        route.ts            ← GET + POST (already exists)
      leetcode/
        resolve/route.ts    ← NEW — lightweight resolver wrapper
        lookup/route.ts     ← already exists
  components/
    problems-table/
      index.tsx             ← main table component
      columns.tsx           ← column definitions
      row.tsx               ← single table row
      new-row.tsx           ← inline creation row
      toolbar.tsx           ← search + filter + sort
      tab-bar.tsx           ← All / By Status / By Topic tabs
    sidebar/
      index.tsx             ← left sidebar
    ui/                     ← shadcn components live here (auto-generated)
```

---

## Definition of done

- `npx prisma migrate dev --name add_is_favorite` has run successfully
- Home screen renders with sidebar + table
- All 9 columns visible and correctly styled
- Difficulty pills match LeetCode colors exactly
- Topic pills use deterministic color assignment
- Status dots/labels render correctly for all states
- Tabs work (All / By Status / By Topic) with correct grouping
- Search + filter + sort work client-side
- Inline row creation works end to end: type `1`, press Enter, "Two Sum" auto-fills with Easy pill + topic pill
- Star toggle works with optimistic update
- Skeleton rows show on initial load
- Custom columns render (even if no columns exist yet, the "+ Add column" header button is there)
- No console errors in `npm run dev`
- Commit: `git add . && git commit -m "Build main problems table (Phase 5)"`
- Stop here — do not build Daily Revision page or any other screen