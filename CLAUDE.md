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

**Stack:** React 18 + Vite 6 + Tailwind CSS v4 + React Router 7 + Motion (Framer Motion v11)

**Entry:** `src/main.tsx` → `src/app/App.tsx` (RouterProvider) → `src/app/routes.ts`

**Path alias:** `@` maps to `src/`

### Layout shell

All routes are nested under `Layout` (`src/app/components/Layout.tsx`), which:
- Wraps `AudioProvider` (global audio state)
- Renders `AnimatePresence` + `motion.div` for route transitions (opacity fade, 200ms)
- Mounts `GlobalPlayer` (persistent bottom bar) — adds `pb-24` when a track is active
- Uses the `LayoutInner` sub-component pattern so `GlobalPlayer` can read `AudioContext` from inside the provider

### Pages (`src/app/pages/`)

| Route | File | Purpose |
|---|---|---|
| `/` | `Home.tsx` | Hub/landing — featured track card + terminal track list; dual-nav (demo pill → `<Navigation />` after 600px scroll) |
| `/entry` | `Entry.tsx` | Portal entry sequence — oscilloscope + terminal boot. Nav is hidden/earned here. |
| `/signal` | `Signal.tsx` | Music player — "THE SIGNAL" — stacked swipeable TrackCards |
| `/coven` | `Coven.tsx` | Member profiles — "THE ARCHIVE" |
| `/ritual` | `Ritual.tsx` | Contact form — "RITUAL" |
| `/terminal` | `Terminal.tsx` | Terminal/debug view |

`Archive.tsx` exists in pages but is not in the router.

### Global audio (`src/app/context/AudioContext.tsx`)

Single `<audio>` element managed in a React context. `useAudio()` exposes:
`play(track, list?)`, `pause()`, `togglePlay(track, list?)`, `next()`, `previous()`, `setVolume(n)`, `currentTrack`, `isPlaying`, `progress`, `volume`, `trackList`.

Uses ref-sync pattern (`currentTrackRef`, `trackListRef`, `isPlayingRef`) to avoid stale closures inside event handlers without triggering re-renders.

### Kirby CMS integration

Content is served from Kirby (headless, installed at `public/cms/`).

- **Production:** PHP at `/cms/tracks.json`, `/cms/members.json`, `/cms/lore.json`
- **Dev:** Vite can't run PHP — requests go to `/mock/*.json` fixtures in `public/mock/`
- `src/app/lib/kirby.ts` — `kirbyFetch()` switches base URL: `/mock` in dev, `/cms` in prod
- `src/app/hooks/useKirbyData.ts` — data-fetching hooks
- `src/app/hooks/useContactForm.ts` — contact form submission
- `src/app/types/kirby.ts` — `KirbyTrack`, `KirbyMember`, `KirbyLoreEntry` types

**Kirby gotcha:** `status` is a reserved Kirby field — stored as `track_status` in content files, mapped back to `status` in the PHP template.

### Shared components (`src/app/components/`)

- `Navigation.tsx`, `Footer.tsx`, `FooterWithResistance.tsx` — layout chrome
- `GlobalPlayer.tsx` — fixed bottom audio player, reads `useAudio()`
- `TrackCard.tsx` — Figma-designed card; accepts `bpm` prop that drives `beat-pulse` CSS animation duration when playing
- `ui/` — shadcn/ui primitives (Radix-based)
- `figma/` — Figma Make-generated components

### Styles (`src/styles/`)

- `theme.css` — CSS custom properties for the full design system (colors, typography tokens, radius = 0, glow utilities)
- `fonts.css` — Google Fonts imports
- `tailwind.css` — Tailwind base import
- `index.css` — Root import (loads fonts, tailwind, theme)

### Design system tokens (defined in `src/styles/theme.css`)

**Palette — sage/olive/lime editorial:**
- `--color-paper: #fafeef` — primary page background (all pages except Terminal/Entry dark canvas)
- `--color-forest: #36430f` — primary text on light backgrounds
- `--color-sage: #838b6a` — borders, secondary UI, muted elements
- `--color-sage-dim: rgba(131,139,106,0.4)` — light borders
- `--color-olive: #6f8825` — secondary/duration text
- `--color-lime: #c7ff1d` — play buttons, active states, progress fill
- `--color-ink: #2b2820` — dark footer panel
- `--color-void: #0A0A0C` — Entry canvas, Signal atmospheric bg, Terminal (dark-mode only)
- `--color-bone*` — kept for dark overlays in Signal/Entry/Terminal only

**Typography — three layers (Adobe Fonts — kit URL required in `src/styles/fonts.css`):**
- `.text-display` → `--font-display` (Ohno Fatface) — logo, member circle names, big lore headers. Never for UI chrome.
- `.text-condensed` → `--font-condensed` (Field Gothic) — nav labels, section headers, archive rows.
- `.text-mono` → `--font-mono` (Suisse International Mono) — all UI chrome, metadata, timestamps, status labels.
- Cormorant, Gilda Display, IBM Plex Mono, Playfair Display are **removed** — do not reintroduce.

All radii are 0 (sharp corners everywhere — `--radius: 0`).

## Design Constraints (from DESIGN-BRIEF.md)

Read `DESIGN-BRIEF.md` before any UI work. Hard rules:

- **Never** use pure `#000000` as background (use `--color-void: #0A0A0C`)
- **Never** use humanist/geometric sans-serif (Inter, DM Sans, Poppins, etc.)
- **Never** snap or instant-cut animations — everything transitions (spring-eased or physically simulated)
- Disconnect animations: drift + fade over **800–1200ms**
- Beat pulse: sharp outward **80ms ease-out**, then spring decay
- No rounded corners anywhere (radius = 0)
- Navigation is hidden or earned on the entry page

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

## Deployment

- **Host:** cPanel shared hosting at exitwave.band (IP: 198.54.115.33)
- **Method:** cPanel Git Version Control → Deploy HEAD Commit
- **`dist/` is committed to git** — Vite build output lives in the repo so cPanel copies files directly
- `.cpanel.yml` copies `dist/` to `/home/exitrgsu/public_html/`
- `.htaccess` in `public/` handles React Router client-side routing and passes `/cms` requests through to PHP
- **Audio files must be uploaded manually via cPanel File Manager** — Git LFS objects don't deploy via cPanel git. Audio is served from `/audio/` in `public_html/`.

## Reference Documents

- `DESIGN-BRIEF.md` — full aesthetic brief, palette, behavior specs, avoid list
- `STEM-PLAYER-SPEC.md` — stem player architecture, stack decisions, song manifest schema, phased build plan
- `STORY.md` — lore bible; every visual and interaction decision should reference this
- `src/imports/ImplementDesignBrief.tsx` — Figma Make-generated initial implementation reference
