<div align="center">

# recall<span style="color: #ff6b00;">.</span>

**Spaced repetition system for Data Structures & Algorithms.**  
*Solve once. Remember forever.*

[![Live Demo](https://img.shields.io/badge/demo-recallx.tech-ff6b00?style=flat-square)](https://recallx.tech)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232a?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-white?style=flat-square)](LICENSE)

[**Live Demo (recallx.tech)**](https://recallx.tech) • [**Report Issue**](https://github.com/Vinit1936/Recall/issues)

</div>

---

### Why Recall?

Developers forget up to **70% of solved DSA problems within 48 hours** due to the Ebbinghaus forgetting curve. Grinding hundreds of problems without scheduled review leads to repeated forgetting and interview anxiety.

**Recall** calculates the exact date you need to revisit each problem before memory decays, turning short-term problem solving into long-term recall.

---

### Features

- **🧠 Automated Spaced Repetition** — Intervals scale dynamically based on recall confidence (`Clean`, `Shaky`, `Struggled`).
- **🌐 5-Platform Smart Resolver** — Paste URLs from **LeetCode**, **Codeforces**, **GFG**, **CodeChef**, or **HackerRank** to auto-import titles, numbers, difficulties, and topic tags (3,400+ indexed dataset).
- **📋 Notion-Style Problems Table** — Custom columns, tags, search, platform filters, sorting, inline notes, and bulk actions.
- **🎯 Daily Revision Deck** — Distraction-free daily queue showing problems due today.
- **🔥 Activity Heatmap & Streaks** — GitHub-style annual contribution heatmap and daily goal tracking.
- **⚡ Fast & Responsive** — Dark-mode glassmorphic UI built with Next.js 16, React 19, Motion, and Three.js.

---

### The Algorithm

Each problem advances through a progressive interval ladder:

```
Solve ───> [+3 Days] ───> [+7 Days] ───> [+14 Days] ───> [+30 Days] ───> Mastered 🏆
          (Step 0)       (Step 1)        (Step 2)        (Step 3)
```

- 🟢 **Clean** — Strong recall ➔ Advances to next step (`+3d` ➔ `+7d` ➔ `+14d` ➔ `+30d` ➔ **Mastered**).
- 🟡 **Shaky** — Partial recall ➔ Repeats current step interval (`+3d`, `+7d`, `+14d`, or `+30d`).
- 🔴 **Struggled** — Failed recall ➔ Resets to Step 0 (`+3d`).

---

### Supported Platforms

| Platform | Auto-Parse URL | Auto-Difficulty | Auto-Topic |
| :--- | :---: | :---: | :---: |
| **LeetCode** | ✅ | ✅ Easy / Med / Hard | ✅ |
| **Codeforces** | ✅ | ✅ Rating-based | ✅ |
| **GeeksforGeeks** | ✅ | ✅ School ➔ Hard | ✅ |
| **CodeChef** | ✅ | ✅ Star Rating | ✅ |
| **HackerRank** | ✅ | ✅ Easy / Med / Hard | ✅ |

---

### Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack) & React 19
- **Database & ORM**: PostgreSQL & Prisma ORM 6
- **Auth**: NextAuth.js v5 (Google, GitHub, Credentials)
- **Styling & Motion**: Tailwind CSS v4 & Motion (Framer Motion v12)
- **3D Background**: Three.js WebGL Grid Distortion
- **Testing**: Vitest

---

### Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/Vinit1936/Recall.git
cd Recall

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Run database migrations
npx prisma migrate dev

# 5. Start development server
npm run dev
```

#### Environment Variables (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/recall?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/recall?schema=public"

AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

---

### Testing

```bash
npm test
```

---

### License

MIT © [Vinit](https://github.com/Vinit1936)

