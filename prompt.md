Add multi-platform support to the inline row creation flow. Only the row creation UX and schema change — nothing else.

**Schema change first:**

Update the Platform enum in `prisma/schema.prisma`:

```prisma
enum Platform {
  LEETCODE
  CODEFORCES
  GFG
  HACKERRANK
  CODECHEF
}
```

Run `npx prisma migrate dev --name add_platforms` then `npx prisma generate`.

**Platform logos:**

Create `src/lib/platforms/logos.tsx` with a `PlatformLogo` component that takes a `platform` prop and renders the appropriate logo. All logos are `24px × 24px`, `border-radius: 4px`, monospace bold text centered, using a styled div — no external images needed:

- LeetCode: bg `#FFA116`, white text "LC", `10px`
- Codeforces: bg `#1F8ACB`, white text "CF", `10px`
- GFG: bg `#2F8D46`, white text "GFG", `9px`
- HackerRank: bg `#00EA64`, black text "HR", `10px`
- CodeChef: bg `#5B4638`, white text "CC", `10px`

**Row creation flow:**

Step 1 — Platform dropdown shows all five platforms with their logos. User picks one.

Step 2 — Based on platform:

For **LeetCode**: existing flow completely unchanged. User types problem number, auto-fetch fires, fallback to URL prompt if not found. Do not touch this flow.

For **Codeforces, GFG, HackerRank, CodeChef**: skip number lookup entirely. Immediately show these fields inline in the row after platform selection:
- URL input (required) — placeholder e.g. "Codeforces problem URL..."
- Title input (required) — placeholder "Problem title..."
- Difficulty dropdown — Easy / Medium / Hard
- Topic input — free text, placeholder "Topic (e.g. DP, Graphs...)"

When user pastes a URL into the URL field, try to prefill the title from the URL slug as a convenience:
- `https://codeforces.com/problemset/problem/1/A` → prefill title "1A"
- `https://www.geeksforgeeks.org/find-the-missing-number/` → prefill title "Find The Missing Number" (slug to title case, strip trailing slashes)
- `https://www.codechef.com/problems/MINSTACK` → prefill title "MINSTACK"
- This is best-effort only — user can always override

All fields tab-navigable. Enter on the last field (topic) saves the row. Escape at any point cancels and removes the draft row.

**Saving:**

`POST /api/problems` already handles `{ platform, title, difficulty, topic, url, dateSolved }` — no changes needed to the API route. Make sure `dateSolved` defaults to `new Date().toISOString()` if not provided.

**Also update** the platform logo rendering in existing table rows — currently all rows show the LeetCode icon regardless of platform. Fix the table row component to render the correct `PlatformLogo` based on `problem.platform`.

Commit when done: `git add . && git commit -m "Add multi-platform support (Codeforces, GFG, HackerRank, CodeChef)"`