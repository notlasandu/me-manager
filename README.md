# MeManager

**An AI-native personal manager application using a local-first architecture.** MeManager combines a high-performance desktop frontend with an autonomous AI sidecar. Its defining capability is its **self-adaptable and self-healing frontend**: the application can intelligently redesign its own UI and fix its own code in real-time, safely rolling back changes if visual or functional errors are detected.

## ✨ The Vision: Self-Adaptability & Self-Healing

The core philosophy of MeManager is that an AI assistant shouldn't just *tell* you things—it should mold the software to your needs.

If you say, *"I need a Kanban board for my tasks today,"* the agent doesn't just output a list. It physically rewrites its own frontend to render a working Kanban board.

### How it Works (The Safe-Healing Pipeline)

Editing raw source code at runtime is notoriously dangerous. MeManager solves this using a **LangGraph State Machine** paired with an **SRE (Site Reliability Engineering) Rollback Gate**.

1. **Agent Coder**: The local LLM processes your voice request and proposes a UI change (e.g., modifying a Svelte component).
2. **LangGraph Flow Manager**: Orchestrates the autonomous loop, safely injecting the code into the active SvelteKit workspace.
3. **Playwright Validation Gate**: A headless browser instantly spins up in the background (via a Python sidecar) to test the newly compiled Svelte code. It checks for JavaScript errors, layout shifts, or missing UI components.
4. **Self-Heal / Canary Rollback**: If Playwright detects a crash, the exact error stack trace is fed *back* to the LLM so it can self-heal. If the LLM fails to fix it after 3 attempts, the sidecar queries the local `ui_versions` SQLite table and instantly rolls back the frontend to the last stable state.

*(See the architectural rules in [.agents/WORKFLOW.md](file:///c:/Users/Lasandu/SoftwareProjects/Svelte/me-manager/.agents/WORKFLOW.md) and the sidecar skeleton in [backend/main.py](file:///c:/Users/Lasandu/SoftwareProjects/Svelte/me-manager/backend/main.py))*

## 🚀 Deep Dive: Core Features

### 1. Local-First & Privacy-Focused

**Why?** Personal management data (tasks, schedules, thoughts) is highly sensitive. Cloud-based LLMs pose a massive privacy risk and require continuous internet connectivity.  
**How?**

- State is managed via a **local SQLite database** (powered by `better-sqlite3` and [Drizzle ORM](https://orm.drizzle.team/)) for instant, offline data access. 
- The intelligence layer runs entirely on your local machine using [Ollama](https://ollama.com/) with lightweight, highly-capable models like `gemma4:e4b`. Your data never leaves your device.

### 2. High-Performance Desktop UI

**Why?** Web wrappers often feel sluggish. A personal manager needs to feel native, snappy, and deeply integrated with the OS.  
**How?**

- The UI is built using **[Svelte 5 (Runes mode)](https://svelte.dev/)** and **[Tailwind CSS v4](https://tailwindcss.com/)** for maximum reactivity and minimal overhead.
- The desktop shell is powered by **[Tauri v2](https://tauri.app/)** (Rust), allowing for incredibly low memory usage while retaining the ability to trigger system-level APIs.
- UI atoms and components are provided by **[shadcn-svelte](https://shadcn-svelte.com/)**, ensuring beautiful, highly accessible designs.

### 3. Browser-Native Voice Interaction

**Why?** Voice interaction dramatically reduces friction for task entry. However, running heavy ML models like Whisper directly on the frontend degrades performance and drains battery.  
**How?**

- We leverage the lightweight, built-in Web Speech API (`window.SpeechRecognition` and `window.speechSynthesis`).
- The `VoiceRecorder` component processes audio instantly without external API dependencies, featuring a dynamic glowing pulse animation indicating active listening.

---

## 🏗️ Project Structure

- `src/` — SvelteKit frontend containing all UI primitives, sections, and the local AI integration layer.
- `src-tauri/` — Tauri v2 Rust backend for native desktop capabilities.
- `backend/` — Python FastAPI sidecar orchestrator for the LangGraph state machine and Playwright UI validation.
- `.agents/` — The **Agent Harness**. Contains strict guidelines (`AGENTS.md`, `WORKFLOW.md`, `DESIGN.md`) and ecosystem skills that AI agents MUST follow when contributing to this repository.

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) & [pnpm](https://pnpm.io/)
- [Rust & Tauri Toolchain](https://tauri.app/v1/guides/getting-started/prerequisites)
- [Python 3.10+](https://www.python.org/)
- [Ollama](https://ollama.com/) (running locally on `localhost:11434` with model `gemma4:e4b` and CORS enabled)

### Installation

1. **Frontend Dependencies**
  ```bash
   pnpm install
   # (Approve any build scripts for better-sqlite3 if prompted: pnpm approve-builds)
  ```
2. **Backend Dependencies**
  ```bash
   cd backend
   pip install -r requirements.txt
  ```

### Running the App

Start the SvelteKit frontend (or Tauri desktop app):

```bash
# For standard web dev server
pnpm run dev

# For Tauri desktop development
pnpm tauri dev
```

Start the Python LangGraph Sidecar:

```bash
cd backend
python main.py
```

## 🤖 Contributing (For AI Agents)

This repository is heavily maintained by AI agents. If you are an AI assistant working on this codebase, you **MUST** strictly adhere to the rules defined in the `.agents/` directory:

1. Read `.agents/AGENTS.md` before making any code changes.
2. Follow the visual standards in `.agents/DESIGN.md`.
3. Adhere to the strict progression and phases outlined in `.agents/WORKFLOW.md`.
4. Utilize the installed skills located in `.agents/skills/` (e.g., `svelte-code-writer`, `shadcn-svelte`, `fastapi`, `playwright-cli`).
