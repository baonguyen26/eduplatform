# PLAN-magic-link-auth: Implement Frictionless Onboarding (PKCE Magic Flow)

> **Goal:** Streamline the user registration process by implementing "Auto-Login via Email Link". When users verify their email, they should be instantly logged in and redirected to the Onboarding Wizard, creating a seamless "one-click" experience from email to app.

---

## 🏗️ Phase 1: Authentication Core Logic

### Task 1: Update Signup Server Action
-   **File:** `src/app/login/actions.ts`
-   **Action:** Modify the `signup` function.
-   **Details:**
    -   Update `supabase.auth.signUp` options.
    -   Set `options.emailRedirectTo` specifically to `${origin}/auth/callback?next=/onboarding`.
    -   Ensure `origin` is dynamically determined (e.g., `request.headers.get('origin')` or helper utility) to work in Dev and Prod.

### Task 2: Verify Auth Callback Logic
-   **File:** `src/app/auth/callback/route.ts`
-   **Action:** Audit and refine the code exchange logic.
-   **Details:**
    -   Ensure it extracts the `code` and `next` parameters from the URL.
    -   Perform `supabase.auth.exchangeCodeForSession(code)`.
    -   After success, redirect the user to the `next` path (which will be `/onboarding`).
    -   Handle errors (invalid code) by redirecting to `/error` or `/login?error=...`.

---

## 🎨 Phase 2: User Experience (UX)

### Task 3: Implement Magic Link "Success View" (Pro Max)
- **Design:** Claymorphism style (Soft, fluffy, 3D-like, matches existing Login aesthetic).
  - **Card:** White, heavy rounded corners (2rem), soft deep shadow (`shadow-xl shadow-blue-500/20`), inner glow (`inset-0 ring-1 ring-white/50`).
  - **Animation:** "Mail Sent" animation (Paper plane flying or Envelope opening) using Framer Motion.
- **Content:**
  - **Headline:** "Check your inbox!" (Font: Baloo 2, Bold)
  - **Subtext:** "We sent a magic link to **[email]**. Click it to instantly teleport into the app." (Font: Quicksand)
  - **Interaction:**
    - "Resend Email" button (Ghost variant, bouncy hover).
    - "Wrong Email?" link (Back to form).
- **Refinement:**
  - Ensure light mode text contrast is > 4.5:1 (Slate-900).
  - Use playful language: "Magic", "Teleport", "Unlock" instead of "Verify".

---

## 🧪 Phase 3: Verification & Security

### Task 4: End-to-End Flow Test
-   **Manual Test:**
    1.  Register with a real/temp email.
    2.  Check Email.
    3.  Click Link -> Observe Browser.
    4.  Verify redirect hits `/auth/callback`.
    5.  Verify final destination is `/onboarding` (and NOT `/login`).
    6.  Verify Session Cookie is set (User is authenticated).

### Task 5: Middleware Double-Check
-   **File:** `src/middleware.ts` / `src/utils/supabase/middleware.ts`
-   **Action:** Ensure the middleware doesn't accidentally block the cached session during the very first redirect.
-   **Details:** The `exchangeCodeForSession` sets a cookie. The redirection to `/onboarding` will trigger middleware. Ensure middleware sees the new cookie.

---

## 📝 Integrated Checklist
- [ ] Signup action points redirect to `/onboarding`.
- [ ] Auth Callback handles code exchange + redirection.
- [ ] Register Page text reflects the "Magic" nature.
- [ ] Middleware permits the flow.
- [ ] E2E Test confirms "Click Email -> Dashboard/Onboarding" works in one step.
