# EduPlatform Design System: MASTER

## Core Principles
1. **Knowledge Mastery First**: Focus on deep understanding, not grades or exam prep.
2. **Unified Framework**: Smooth transition from Primary (friendly) to Secondary (academic).
3. **Calm & Focused**: Minimal distractions, high accessibility, and high contrast.
4. **Mastery States**: Progress is shown through 4 distinct states:
    - `Unseen` (Slate-200 / Gray)
    - `Exploring` (Amber-400 / Yellow)
    - `Practicing` (Blue-500)
    - `Mastered` (Emerald-600)

## Visual Language

### Colors (Shared)
- **Primary (Math)**: Indigo-600
- **Primary (Language)**: Rose-600
- **Background**: Slate-50 (Pure, calm)
- **Surface**: White with subtle borders

### Primary (Grade 3–5)
- **Header Font**: `Baloo 2` (Google Font)
- **Body Font**: `Inter`
- **UI Style**: "Soft 3D" / Bubbly.
    - **Border Radius**: `rounded-3xl` (24px)
    - **Shadows**: Soft, multi-layered (Soft UI)
    - **Components**: Large, chunky buttons, illustrative icons.
- **Knowledge Map**: Linear "Board Game" style path with visual milestones.

### Secondary (Grade 6–9)
- **Header Font**: `Outfit` (Google Font)
- **Body Font**: `Inter`
- **UI Style**: Professional / Academic.
    - **Border Radius**: `rounded-xl` (12px)
    - **Shadows**: Clean, sharp (Box Shadow)
    - **Components**: Minimal buttons, thin-stroke icons, node-based graphs.
- **Knowledge Map**: Node-based prerequisite visualization (DAG).

## Core Shared Components

### Knowledge Map
- **Primary**: A vertical or horizontal path with large icons for topics.
- **Secondary**: A network graph where nodes are "Knowledge Points" and edges are prerequisites.

### Diagnostic Interface
- **Tone**: Encouraging, low-pressure.
- **Interaction**: Single-focus questions, large hit areas (Primary), structured inputs (Secondary).

### Lesson Structure (The 4-Step Mastery)
1. **Concept**: Clear, concise explanation (Video/Visual first for Primary, Text/Diagram for Secondary).
2. **Examples**: 2-3 interactive examples.
3. **Common Mistakes**: "Watch out!" section highlighting misconceptions.
4. **Quick Check**: 3-question understanding check to move from `Exploring` to `Practicing`.

### Progress Tracker
- **Visualization**: Concentric mastery circles or heatmaps (no bars/grades).
- **State Changes**: Smooth transitions between mastery colors.

## Adaptive UX rules
- **Navigation**: Sidebar with large icons for Primary, collapsible sub-menus for Secondary.
- **Complexity**: Gradually increase density of information as grade level increases.
