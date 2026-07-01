# Task: Add two small additions to existing Prisma schema — nothing else

The Prisma schema is already set up and the initial migration has run successfully. I need exactly two additions made to the existing schema. Do only this and stop — do not touch any other files, do not modify existing models, do not add anything beyond what is listed below.

## Hard constraints — same as before

- Prisma version is 6.x — do NOT upgrade or change it under any circumstances
- Do NOT create or modify any `prisma.config.ts` file
- Do NOT touch any frontend files, components, or pages
- Do NOT modify any existing model fields — only ADD the new field and new model below
- If anything fails, STOP and report the exact error — do not work around it

## What to add

### 1. Add one field to the existing `Problem` model

In `prisma/schema.prisma`, find the `Problem` model and add this single field after the `notes` field:

```prisma
customFields  Json?   @default("{}")
```

The Problem model's notes + customFields section should look like this after the change:

```prisma
notes           String?       @db.Text
customFields    Json?         @default("{}")
```

Do not move, rename, or touch any other fields in the Problem model.

### 2. Add one new model at the bottom of schema.prisma

Add this model at the end of the file, after the existing `StreakLog` model:

```prisma
model UserColumnConfig {
  id        String   @id @default(cuid())
  userId    String
  name      String
  order     Int
  createdAt DateTime @default(now())

  @@index([userId])
}
```

## After making the changes

1. Run `npx prisma generate` — confirm it succeeds
2. Run `npx prisma migrate dev --name add_custom_columns` — confirm it succeeds and applies to the Neon database
3. Show me the final output confirming the migration succeeded
4. Stop here and wait for my next instruction — do not proceed to writing any application code