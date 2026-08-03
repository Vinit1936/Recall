# 🚦 Deployment Readiness Report — Recall

**Generated:** 2026-08-03 · **Skill:** checkmyvibe  
**Stack:** Next.js 15 · Prisma ORM · PostgreSQL (Neon) · NextAuth v5 (Auth.js) · Google + GitHub OAuth + Credentials provider  
**Data handled:** User accounts (email, hashed passwords, OAuth tokens), problem-solving history, revision schedules. No payment or health data found.

---

## Check 1: Exposed Secrets and Credentials

### 🔴 [Critical] Real credentials stored in `.env` — rotate all of them before going live

- **What's wrong:** The `.env` file contains live, working credentials — a real database connection string with a username and password, a real session signing secret, real Google OAuth client ID and secret, and a real GitHub OAuth client ID and secret. While this file is correctly gitignored (so it won't be pushed to GitHub), the values are real and should be treated with care.
- **Why it matters:** If this `.env` file is ever accidentally committed, shared, copied to a server without proper access controls, or leaked in any other way, anyone who gets it can: connect directly to your Neon database (read and delete all user data), impersonate your app with Google and GitHub OAuth (intercept user logins), and forge any session token in your app.
- **The fix:**
  1. **Before deploying to production**, rotate every secret in this file:
     - Go to [console.neon.tech](https://console.neon.tech) → your project → rotate/regenerate the database password
     - Go to [console.cloud.google.com](https://console.cloud.google.com) → OAuth credentials → regenerate the client secret
     - Go to [github.com/settings/applications](https://github.com/settings/applications) → your OAuth app → reset the client secret
     - Generate a new `AUTH_SECRET` with: `openssl rand -base64 32`
  2. On your hosting platform (Vercel/Railway/etc.), inject these as **environment variables**, not a committed file.
- **File(s):** `.env` (lines 4, 7, 11, 13, 17–22)

> **Note:** The automated scanner flagged many high-entropy strings in `package-lock.json` — these are normal package integrity hashes (safe, not secrets). It also flagged `package.json:25` for a key named `auth` — that is a script entry and not a credential. `src/components/daily/problem-row.tsx:122` flagged a React component `key` prop — also not a secret. All of those are **false positives** and can be ignored.

---

## Check 2: `.gitignore` Hygiene

### ✅ Pass — `.env` is correctly gitignored

- The `.gitignore` uses the glob `.env*` which covers `.env`, `.env.local`, `.env.production`, etc. All standard secret file patterns are covered.
- `git log` confirms the `.env` file has **never been committed** to the repository history. The credentials are not in git history.

---

## Check 3: Authentication

### ✅ No stub or fake auth found

- The automated script found no patterns like `mockAuth`, `fakeLogin`, `return true`, or bypassed auth guards.
- All API endpoints check `const session = await auth()` and gate on `session?.user?.id` before touching the database. This is the correct pattern.
- A global middleware (`src/proxy.ts`) runs on every request, redirecting unauthenticated page visits to `/auth/login` and returning a JSON 401 for unauthenticated API calls.
- Password hashing uses `bcrypt` with a cost factor of 12 — appropriately strong.
- Session tokens are JWTs; the user's ID is stored in the token sub-claim, not in a cookie the user could tamper with.

### ⚠️ [Should Fix] Auth cookies are set with `secure: false`

- **What's wrong:** In `src/auth.ts` (lines 21 and 30), the `secure: false` option is set explicitly on the PKCE and state cookies. The comment says "must be false for http://localhost."
- **Why it matters:** On `localhost` during development this is harmless. But if this config ships unchanged to a production server running over HTTPS, those auth-related cookies will not be marked as `Secure` — meaning they could theoretically be transmitted over an unencrypted HTTP connection.
- **The fix:** Make `secure` conditional on the environment:
  ```ts
  // In src/auth.ts
  cookies: {
    pkceCodeVerifier: {
      name: 'authjs.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    state: {
      name: 'authjs.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  ```
- **File(s):** `src/auth.ts` lines 21, 30

---

## Check 4: Database Configuration

### ✅ Pass — No misconfigured database rules found

- The project uses Prisma ORM with a self-managed PostgreSQL database (Neon). There is no Supabase or Firebase involved, so row-level security policies and permissive Firebase rules do not apply here.
- Authorization is enforced at the application layer: every database query includes a `userId` filter tied to the authenticated session.
- The automated script found no misconfigurations in configuration files.

---

## Check 5: Broken Object-Level Authorization (IDOR)

### ✅ No IDOR vulnerabilities found

Every route that touches a record by ID was reviewed:

| Route | ID Param | User ownership check? |
|---|---|---|
| `PATCH /api/problems/[id]` | `params.id` | ✅ `findFirst({ where: { id, userId } })` before update |
| `DELETE /api/problems/[id]` | `params.id` | ✅ `findFirst({ where: { id, userId } })` before delete |
| `DELETE /api/problems` (bulk) | `body.ids[]` | ✅ `deleteMany({ where: { id: { in: ids }, userId } })` |
| `DELETE /api/columns` | query `?id=` | ✅ `findFirst({ where: { id, userId } })` before delete |
| `GET /api/problems` | — (list) | ✅ `findMany({ where: { userId } })` |
| `GET /api/problems/due` | — | ✅ `findMany({ where: { userId, ... } })` |
| `GET /api/activity` | — | ✅ session userId filter throughout |
| `GET /api/streak` | — | ✅ `findMany({ where: { userId } })` |

All ID-based mutations verify ownership before acting. No IDOR risk found.

---

## Check 6: Input Validation

### ✅ Core inputs are validated

- Signup route validates email presence, password length (≥ 8 chars), and checks for duplicate accounts.
- Problem creation validates required fields (`platform`, `title`, `difficulty`, `url`) and validates difficulty against an enum allowlist before writing to the database.
- Column creation validates that `name` is a non-empty string.

### ⚠️ [Worth Reviewing] `POST /api/leetcode/lookup` has no in-route authentication check

- **What's wrong:** This route does not call `auth()` and does not require the user to be logged in. It is protected by the global middleware (`src/proxy.ts`) which guards all `/api/*` routes — so it IS protected in practice. However, this is an implicit dependency on middleware rather than an explicit in-route check. `GET /api/leetcode/resolve` shares this pattern.
- **Why it matters:** If the middleware matcher ever changes or these routes are moved, they would become publicly accessible. Since they only proxy to LeetCode's public API, real-world impact is limited — but defense-in-depth is better practice.
- **The fix:** Add an auth guard at the top of each handler:
  ```ts
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  ```
- **File(s):** `src/app/api/leetcode/lookup/route.ts`, `src/app/api/leetcode/resolve/route.ts`

### ⚠️ [Worth Reviewing] No length cap on `titleSlug` input

- **What's wrong:** The `titleSlug` field passed to `POST /api/leetcode/lookup` has no maximum length validation beyond a type check.
- **The fix:**
  ```ts
  if (!titleSlug || typeof titleSlug !== 'string' || titleSlug.length > 200) {
    return NextResponse.json({ error: 'titleSlug required' }, { status: 400 });
  }
  ```
- **File(s):** `src/app/api/leetcode/lookup/route.ts` line 29

---

## Check 7: Client-Side Payment or Pricing Logic

### ✅ Not applicable

No payment, billing, or pricing logic was found in the codebase. No Stripe integration, no checkout flows, no price fields. This check does not apply.

---

## Final Summary

**Stack:** Next.js 15 + Prisma + PostgreSQL (Neon) + NextAuth v5. Handles user accounts and problem-solving history. No payment or regulated health data.

| Severity | Count | Items |
|---|---|---|
| 🔴 Critical | 1 | Live credentials in `.env` — rotate before going live |
| ⚠️ Should Fix | 1 | Auth cookies hard-coded `secure: false` |
| 📝 Worth Reviewing | 3 | Missing in-route auth on 2 LeetCode API routes; no length cap on `titleSlug` |

**Verdict: Not ready to ship as-is — fix the Critical item first (rotate all credentials and inject them via environment variables on your hosting platform), then apply the Should Fix for auth cookie security. The Worth Reviewing items are low-urgency and can be addressed in a follow-up commit.**

---

> **Scope reminder:** This review covers common configuration patterns seen in AI-generated code — exposed secrets, auth stubs, database rules, object-level authorization, input validation, and client-side payment logic. It is not a comprehensive third-party security audit or penetration test. If this app ever handles payment, health, or other regulated data, get a professional external review before launch regardless of these results.
