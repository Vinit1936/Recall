<div align="center">

# Recall

**Spaced repetition system for Data Structures & Algorithms.**  
*Solve once. Remember forever.*

[![Live Demo](https://img.shields.io/badge/demo-recallx.tech-ff6b00?style=flat-square)](https://recallx.tech)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-20232a?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

<!-- LIVE DEMO LINK -->
[**Live Demo (recallx.tech)**](https://recallx.tech) • [**GitHub Repository**](https://github.com/Vinit1936/Recall) • [**Report Issue**](https://github.com/Vinit1936/Recall/issues)

<!-- SCREENSHOT: dashboard table view -->
<!-- VIDEO LINK -->

</div>

---

## Pitch

Recall is an intelligent revision tracker built for software engineers practicing coding interview problems. When practicing algorithms across platforms like LeetCode, Codeforces, or GeeksforGeeks, solving a problem once is rarely enough to retain the core intuition weeks later under interview pressure. Recall eliminates the mental overhead of tracking what to review and when by running an automated spaced repetition engine behind an editable Notion-style table. You log a problem once, and the system automatically calculates progressive review dates tailored to how easily you remembered the solution.

---

## The Problem

Solving a complex data structures and algorithms (DSA) problem once does not guarantee you will remember the pattern weeks later during a technical interview. According to the Hermann Ebbinghaus forgetting curve, human memory decays exponentially after learning new information, causing learners to forget up to 90% of newly learned concepts within seven days if not reviewed at timely intervals. Traditional cramming and static spreadsheets require manual tracking and fail to adapt when you struggle with a concept. Recall intercepts this forgetting curve by scheduling reviews at strategically widening intervals right before memory decays.

---

## How It Works

Recall is powered by an exact, deterministic spaced repetition engine implemented in [`src/lib/scheduling.ts`](file:///d:/Recall/recall/src/lib/scheduling.ts). The algorithm operates on pure functions without side effects, calculating status transitions and next revision dates based on structured inputs.

### 1. The Revision Ladder

Every problem in the system climbs a 4-step interval ladder defined by `LADDER_DAYS = [3, 7, 14, 30]`:

* **Step 0**: Review scheduled in **3 days** (`+3 days`)
* **Step 1**: Review scheduled in **7 days** (`+7 days`)
* **Step 2**: Review scheduled in **14 days** (`+14 days`)
* **Step 3**: Review scheduled in **30 days** (`+30 days`)

When a new problem is added, `getInitialSchedule` places it at **Step 0** with its first revision due in **3 days** (`status: 'ACTIVE'`).

```
New Problem ───> [Step 0: +3d] ───> [Step 1: +7d] ───> [Step 2: +14d] ───> [Step 3: +30d] ───> MASTERED
```

---

### 2. Confidence Ratings

When completing a revision in the Daily Revision queue or Focus Deck, the user rates their recall using one of three `Confidence` levels:

* **`CLEAN`**:
  * **Regular Revision (`REGULAR`)**: Advances the problem to the next ladder step (e.g., Step 0 &rarr; Step 1 in 7 days, Step 1 &rarr; Step 2 in 14 days, Step 2 &rarr; Step 3 in 30 days). If the problem is already at **Step 3**, a `CLEAN` rating graduates the problem to **`MASTERED`** status and sets `nextRevisionAt` to `null`, removing it from the active daily rotation.
  * **Mastered Recheck (`RECHECK`)**: If a mastered problem is being rechecked and aced with `CLEAN`, it fast-forwards directly to **Step 3** (`nextRevisionAt = today + 30 days`, status remains `ACTIVE`).
* **`SHAKY`**:
  * **Regular Revision (`REGULAR`)**: The problem was solved, but with hesitation. The problem stays at its current ladder step (`newStep = currentStep`) and repeats the same interval from today (e.g., at Step 2, next review is scheduled in 14 days).
  * **Mastered Recheck (`RECHECK`)**: Places the problem mid-ladder at **Step 1** (`nextRevisionAt = today + 7 days`, status `ACTIVE`).
* **`STRUGGLED`**:
  * **Regular Revision (`REGULAR`)**: The intuition or implementation failed. Regardless of whether the problem was at Step 0, Step 1, Step 2, or Step 3, the problem resets completely back to **Step 0** (`newStep = 0`, `nextRevisionAt = today + 3 days`, status `ACTIVE`).
  * **Mastered Recheck (`RECHECK`)**: Mastery was lost; resets completely to **Step 0** (`newStep = 0`, `nextRevisionAt = today + 3 days`, status `ACTIVE`).

---

### 3. Problem Status

Every problem is in one of three `ProblemStatus` states:

* **`ACTIVE`**: The problem is currently part of the active spaced repetition rotation and has a scheduled `nextRevisionAt` date.
* **`MASTERED`**: The problem has successfully completed the entire ladder by receiving a `CLEAN` rating at **Step 3**. Its `nextRevisionAt` becomes `null`, and it leaves the daily revision queue. A mastered problem can be reintroduced into rotation at any time using the "Revise again" action (`reviseAgainFromMastered`), which resets it to Step 0, sets `nextRevisionAt = today + 3 days`, sets status to `ACTIVE`, and tags the revision as `RECHECK`.
* **`RETIRED`**: The problem was manually removed from rotation by the user (via `retireProblem`). Its `nextRevisionAt` is set to `null`, and it will never appear in daily revisions unless manually reactivated. A problem can be retired at any time regardless of its current step or status.

---

### 4. Revision Types

The `RevisionType` enum distinguishes the origin of a review:

* **`REGULAR`**: Standard scheduled review as a problem climbs the ladder from Step 0 to Step 3.
* **`RECHECK`**: Triggered when a `MASTERED` problem is manually pulled back into active rotation via `reviseAgainFromMastered()`. The next submission uses the `RECHECK` branch in `applyRevision`, allowing problems to fast-forward to Step 3 if rated `CLEAN`, jump to Step 1 if rated `SHAKY`, or reset to Step 0 if rated `STRUGGLED`.

---

### 5. Overdue Handling

The `isDueToday(nextRevisionAt, today)` utility strips time components and checks if `nextRevisionAt <= today`.
* If a scheduled revision date passes without review, the problem does **not** disappear, expire, or skip steps.
* The API endpoint `GET /api/problems/due` returns all problems where `status == 'ACTIVE'` and `nextRevisionAt <= now`, explicitly flagging problems where `nextRevisionAt < todayMidnight` as `isOverdue: true`.
* Overdue problems accumulate in the daily queue until cleared. When an overdue problem is revised, its next revision date is calculated starting from **the day it was actually revised (`today`)**, not the original due date.

---

### 6. Streak Logic

The streak counter tracks daily consistency through the `StreakLog` model and problem revisions:
* Whenever a revision is submitted via `PATCH /api/problems/[id]/revise`, an entry in `StreakLog` for `(userId, date)` is automatically upserted with `completed: true`.
* The `GET /api/streak` endpoint aggregates all unique calendar dates containing completed `StreakLog` entries or recorded `Revision` records.
* **Active Streak**: If today has activity (`todayCompleted = true`), the streak counter counts backwards day-by-day starting from today.
* **Pending Streak**: If today has no activity yet but yesterday was completed (`yesterdayCompleted = true`), the streak remains intact (counting backwards from yesterday) while displaying today as pending.
* **Reset**: If neither today nor yesterday has recorded activity, the streak resets to `0`.

---

## Features

* **Multi-Platform Support**: Built-in support for five major coding platforms (`Platform` enum: `LEETCODE`, `CODEFORCES`, `GFG`, `HACKERRANK`, `CODECHEF`).
* **Pluggable Auto-Fill & Resolver System**:
  * Resolves problem numbers, codes, URLs, and titles against local indexed JSON datasets:
    * **Codeforces**: 11,335 problems indexed (supports problem codes like `"4A"`, `"158A"` or numeric IDs).
    * **CodeChef**: 4,825 problems indexed (supports problem codes like `"FLOW001"`, URLs, numeric IDs, or problem titles).
    * **LeetCode**: 2,800 problems indexed (supports problem IDs / numbers).
    * **GeeksforGeeks**: Seed dataset + dynamic URL slug parser (extracts title, sets default difficulty `MEDIUM`, hashes slug to numeric ID).
    * **HackerRank**: Seed dataset + dynamic URL slug parser (extracts title, sets default difficulty `EASY`, hashes slug to numeric ID).
  * **Live GraphQL Fallback**: If a LeetCode problem is not found in the local dataset, `POST /api/leetcode/lookup` fetches live metadata directly from LeetCode's public GraphQL API using the problem's `titleSlug`.
  * **Manual Fallback**: Custom problems or manual entries can be created by supplying title, difficulty (`EASY`, `MEDIUM`, `HARD`), and URL.
* **Notion-Style Problem Table**:
  * Inline editing for problem titles, topics, difficulties, notes, favorite toggles, and status.
  * Status tabs: `All`, `Active`, `Mastered`, `Retired`.
  * Search by title, topic, or problem number.
  * Filters for platform, difficulty, and topic.
  * Batch selection with multi-row deletion.
* **Dynamic Custom Columns**:
  * Users can create custom columns saved in `UserColumnConfig` (`GET /api/columns`, `POST /api/columns`, `DELETE /api/columns`).
  * Field values are saved per problem in the `Problem.customFields` JSON column (`PATCH /api/problems/[id]/custom-fields`).
* **Daily Revision Queue & Focus Deck**:
  * Dedicated `/daily` dashboard view showing problems due today and overdue problems.
  * Interactive **Focus Deck** card mode with keyboard shortcuts, timer, and one-click confidence grading.
  * Stats strip displaying total due problems and current streak with animated flame indicator.
* **Annual Activity Heatmap**:
  * GitHub-style 365-day revision heatmap (`GET /api/activity`) tracking daily revision intensity, total revisions, and maximum streaks.
* **Authentication**:
  * NextAuth.js v5 (beta) with JWT session strategy and Prisma adapter.
  * Supported providers configured in [`src/auth.ts`](file:///d:/Recall/recall/src/auth.ts):
    * **Google OAuth** (`GoogleProvider`)
    * **GitHub OAuth** (`GitHubProvider`)
    * **Email & Password Credentials** (`CredentialsProvider`) with `bcryptjs` hashing.
  * Automatic OAuth account linking for matching email addresses.
* **Data Backup & Export**:
  * One-click full JSON export via `GET /api/export` containing all user problems, full revision history, and streak logs.

---

## Tech Stack

### Core Dependencies

* **Framework**: [Next.js](https://nextjs.org/) `16.2.9` (App Router, Server Components & Route Handlers)
* **UI Library**: [React](https://react.dev/) `19.2.4` / [React DOM](https://react.dev/) `19.2.4`
* **Language**: [TypeScript](https://www.typescriptlang.org/) `5.x`
* **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma Client](https://www.prisma.io/) `6.19.3` & Prisma CLI `6.19.3`
* **Authentication**: [NextAuth.js](https://authjs.dev/) `5.0.0-beta.31`, [`@auth/prisma-adapter`](https://www.npmjs.com/package/@auth/prisma-adapter) `2.11.2`, [`bcryptjs`](https://www.npmjs.com/package/bcryptjs) `3.0.3`
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) `4.x` ([`@tailwindcss/postcss`](https://www.npmjs.com/package/@tailwindcss/postcss) `4.x`), [`tw-animate-css`](https://www.npmjs.com/package/tw-animate-css) `1.4.0`
* **UI Primitives & Styling Utilities**: [`@base-ui/react`](https://base-ui.com/) `1.6.0`, [`shadcn`](https://ui.shadcn.com/) `4.12.0`, [`clsx`](https://www.npmjs.com/package/clsx) `2.1.1`, [`tailwind-merge`](https://www.npmjs.com/package/tailwind-merge) `3.6.0`, [`class-variance-authority`](https://cva.style/) `0.7.1`
* **Icons & Animation**: [`lucide-react`](https://lucide.dev/) `1.23.0`, [`motion`](https://motion.dev/) `12.42.2` (Motion / Framer Motion v12), [`lenis`](https://lenis.darkroom.engineering/) `1.3.26`
* **3D Visuals & Graphics**: [`three`](https://threejs.org/) `0.185.1`, [`postprocessing`](https://www.npmjs.com/package/postprocessing) `6.39.4`
* **Data Fetching & Dates**: [`swr`](https://swr.vercel.app/) `2.4.2`, [`date-fns`](https://date-fns.org/) `4.4.0`
* **Testing**: [Vitest](https://vitest.dev/) `4.1.9`

---

## Architecture Notes

### 1. Pluggable Platform Resolver Architecture
Platform auto-fill logic is decoupled through the `PlatformResolver` interface in [`src/lib/platforms/types.ts`](file:///d:/Recall/recall/src/lib/platforms/types.ts):

```typescript
export interface PlatformResolver {
  resolve(identifier: string): ResolveResult;
}
```

Resolvers are registered centrally in [`src/lib/platforms/index.ts`](file:///d:/Recall/recall/src/lib/platforms/index.ts). Server-side API endpoints (`/api/leetcode/resolve`, `/api/codeforces/resolve`, etc.) execute resolution on the server, ensuring massive lookup datasets (over 18,000 problems across platforms) are never shipped in client bundles.

### 2. Flexible JSON Custom Fields vs Rigid Schema
Rather than requiring database migrations each time a user creates a new table column, custom columns are managed through two lightweight mechanisms:
1. `UserColumnConfig` table stores the user's defined column names and display order.
2. `Problem.customFields` stores the values in a PostgreSQL `Json` field (`@default("{}")`). Updates are performed using atomic read-modify-write transactions in `PATCH /api/problems/[id]/custom-fields`.

### 3. Dual Connection Neon Database Setup
In [`prisma/schema.prisma`](file:///d:/Recall/recall/prisma/schema.prisma), Prisma is configured with dual connection strings to support serverless pooling (PgBouncer/Neon):

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```
* `DATABASE_URL`: Uses the pooled connection string with connection limits for serverless Next.js API route handlers.
* `DIRECT_URL`: Uses the direct PostgreSQL connection for running Prisma CLI migrations (`npx prisma migrate dev`).
* [`src/lib/prisma.ts`](file:///d:/Recall/recall/src/lib/prisma.ts) implements a `globalThis` singleton pattern to prevent client duplication during Next.js hot-reloads.

---

## Getting Started

### Prerequisites

* **Node.js**: `18.18+` or `20+` (`Node.js 20+` recommended)
* **Package Manager**: `npm` (or `pnpm` / `yarn`)
* **PostgreSQL Database**: Local PostgreSQL instance or a cloud database like [Neon](https://neon.tech) / [Supabase](https://supabase.com).

### 1. Clone & Install

```bash
git clone https://github.com/Vinit1936/Recall.git
cd Recall
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database Connections (Neon / PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.region.neon.tech/recall?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@ep-sample.region.neon.tech/recall?sslmode=require"

# NextAuth / Auth.js Configuration
AUTH_SECRET="your-generated-secret-key-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional for local development; Credentials login works out of the box)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 3. Run Database Migrations

Apply Prisma schema migrations to your database:

```bash
npx prisma migrate dev
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Tests

Run the test suite with Vitest:

```bash
npm test
```

---

## Project Structure

```
recall/
├── prisma/
│   ├── schema.prisma            # Prisma schema: models, enums, dual-connection datasource
│   └── migrations/              # SQL migration history
├── public/                      # Static assets & icons
├── src/
│   ├── app/
│   │   ├── (app)/               # Authenticated application routes
│   │   │   ├── daily/           # Daily revision queue & focus deck page
│   │   │   ├── dashboard/       # Main Notion-style problems table view
│   │   │   └── settings/        # User profile, preferences, and JSON backup export
│   │   ├── (landing)/           # Public landing page with interactive demos
│   │   ├── api/                 # Next.js route handlers
│   │   │   ├── activity/        # 365-day revision history for heatmap
│   │   │   ├── auth/            # Auth.js handlers & email/password signup
│   │   │   ├── codechef/        # CodeChef resolver endpoint
│   │   │   ├── codeforces/      # Codeforces resolver endpoint
│   │   │   ├── columns/         # Custom column configuration CRUD
│   │   │   ├── export/          # Full user data JSON export endpoint
│   │   │   ├── gfg/             # GeeksforGeeks resolver endpoint
│   │   │   ├── hackerrank/      # HackerRank resolver endpoint
│   │   │   ├── leetcode/        # LeetCode resolve & live GraphQL lookup
│   │   │   ├── problems/        # Problem CRUD, due list, revise, retire, revise-again
│   │   │   ├── settings/        # Profile and preference update endpoint
│   │   │   └── streak/          # Daily streak calculation endpoint
│   │   ├── auth/                # Login and register pages
│   │   ├── layout.tsx           # Root layout & font configuration
│   │   └── globals.css          # Global styling & Tailwind directives
│   ├── components/
│   │   ├── auth/                # Login, signup, and mobile auth components
│   │   ├── daily/               # Daily queue, focus deck card, stats strip, all-done screen
│   │   ├── heatmap/             # 365-day contribution activity grid & streak stats
│   │   ├── landing/             # Landing page hero, science, demos, and footer
│   │   ├── problems-table/      # Editable table, toolbar, new row input, custom columns
│   │   └── ui/                  # Reusable UI primitives
│   ├── data/                    # Local JSON datasets for problem resolvers
│   ├── hooks/                   # Custom React hooks (e.g. useMediaQuery)
│   ├── lib/
│   │   ├── platforms/           # Platform resolver implementations & lookup index
│   │   ├── prisma.ts            # Global Prisma Client singleton
│   │   └── scheduling.ts        # Pure spaced repetition engine & interval calculations
│   └── types/                   # Shared TypeScript type definitions
├── package.json
└── tsconfig.json
```

---

## Roadmap

The following items are planned improvements not yet implemented in the codebase:

* [ ] **CSV / Anki / Excel Import**: Ability to bulk-import problems and history from spreadsheets or Anki decks (currently only JSON export via `GET /api/export` is implemented).
* [ ] **Multiple Custom Problem Lists**: Support for organizing problems into custom categorized folders/lists (e.g., "Blind 75", "NeetCode 150", "Company Tagged") rather than a single unified list.
* [ ] **Direct Live API Fallbacks for Codeforces / CodeChef / GFG**: Live web-scraping or API lookup for newly published problems on non-LeetCode platforms.
* [ ] **Automated Revision Reminder Notifications**: Optional email or push notifications when daily revision problems become due.

---

## Contributing & Contact

Contributions, bug reports, and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contact & Links

* **Author**: Vinit Patil
* **GitHub**: [@Vinit1936](https://github.com/Vinit1936)
* **Twitter / X**: [@vinitpatil193](https://twitter.com/vinitpatil193)
* **LinkedIn**: [vinitpatil19](https://www.linkedin.com/in/vinitpatil19/)
* **Instagram**: [@vinit.patil19](https://instagram.com/vinit.patil19)
* **Repository**: [https://github.com/Vinit1936/Recall](https://github.com/Vinit1936/Recall)
