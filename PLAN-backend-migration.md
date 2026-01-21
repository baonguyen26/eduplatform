# Backend Migration: The "Real App" Foundation

## Goal
Transform the static EduPlatform prototype into a dynamic application driven by a Supabase backend, enabling user persistence, authentication, and real data flow.

## 🛑 User Choices & Assumptions
- **Stack:** Supabase (Auth + DB) — *Assumed for speed/robustness.*
- **Roles:** Student + Parent — *Assumed based on `ParentView.tsx` presence.*
- **Strategy:** "Hard Cutover" — All data driven from DB immediately.

## 📋 Task Breakdown

### Phase 1: Infrastructure & Schema
- [ ] **Setup Supabase Client**
  - Install `@supabase/ssr` `@supabase/supabase-js`.
  - Create `utils/supabase/server.ts` and `client.ts`.
  - Configure Environment Variables.
- [ ] **Design & Apply Database Schema**
  - `profiles` (id, role: student|parent|tutor, full_name, avatar_url).
  - `subjects` (Math, Literature).
  - `topics` (Geometry, Algebra - referencing subjects).
  - `user_progress` (tracking mastery scores per topic).
  - `knowledge_nodes` (for the graph visualization).

### Phase 2: Authentication
- [ ] **Auth Pages Implementation**
  - Create `/login` page (Email/Password + OAuth).
  - Create `/auth/callback` route.
  - Create Middleware for protected routes (`/dashboard`).

### Phase 3: Data Seeding (The "Yes" Commitment)
- [ ] **Create Seed Script**
  - Extract hardcoded data from `page.tsx` and `KnowledgeMap.tsx`.
  - Write `supabase/seed.sql` or a clear TypeScript seeder script.
  - **Verify:** Dashboard loads with "real" mocked data from DB.

### Phase 4: Component Integration
- [ ] **Connect Dashboard**
  - Update `TutorDashboard.tsx` to fetch `profiles`.
  - Update `MasteryTracker.tsx` to fetch `user_progress`.
- [ ] **Connect Knowledge Map**
  - Update `KnowledgeMap.tsx` to fetch `knowledge_nodes` and relationships.

## ✅ Done When
- [ ] User can Sign Up and Login.
- [ ] Dashboard shows user's specific name and progress (not hardcoded).
- [ ] "Spark/Focus" modes persist across reloads (saved in `profiles` preferences).
- [ ] `ParentView` shows linked student data.

## 🛠Dependencies
- `@supabase/supabase-js`
- `@supabase/ssr`
