<div align="center">

# recall<span style="color: #ff6b00;">.</span>

**Spaced Repetition System for Data Structures & Algorithms**

*Solve once. Remember forever.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-green?style=flat-square&logo=auth0)](https://authjs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[**Explore Live Demo (recallx.tech)**](https://recallx.tech) • [**Report Bug**](https://github.com/Vinit1936/Recall/issues) • [**Request Feature**](https://github.com/Vinit1936/Recall/issues)

</div>

---

## 📑 Table of Contents

- [The Problem](#-the-problem)
- [Key Features](#-key-features)
- [How Spaced Repetition Works](#-how-spaced-repetition-works)
- [Multi-Platform Support](#-multi-platform-support)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Running Tests](#-running-tests)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## ⚡ The Problem

According to the **Ebbinghaus Forgetting Curve**, developers forget up to **70% of newly learned algorithms within 48 hours** if not reviewed systematically. 

Grinding hundreds of LeetCode problems without a structured revision schedule leads to wasted effort, repetitive forgetting, and pre-interview panic. **Recall** fixes this by mathematically scheduling your revisions at the exact moment decay begins.

---

## ✨ Key Features

### 🧠 Automated Spaced Repetition Engine
- Calculates optimal review intervals based on past retention and user feedback (`Clean`, `Shaky`, `Struggled`).
- Progressive interval ladder (`+3d` → `+7d` → `+14d` → `+30d` → `Mastered`).
- Smart penalty recalculations for forgotten or difficult problems.

### 🌐 Universal Problem URL Resolution
- Paste problem links from **LeetCode**, **Codeforces**, **GeeksforGeeks (GFG)**, **CodeChef**, or **HackerRank**.
- Automatically extracts problem number, canonical title, difficulty level, and primary topic tag.
- Pre-indexed database of **3,400+ problems** for zero-latency lookups.

### 📊 Notion-Grade Problems Table
- Fast, full-text client & server searching and multi-attribute filtering (Difficulty, Topic, Platform, Status).
- Dynamic custom column creation & ordering per user.
- Inline notes, favorite stars, and multi-row batch actions (Batch Master, Batch Retire, Batch Delete).
- One-click CSV exports for offline backup.

### 🎯 Daily Focus Revision Queue
- Dedicated daily view highlighting problems due for revision today.
- One-click confidence logging with instant schedule progression.
- Clean, distraction-free cards with full platform link integrations.

### 🔥 Streak Engine & Activity Heatmap
- GitHub-style interactive annual activity heatmap.
- Streak counter and daily goal target tracking (3, 5, 8, or 10 problems/day).

### 📱 Responsive & Motion-Rich Experience
- Custom dark theme built with glassmorphism and subtle micro-interactions.
- Three.js WebGL interactive grid distortion background on desktop auth.
- 100% mobile-optimized layouts with touch-native interactions.

---

## 🔬 How Spaced Repetition Works

```mermaid
flowchart TD
    A[Solve Problem] --> B[Initial Schedule: Step 0 (+3 Days)]
    B --> C{Daily Revision Review}
    C -->|Confidence: Clean| D[Advance Step: +7d -> +14d -> +30d]
    C -->|Confidence: Shaky| E[Repeat Current Step Interval]
    C -->|Confidence: Struggled| F[Reset to Step 0: Revise in +3 Days]
    D -->|Step 3 Clean Passed| G[Status: Mastered 🏆]
    E --> C
    F --> C
```

| Confidence Level | Effect on Schedule | Next Interval |
| :--- | :--- | :--- |
| **Clean** 🟢 | Strong recall. Advances to the next step on the ladder. | `+3d` (Step 0) ➔ `+7d` (Step 1) ➔ `+14d` (Step 2) ➔ `+30d` (Step 3) ➔ **Mastered** |
| **Shaky** 🟡 | Partial recall. Repeats the current step's interval duration. | Repeats current interval (`+3d`, `+7d`, `+14d`, or `+30d`) |
| **Struggled** 🔴 | Failed recall. Fully resets ladder back to Step 0. | Resets to Step 0 (`+3d`) |

---

## 🌐 Multi-Platform Support

Recall features native metadata parsers and resolvers for all major competitive programming and interview prep platforms:

| Platform | URL Resolver | Auto-Topic Tagging | Auto-Difficulty |
| :--- | :---: | :---: | :---: |
| **LeetCode** | ✅ Supported | ✅ Supported | ✅ Easy / Medium / Hard |
| **Codeforces** | ✅ Supported | ✅ Supported | ✅ Rating-based Mapping |
| **GeeksforGeeks** | ✅ Supported | ✅ Supported | ✅ School → Hard |
| **CodeChef** | ✅ Supported | ✅ Supported | ✅ Star/Difficulty Mapping |
| **HackerRank** | ✅ Supported | ✅ Supported | ✅ Easy / Medium / Hard |

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **Frontend UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), Custom Design System |
| **Animations & 3D** | [Motion (Framer Motion v12)](https://motion.dev/), [Three.js](https://threejs.org/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM 6](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v5 (Auth.js)](https://authjs.dev/) (Google, GitHub, Credentials) |
| **State & Fetching** | [SWR](https://swr.vercel.app/) with Optimistic UI & Local Caching |
| **Testing** | [Vitest](https://vitest.dev/) (Unit & Integration Tests) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📐 System Architecture

```
                               ┌─────────────────────────┐
                               │   Next.js 16 Frontend   │
                               │  (React 19 + SWR Cache) │
                               └────────────┬────────────┘
                                            │
                                  HTTPS / REST / Actions
                                            │
                               ┌────────────▼────────────┐
                               │     Next.js API &       │
                               │    Auth Proxy Layer     │
                               └────────────┬────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
         ┌──────────▼──────────┐ ┌──────────▼──────────┐ ┌──────────▼──────────┐
         │ NextAuth v5 Session │ │  Problem Resolvers  │ │  Spaced Repetition  │
         │  (JWT / OAuth 2.0)  │ │ (5 External Scrapers│ │   Algorithm Core    │
         └──────────┬──────────┘ └──────────┬──────────┘ └──────────┬──────────┘
                    │                       │                       │
                    └───────────────────────┼───────────────────────┘
                                            │
                               ┌────────────▼────────────┐
                               │      Prisma ORM 6       │
                               └────────────┬────────────┘
                                            │
                               ┌────────────▼────────────┐
                               │    PostgreSQL Database  │
                               └─────────────────────────┘
```

---

## 📂 Directory Structure

```
recall/
├── prisma/
│   ├── schema.prisma              # Prisma schema definition
│   └── migrations/                # SQL migration history
├── public/                        # Static assets, platform logos, icons
├── scripts/                       # Dataset generators & scraper scripts
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (app)/                 # Authenticated application group
│   │   │   ├── daily/             # Daily revision focus deck
│   │   │   ├── dashboard/         # Full problems table & filters
│   │   │   └── settings/          # User preferences & account settings
│   │   ├── (landing)/             # Marketing homepage & showcase
│   │   ├── api/                   # REST API routes (Problems, Sync, Auth)
│   │   ├── auth/                  # Login & authentication routes
│   │   ├── globals.css            # Global CSS & Tailwind imports
│   │   ├── mobile.css             # Dedicated mobile responsive style system
│   │   └── proxy.ts               # Next.js 16 Auth boundary & route proxy
│   ├── components/                # React UI components
│   │   ├── app/                   # App navigation & shells
│   │   ├── auth/                  # Desktop & Mobile authentication forms
│   │   ├── daily/                 # Daily revision queue deck components
│   │   ├── heatmap/               # Activity contribution heatmap
│   │   ├── landing/               # Landing page presentation components
│   │   ├── problems-table/        # Data grid, custom columns, toolbar
│   │   └── ui/                    # Base UI components (Buttons, Inputs, 3D)
│   ├── data/                      # Pre-indexed problem datasets (JSON)
│   ├── hooks/                     # Custom React hooks (Media queries, Stores)
│   ├── lib/                       # Core business logic & helpers
│   │   ├── platforms/             # Platform scraper & resolver implementations
│   │   ├── prisma.ts              # Global Prisma client instance
│   │   ├── scheduling.ts          # Spaced repetition calculation algorithm
│   │   └── swr-cache.ts           # SWR caching & synchronization layer
│   └── types/                     # TypeScript definitions & ambient types
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**, **pnpm**, or **yarn**
- **PostgreSQL Database** (local instance or cloud like Supabase / Neon / Railway)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vinit1936/Recall.git
   cd Recall
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Connections
DATABASE_URL="postgresql://user:password@localhost:5432/recall?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/recall?schema=public"

# NextAuth / Auth.js Configuration
AUTH_SECRET="your-super-secret-auth-key-generate-via-openssl"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional for local credentials test)
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"
```

> 💡 *Tip: You can generate a secure `AUTH_SECRET` using `openssl rand -base64 32`.*

### Database Setup

Run Prisma migrations to create the database tables:

```bash
npx prisma migrate dev --name init
```

### Running the App

Start the development server with Turbopack:

```bash
npm run dev
```

Open [**http://localhost:3000**](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

Recall includes a unit and integration test suite powered by [Vitest](https://vitest.dev/):

```bash
# Run all test suites
npm test

# Run tests in watch mode
npx vitest

# Run tests with code coverage report
npx vitest run --coverage
```

Test coverage includes:
- Spaced repetition algorithm interval logic (`scheduling.test.ts`)
- Multi-platform problem URL parsers (`leetcode.test.ts`, `codeforces.test.ts`, `gfg.test.ts`, `codechef.test.ts`, `hackerrank.test.ts`)

---

## 🗄 Database Schema

The core database architecture consists of:
- **`User`**: Account profiles, OAuth connections, and preferences.
- **`Problem`**: Indexed problems per user with platform metadata, current review step, notes, and custom fields.
- **`Revision`**: Complete historical audit log of every revision attempt, confidence level, and interval delta.
- **`StreakLog`**: Daily activity completion entries powering the streak engine and heatmap.
- **`UserColumnConfig`**: Custom dynamic table columns configured by each user.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m 'feat: add amazing feature'`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Vinit1936">Vinit</a> for students and engineers mastering DSA.</sub>
</div>

