# Task: Write the scheduling logic — pure TypeScript functions + unit tests

This is the core brain of the app. Write this as pure functions with zero dependencies on Next.js, Prisma, or any database. Functions take plain data in, return plain data out. The API routes will call these functions later — for now, just the logic and its tests.

## Hard constraints

- Pure TypeScript only — no imports from Next.js, Prisma, React, or any DB layer
- No database calls anywhere in this file
- Do NOT create any API routes, components, or pages in this task
- Do NOT modify the Prisma schema
- If anything is unclear, STOP and ask me — do not guess or improvise the logic
- Write the functions EXACTLY as specced below — the logic rules are not suggestions

## File to create

Create one file: `src/lib/scheduling.ts`
Create one test file: `src/lib/scheduling.test.ts`

---

## Part 1 — `src/lib/scheduling.ts`

### Constants

```typescript
export const LADDER_DAYS = [3, 7, 14, 30] as const;
export type LadderStep = 0 | 1 | 2 | 3;
```

### Types

```typescript
export type ProblemStatus = 'ACTIVE' | 'MASTERED' | 'RETIRED';
export type Confidence = 'CLEAN' | 'SHAKY' | 'STRUGGLED';
export type RevisionType = 'REGULAR' | 'RECHECK';

export type SchedulingInput = {
  currentStep: number;
  status: ProblemStatus;
  confidence: Confidence;
  revisionType: RevisionType;
  today: Date;
};

export type SchedulingResult = {
  newStep: number;
  newStatus: ProblemStatus;
  nextRevisionAt: Date | null; // null when MASTERED or RETIRED
};
```

### Function 1 — `addDays`

Simple date utility. Takes a date and a number of days, returns a new Date that many days in the future. Do not mutate the input date.

```typescript
export function addDays(date: Date, days: number): Date
```

### Function 2 — `applyRevision`

This is the main scheduling function. Apply the rules below EXACTLY — do not add extra logic, smoothing, or "improvements."

**Rules:**

**If `revisionType` is `RECHECK`** (problem was Mastered, user pulled it back):
- `CLEAN` on a RECHECK → `newStep = 3`, `newStatus = 'ACTIVE'`, `nextRevisionAt = today + 30 days`
  (fast-forward back up — don't crawl through the full ladder again)
- `SHAKY` on a RECHECK → `newStep = 1`, `newStatus = 'ACTIVE'`, `nextRevisionAt = today + 7 days`
  (not confident enough to fast-forward, but not a full reset either)
- `STRUGGLED` on a RECHECK → `newStep = 0`, `newStatus = 'ACTIVE'`, `nextRevisionAt = today + 3 days`
  (full reset — mastery wasn't real)

**If `revisionType` is `REGULAR`:**
- `STRUGGLED` (any step) → `newStep = 0`, `newStatus = 'ACTIVE'`, `nextRevisionAt = today + 3 days`
- `SHAKY` (any step) → `newStep = currentStep` (unchanged), `newStatus = 'ACTIVE'`, `nextRevisionAt = today + LADDER_DAYS[currentStep]`
  (repeat the same interval — not ready to advance)
- `CLEAN` at steps 0, 1, or 2 → `newStep = currentStep + 1`, `newStatus = 'ACTIVE'`, `nextRevisionAt = today + LADDER_DAYS[currentStep + 1]`
- `CLEAN` at step 3 (the final step) → `newStep = 3`, `newStatus = 'MASTERED'`, `nextRevisionAt = null`
  (problem exits active rotation)

```typescript
export function applyRevision(input: SchedulingInput): SchedulingResult
```

### Function 3 — `retireProblem`

User manually retires a problem from any state. Always returns the same thing.

```typescript
export function retireProblem(): Pick<SchedulingResult, 'newStatus' | 'nextRevisionAt'> {
  return { newStatus: 'RETIRED', nextRevisionAt: null };
}
```

### Function 4 — `reviseAgainFromMastered`

User clicks "Revise again" on a Mastered problem. Pulls it back into rotation as a RECHECK.

```typescript
export function reviseAgainFromMastered(today: Date): {
  newStep: 0;
  newStatus: 'ACTIVE';
  nextRevisionAt: Date;
  revisionType: 'RECHECK';
}
```

Returns: `newStep = 0`, `newStatus = 'ACTIVE'`, `nextRevisionAt = today + 3 days`, `revisionType = 'RECHECK'`

### Function 5 — `getInitialSchedule`

Called when a new problem is first added to the tracker. Returns the first scheduled revision date.

```typescript
export function getInitialSchedule(createdAt: Date): {
  currentStep: 0;
  nextRevisionAt: Date;
  status: 'ACTIVE';
} {
  return {
    currentStep: 0,
    nextRevisionAt: addDays(createdAt, LADDER_DAYS[0]), // +3 days
    status: 'ACTIVE',
  };
}
```

### Function 6 — `isDueToday`

Returns true if a problem should appear in today's Daily Revision list. Includes overdue problems.

```typescript
export function isDueToday(nextRevisionAt: Date, today: Date): boolean
```

Logic: return true if `nextRevisionAt` is on or before `today` (same day counts as due, past days are overdue and also count).

---

## Part 2 — `src/lib/scheduling.test.ts`

Use vitest for testing. Install vitest if not already present: `npm install vitest --save-dev`

Add this to `package.json` scripts if not present:
```json
"test": "vitest run"
```

Write tests covering ALL of the following cases — do not skip any:

### addDays tests
- Adding 3 days to a date returns the correct date
- Adding 0 days returns the same date
- Does not mutate the input date

### applyRevision — REGULAR tests
- STRUGGLED at step 0 → resets to step 0, ACTIVE, +3 days
- STRUGGLED at step 2 → resets to step 0, ACTIVE, +3 days (regardless of where it was)
- STRUGGLED at step 3 → resets to step 0, ACTIVE, +3 days
- SHAKY at step 0 → stays step 0, ACTIVE, +3 days
- SHAKY at step 2 → stays step 2, ACTIVE, +14 days
- CLEAN at step 0 → advances to step 1, ACTIVE, +7 days
- CLEAN at step 1 → advances to step 2, ACTIVE, +14 days
- CLEAN at step 2 → advances to step 3, ACTIVE, +30 days
- CLEAN at step 3 → stays step 3, becomes MASTERED, nextRevisionAt is null

### applyRevision — RECHECK tests
- CLEAN on RECHECK → step 3, ACTIVE, +30 days (fast-forward)
- SHAKY on RECHECK → step 1, ACTIVE, +7 days
- STRUGGLED on RECHECK → step 0, ACTIVE, +3 days (full reset)

### retireProblem tests
- Always returns RETIRED status and null nextRevisionAt

### reviseAgainFromMastered tests
- Returns step 0, ACTIVE, +3 days from today, revisionType RECHECK

### getInitialSchedule tests
- Returns step 0, ACTIVE, nextRevisionAt = createdAt + 3 days

### isDueToday tests
- Problem due today → true
- Problem due yesterday (overdue) → true
- Problem due 5 days ago (overdue) → true
- Problem due tomorrow → false
- Problem due 3 days from now → false

---

## Definition of done

- `src/lib/scheduling.ts` exists with all 6 functions exported
- `src/lib/scheduling.test.ts` exists with all tests listed above
- Running `npm test` passes ALL tests with zero failures
- Show me the full test output confirming all pass
- Stop here — do not create API routes, components, or any other files