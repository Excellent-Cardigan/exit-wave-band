# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # Install dependencies
npm run dev    # Start Vite dev server (always run in the background)
npm run build  # Production build
```

No test runner or lint script is configured in package.json. This project was bootstrapped from Figma Make.

## Architecture

**Stack:** React 18 + Vite 6 + Tailwind CSS v4 + React Router 7

**Entry:** `src/main.tsx` → `src/app/App.tsx` (RouterProvider) → `src/app/routes.ts`

**Path alias:** `@` maps to `src/`

### Pages (`src/app/pages/`)

| Route | File | Purpose |
|---|---|---|
| `/` | `Home.tsx` | Hub/landing — links to all sections |
| `/entry` | `Entry.tsx` | Portal entry sequence — oscilloscope + terminal boot |
| `/signal` | `Signal.tsx` | Music player — "THE SIGNAL" |
| `/coven` | `Coven.tsx` | Member profiles — "THE ARCHIVE" (maps to Archive.tsx also present) |
| `/ritual` | `Ritual.tsx` | Contact — "RITUAL" |
| `/terminal` | `Terminal.tsx` | Terminal/debug view |

`Archive.tsx` also exists in pages but is not yet in the router.

### Shared components (`src/app/components/`)

- `Navigation.tsx`, `Footer.tsx`, `FooterWithResistance.tsx` — layout shell
- `ui/` — shadcn/ui primitives (Radix-based)
- `figma/` — Figma Make-generated components

### Styles (`src/styles/`)

- `theme.css` — CSS custom properties for the full design system (colors, typography tokens, radius = 0 everywhere, glow utilities, MTG card frame utilities)
- `fonts.css` — Google Fonts imports for the three-layer typography system
- `tailwind.css` — Tailwind base import
- `index.css` — Root import (loads fonts, tailwind, theme)

### Key design system tokens (defined in `src/styles/theme.css`)

**Palette:**
- `--color-parchment: #e8e1d3` — primary background / warm bone text
- `--color-ink: #2b2820` — primary text
- `--color-signal: #3a8a7a` — primary signal/glow (cold teal)
- `--color-accent: #4a7c9e` — secondary accent (muted blue)
- `--color-ritual: #1a1816` — near-void dark surface

**Typography layers (CSS classes):**
- `.text-blackletter` → `--font-blackletter` (Cormorant) — circle names, ritual/lore moments only
- `.text-mono` → `--font-mono` (IBM Plex Mono / Share Tech Mono) — all UI chrome, system labels
- `.text-serif` → `--font-serif` (Cinzel) — lore pull quotes and long-form mythological text

Default body font is monospace. All radii are 0 (sharp corners everywhere).

## Design Constraints (from DESIGN-BRIEF.md)

This project has strong, intentional aesthetic rules — read DESIGN-BRIEF.md before working on any UI. Key hard constraints:

- **Never** use pure `#000000` as background
- **Never** use humanist/geometric sans-serif (Inter, DM Sans, Poppins, etc.)
- **Never** snap or instant-cut animations — everything transitions (spring-eased or physically simulated)
- Disconnect animations: drift + fade over **800–1200ms**
- Beat pulse: sharp outward **80ms ease-out**, then spring decay
- Blackletter (`text-blackletter`) is reserved for ritual/mythological contexts only — not UI chrome
- Monospace is reserved for machine/system contexts only — not lore text
- Do not mix all three type layers in a single view
- No rounded corners anywhere (radius = 0)
- Navigation is hidden or earned on the entry page — no standard nav bar there

## Stem Player Architecture (planned — see STEM-PLAYER-SPEC.md)

The centerpiece feature is a physics-driven interactive stem player. When building it:

- **d3-force** runs in a `requestAnimationFrame` loop — positions written to **React refs**, never state. React must not re-render on animation frames.
- Audio signal chain per stem: `AudioBufferSourceNode → GainNode → AnalyserNode → GainNode (master) → AnalyserNode (master) → ctx.destination`
- Use **Tone.js** Transport/Player for scheduling; raw Web Audio API for the gain/analyser graph
- Connect/disconnect = `.connect()` / `.disconnect()` with `linearRampToValueAtTime()` fade over ~100ms to avoid clicks
- Beat scheduling: BPM manifest + Chris Wilson-style lookahead scheduler (25ms `setTimeout` targeting AudioContext time)
- Visual node content: **p5.js** in instance mode (one sketch per card) for v1; Three.js + GLSL for v1.5+
- Graph edges + background layer: **Pixi.js** canvas (z-index beneath React node cards)

Critical files to create when building the stem player:
- `src/audio/engine.js` — Web Audio context, stem loader, gain/analyser graph
- `src/graph/simulation.js` — d3-force simulation and tick loop
- `src/audio/beatScheduler.js` — lookahead scheduler, BeatBus emitter
- `public/songs/manifest.schema.json` — song manifest contract

## Reference Documents

- `DESIGN-BRIEF.md` — full aesthetic brief, palette, behavior specs, avoid list
- `STEM-PLAYER-SPEC.md` — stem player architecture, stack decisions, song manifest schema, phased build plan
- `STORY.md` — lore bible; every visual and interaction decision should reference this
- `src/imports/ImplementDesignBrief.tsx` — Figma Make-generated initial implementation reference
