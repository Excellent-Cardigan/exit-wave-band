# Exit-Wave — Interactive Stem Player: Song Page Spec

## Context

Exit-Wave wants a song page that functions as a ritual object, not a music player. Each stem of a finished track is a floating node in a physics-driven graph. Users connect and disconnect stems, adjust volume, and attach beat-reactive visual/animation nodes. The experience draws from the TOOL Flash site and early Radiohead W.A.S.T.E. — immersive, world-like, earned.

The project is currently greenfield (only STORY.md exists). This spec covers concept, architecture, stack options, and open questions — designed to be saved and returned to when build begins.

---

## Concept

### Node Types

**Audio Nodes** — one per stem (drums, bass, vocals, synth, guitar, field recording, etc.)
- Randomly placed on load, various sizes, labeled
- All default-connected to the Master Output node
- Click to disconnect/reconnect → GainNode disconnects from master, node drifts outward
- Per-node volume knob (radial SVG arc, not an HTML range input)
- Mini waveform display fed by AnalyserNode

**The Master Output Node** — fixed at center, visually dominant
- Cannot be removed
- Global volume + combined level ring
- Global play/pause control

**Visual/Animation Nodes** — beat-reactive canvases
- Default disconnected (dark, faint pulse)
- Can bind to master mix OR a specific stem (e.g., connect a visual to "bass" → it reacts to bass frequencies only)
- Resizable within the card, or expand to fullscreen (graph continues running behind, dimmed)
- User can drag to reposition like any other node

### Physics & Feel
- Force-directed layout: master output pinned at center, stems orbit it
- Nodes drift continuously (low Brownian noise) — active stems drift more, disconnected stems drift further and slower
- Connection edges are animated bezier curves, not straight lines — slight sag, low-frequency wobble
- Beat events trigger a brief repulsion pulse outward from master, then spring back
- Nothing snaps. Everything transitions. Disconnecting a node dims/fades over ~1 second.

---

## Audio Architecture

**Core: Web Audio API (raw)**
All stems load as ArrayBuffers → decoded once → all `AudioBufferSourceNode.start()` calls fire at the same `ctx.currentTime + offset`. This is the only reliable method for sample-accurate multi-stem sync.

**Audio signal chain per stem:**
```
AudioBufferSourceNode → GainNode (per-stem) → AnalyserNode (per-stem) → GainNode (master) → AnalyserNode (master) → ctx.destination
```

Connect/disconnect = `.connect()` / `.disconnect()` on the stem GainNode, with a `linearRampToValueAtTime()` fade over ~100ms to avoid click artifacts.

**Recommended wrapper: Tone.js**
Use `Tone.Player` + `Tone.Transport` for the shared clock and playback controls. Drop to raw Web Audio API for the gain/analyser node graph. This hybrid is well-supported by Tone's API.

**Beat Scheduling (v1): BPM Manifest**
Store `bpm` and `downbeat_offset_seconds` per song in JSON. Use a Chris Wilson-style lookahead scheduler (25ms `setTimeout` targeting AudioContext time) to emit beat events. Perfectly accurate, no runtime analysis required.

**Beat Scheduling (upgrade path): Offline Analysis**
Use `aubio.js` or `essentia.js` to analyze the drum stem, produce a beat timestamp array, bake into the manifest. Handles rubato and complex rhythms.

**Continuous Reactivity:** Each AnalyserNode feeds `getFloatTimeDomainData()` each animation frame → RMS, low/mid/high frequency energy → piped to visual nodes and physics simulation.

---

## Stack Options

### Animation / Visual Nodes

| Tool | Browser-native | Beat-reactive | Integration | Ceiling | Verdict |
|---|---|---|---|---|---|
| **p5.js** | Yes | Yes — pass energy to `draw()` | Low — instance mode per node card | Medium-high — requires craft to escape defaults | **v1 primary** |
| **Raw GLSL / WebGL** | Yes | Yes — uniforms per frame | High — write shaders by hand | Highest possible — demoscene / ShaderToy territory | v1.5+ with dedicated shader dev |
| **Three.js** | Yes (WebGL) | Yes — update uniforms/materials | Medium | Very high — 3D, post-processing (bloom, glitch, film grain) | **Strong secondary** — especially with React Three Fiber |
| **Pixi.js** | Yes (WebGL/WebGPU) | Yes — custom GLSL filters | Medium-low | High for 2D — displacement, distortion, particle batches | Good for edge/background layer |
| **Rive** | Yes (.riv runtime) | Yes — State Machine inputs (Trigger, Number) | Medium — requires Rive editor | Medium-high for designed/authored animation | Best for sigils, logos, animated glyphs — not generative |
| **Canvas 2D API** | Yes | Yes | Very low | Medium — no GPU effects | Use only for waveform display on audio nodes |
| **jitter.video** | **No** | Yes (editor has audio sync/scrubbing) | Browser via Lottie or WebM export | High for motion design — web-based, collaborative | Authoring tool only — design beat-synced loops with audio scrubbing, export Lottie/WebM for browser |
| **TouchDesigner** | **No** | Yes natively | N/A for browser — export video/Spout/Syphon | Extremely high — industry-standard for AV installation | **Production authoring tool only** — render, export, embed as video |
| **Cavalry** | **No** | Yes (editor only) | Browser via Lottie export | High for motion design | Authored elements only — export Lottie/video for browser |

> **Key insight:** jitter.video, TouchDesigner, and Cavalry are not browser runtimes. They are production authoring tools. The workflow is: design/render visual loops in those tools → export as Lottie JSON, WebM, or sprite atlas → embed in browser player driven by beat events. jitter.video is the most accessible of the three — it runs in the browser and has built-in audio scrubbing to sync animations to a track before export.

### Node Graph UI

| Library | Pros | Cons | Verdict |
|---|---|---|---|
| **d3-force (standalone)** | Industry-standard physics, fully customizable forces, owns rendering entirely | You build all rendering yourself | **Recommended** — use for position computation only, render with your own layer |
| **React Flow** | Feature-complete out of the box, custom node components, fast to prototype | Looks like a DAW/software tool by default, fighting its aesthetic is expensive, SVG edges degrade with animation | Viable for prototype only |
| **Cytoscape.js** | Powerful graph analysis | Clinical aesthetic, wrong tool for this use case | Do not use |
| **Custom Canvas/WebGL** | Total creative control | Maximum engineering effort | Long-term target |

### Audio Library

| Library | Verdict |
|---|---|
| **Web Audio API (raw)** | Required at the core for sample-accurate sync |
| **Tone.js** | Recommended as transport/scheduling layer on top of raw API |
| **Howler.js** | Do not use — no AnalyserNode access, not designed for multi-stem sync |

### App Shell / Framework

| Option | Verdict |
|---|---|
| **React + Vite** | Recommended for v1 — ecosystem, React Three Fiber, manageable with refs to keep React out of animation hot path |
| **Svelte + Vite** | Excellent for animation-heavy work, smaller bundle, smaller ecosystem |
| **Vanilla JS + Vite** | Maximum control, most labor-intensive |

---

## Recommended Stack (Primary)

| Layer | Technology |
|---|---|
| App shell | React + Vite |
| Graph physics | d3-force (standalone module) |
| Node card rendering | React components, `position: absolute` over canvas |
| Graph edges + background | Pixi.js (dedicated canvas layer, z-index beneath cards) |
| Audio engine | Web Audio API + Tone.js Transport/Player |
| Beat scheduling | BPM manifest + custom lookahead scheduler |
| Visual node content (v1) | p5.js in instance mode (one sketch per card) |
| Visual node content (v1.5+) | Three.js + custom ShaderMaterial / GLSL |
| Authored animation (sigils) | Rive |
| Production visual authoring | jitter.video / TouchDesigner / Cavalry → export Lottie or WebM → embed |

**Architecture pattern:**
d3-force runs in a `requestAnimationFrame` loop. Positions are written to React refs (not state), applied as CSS `transform: translate()` on node cards and as Pixi.js geometry updates. React never re-renders on animation frames — only on user interactions (connect/disconnect, volume change).

---

## Recommended Stack (Alternative / Faster to Launch)

| Layer | Technology |
|---|---|
| App shell | Vanilla JS + Vite |
| Graph physics | d3-force |
| Node card rendering | Dynamic DOM |
| Graph edges | SVG layer (adequate at low node counts) |
| Audio engine | Tone.js (higher abstraction) |
| Visual nodes | p5.js instance mode |
| Authored animation | lottie-web |

---

## Song Manifest Schema

Each song needs a JSON manifest. Core fields:

```json
{
  "id": "song-slug",
  "title": "...",
  "year": 2020,
  "lore": "Short mythological annotation from STORY.md pattern",
  "bpm": 118,
  "downbeat_offset_seconds": 0.24,
  "duration_seconds": 214.6,
  "layout_seed": 8472,
  "stems": [
    {
      "id": "field",
      "label": "The City",
      "member": "Purity",
      "audio_src": { "opus": "/audio/song-01/field.webm", "aac": "/audio/song-01/field.m4a" },
      "default_connected": true,
      "default_gain": 0.7,
      "visual_style": "distinct",
      "lore_note": "7pm. Every night. Pots and windows."
    }
  ],
  "visual_nodes": [
    {
      "id": "vis-01",
      "label": "The Wave",
      "type": "p5",
      "source": "master",
      "default_connected": false,
      "sketch_module": "/sketches/the-wave.js"
    }
  ]
}
```

Note: `layout_seed` makes initial node placement deterministic per song (same URL = same layout, shareable).

---

## Design Constraints (from STORY.md)

- **Background:** near-black with slight warm or violet tint — not pure #000000
- **Node cards:** semi-transparent dark surface, border glow in muted signal color (amber, cold white, or deep cyan — TBD)
- **Active edges:** low-opacity glow, pulses on beat, color varies by stem identity
- **Master output:** brightest element — the ritual center, the drain
- **The City node (field recording stem):** visually distinct from instrument nodes — different geometry, different glow color. It represents Harlem, not an instrument.
- **Typography:** no default sans-serif. Industrial/brutalist type + organic texture (per TOOL / NIN aesthetic)
- **Motion:** nothing snaps. All transitions are spring-based or eased. Disconnect = drift + fade over 800–1200ms. Beat pulse = sharp outward (80ms ease-out), slow decay.

---

## Open Questions — Must Decide Before Build

**Blocking:**
1. What track are we building against first? Need real separated stems — even rough — to develop and test sync behavior.
2. How many stems per track? (4 vs. 8 is a meaningfully different experience in the graph.)
3. React or not? Framework decision gates all other engineering decisions.
4. Who authors the visual node animations? p5/Three.js/Rive require a generative artist or creative coder — is this a band member, a hire, or a collaboration?

**Design:**
5. Color palette — at minimum: background tone, node card surface color, primary glow/signal color.
6. Mobile strategy — the node graph is desktop-first. Is there a mobile fallback, or is this desktop-only for launch?
7. What does the visual language section of STORY.md contain? (sigils, celestial bodies, etc.) — directly determines what visual node animations show.

**Content:**
8. Are any tracks ready to have stems exported from the DAW?
9. Is stem downloading gated, and if so by what? (email, interaction, lore puzzle?)
10. Is the site statically hosted (Vercel/Netlify) or does it need server-side logic?

---

## Phased Build Outline

| Phase | Focus | Deliverable |
|---|---|---|
| 0 | Foundation | Vite + React setup, Web Audio API stem sync working (no UI), JSON manifest schema |
| 1 | Graph shell | d3-force running, HTML node cards positioned, connect/disconnect wired to GainNodes |
| 2 | Visual layer v1 | Pixi.js edge layer, first p5 visual node, beat reactivity wired |
| 3 | Polish | Color system, typography, radial volume knobs, waveform display, transition animations |
| 4 | Content + ship | First real song loaded, hosting setup, CDN for audio |

---

## Critical Files to Create (when build begins)

- `src/audio/engine.js` — Web Audio API context, stem loader, gain/analyser graph, Tone.js Transport integration
- `src/graph/simulation.js` — d3-force simulation, force parameters, tick loop, position output
- `src/audio/beatScheduler.js` — BPM manifest reader, lookahead scheduler, BeatBus event emitter
- `public/songs/manifest.schema.json` — Song manifest JSON schema (contract between content and player)
- `STORY.md` — Existing lore bible — every visual and interaction decision should reference this document

---

## Reference Examples

### Rive — Flash Aesthetic

The single most important reference for the visual direction: **2Advanced V3 Rive Rearchitecture** (2024). The original 2Advanced Studios V3 site (2001) was voted "Most Influential Website of the Decade" — the canonical Flash-era web experience. Eric Jordan rebuilt it from scratch in Rive + React (Vite), mapping every keyframe and interaction to Rive's state machine. It proves Rive is the spiritual successor to Flash and is directly aligned with Exit-Wave's aesthetic goals.

- [2Advanced V3 Rive Rearchitecture — Behance case study](https://www.behance.net/gallery/230375609/2Advanced-V3-2024-Rive-Rearchitecture)
- [Blog: "Look Ma, No Flash! 2A V3 Expansions (2024 Rive Edition)"](https://www.2advanced.blog/look-ma-no-flash-2advanced-v3-expansions/)
- [Source .riv files — Patreon (Gold Pack)](https://www.patreon.com/2Advanced/shop/v3-expansions-2024-rive-website-source-1917013)
- [School of Motion: "Is this the new Flash? Rive and the future of interactive design"](https://www.schoolofmotion.com/blog/rive)
- [Rive Community Showcase](https://community.rive.app/c/showcase)
- [Rive Marketplace](https://rive.app/marketplace/)
- [Awesome-Rive — curated examples, tutorials, runtimes](https://github.com/rive-app/awesome-rive)

### jitter.video

- [jitter.video — main site & template gallery](https://jitter.video/)
- [UI/UX animation examples](https://jitter.video/ui-ux-animations/)
- [Instagram — best place to see output examples](https://www.instagram.com/jitter.video/)

### Three.js — Beat-Reactive

- [Codrops: Audio-Reactive Visuals with Dynamic Particles in Three.js](https://tympanus.net/codrops/2023/12/19/creating-audio-reactive-visuals-with-dynamic-particles-in-three-js/) — covers BPMManager, shader uniforms, GSAP — very close to this spec's architecture
- [Codrops: 3D Audio Visualizer with Three.js, GSAP & Web Audio API](https://tympanus.net/codrops/2025/06/18/coding-a-3d-audio-visualizer-with-three-js-gsap-web-audio-api/)
- [GitHub: r3f-music-visualizer — beat-reactive with shaders in Three.js](https://github.com/rkmiller131/r3f-music-visualizer)

### p5.js — Audio Reactive

- [p5-music-viz — canonical p5 + FFT audio visualization workshop (Eyeo)](https://therewasaguy.github.io/p5-music-viz/)
- [Building a Reaction Diffusion Audio Visualizer with p5.js](https://hamy.xyz/blog/building-a-reaction-diffusion-visualizer-in-p5js) — organic/biological aesthetic relevant to Exit-Wave
- [p5.js Web Editor — audio reactive collection](https://editor.p5js.org/austinzhangmusic/collections/HBVLL4IQ0)

### General Audio Visualization

- [awesome-audio-visualization — comprehensive curated list](https://github.com/willianjusten/awesome-audio-visualization)

---

*Spec drafted: 2026-02-25 — greenfield, pre-build*
*Updated: 2026-02-25 — corrected jitter.video role, added reference examples*
