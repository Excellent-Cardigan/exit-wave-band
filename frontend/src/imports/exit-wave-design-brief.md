# EXIT.WAVE — Design Brief

---

## Build

A lore-first band website for **exit.wave** — a 5-member witch rock / dark wave / industrial electronic collective from Harlem, NY and Western Massachusetts. Not a press kit. A world. Five pages: Entry/Portal, The Signal (music player), The Stems (interactive stem player), The Archive (lore), Contact/Ritual. Desktop-first. The stem player is the centerpiece feature. Reference points: the original TOOL Flash site, Radiohead W.A.S.T.E., and the Lumon Industries computer interfaces from *Severance*. Stack: React + Vite, d3-force, Web Audio API + Tone.js, Pixi.js, p5.js.

---

## Content

**Circle names / members (in ritual order):**
- PURITY — Bobby D. — Composer, Producer, Sampler, Guitar
- TOY — Tony — Vocals
- CALM — Thom — Drums
- AER — Aaron — Composer, Producer, Modular Synth
- ZERO — John — Bass

**Songs (mastered, stems available):**
- *Moth's Lament*
- *Mounting Mountain Cemetery*
- ~12 tracks in the vault (unlisted, no details shown)

**Core lore text (exact, verbatim, ordered by weight):**
1. "The exit is not an ending — it is a rite of passage. A frequency. A door that only opens from one side."
2. "The Wave is not sound. The Wave is what sound leaves behind — the resonance in a room after the last note dies."
3. "Exit-Wave are space druids — but not the kind that tend sacred groves on forest moons. We are the witchier kind. The ones who were cast out, who left, who chose the void."
4. "Exit-Wave was never formed. It coalesced — the way a storm coalesces, the way a coven finds itself, the way a frequency that has always existed finally finds its receivers."
5. "like a signal in the static"

**Page labels:**
- Entry: no label
- Music: **THE SIGNAL**
- Stem player: **THE STEMS**
- Lore: **THE ARCHIVE**
- Contact: **RITUAL**

**Distribution:** TIDAL · Subvert FM (planned)

---

## Constraints

- No standard nav bar on entry — navigation is earned or hidden
- Music playback is woven into the experience, never bolted on as an embed
- Raw stems only available for download (not mastered tracks)
- Stem downloads gated behind an interaction — not freely exposed
- Lore is discoverable, not all surfaced at once — some hidden or earned
- Background: never pure `#000000` — near-black with violet or warm tint
- Node cards: semi-transparent dark surface, border glow in muted signal color
- Typography: no default sans-serif — three-layer type hierarchy strictly observed
- Nothing snaps — every transition is spring-eased or physically simulated
- Disconnect = drift + fade over 800–1200ms minimum
- Beat pulse = sharp outward (80ms ease-out), slow spring decay
- Master output node is fixed at center, cannot be removed, is always the brightest element
- The City (field recording stem): distinct visual geometry and glow color from instrument nodes — it represents Harlem, not an instrument
- Blackletter is reserved for ritual/mythological contexts — never used for UI chrome or system labels
- Monospace is reserved for system/machine contexts — never used for lore or member profiles
- Each of the five circle names has a unique sigil — these must be designed before UI build begins, as they appear throughout
- Scottish lore is influence, not content — no direct quotes, no character names, no mythology lifted verbatim
- The "thin place" framing governs the entry experience — the site is a membrane, not a destination

---

## Style

Corporate occult threaded with medieval heresy. A decommissioned government facility repurposed as a ritual chamber — but the ritual is older than the building. The aesthetic of Lumon Industries (*Severance*) if it were operated by space druids who remember what Scotland looked like before the clearances. Sterile grid systems bleeding into Pictish knotwork. Terminal-cold type beside blackletter. A knightly order that chose the void.

**Scottish lore as influence layer** (not source material — draw the spirit, not the text):
- The Celtic concept of *thin places* — locations where the membrane between worlds is permeable — frames the entire site. The website is a thin place. The entry portal is where the membrane is thinnest.
- Pictish carved stones as visual DNA: geometric, pre-Christian, symbolic without being legible. Node borders, sigil geometry, and section dividers pull from this — abstracted, not reproduced.
- The Highland aesthetic of desolation and scale — moors, fog, standing stones in low light — as environmental texture and mood reference. Not imagery, but feeling.
- *An dà shealladh* (second sight) as a design metaphor: lore hidden in The Archive rewards those who look twice. Visitors with second sight find things others miss.
- The five members as a knightly order — each circle name (PURITY, TOY, CALM, AER, ZERO) carries a heraldic device. These sigils appear throughout the site as identifiers, not decoration.

**Typography system (three-layer hierarchy):**
1. **Blackletter** — for circle names, The Archive section headers, and ritual/lore moments. The oldest layer. The mythological layer.
2. **Monospace / OCR** — for all UI chrome, system labels, stem player controls, status lines. The Severance layer. The machine layer.
3. **Uncial or insular serif** — for lore pull quotes and long-form mythological text. The manuscript layer.

The tension between layers 1 and 2 — blackletter beside monospace — is the aesthetic. Medieval and corporate. Coven and corporation.

**Medieval knight references:**
- Heraldic structure informs The Archive: member profiles read like illuminated manuscript entries, not artist bios. Each has a sigil, a role in the order, a lore annotation.
- The knightly order framing gives the five circle names weight — they are not stage names, they are the names of the order.
- Armorial geometry (quartered shields, border devices) abstracted into UI chrome and section dividers.

**Palette:**
- Background: `#07070d` — near-void, violet lean
- Surface: `#111119` — node cards, panels
- Primary text: `#e8e4d9` — warm bone
- Signal/glow: `#4fd1d1` — cold cyan
- Accent: `#8b7fd4` — muted violet
- Danger/disconnect: `#c47a3a` — amber warning

---

## Behavior

**Entry:** Full-screen near-void field. A single horizontal oscilloscope line — flat, then spiking as if locking onto a signal. Terminal text types in: `SIGNAL ACQUIRED.` / `FREQUENCY: EXIT.WAVE` / `[ENTER]`. Click or keypress resolves into the site. No logo. No hero image. Just the machine finding the signal.

**Stem Player:**
- Force-directed graph; master output pinned center, stems orbit it
- Nodes drift continuously with low Brownian noise — active stems drift more, disconnected ones drift further and slower
- Connect/disconnect: click node → 100ms gain fade → node drifts outward and dims over 800ms
- Connection edges: animated bezier curves with slight sag and low-frequency wobble; glow color varies per stem identity
- Beat events: brief repulsion pulse outward from master (80ms ease-out), spring decay
- Per-node: radial SVG arc volume knob, mini waveform display via Canvas 2D
- Visual nodes: default disconnected (dark, faint pulse); can bind to master or specific stem; beat-reactive p5.js sketches; expandable to fullscreen
- d3-force runs in rAF loop; positions written to refs, never state; React never re-renders on animation frames

**Music Player (The Signal):** Not a media player. A persistent system status line — shows current track, waveform, play state. Reads like a process monitor, not a Spotify widget.

**The Archive:** Lore reveals progressively. Some text hidden until a threshold interaction (scroll depth, time on site, or a discovered sigil). Member profiles expand on interaction — illuminated manuscript style. Deliberate, paginated. No infinite scroll.

**Transitions between pages:** Signal-dropout effect — brief scan line collapse, then re-acquisition on the new page. Changing frequencies, not changing tabs.

---

## Avoid

- Standard music artist layouts: full-bleed hero photo, centered logo, social icons row
- Spotify/SoundCloud embed aesthetic — no rounded media players, no green
- Default browser UI elements without reskinning (range inputs, checkboxes, selects)
- Snapping or instant-cut animations anywhere
- Pure black (`#000000`) as a background
- Humanist or geometric sans-serif fonts (Inter, DM Sans, Poppins, etc.)
- Anything that looks like a Squarespace template for a band
- Decorative glitch that doesn't earn its meaning — glitch should signal corruption, transmission error, state change
- Placeholder content in any mockup — use the exact names, titles, and lore text above
- Press kit energy: no EPK, no "stream now on all platforms" banners
- Mobile-first compromises on the stem player — desktop is the intended vessel
- Tartan patterns, Celtic knot clip art, or anything that reads as Scottish tourism
- Blackletter used ironically or decoratively — it carries weight, use it with intent
- Mixing all three type layers in a single view — the hierarchy should feel intentional, not chaotic
- Literal medieval imagery (swords, shields as images) — the reference is structural and typographic, not illustrative
- Anything that looks like a Renaissance faire
- No more than one design element lifted from any single reference — everything else must be original. No copying multiple aspects from the same source (layout + color + typography = plagiarism)
- No design elements too synonymous with existing references — no direct lifts from the TOOL Flash site's exact layout, no replicating Radiohead W.A.S.T.E.'s specific color treatment, no copying the Severance UI chrome verbatim
- No icon-heavy UI where typography can communicate
- No decorative gradients or shadows unless they serve your one inspired element
- Document a single inspiration source per component so you can apply the gut-check test: would you feel comfortable posting this with your reference side-by-side?

---

*Brief drafted: 2026-03-02*
