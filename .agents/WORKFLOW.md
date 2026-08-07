# WORKFLOW: The Build Order (Execution Directives)

This file enforces a strict phase progression for the agent. **You must not start the next section or phase until the previous one is 100% complete, verified, and tested.**

---

## Phase 1: Foundation & Scaffolding (Frontend + Backend)

**Goal:** Establish the SvelteKit/Tauri frontend, the Python Sidecar, and the local SQLite database.

1. **Scaffold SvelteKit**:
   - Initialize the project: `npx -y sv create ./`
   - Use Svelte 5 (Runes) only.
2. **Agent Skills Installation**:
   - Run: `npx skills add https://github.com/leonxlnx/taste-skill --skill design-taste-frontend`
   - Run: `npx skills add https://github.com/sveltejs/ai-tools --skill svelte-code-writer`
3. **Tauri Integration**:
   - Initialize Tauri in the project (`npm run tauri init` or equivalent).
   - Configure `tauri.conf.json` to allow necessary system APIs and set the build commands.
4. **Data Layer (SQLite + Drizzle)**:
   - Install `drizzle-orm`, `drizzle-kit`, and `better-sqlite3`.
   - Create `src/lib/server/db/schema.ts` defining:
     - `tasks` table (id, title, description, priority, status, deadline).
     - `ui_versions` table for self-healing rollbacks (id, timestamp, svelte_code, json_config, is_stable).
5. **UI Kit Setup**:
   - Initialize `shadcn-svelte` and **Tailwind CSS v4**.
   - Create `src/routes/layout.css` and paste the `@theme` definitions from `DESIGN.md`. Add Google Font `Inter` to `src/app.html`.
6. **Python Sidecar Skeleton (Flow Manager)**:
   - Create `backend/` directory at the project root.
   - Create `backend/requirements.txt` containing: `fastapi`, `uvicorn`, `langgraph`, `langchain`, `playwright`, `pytest`.
   - Setup a basic `backend/main.py` FastAPI server running on a specific port (e.g., `localhost:8000`).

**Phase 1 Completion Criteria**:
- `pnpm run dev` serves the Svelte app successfully.
- `python backend/main.py` serves the FastAPI backend successfully.
- Drizzle migrations run successfully and generate the local SQLite `.db` file.

---

## Phase 2: Core Atoms & Primitive Features

**Goal:** Build the reusable UI components and the basic communication layers (Ollama + Voice).

1. **Ready-Made Components (shadcn-svelte)**:
   - Generate `Button`, `Card`, `Input`, `Badge`, `ScrollArea` via `npx shadcn-svelte@latest add [component]`
2. **Local AI Connection (Ollama)**:
   - Create `src/lib/ai/ollama.ts`.
   - Implement `askLocalModel(prompt, schema)` using native `fetch` to `http://localhost:11434/api/chat`.
   - Target model: `gemma4:e4b`.
   - **Crucial:** Implement defensive JSON parsing (strip ` ```json ` fences before `JSON.parse`).
3. **Voice UI (Browser Native)**:
   - Create `src/lib/components/ui/VoiceRecorder.svelte`.
   - Use `window.SpeechRecognition` (or `webkitSpeechRecognition`) for capturing voice to text.
   - Use `window.speechSynthesis` for text-to-voice feedback.
   - Ensure a glowing mic icon (using tailwind `animate-pulse`) shows during listening.

**Phase 2 Completion Criteria**:
- All UI atoms are in `src/lib/components/ui`.
- `ollama.ts` successfully fetches structured JSON from a local running Ollama instance.
- Voice UI component can transcribe speech to text natively in the browser.

---

## Phase 3: The Dashboard (Sections)

**Goal:** Build the primary UI relying heavily on the primitives created in Phase 2.

1. **Layout & Sidebar**:
   - Build `src/routes/+layout.svelte`. Implement a sticky sidebar for navigation and global Voice Input trigger.
2. **Weekly / Daily Planner View (`src/routes/+page.svelte`)**:
   - Build `src/lib/components/sections/TaskList.svelte`.
   - Connect it to the Drizzle SQLite database (via SvelteKit load functions).
   - Display tasks using Bento grid layouts (reusing `Card` components).
3. **Agent Feed Section**:
   - Build `src/lib/components/sections/AgentFeed.svelte`.
   - This displays the real-time textual or JSON feedback from the LLM based on user voice prompts.

**Phase 3 Completion Criteria**:
- The main dashboard loads data from SQLite.
- Tasks can be added/updated via the UI.
- `npm run build` passes with no errors.

---

## Phase 4: The Open-Source "Safe-Healing" Pipeline (LangGraph)

**Goal:** Implement the sophisticated LangGraph state machine inside the Python Sidecar to allow the agent to edit Svelte files autonomously and safely.

1. **LangGraph State Machine (`backend/orchestrator.py`)**:
   - Define a state graph: `GenerateCode` -> `ValidatePlaywright` -> (If Fail) `SelfHeal` -> (If Pass) `Deploy`.
2. **The Agent Coder Tool**:
   - Write a LangChain Tool inside Python that takes a prompt, modifies the specific `.svelte` or JSON layout file in the SvelteKit directory.
3. **The Validation Gate (Playwright)**:
   - Write a Python script `backend/validate_ui.py` using Playwright for Python.
   - The script opens `localhost:5173`, waits for the UI to render, and checks for Javascript errors or massive layout shifts.
   - If an error is caught, return the stack trace back to the LangGraph `SelfHeal` node.
4. **The Rollback Mechanism (SRE Gate)**:
   - If the `SelfHeal` loop fails 3 times, the sidecar restores the Svelte code from the `ui_versions` SQLite table to its previous stable state.

**Phase 4 Completion Criteria**:
- You can trigger the LangGraph pipeline via a FastAPI endpoint.
- It attempts to modify a Svelte file.
- Playwright runs silently and confirms the UI is not broken.
- Rollback successfully reverts files if a deliberate syntax error is introduced.

---

## Execution Directives for Agents
- **Run `svelte-autofixer` constantly**: On every `.svelte` file modification, run `npx @sveltejs/mcp svelte-autofixer`.
- **Pre-flight Checks**: Consult the `design-taste-frontend` Pre-Flight Check before delivering any visual Phase.
- **Never Hardcode Copy**: All static text goes into `src/lib/data/` files.
- **Use Ready-Made**: Do not write complex UI from scratch; generate it via `shadcn-svelte`.
