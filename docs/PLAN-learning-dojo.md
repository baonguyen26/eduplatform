# PLAN: The Learning Dojo (Student Experience)

## Goal
Transform the "Learning" section from a static content viewer into an interactive, gamified "Dojo". This includes a rich media player, interactive quizzes to verify mastery, and a reward system (XP/Streaks) to drive engagement.

## 📋 Task Breakdown

### Phase 1: Database Schema (Extensions)
- [ ] Create `quizzes` table (linked to Lessons).
- [ ] Create `quiz_questions` table (start with multiple choice).
- [ ] Create `user_quiz_attempts` table.
- [ ] Add `xp`, `streak_current`, `streak_longest` to `profiles`.
- [ ] Update `deploy-db.ts` to include new schema.

### Phase 2: Rich Lesson Player (Claymorphism UI)
- **Design System**: Use Claymorphism (fluffy, 3D, soft shadows).
    - **Font**: `Baloo 2` for Headings, `Quicksand` for body.
    - **Colors**: Primary Blue/Indigo, Warm White backgrounds.
- [ ] Create `RichVideoPlayer.tsx`
    - [ ] Wraps YouTube embed with "Clay" rounded frame.
    - [ ] Syncs "watched" status with valid duration (e.g. must watch 80%).
- [ ] Update `LessonView` layout.
    - [ ] Sidebar for "Course Content" (Clay card).
    - [ ] Main area for Video + Markdown.
    - [ ] "Next Lesson" sticky footer (Floating Clay button).

### Phase 3: Interactive Quizzes (Playful UX)
- [ ] Create `QuizRunner.tsx` component.
    - [ ] **Answers**: Big, colorful buttons (Green/Red feedback on click).
    - [ ] State machine for taking the quiz (Question -> Answer -> Feedback -> Next).
    - [ ] "Results" card with score + Confetti.
- [ ] Implement backend action `submitQuizAttempt`.
    - [ ] Validates answers.
    - [ ] Awards XP.
    - [ ] Marks Lesson as "Completed" (if passed).
    - [ ] Updates Knowledge Graph node mastery.

### Phase 4: Gamification System
- [ ] Create `GamificationEngine.ts` (Backend).
    - [ ] `awardXP(userId, amount, reason)`
    - [ ] `checkDailyStreak(userId)`
- [ ] Create UI Components (`Baloo 2` font).
    - [ ] `XPBar.tsx`: Top of screen, animated value.
    - [ ] `StreakFlame.tsx`: Animated fire icon (+ wiggle on update).
    - [ ] `LevelUpModal.tsx`: Fireworks via `canvas-confetti`, large "Level Up!" text.

## Agent Assignments
- **Database Architect**: Phase 1
- **Frontend Specialist**: Phase 2, 3, 4 (UI - Claymorphism Expert)
- **Backend Specialist**: Phase 3 (Logic), 4 (Engine)

## Verification Plan
### Automated Tests
- Test Quiz scoring logic (10/10 correct = 100%).
- Test XP accumulation.

### Manual Verification
- **Student Flow**:
    1. Watch video (progress bar moves).
    2. Click "Take Quiz".
    3. Pass Quiz -> See "XP Gained" animation.
    4. Check Dashboard -> Node unlocked.
