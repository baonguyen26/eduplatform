# PLAN: Knowledge Mastery Engine (Pro Max)

## Goal
Implement a high-fidelity, interactive knowledge graph that visualizes student progress across granular concepts (Nodes) and prerequisite relationships (Edges). This "Mastery Engine" will adapt its aesthetic based on the user's grade level.

## 🛑 Socratic Gate (Discovery Questions)
> [!IMPORTANT]
> Please provide feedback on these items before we transition to EXECUTION.

1.  **Graph Complexity:** Should the knowledge map follow a strict hierarchical structure (e.g., Module > Lesson), or a **DAG (Directed Acyclic Graph)** where a single concept (Node) can have multiple prerequisites across different subjects?
2.  **Mapping Philosophy:** Is a "Node" equivalent to a **Course**, a **Module**, or a granular **Concept** (e.g., "Multiplication of 2-digit numbers")? Granular concepts allow for better progress tracking but require more metadata tagging.
3.  **Mastery Definition:** How is "Mastery" objectively reached in this system?
    - Simple completion of associated lessons?
    - Passing a specific "Mastery Quiz"?
    - Manual approval from a Tutor/Parent?

---

## 🎨 UI/UX Pro Max Architecture

### 1. Dual-Mode Aesthetic (Aero 2.0)
The interface will automatically switch styles based on the user's `grade_level`:

| Feature | **Explorer Mode** (Grades 1-5) | **Academic Mode** (Grades 6-9) |
| :--- | :--- | :--- |
| **Style** | **Claymorphism** (Soft 3D / Bubbly) | **Glassmorphism 2.0** (Spatial / Sharp) |
| **Colors** | Vibrant, multi-color nodes | Monochromatic, glow-based nodes |
| **Typography**| `Baloo 2` (Playful) | `Outfit` (Academic/Sleek) |
| **Graph Type** | Milestone "Game Board" Path | Interactive Node-Link DAG |

### 2. The Interactive Mastery Engine
- **Spatial Navigation**: The graph will support 60fps Pan & Zoom using `framer-motion` and `react-use-gesture`.
- **Relationship Connectors**: Edges between nodes will animate (pulsing light flow) to show the path of knowledge.
- **State Visualization**:
    - `Unseen`: Desaturated, locked icon.
    - `Exploring`: Amber glow, pulsing border.
    - `Practicing`: Blue spatial shadow.
    - `Mastered`: Emerald glass effect, "Success" checkmark.

---

## Proposed Technical Changes

### Database (Supabase)
- `knowledge_nodes`: Granular concepts (UUID, title, description, subject, grade_level, icon_type).
- `knowledge_edges`: Relationship mapping (from_node_id, to_node_id, relationship_type: 'prerequisite' | 'related').
- `user_node_progress`: Tracking mastery (user_id, node_id, status: unseen | exploring | practicing | mastered, last_activity_at).
- `lesson_to_node`: Junction table to link multiple lessons to a single concept node.

### Components
- **[NEW] [MasteryGraph.tsx](file:///c:/Users/baong/OneDrive/Desktop/TNB/edu/src/components/MasteryGraph.tsx)**: The core engine supporting both visual modes.
- **[MODIFY] [KnowledgeMap.tsx](file:///c:/Users/baong/OneDrive/Desktop/TNB/edu/src/components/KnowledgeMap.tsx)**: Wrapper that handles mode switching and data fetching.
- **[NEW] [ConceptModal.tsx](file:///c:/Users/baong/OneDrive/Desktop/TNB/edu/src/components/ConceptModal.tsx)**: Spatial glassmorphism modal for concept drill-down.

## Verification Plan
### Automated Tests
- `scripts/verify_graph_integrity.py`: Ensure no circular dependencies or orphan nodes.
- Unit tests for `mastery_calculation` (Logic to auto-promote node status).

### UI/UX Audit (Pro Max Checklist)
- [ ] **Dual-Mode Check**: Verify theme swap on grade level change.
- [ ] **Spatial Check**: Zoom/Pan performance at 60fps.
- [ ] **Contrast Check**: Accessibility ratio > 4.5:1 in both modes.
- [ ] **Motion Check**: No layout shifts during node expansion.
