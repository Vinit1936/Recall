# recall.

**Spaced repetition for Data Structures & Algorithms. Solve once. Remember forever.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![YouTube Walkthrough](https://img.shields.io/badge/YouTube-Watch%20Demo-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://youtu.be/EF25DZDJ6gw)

**Live Demo:** [recallx.tech](https://recallx.tech) &nbsp;•&nbsp; **Video Walkthrough:** [YouTube (9 min)](https://youtu.be/EF25DZDJ6gw)

<div align="center">
  <video src="utils/demo.mp4" controls="controls" width="100%"></video>
  <p align="center">
    <sub>🎥 <strong>Watch the full walkthrough</strong>: <a href="https://youtu.be/EF25DZDJ6gw"><strong>YouTube Video Walkthrough</strong></a></sub>
  </p>
</div>

---

## The Problem

Solving a Data Structures & Algorithms problem once does not mean you will remember its core intuition weeks later under interview pressure. Without structured reinforcement, memory decays exponentially according to the forgetting curve. recall. automates spaced repetition so you review each problem right before you forget it.

![Forgetting Curve & Spaced Repetition Intervals](utils/Forgetting%20Curve.png)

---

## How It Works

recall. uses a deterministic, pure spaced repetition engine (`src/lib/scheduling.ts`) to manage problem revision intervals.

### The Revision Ladder
Every tracked problem climbs a 4-step interval ladder (`LADDER_DAYS = [3, 7, 14, 30]`):
- **Step 0:** Review in **3 days** (initial schedule for all new problems)
- **Step 1:** Review in **7 days**
- **Step 2:** Review in **14 days**
- **Step 3:** Review in **30 days**

### Confidence Ratings & State Transitions

#### 1. REGULAR Review (Active Problems)
- **`CLEAN`**:
  - If on **Step 0–2**: Advances to next step (`newStep: currentStep + 1`), scheduled for `today + LADDER_DAYS[nextStep]`.
  - If on **Step 3**: Transitions to **`MASTERED`** (`newStatus: 'MASTERED'`, `nextRevisionAt: null`), exiting the active revision queue.
- **`SHAKY`**: Retains current step (`newStep: currentStep`), repeating the current interval (`nextRevisionAt: today + LADDER_DAYS[currentStep]`).
- **`STRUGGLED`**: Resets completely to **Step 0** (`newStep: 0`), scheduled for review in **3 days** (`today + LADDER_DAYS[0]`).

#### 2. RECHECK Review (Mastered Problems Pulled Back)
When revising a previously mastered problem via "Revise again":
- **`CLEAN`**: Fast-forwards directly to **Step 3** (`today + 30 days`).
- **`SHAKY`**: Placed at **Step 1** (`today + 7 days`).
- **`STRUGGLED`**: Full reset to **Step 0** (`today + 3 days`).

### Lifecycle & Mechanics
- **`MASTERED` Trigger:** Scoring `CLEAN` on Step 3 during a `REGULAR` review.
- **Revise Again:** Pulls a `MASTERED` problem back into `ACTIVE` rotation at Step 0 (`nextRevisionAt: today + 3 days`) with a `RECHECK` revision flag (`reviseAgainFromMastered`).
- **`RETIRED` Trigger:** Manual user action (`retireProblem`) setting status to `RETIRED` and `nextRevisionAt: null`.
- **Overdue Handling:** `isDueToday` compares midnight-normalized dates (`due <= now`). Overdue problems never expire or drop off—they remain in the daily queue until revised.
- **Streak Calculation:** Aggregates `StreakLog` entries and `Revision` timestamps:
  - If today has a revision, counts contiguous active days backwards from today.
  - If today is pending but yesterday had a revision, the streak remains intact and counts backwards from yesterday.
  - If yesterday was missed, the streak resets to 0.

![The Revision Ladder](utils/Revision%20ladder.png)

---

## Features

- **Multi-Platform Support (`Platform` Enum):**
  - `LEETCODE`
  - `CODEFORCES`
  - `GFG`
  - `HACKERRANK`
  - `CODECHEF`
- **Instant Auto-Fill & Metadata Resolvers:**
  - **LeetCode:** In-memory $O(1)$ lookup across **2,800** problems by ID.
  - **Codeforces:** In-memory lookup across **11,335** problems by alphanumeric code (e.g., `4A`) or numeric ID.
  - **CodeChef:** In-memory lookup across **4,825** problems by problem code (e.g., `FLOW001`), numeric ID, title, or URL.
  - **GeeksforGeeks (GFG):** Local dataset mappings + regex fallback extracting slugs, titles, and difficulty from URLs.
  - **HackerRank:** Local dataset mappings + regex fallback extracting challenge slugs and titles from URLs.
- **Custom Columns & Dynamic Fields:**
  - Users can create and reorder custom column definitions (`UserColumnConfig`).
  - Problem values stored dynamically in a PostgreSQL `Json` column (`customFields`), with atomic read-modify-write updates (`PATCH /api/problems/[id]/custom-fields`).
- **Authentication (`src/auth.ts`):**
  - Powered by NextAuth.js v5 (Auth.js beta) with `@auth/prisma-adapter`.
  - Configured providers: **Google OAuth**, **GitHub OAuth**, and **Credentials** (email/password with `bcryptjs`).
  - Automatic account linking for existing user accounts.
- **Daily Revisions & Habit Tracking:**
  - Focused `/daily` review interface with rating cards.
  - Consecutive streak counter with daily completion detection.
  - 365-day revision activity heatmap (`/api/activity`) tracking active days and max streak.
- **Data Export:**
  - Full JSON backup download (`/api/export`) containing user profile, tracked problems, revision history, and streak logs.

<!-- DIAGRAM: architecture.png -->

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, Server & API Routes)
- **Language:** TypeScript 5
- **Database & ORM:** PostgreSQL (Neon Serverless), Prisma ORM 6.19
- **Authentication:** NextAuth.js v5 (Auth.js beta), `@auth/prisma-adapter`, `bcryptjs`
- **Styling:** Tailwind CSS 4, Radix/Base UI (`@base-ui/react`), Lucide React
- **Animation & UX:** Motion (Framer Motion), Lenis (smooth scroll), Three.js
- **Data Fetching:** SWR, Native Fetch

---

## Architecture Notes

- **Pluggable Platform Resolver Pattern:** Platform lookups implement the `PlatformResolver` interface (`resolve(identifier: string): ResolveResult`) and register in a central dictionary (`resolvers: Record<string, PlatformResolver>`), enabling instant multi-platform metadata extraction without external API latency.
- **Dynamic JSON Custom Fields:** Custom user attributes are stored inside a PostgreSQL `Json` column on the `Problem` model (`customFields Json? @default("{}")`), paired with `UserColumnConfig` for column layout, enabling dynamic schema customization without running database migrations.
- **Dual Neon Connection Setup:** Prisma handles connection pooling for serverless execution while keeping direct access for migrations:
  ```prisma
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
  }
  ```

---

## Database Schema & Data Models

- **`User`**: Core user accounts, hashed credentials, and NextAuth session/OAuth relations.
- **`Problem`**: Problem metadata, platform enum, current ladder step (`0–3`), status (`ACTIVE`, `MASTERED`, `RETIRED`), `nextRevisionAt` timestamp, and `customFields` JSON.
- **`Revision`**: Complete revision history logging timestamp, confidence rating (`CLEAN`, `SHAKY`, `STRUGGLED`), review type (`REGULAR`, `RECHECK`), and ladder step transitions (`stepBefore`, `stepAfter`).
- **`StreakLog`**: Daily activity completion tracking (`userId`, `date DateTime @db.Date`, `completed Boolean`).
- **`UserColumnConfig`**: Per-user custom column schemas and order configuration.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET`, `POST` | `/api/problems` | List problems with multi-filtering and sorting, or create a problem with auto-metadata resolution |
| `GET` | `/api/problems/due` | Fetch all problems currently due or overdue for revision |
| `GET`, `PATCH`, `DELETE` | `/api/problems/[id]` | Fetch, update problem metadata, or delete a tracked problem |
| `PATCH` | `/api/problems/[id]/revise` | Submit a revision confidence score (`CLEAN`, `SHAKY`, `STRUGGLED`) and advance the ladder |
| `PATCH` | `/api/problems/[id]/revise-again` | Pull a `MASTERED` problem back into active rotation as a `RECHECK` |
| `PATCH` | `/api/problems/[id]/retire` | Manually retire an active problem from revision rotation |
| `PATCH` | `/api/problems/[id]/custom-fields` | Update dynamic custom column key-value fields atomically |
| `GET`, `POST`, `DELETE` | `/api/columns` | List, create, or delete user custom column definitions |
| `GET` | `/api/activity` | Fetch 365-day revision activity counts for the heatmap |
| `GET` | `/api/streak` | Fetch current active streak and today's completion status |
| `GET` | `/api/export` | Download a complete JSON backup of problems, revisions, and streaks |

---

## Project Structure

```text
recall/
├── prisma/
│   └── schema.prisma          # PostgreSQL schema & Prisma client configuration
├── src/
│   ├── app/
│   │   ├── (app)/             # Authenticated views (/dashboard, /daily, /settings)
│   │   ├── (landing)/         # Marketing landing page & components
│   │   ├── api/               # Next.js App Router REST API endpoints
│   │   └── auth/              # Login, registration, and auth routes
│   ├── components/
│   │   ├── problems-table/    # Interactive table, cell editors, filters, and toolbar
│   │   ├── daily/             # Revision card deck and celebration screen
│   │   ├── heatmap/           # 365-day activity heatmap component
│   │   └── ui/                # Base UI components and design tokens
│   ├── data/                  # Pre-indexed offline problem catalogs
│   ├── lib/
│   │   ├── scheduling.ts      # Pure spaced repetition engine & interval calculations
│   │   ├── prisma.ts          # Global Prisma client singleton
│   │   └── platforms/         # Pluggable multi-platform problem metadata resolvers
│   └── auth.ts                # NextAuth.js v5 configuration & provider setup
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Vinit1936/Recall.git
cd Recall
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@endpoint-pooler.region.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@endpoint.region.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
AUTH_SECRET="your-auth-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 3. Database Migration

```bash
npx prisma db push
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Tests

```bash
npm test
```

---

## Author

Created by **Vinit Patil**

- **GitHub:** [github.com/Vinit1936](https://github.com/Vinit1936) • [recall. Repository](https://github.com/Vinit1936/Recall)
- **Twitter / X:** [@vinitpatil193](https://twitter.com/vinitpatil193)
- **LinkedIn:** [linkedin.com/in/vinitpatil19](https://www.linkedin.com/in/vinitpatil19/)
- **YouTube Walkthrough:** [youtu.be/EF25DZDJ6gw](https://youtu.be/EF25DZDJ6gw)

*Master algorithms through structured spaced repetition.*
