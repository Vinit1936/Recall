<div align="center">

# recall.

**Spaced repetition for Data Structures & Algorithms.**
*Solve once. Remember forever.*

[![Live Demo](https://img.shields.io/badge/demo-recallx.tech-ff6b00?style=flat-square)](https://recallx.tech)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

[**Live Demo**](https://recallx.tech) · [**Report an Issue**](https://github.com/Vinit1936/Recall/issues)

<!-- SCREENSHOT: dashboard table view -->
<!-- VIDEO LINK -->

</div>

---

## The problem

You solve a problem once. Three weeks later, in an actual interview, you've forgotten the trick. According to the Ebbinghaus forgetting curve, memory decays exponentially without reinforcement — up to 90% of what you learn is gone within a week if you don't revisit it.

Spreadsheets and Notion trackers don't fix this — they still require *you* to remember what to review and when. Recall automates that decision.

## What it does

Add a problem once. Recall schedules it for review at **+3 → +7 → +14 → +30 days**. Each time you review, you rate your recall as Clean, Shaky, or Struggled — the schedule adapts automatically. A dedicated Daily Revision queue tells you exactly what to review today. No manual tracking, ever.

**→ [Read the full scheduling algorithm](./docs/SCHEDULING.md)** — every rule, status, and edge case explained in detail.

## Features

- **Multi-platform** — LeetCode, Codeforces, GeeksforGeeks, HackerRank, and CodeChef, with a combined local dataset of 18,000+ indexed problems for instant auto-fill
- **Auto-fill everywhere** — type a problem ID and title, difficulty, and topic fill in automatically; falls back to a live LeetCode GraphQL lookup for anything not in the local dataset
- **Notion-style editable table** — inline editing, search, filters, custom user-defined columns, batch actions
- **Daily Revision queue + Focus Deck** — a focused, keyboard-driven review mode with a live timer
- **Streaks & activity heatmap** — a 365-day GitHub-style heatmap of your revision history
- **Auth** — Google, GitHub, and email/password via NextAuth.js, with automatic account linking
- **Full data export** — one-click JSON export of every problem, revision, and streak record you own

## Tech stack

**Next.js 16** (App Router) · **TypeScript** · **PostgreSQL** via **Prisma** · **NextAuth.js v5** · **Tailwind CSS** · **Motion** for animation · **SWR** for data fetching · **Vitest** for testing

## Architecture highlights

- **Pluggable platform resolvers** — every platform (LeetCode, Codeforces, etc.) implements a shared `PlatformResolver` interface, so adding a new platform means writing one resolver, not touching the core app. Large lookup datasets are resolved server-side and never shipped to the client.
- **Schema-less custom columns** — user-defined table columns don't require migrations. Column definitions live in `UserColumnConfig`; values are stored in a `Json` field on each problem, updated via atomic read-modify-write.
- **Dual-connection Neon setup** — a pooled connection (`DATABASE_URL`) handles all serverless runtime queries; a direct connection (`DIRECT_URL`) is reserved for Prisma migrations. Prevents connection exhaustion under load.

More detail on all three in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Getting started

```bash
git clone https://github.com/Vinit1936/Recall.git
cd Recall
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your-pooled-neon-connection-string"
DIRECT_URL="your-direct-neon-connection-string"
AUTH_SECRET="a-random-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional — Credentials (email/password) login works without these
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

```bash
npx prisma migrate dev
npm run dev
```

Open [localhost:3000](http://localhost:3000). Run tests with `npm test`.

## Project structure

```
src/
├── app/
│   ├── (app)/          # dashboard, daily revision, settings
│   ├── (landing)/      # public landing page
│   └── api/            # route handlers — problems, resolvers, auth, streak, activity
├── components/         # table, daily queue, heatmap, landing, auth
├── lib/
│   ├── scheduling.ts   # the spaced repetition engine — pure, fully tested
│   ├── platforms/      # one resolver per platform
│   └── prisma.ts       # Prisma client singleton
└── data/                # local problem datasets
```

## Roadmap

- [ ] CSV / Anki import
- [ ] Multiple problem lists (e.g. Blind 75, NeetCode 150 as separate tracked sets)
- [ ] Live lookup fallback for Codeforces / CodeChef / GFG (LeetCode already has this)
- [ ] Revision reminder notifications

## Author

**Vinit Patil** — [GitHub](https://github.com/Vinit1936) · [Twitter/X](https://twitter.com/vinitpatil193) · [LinkedIn](https://www.linkedin.com/in/vinitpatil19/)

---

<div align="center">
<sub>Built solo, for anyone who's ever re-solved a problem they swore they already knew.</sub>
</div>
