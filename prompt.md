# Task: Add authentication with NextAuth.js (Auth.js v5)

This phase wires real authentication into the app. The app currently uses a hardcoded `dev-user-1` userId everywhere — after this phase, every route uses the real logged-in user's ID from the session.

Read `ui.md` before building any UI in this phase.

---

## 0. Install packages

```bash
npm install next-auth@beta
npm install @auth/prisma-adapter
npm install bcryptjs
npm install @types/bcryptjs --save-dev
```

Use `next-auth@beta` (Auth.js v5) — not v4. The configuration pattern is different from v4; use the v5 App Router pattern with a single `auth.ts` config file.

---

## 1. Prisma schema additions

Add the standard NextAuth.js Prisma adapter models to `prisma/schema.prisma`. Add these alongside the existing models — do NOT modify existing models:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

Also update the existing `User` model to add the relations NextAuth needs:

```prisma
accounts  Account[]
sessions  Session[]
```

Run: `npx prisma migrate dev --name add_nextauth_tables`
Run: `npx prisma generate`

---

## 2. Environment variables

Add these to `.env`:

```env
NEXTAUTH_SECRET="generate-a-random-string-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth — leave empty for now, fill in later
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# GitHub OAuth — leave empty for now, fill in later
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

For `NEXTAUTH_SECRET`: generate a secure random string using:
```bash
openssl rand -base64 32
```
Paste the output as the value.

---

## 3. Auth config — `src/auth.ts`

Create the main NextAuth config file at the project root level `src/auth.ts`:

```typescript
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        return user;
      },
    }),
    // Google and GitHub providers stubbed — uncomment when credentials are ready:
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
});
```

---

## 4. NextAuth route handler

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

---

## 5. Middleware — protect all routes

Create `src/middleware.ts` at the project root:

```typescript
export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup).*)'],
};
```

This redirects unauthenticated users to `/login` for all pages except the auth pages themselves and Next.js internals.

---

## 6. Signup API route

Create `src/app/api/auth/signup/route.ts`:

- Accepts `POST` with `{ email, password, name? }`
- Validates: email must be valid format, password must be at least 8 characters
- Checks if user already exists — return 409 if so
- Hashes password with `bcrypt.hash(password, 12)`
- Creates User in database
- Returns `{ success: true, email }` on success
- Returns appropriate error messages on failure

---

## 7. Replace hardcoded userId everywhere

Search the entire codebase for `dev-user-1` and `// TODO: replace hardcoded userId` comments. Replace every instance with the real session user ID.

Pattern for API routes:

```typescript
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  // ... rest of route
}
```

Apply this pattern to ALL existing API routes:
- `GET /api/problems`
- `POST /api/problems`
- `GET /api/problems/due`
- `PATCH /api/problems/[id]/revise`
- `PATCH /api/problems/[id]/retire`
- `PATCH /api/problems/[id]/revise-again`
- `PATCH /api/problems/[id]`
- `PATCH /api/problems/[id]/custom-fields`
- `GET /api/columns`
- `POST /api/columns`
- `GET /api/streak`
- `GET /api/activity`
- `GET /api/leetcode/resolve`

Every route must return 401 if no valid session exists.

---

## 8. Login page — `src/app/login/page.tsx`

Split-screen layout, full viewport height:

### Left panel (40% width)
- Background: very dark `#0a0a0a`
- A large user-supplied image fills this panel — use `next/image` with `fill` and `object-fit: cover`
- Image source: `/public/auth-hero.jpg` — create a placeholder for now (a dark gradient div) since the real image will be added later
- Over the image/gradient, bottom-left: app name `recall.` in monospace white, `24px`
- Tagline below: `"Never forget what you've solved."` in muted gray, `14px`

### Right panel (60% width)
- Background: `#111111`
- Centered vertically and horizontally
- Max width of form content: `380px`

Form content top to bottom:
```
Get started

Email
[ email input ]

Password
[ password input ]

[ Sign in ]

─────── or ───────

[ G  Sign in with Google ]     ← disabled/grayed out, tooltip: "Coming soon"
[ ⌥  Sign in with GitHub ]     ← disabled/grayed out, tooltip: "Coming soon"

Don't have an account? Sign up
```

- "Get started": white, `24px`, slightly bold
- Label style: muted gray `#888`, `12px`, uppercase, monospace, `4px` margin bottom
- Input style: background `#1a1a1a`, border `1px solid #2a2a2a`, white text, `14px`, `8px` padding, border radius `6px`. Focus: border color `#444`
- "Sign in" button: full width, background `#fff`, text `#000`, `14px`, bold, border radius `6px`, height `40px`. Hover: background `#e5e5e5`
- OAuth buttons: full width, background `#1a1a1a`, border `1px solid #2a2a2a`, white text (muted to `#666` since disabled), border radius `6px`, height `40px`, logo icon on left
- "Don't have an account? Sign up": muted gray text, "Sign up" is a link to `/signup` in white

Form behavior:
- On submit: call `signIn('credentials', { email, password, callbackUrl: '/' })`
- Show inline error below the button if sign in fails: "Invalid email or password" in red `#f87171`
- Show loading state on the button while submitting (spinner, disabled)
- No page reload on error — handle with NextAuth's error callback

---

## 9. Signup page — `src/app/signup/page.tsx`

Same split-screen layout as login. Right panel form:

```
Create account

Name (optional)
[ name input ]

Email
[ email input ]

Password
[ password input — min 8 chars ]

[ Create account ]

─────── or ───────

[ G  Sign up with Google ]     ← disabled, "Coming soon"
[ ⌥  Sign up with GitHub ]     ← disabled, "Coming soon"

Already have an account? Sign in
```

Form behavior:
- On submit: call `POST /api/auth/signup` with `{ name, email, password }`
- On success: automatically sign in with `signIn('credentials', { email, password, callbackUrl: '/' })`
- Show inline errors:
  - "Password must be at least 8 characters" if too short
  - "An account with this email already exists" if 409
  - "Something went wrong, please try again" for other errors

---

## 10. Update sidebar to show user info + sign out

At the very bottom of the sidebar (above the "dev mode" badge which should now be removed), add:

```
[ user avatar initial ]  user@email.com
                         Sign out
```

- Avatar: a small circle `32px` with the first letter of the user's name/email, background `#2a2a2a`, white text, monospace
- Email: muted gray `#666`, `12px`, truncated if long
- "Sign out": muted gray `#555`, `11px`, clickable — calls `signOut()` from next-auth

Use `useSession()` from `next-auth/react` in the sidebar component. Wrap the app in `<SessionProvider>` in `layout.tsx`.

---

## Definition of done

- `npx prisma migrate dev --name add_nextauth_tables` ran successfully
- `/login` page renders correctly with split-screen layout
- `/signup` page renders correctly
- Signing up creates a real User in the Neon database (verify in Neon dashboard → Tables → User)
- Signing in with those credentials redirects to `/` (the problems table)
- Visiting `/` while logged out redirects to `/login`
- All API routes return 401 when called without a session
- Sidebar shows logged-in user's email + sign out button
- All `dev-user-1` references are gone from the codebase (run `grep -r "dev-user-1" src/` to confirm — should return nothing)
- `npm run dev` shows no console errors
- Commit: `git add . && git commit -m "Add NextAuth authentication (Phase 7)"`
- Stop here — do not build the landing page or deploy yet