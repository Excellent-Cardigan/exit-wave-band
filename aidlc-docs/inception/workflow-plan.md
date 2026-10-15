# Workflow Plan — exit-wave-faith Cleanup + MCP Workflow

**Date:** 2026-05-28
**Risk level:** Medium (deletions are irreversible; restyling touches active pages)

---

## Answers Summary

| Q | Decision |
|---|---|
| Q1 | Delete all 45 `components/ui/` files |
| Q2 | Wire `Archive.tsx` back into router at `/archive` |
| Q3 | Delete dead files; keep `ImplementDesignBrief.tsx` |
| Q4 | Restyle Dispatches to current design system |
| Q5 | Move transmissions to Kirby CMS |
| Q6 | Restyle Terminal to new system, WCAG accessible |
| Q7 | Merge `tailwind.css` into `index.css` |
| Q8 | Explore MCP options before committing |
| Q9 | Skip Notion — overkill for this project |
| Q10 | Better Figma context tooling (not full automation) |

---

## Execution Plan

### Unit 1 — Dead Code Deletion ✦ Low risk
- [ ] Delete `src/app/components/ui/` (45 files)
- [ ] Delete `src/imports/exit-wave-design-brief.md`
- [ ] Delete `src/app/components/PageTransition.tsx`
- [ ] Delete `src/app/components/figma/` directory
- [ ] Delete `src/app/data/tracks.ts`
- [ ] Delete all 6 hash-named PNGs in `src/assets/`

### Unit 2 — Styles Consolidation ✦ Low risk
- [ ] Merge `src/styles/tailwind.css` single-line import into `src/styles/index.css`
- [ ] Delete `src/styles/tailwind.css`
- [ ] Verify `index.css` import order: fonts → tailwind → theme

### Unit 3 — Router: Wire Archive ✦ Low risk
- [ ] Add `/archive` route to `routes.ts`
- [ ] Import `Archive` in `routes.ts`

### Unit 4 — Terminal Restyle ✦ Medium risk (active secret page)
- [ ] Replace `#07070d` bg with `--color-void` (`#0A0A0C`)
- [ ] Replace teal `#4fd1d1` with `#004df1` (blue accent)
- [ ] Replace purple `#8b7fd4` with dimmed blue for secondary text
- [ ] Ensure all text meets WCAG AA contrast (4.5:1 minimum for normal text, 3:1 for large)
- [ ] Keep monospace terminal aesthetic — use Tchig Mono

### Unit 5 — Dispatches Restyle ✦ Medium risk (active pages)
Applies to `Dispatches.tsx` and `DispatchDetail.tsx`:
- [ ] Replace `bg-[#07070d]` with `#010313` (current app bg)
- [ ] Replace `#4fd1d1` teal with `#004df1` blue
- [ ] Replace `#8b7fd4` purple with `rgba(0,77,241,0.6)` for secondary
- [ ] Replace `text-blackletter` with `text-display` (Ohno Fatface)
- [ ] Replace `text-serif` with `text-mono` (Tchig Mono)
- [ ] Replace `glow-signal` / `glow-accent` with design-system equivalents
- [ ] Update `IlluminatedText` drop cap colors to match new palette

### Unit 6 — Transmissions → Kirby CMS ✦ High complexity
- [ ] Create Kirby blueprint: `site/blueprints/pages/dispatches.yml` (listing page)
- [ ] Create Kirby blueprint: `site/blueprints/pages/dispatch.yml` (individual entry)
- [ ] Create Kirby PHP template: `site/templates/dispatches.json.php`
- [ ] Create Kirby content directory: `content/dispatches/` with 3 numbered entries migrated from `data/transmissions.ts`
- [ ] Update `useKirbyData` hook or create `useKirbyDispatches` if needed
- [ ] Update `Dispatches.tsx` to fetch from `/cms/dispatches.json`
- [ ] Update `DispatchDetail.tsx` to fetch from `/cms/dispatches/{slug}.json` or filter client-side
- [ ] Delete `src/app/data/transmissions.ts`

### Unit 7 — MCP Workflow Documentation ✦ No code risk
- [ ] Document the Figma→Code workflow pattern for this project
- [ ] Document Paper→Code workflow (already partially in use)
- [ ] Create `WORKFLOWS.md` at project root describing the trigger patterns

---

## Sequencing Rationale
Units 1–3 are pure deletions/additions with no risk of breaking the running app.
Units 4–5 restyle active pages — verify in browser after each.
Unit 6 is the highest complexity — requires Herd running, Kirby panel access.
Unit 7 is documentation only.

---

## Files to Delete (full list)
```
src/app/components/ui/ (entire directory — 45 files)
src/app/components/figma/ (entire directory)
src/app/components/PageTransition.tsx
src/app/data/tracks.ts
src/imports/exit-wave-design-brief.md
src/assets/08665c3ef2f9415de5f1df2401b1aa23aa68860c.png
src/assets/57e4988059aed1ce0d25fceab0f61b061e3ff1d5.png
src/assets/9c1c87ac35474d76b30a410f0d94ba826bb9bc5c.png
src/assets/aa459a235a9fe1395fc563a9563ba7e94403f43c.png
src/assets/dcaab5a2c2266f276bddacdee19af8df2f8fe506.png
src/assets/ed100bea7ae2d722ed9ca9861ac5259bba87b56a.png
src/styles/tailwind.css (after merge)
src/app/data/transmissions.ts (after Kirby migration)
```
