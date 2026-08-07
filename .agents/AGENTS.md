# Agent Harness Rules (AGENTS.md)

## 0. Project Overview & Architectural Context
- **Vision**: An AI-native personal manager application using a local-first architecture.
- **Tech Stack**: Tauri + SvelteKit frontend, Python sidecar backend.
- **Safe-Healing Pipeline**: An autonomous loop (Agent Coder -> LangGraph Flow Manager -> Playwright Validation Gate -> Canary Rollback) that edits Svelte files securely.
- **Deferred Features**: Email fetching and Argo Rollouts are intentionally deferred to Phase 2. Focus on local SQLite state and local Ollama model for Phase 1.

## 1. Tech Stack & Syntax Rules (Non-Negotiable)
- **Framework**: SvelteKit with **Svelte 5** (runes mode).
- **Desktop Runtime**: Tauri (for native desktop capabilities).
- **Styling**: **Tailwind CSS v4** via `@tailwindcss/vite`.
  - There is NO `tailwind.config.js/ts` file. Do NOT create one.
  - Do NOT use `@tailwind base/components/utilities` — use `@import 'tailwindcss'` instead.
  - All theme customization happens inside CSS using `@theme { }` blocks in `src/routes/layout.css`.
  - Use Tailwind CSS for all styling. Avoid writing custom scoped CSS `<style>` blocks unless absolutely necessary for complex animations or pseudo-elements.
- **UI Components**: `shadcn-svelte`. Use ready-made components to minimize raw UI code.
- **Svelte 5 Runes Mode**: Use `$props()`, `$state()`, `$derived()`, `$effect()`, `{@render}`, and `{#snippet}`. 
  - **EXPLICITLY BANNED SVELTE 4 SYNTAX**: Do NOT use `export let`, `$:` reactive statements, `on:click` (use `onclick`), `<slot>` (use `{@render}`), or `createEventDispatcher`.

## 2. Local AI & LLM Integration Rules (Ollama + Gemma 4)
- **Ollama Connection**: Connect to `http://localhost:11434/api/chat` using the model `gemma4:e4b`.
- **CORS Handling**: Assume `OLLAMA_ORIGINS="*"` is set by the user. Call Ollama directly from the frontend/sidecar without unnecessary proxies.
- **Performance Tuning (Optional)**: If context is small, cap it in the request: `options: { num_ctx: 8192 }`.
- **API Request Shape**: `{ "model": "gemma4:e4b", "messages": [ { "role": "system", "content": "..." }, { "role": "user", "content": "..." } ], "stream": false }`
- **API Response Path**: The LLM's response string will always be found at `data.message.content`.
- **JSON Outputs**: When prompting the LLM for structured data, enforce strict JSON schemas in the system prompt.
  - *Example System Prompt*: `You MUST respond only with valid JSON, no other text. Schema: { "key": "value" }`
  - *Defensive Parsing*: Always strip markdown code fences before running `JSON.parse`. Example:
    ```javascript
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    ```
- **Voice UI**: Use browser-native APIs for frontend voice input/output. DO NOT use heavy external models like Whisper inside the frontend. The backend Python sidecar may use `faster-whisper`.
  - *Speech to Text*: Use `new (window.SpeechRecognition || window.webkitSpeechRecognition)(); recognition.lang = 'en-US';`
  - *Text to Speech*: Use `window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));`

## 3. Strict File Granularity (Small Files)
- **Max Length**: No single `.svelte` or `.ts` logic file should exceed **150 lines**.
  - *Refactoring*: If a file grows larger, it MUST be refactored into smaller, composable sub-components or utility functions.
  - *Exception*: Data files (`src/lib/data/*.ts`) containing static content objects are exempt from the line limit.

## 4. Content Separation (No Hardcoded Text)
- All static data MUST be extracted into separate files under `src/lib/data/`.

## 5. Component Architecture
- Break pages into **Section Components** and **UI Components** (reusing shadcn where possible).

## 6. Single Responsibility Principle
- Extract complex state management into `.svelte.ts` modules.

## 7. Directory Structure
src/
├── lib/
│   ├── components/
│   │   ├── ui/          # Reusable atoms (shadcn)
│   │   ├── sections/    # Page sections
│   │   └── layout/      # Nav, Sidebar
│   ├── ai/              # AI integration (ollama.ts)
│   └── data/            # Content data files
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── layout.css
backend/               # Python sidecar for LangGraph orchestrator

## 8. Mandatory Skills Usage
Agents MUST consult and use the following skills when working in their respective domains:
1. **`svelte-code-writer`**: Run `npx @sveltejs/mcp svelte-autofixer` on every `.svelte` file before finalizing.
2. **`design-taste-frontend`**: Consult Pre-Flight Check before delivering frontend sections.
3. **`drizzle-orm`**: Consult when writing or updating SQLite schemas and queries.
4. **`playwright-cli` & `playwright-best-practices`**: Consult when developing the `validate_ui.py` script or any E2E tests.
5. **`tauri-v2`**: Consult when updating `tauri.conf.json`, rust code, or desktop capabilities.
6. **`shadcn-svelte`**: Consult when scaffolding or customizing UI components.
7. **`fastapi`**: Consult when developing the Python LangGraph sidecar backend.
8. **`find-skills`**: Use `npx skills find <query>` to discover new capabilities if stuck on unfamiliar domains.

*(Installation for new agents: Install missing skills via `npx skills add <owner/repo@skill>` prior to starting development)*

## 9. Phase Verification
Confirm foundations exist before building sections. Check `WORKFLOW.md` for explicit completion criteria per phase.

## 10. Build Verification
Always run `pnpm run build` or `npm run build` before declaring done.

## 11. No Comments
Do not write HTML/JS comments. Use self-documenting naming for variables, functions, props, and components.
