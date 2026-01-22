# PLAN: Local Database Deployment Script

## Goal
Automate the execution of local SQL files (`supabase/*.sql`) against the remote Supabase database using a simple Node.js script, avoiding the need for the full Supabase CLI or Docker.

## 📋 Task Breakdown

### Phase 1: Setup & Dependencies
- [ ] Install `postgres` (or `pg`) driver.
- [ ] Ensure `DATABASE_URL` is set in `.env.local` (connection string).

### Phase 2: Script Implementation
- [ ] Create `scripts/deploy-db.ts`.
    - [ ] Connect to DB using `DATABASE_URL`.
    - [ ] Function to read and split SQL files by `;` (basic parsing) or execute whole file.
    - [ ] Logic to iterate over specific files in order:
        1. `supabase/profiles-schema.sql` (Fixes the current error)
        2. `supabase/courses-schema.sql`
        3. `supabase/migrations/*.sql` (Knowledge Graph)
    - [ ] Add logging for success/failure.

### Phase 3: Integration
- [ ] Add `db:deploy` script to `package.json`.
    - Command: `npx tsx scripts/deploy-db.ts`

## Verification Plan
### Manual Verification
- Run `npm run db:deploy`.
- Verify the "Onboarding Error" (missing `grade_level` column) is resolved.
- Verify the new `knowledge_nodes` tables exist in Supabase (by checking dashboard or app functionality).
