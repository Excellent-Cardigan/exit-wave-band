# Exit.Wave — Homepage Spec
**Status: FROZEN — human-approved intent artefact. Do not edit content model.**
**Phase: AI-DLC Build — Paper.design exploration (6 directions)**

---

## Project context

Exit.Wave is an electronic **collective** with named members — not a solo artist. Industrial, ambient, goth, post-punk, with goth-disco and minimal synth-pop edges. Mood: haunted but danceable. "Transmissions from 1984 heard in 2025." Reference: Nine Inch Nails, Boards of Canada, The Cure, Portishead, HEALTH, Aphex Twin.

The political/resistance dimension reads through aesthetic only — never stated in copy.

---

## Content model (locked)

### Releases (2)

| | Release A | Release B |
|---|---|---|
| Type | Solo album — released | Band full-length — out July, pre-order |
| Has | Title, cover art, tracklist, formats, buy link, streaming links, stem pack | Title, track art, tracklist, formats, buy link, streaming links, stem pack |

Build as if all art and copy exist. Use realistic placeholder content. Never "lorem ipsum". Never stock/AI imagery — use solid fields, shader fills, or labelled image slots.

### Members

Several members. Each has: name, photo slot, role, short bio, links.

### Blog

Multi-author updates feed. Recent posts, each with: title, author, date, excerpt.

### Stems

Per-release downloadable stem packs. First-class module — not a footnote.

---

## Homepage modules

All six directions must accommodate every module. Directions differ in **hierarchy, treatment, and shader intensity** — not in which content exists.

| # | Module | Notes |
|---|---|---|
| 1 | **Hero** | Name, one atmospheric line, shader backdrop, clear entry path |
| 2 | **Featured release** | Solo album (available now) + band album (out July, pre-order). Dual-feature allowed. |
| 3 | **Listen** | Embedded player or DSP row |
| 4 | **Buy / Own → subvert.fm** | Primary purchase surface. Above Spotify/Apple, never visually subordinate. |
| 5 | **Stems** | Download per release. First-class. |
| 6 | **Members** | Names, photos, bios |
| 7 | **Blog** | Recent updates |
| 8 | **Visuals** | Reel or sparse gallery |
| 9 | **Footer** | Contact/booking, EPK link, social row, optional mailing-list field |

---

## Action priority (a constellation, in order)

1. Absorb the atmosphere
2. Listen
3. Buy / own on **subvert.fm**
4. Reach the subvert.fm page
5. Download stems

> subvert.fm is a co-op-owned, 0%-fee, artist-owned marketplace. It is a values statement. "Purchase music" and "subvert.fm" are the same destination. Place it above Spotify/Apple.

---

## NEVER — hard guardrails

Self-check every artboard against this list before moving on.

- No explicit political copy or sloganeering
- No SaaS/startup tells: no "Sign up free," testimonial carousels, icon-feature grids, logo soup, big rounded gradient CTAs
- No stock photography or generic AI imagery — use shaders, solid fields, or clearly labelled image slots
- No dark patterns: no autoplay audio on load, pop-ups, cookie nags, exit-intent modals, fake countdowns, fake scarcity
- No surveillance-grade trackers in design assumptions
- No clutter / no kitchen-sink navigation — atmosphere carries it
- Do not bury subvert.fm or stem packs beneath mainstream streaming

---

## Six directions

Same content model. Same aesthetic. Same guardrails. Differ in hierarchy, treatment, and shader intensity.

### 1. Signal Lock — release-forward hub
Latest release dominates above the fold. Play + buy (subvert.fm) + stems one tap away. Functional, fan-converting. **Minimal shader** (subtle grain only); content does the work.

### 2. Dead Channel — maximal atmosphere
Full-bleed shader entry: Image Dithering + Grain + scanline/VHS feel. Almost no chrome. Content revealed on scroll. Faceless-leaning entry; members deeper down. **Maximal shader intensity.**

### 3. Index — archival catalog
The site as a transmission archive: releases, members, blog, stems as a dense monospaced directory. Brutalist, text-forward, post-punk zine energy. **Shaders sparse and structural.**

### 4. Collective — members-forward
Leads with the people (names/photos/bios) and the blog; music and store follow. Humanizes the project. **Mid shader intensity** — warm grain on portrait slots.

### 5. Broadcast — editorial long-scroll
Cinematic vertical narrative: hero → release → lore → members → blog → store. **Shader-driven section transitions** carry the mood between chapters.

### 6. Mirrorball — goth-disco, motion-forward
The one direction that *moves*. Built around rhythm and the body. Corroded-chrome Liquid Metal + Halftone, a pulsing/looping hero, release framed like a club-night flyer. **Saturated but moody — danceable, not bright.** Play-now leads; buy/stems follow. **Heaviest shader: Liquid Metal + Halftone CMYK.**

---

## Portability constraints (winner ports to Kirby CMS)

- Semantic HTML + Tailwind utility classes (Kirby supports Tailwind v4)
- `prose`-wrapped region for CMS rich text (blog/bio)
- Every module component-shaped and content-driven → maps to Kirby snippet + blueprint
- Progressive enhancement (Alpine.js-friendly) — no React-only patterns
- Port path: Paper JSX/HTML → `site/templates/*.php` + `site/snippets/*.php` + blueprint YAML, Tailwind retained

---

## Build checklist (Paper.design, 1440px desktop + 390px mobile hero minimum)

- [ ] 1. Signal Lock artboard — screenshot + self-review
- [ ] 2. Dead Channel artboard — screenshot + self-review
- [ ] 3. Index artboard — screenshot + self-review
- [ ] 4. Collective artboard — screenshot + self-review
- [ ] 5. Broadcast artboard — screenshot + self-review
- [ ] 6. Mirrorball artboard — screenshot + self-review
- [ ] Reflection: rationale per direction + single recommendation
- [ ] HARD STOP — wait for human selection

---

## Definition of done (this phase)

- This file written ✓
- 6 artboards built in Paper, each screenshotted and self-reviewed against guardrails
- Reflection: 6 screenshots + one-paragraph rationale each + single recommendation tied to action priority
- **Then stop. No Kirby code. No repo changes beyond this file.**
