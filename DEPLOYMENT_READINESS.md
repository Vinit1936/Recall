# 🚦 Deployment Readiness Report — Recall

**Generated:** 2026-08-03 · **Actioned:** 2026-08-03 · **Skill:** checkmyvibe  
**Stack:** Next.js 15 · Prisma ORM · PostgreSQL (Neon) · NextAuth v5 (Auth.js) · Google + GitHub OAuth + Credentials provider  
**Data handled:** User accounts (email, hashed passwords, OAuth tokens), problem-solving history, revision schedules. No payment or health data found.

---

## Check 1: Exposed Secrets and Credentials

### 🔴 [Critical — ACTION REQUIRED BY YOU] Real credentials stored in `.env` — rotate all of them before going live

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

### ✅ [Should Fix — FIXED] Auth cookies were set with `secure: false`

- **Fixed in:** `src/auth.ts` — `secure` is now `process.env.NODE_ENV === 'production'`, so it's `false` on localhost and `true` when deployed over HTTPS.
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

### ✅ [Worth Reviewing — FIXED] `POST /api/leetcode/lookup` had no in-route authentication check

- **Fixed in:** Both `src/app/api/leetcode/lookup/route.ts` and `src/app/api/leetcode/resolve/route.ts` now call `auth()` at the top of the handler and return a 401 before doing any work if the user is not signed in.

### ✅ [Worth Reviewing — FIXED] No length cap on `titleSlug` input

- **Fixed in:** `src/app/api/leetcode/lookup/route.ts` — validation now rejects any `titleSlug` longer than 200 characters.

---

## Check 7: Client-Side Payment or Pricing Logic

### ✅ Not applicable

No payment, billing, or pricing logic was found in the codebase. No Stripe integration, no checkout flows, no price fields. This check does not apply.

---

## Final Summary

**Stack:** Next.js 15 + Prisma + PostgreSQL (Neon) + NextAuth v5. Handles user accounts and problem-solving history. No payment or regulated health data.

| Severity | Count | Status |
|---|---|---|
| 🔴 Critical | 1 | ⏳ **Awaiting manual action** — rotate credentials on external dashboards |
| ⚠️ Should Fix | 1 | ✅ Fixed in `src/auth.ts` |
| 📝 Worth Reviewing | 3 | ✅ All fixed in `src/app/api/leetcode/` |

**Verdict: Almost there — the only remaining blocker is rotating the real credentials in `.env` and injecting fresh ones as environment variables on your hosting platform (Vercel/Railway/etc.). All code-level issues are resolved.**

---

> **Scope reminder:** This review covers common configuration patterns seen in AI-generated code — exposed secrets, auth stubs, database rules, object-level authorization, input validation, and client-side payment logic. It is not a comprehensive third-party security audit or penetration test. If this app ever handles payment, health, or other regulated data, get a professional external review before launch regardless of these results.
