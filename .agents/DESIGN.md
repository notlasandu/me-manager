## Design Read
*"A sleek, AI-native, dark-themed personal management dashboard. Glassmorphic elements, highly functional bento grids, and a premium productivity aesthetic."*

## The Three Dials
- **DESIGN_VARIANCE: 4** — Keep layouts functional and structured (dashboards).
- **MOTION_INTENSITY: 3** — Restrained motion; subtle hovers and smooth transitions.
- **VISUAL_DENSITY: 7** — High data density but clean typography.

## Local AI Integration Aesthetics
- **Voice Feedback**: Use native browser `window.speechSynthesis` for audio feedback. Ensure UI reflects listening states visually (e.g. glowing mic icon).
- **Data Rendering**: AI responses will arrive as structured JSON from `gemma4:e4b`. Map JSON directly to `shadcn-svelte` bento grid cards rather than rendering raw text blocks.

## Color Palette (Locked)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-primary` | `#6366f1` | Indigo accent for tasks/buttons/AI states |
| `--color-brand-dark` | `#0f172a` | Deep slate background |
| `--color-brand-surface` | `#1e293b` | Card backgrounds |

## Typography (Locked)
| Role | Font | Tailwind Classes |
|------|------|------------------|
| **Display / H1** | Inter | `text-4xl font-bold tracking-tight text-white` |
| **Section Headings** | Inter | `text-2xl font-semibold text-slate-200` |
| **Body** | Inter | `text-base text-slate-400 leading-relaxed` |

## Spacing & Layout (Locked)
| Token | Value | Notes |
|-------|-------|-------|
| **Max Content Width** | `max-w-7xl mx-auto px-6` | Standard layout |
| **Section Padding** | `py-12` | Dashboard vertical rhythm |
| **Card Grid Gaps** | `gap-4` | Bento grids |

## Aesthetic Rules (Locked)
### Glassmorphism / Cards
- **Dark variant**: `bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-sm`
- All cards use `rounded-xl`.

### Interactive States
- **Button Hover**: `hover:brightness-110 hover:scale-[1.02]`
- **Transitions**: `transition-all duration-300 ease-out`

## Component Checklist (Pre-flight)
- [ ] Correct font loaded
- [ ] Uses ready-made UI atoms (e.g., shadcn)
- [ ] No hardcoded copy
- [ ] Native voice APIs mapped to UI buttons
- [ ] JSON mapped cleanly to UI cards (no raw code blocks)
- [ ] No comments in `.svelte` files
- [ ] `npm run build` passes
