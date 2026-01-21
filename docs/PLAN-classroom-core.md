# PLAN-classroom-core: Build the Learning Experience

> **Goal:** Build the core "Classroom" experience where students discover courses, view lessons, and track their progress. This is the heart of the product.

---

## 🏗️ Phase 1: Data Architecture

### Task 1: Database Schema (Supabase)
-   **Tables:**
    -   `courses`: Title, description, thumbnail, subject, grade_level, published status.
    -   `modules` (optional, for grouping): Title, order.
    -   `lessons`: Title, content (rich text), video_url, duration, order, course_id.
    -   `user_progress`: user_id, lesson_id, status (completed/started), last_watched_position.
-   **RLS Policies:** Public read for content, User-specific read/write for progress.
-   **Seed Data:** Create a SQL seed file with 2-3 sample courses (Math, Science) and 5-10 lessons each.

---

## 🎨 Phase 2: Course Discovery (The "Netflix" View)

### Task 2: Course Catalog Page (`/dashboard/courses`)
-   **Design:** Claymorphism "Bubble" aesthetic.
    -   **Grid:** Responsive Auto-fit Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`).
-   **Component: `CourseCard`**
    -   **Shape:** High rounded corners (`rounded-[2rem]`), white bg, soft deep shadow.
    -   **Thumbnail:** 16:9 aspect ratio, fully rounded top. "Play" overlay (Glassmorphism circle, blur-md) appears on hover.
    -   **Badges:** Pill-shaped, color-coded by Subject (Math=Blue, Science=Green, English=Yellow).
    -   **Progress:** Thick, rounded progress bar (`h-3 rounded-full bg-slate-100` -> `bg-gradient-to-r from-blue-400 to-indigo-500`).
    -   **Interaction:** `whileHover={{ scale: 1.05, y: -5 }}` using Framer Motion.

### Task 3: Course Detail Page (`/courses/[id]`)
-   **Header:** Hero section with "Soft Cloud" background.
-   **Content:**
    -   **Title:** Huge Baloo 2 typography.
    -   **Syllabus:** Accordion list. Each module is a "Card".
    -   **Action:** "Continue Learning" Floating Action Button (FAB) style.

---

## 🎥 Phase 3: The Learning Player

### Task 4: Lesson Player Page (`/learn/[lessonId]`)
-   **Layout:** "Focus Mode" / Cinema View.
    -   **Main Stage:** Darkened backdrop (`bg-slate-900`) for video prominence.
    -   **Sidebar:** Glassmorphism panel (`bg-white/90 backdrop-blur-xl`) on the right.
-   **Components:**
    -   **Video Player:** Custom wrapper. Rounded corners (`rounded-2xl`). Custom controls (Big, bubbly play buttons).
    -   **Lesson List:** Vertical list. Active lesson has "Active Glow" (`ring-2 ring-indigo-400 bg-indigo-50`).
    -   **Victory Moment:** "Mark as Complete" triggers `canvas-confetti` explosion.
-   **Top Bar:** Minimalist. Breadcrumbs + "Exit Focus Mode".

---

## 🧪 Phase 4: Integration

### Task 5: Progress Connectivity
-   **Backend:** detailed server actions to `updateProgress` and `getCourseProgress`.
-   **Frontend:** Connect the "Mark Complete" button to the DB.
-   **Dashboard:** Update the main Dashboard widget to show "Recently Accessed Courses".

---

## 📝 Integrated Checklist
- [ ] Schema `courses`, `lessons`, `progress` created.
- [ ] Seed data populated.
- [ ] `CourseCard` built with Claymorphism.
- [ ] Catalog Page implementation.
- [ ] Player Page with "Cinema Mode".
- [ ] `canvas-confetti` integrated.
- [ ] "Mark Complete" updates DB and UI.
