# Requirements Questions — Inception Phase

**Project:** exit-wave-faith cleanup + MCP workflow
**Date:** 2026-05-28

Answer each question by filling in your choice after `[Answer]:`.
Use the letter (A, B, C...) or write your own response after "Other".

---

## Part 1: Dead Code Cleanup

---

**Q1: The entire `components/ui/` directory (45 shadcn/ui files) has zero imports anywhere in the app. It was dropped in by Figma Make at bootstrap and never used. What should we do with it?**

A) Delete all 45 files completely — we build custom UI, don't need the library

B) Keep it — I may want to use shadcn/ui components in future features

C) Keep a small subset (tell me which components you want to keep) — Other below

D) Other

[Answer]: A

---

**Q2: `Archive.tsx` is a fully-built alternate version of the Coven/members page with a scroll-reveal lore mechanic. It's not in the router and is superseded by `Coven.tsx`. However it has a unique interaction concept (lore entries reveal as you scroll deeper). What should we do?**

A) Delete it — Coven.tsx is the active page, Archive is dead weight

B) Keep it as a reference but don't route it — I may revisit the scroll-reveal lore idea

C) Actually wire it back into the router and decide later whether to replace Coven

D) Other

[Answer]: C

---

**Q3: The following files are confirmed dead (zero imports, no router entries, only referenced by each other):**
- `src/imports/ImplementDesignBrief.tsx` (Figma Make bootstrap artifact)
- `src/imports/exit-wave-design-brief.md` (duplicate of root `DESIGN-BRIEF.md`)
- `src/app/components/PageTransition.tsx` (Layout handles transitions)
- `src/app/components/figma/ImageWithFallback.tsx`
- `src/app/data/tracks.ts` (empty re-export shim)
- All 6 hash-named PNGs in `src/assets/`

**Delete all of these?**

A) Yes — delete them all

B) Yes, but keep `ImplementDesignBrief.tsx` as a design reference

C) Other

[Answer]: B

---

## Part 2: Active Page Issues

---

**Q4: `Dispatches.tsx` and `DispatchDetail.tsx` use the OLD color palette (`#4fd1d1` teal, `#8b7fd4` purple, `text-blackletter`, `bg-[#07070d]`) — the pre-redesign system. The rest of the site uses the new navy/blue/lime palette. What should we do?**

A) Restyle Dispatches to match the current design system (navy bg, `#004df1` blue, Tchig Mono + Ohno Fatface)

B) Leave Dispatches with its own aesthetic — it feels intentionally different as a lore/editorial section

C) Other

[Answer]: A

---

**Q5: `data/transmissions.ts` contains hardcoded Dispatches content (3 lore entries). Should this stay as local data or move to Kirby CMS?**

A) Keep it local — Dispatches content rarely changes, no need for a CMS panel for it

B) Move to Kirby — I want to edit Dispatches content from the panel like tracks and members

C) Other

[Answer]: B

---

**Q6: `Terminal.tsx` uses old colors (`#4fd1d1` teal, `#8b7fd4` purple) but this might be intentional since the terminal is a secret hidden experience. Should it keep its own palette?**

A) Keep the teal/purple — the terminal is intentionally alien, let it have its own vibe

B) Restyle to match the new system for consistency

C) Other

[Answer]: B, keep in mind WCAG Accessibility for text color and readibility

---

## Part 3: Styles

---

**Q7: `src/styles/` has 4 files: `index.css` (root import), `tailwind.css` (one line), `fonts.css`, and `theme.css`. The `tailwind.css` file is a single `@import "tailwindcss"` line — it could be merged directly into `index.css`. Combine them?**

A) Yes — merge `tailwind.css` into `index.css`, keep `fonts.css` and `theme.css` separate

B) Leave the 4-file structure as-is — it's clear and organized

C) Other

[Answer]: A

---

## Part 4: MCP Workflow

---

**Q8: For the multi-MCP workflow, what's the primary use case you're envisioning between the local site, Figma, and Notion?**

A) Design-to-code sync — I design in Figma/Paper, Claude Code implements it automatically into the React codebase

B) Content pipeline — I write content somewhere (Notion), it flows into Kirby/the site automatically

C) Both A and B — a full design + content workflow

D) I want to explore what's possible before committing — show me the options

[Answer]: D

---

**Q9: For Notion specifically — what would you use it for on this project?**

A) Project/task tracking (to-do lists, feature backlog, release notes)

B) Content authoring (writing Dispatches lore entries, band bio text, etc.)

C) Both

D) Skip Notion — Kirby panel already handles content, and GitHub handles tasks. It would be overkill.

[Answer]: D

---

**Q10: How formal/automated do you want the MCP workflow to be?**

A) Fully automated — I design in Figma, Claude Code detects changes and updates the codebase without me prompting

B) Semi-automated — I trigger it with a command ("implement this Figma design") but the flow is streamlined

C) Just better tooling — I want Claude Code to have better context about the Figma designs when I ask it to implement something

D) Other

[Answer]: C

---

*Fill in your answers above, then tell me you're ready and I'll proceed with Workflow Planning and execution.*
