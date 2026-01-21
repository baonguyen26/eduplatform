# Plan: Registration & Onboarding (Option A)

## 📝 Overview
Implement "Authentic Onboarding" flow: a distinct Registration process followed by a mandatory Onboarding Wizard. Users sign up (via Email or Social), and are immediately redirected to `/onboarding` to select their Role (Student/Parent) and complete their Profile. This decouples authentication from business logic/roles.

**Option A Strategy:**
1. **Auth:** Supabase Auth (Email/Password + Google).
2. **Gateway:** Check `profiles` table. If no profile/role -> Redirect to `/onboarding`.
3. **Wizard:** Multi-step form to set Role, Name, and Grade (Student) or Children (Parent).
4. **Completion:** Mark profile as active/complete -> Redirect to `/dashboard`.

## � Design & UX Concept (UI/UX Pro Max)
**Aesthetic:** "Aero / Glassmorphism 2.0"
- **Vibe:** Playful, Premium, "App Store" quality.
- **Backgrounds:** Soft 3D shapes, animated blobs, deep gradients (Blue/Indigo/Emerald).
- **Cards:** Glassmorphic (`bg-white/80`, `backdrop-blur-xl`), soft borders, deep shadows (`shadow-xl`).

**Typography:**
- **Headings:** `Baloo 2` (variable: `--font-baloo-2`) - Rounded, friendly.
- **Body:** `Quicksand` (variable: `--font-quicksand`) - Clean, readable.

**Motion & Interaction:**
- **Transitions:** Fluid physics-based (Springs: stiffness 100, damping 20) or slow ease (400ms+).
- **Hover:** stable scale (`scale-105`), glow elevation. No layout shifts.
- **Feedback:** Immediate visual response for all clicks/inputs.

## �🏗 Project Type
**WEB** (Next.js + Supabase)

## 🎯 Success Criteria
- [ ] **Visuals:** Registration page matches "Feature Twin" high-fidelity standard.
- [ ] User can sign up with Email/Password or Google.
- [ ] New users are forced into `/onboarding` route.
- [ ] Users cannot access `/dashboard` until Role is set.
- [ ] "Student" flow captures Grade Level.
- [ ] "Parent" flow captures basic info (placeholder for child linking).
- [ ] Data persists to `profiles` table in Supabase.


## 🛠 Tech Stack
- **Auth:** Supabase Auth (`@supabase/ssr`)
- **DB:** Supabase Postgres (`profiles` table)
- **Frontend:** Next.js App Router, Tailwind CSS, Framer Motion (for Wizard transitions)
- **Validation:** Zod + React Hook Form

## 📂 File Structure
```
src/
├── app/
│   ├── auth/
│   │   ├── callback/             # Auth callback route
│   │   │   └── route.ts
│   │   ├── login/
│   │   │   └── page.tsx          # Existing (update for clean auth)
│   │   └── register/             # NEW: Dedicated register page
│   │       └── page.tsx
│   ├── onboarding/               # NEW: Wizard Flow
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Role Selection & Forms
│   │   └── actions.ts            # Server actions for profile update
│   └── dashboard/
│       └── layout.tsx            # Protected layout (checks profile)
├── middleware.ts                 # Route protection & redirection
└── utils/
    └── supabase/
        ├── middleware.ts         # Supabase specific middleware helper
        ├── server.ts             # Server client
        └── client.ts             # Client client
```

## 📋 Task Breakdown

### Phase 1: Foundation (Supabase)
- [ ] **Task 1: Supabase Setup** <!-- id: 1 -->
  - **Input:** Env vars, Supabase project.
  - **Action:** Install `@supabase/ssr`, create `utils/supabase/{client,server}.ts`.
  - **Output:** Working Supabase client utilities.
  - **Verify:** Can instantiate client without error.

- [ ] **Task 2: Profiles Schema** <!-- id: 2 -->
  - **Input:** SQL Editor.
  - **Action:** Create `profiles` table: `id` (uuid, refs auth.users), `role` (text), `full_name` (text), `onboarding_completed` (boolean). Add RLS policies (Users can update own profile).
  - **Output:** `profiles` table exists.
  - **Verify:** `supabase db push` or manual check.

### Phase 2: Authentication
- [ ] **Task 3: Auth Callback Route** <!-- id: 3 -->
  - **Input:** `src/app/auth/callback/route.ts`.
  - **Action:** Implement PKCE exchange code.
  - **Output:** Working auth callback.
  - **Verify:** Login redirects verify email properly (or session created).

- [ ] **Task 4: Register Page (Feature Twin)** <!-- id: 4 -->
  - **Input:** `src/app/login/page.tsx` (reference).
  - **Action:** Create `src/app/register/page.tsx`.
    - **Concept:** "Feature Twin" of Login page (Split Screen).
    - **Hero (Left):** "Unlock Your Superpowers" / "Join Adventure".
    - **Form (Right):** Create Account form (Email, Password).
    - **Link:** "Already have an account? Login" (links to `/login`).
  - **Output:** Visual Register page matching Login aesthetic.
  - **Verify:** User can submit form -> Supabase user created.

- [ ] **Task 5: Middleware Protection** <!-- id: 5 -->
  - **Input:** `middleware.ts`.
  - **Action:** Update middleware to:
    1. Refresh session.
    2. If logged in but no profile/role -> Redirect to `/onboarding`.
    3. If not logged in -> Redirect to `/login`.
  - **Output:** Routing logic.
  - **Verify:** Accessing `/dashboard` as new user redirects to `/onboarding`.

### Phase 3: Onboarding Wizard
- [ ] **Task 6: Onboarding UI Shell (Pro Max)** <!-- id: 6 -->
  - **Input:** `src/app/onboarding/page.tsx`.
  - **Action:** Create "Step 1: Choose Role" interface.
    - **Cards:** Two large glassmorphic cards ("Student" vs "Parent") with animated icons/emoji (🎓 vs 👨‍👩‍👧‍👦).
    - **Interaction:** Hover = Scale + Glow. Click = Smooth transition to Form.
    - **Header:** "Who is joining us today?" (Proprietary heading font).
    - **Background:** continuation of the Register page ambient animation.
  - **Output:** High-fidelity Role selection UI.
  - **Verify:** Animations play smoothly; Selection updates state.

- [ ] **Task 7: Student Flow** <!-- id: 7 -->
  - **Input:** `src/app/onboarding/student-form.tsx`.
  - **Action:** Form for Full Name & Grade Level.
  - **Output:** Student details form.
  - **Verify:** Form renders when Student role selected.

- [ ] **Task 8: Completion Action** <!-- id: 8 -->
  - **Input:** `src/app/onboarding/actions.ts`.
  - **Action:** `completeOnboarding(formData)`: Updates `profiles` table with Role + Data + `onboarding_completed=true`. Redirects to `/dashboard`.
  - **Output:** Server Action.
  - **Verify:** Submitting form updates DB and moves user to Dashboard.

## ✅ Phase X: Verification
- [ ] **Lint Check:** `npm run lint` passes.
- [ ] **Auth Flow:** User can Signup (Email) -> Onboarding -> Dashboard.
- [ ] **Persistence:** Reloading page keeps user logged in and on Dashboard (not Onboarding).
- [ ] **DB Check:** `profiles` table has correct row for new user.
