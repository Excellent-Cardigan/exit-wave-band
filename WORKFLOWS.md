# MCP Workflows — exit-wave-faith

Practical trigger patterns for working with Claude Code, Paper, and Figma on this project.
The goal is better design context at implementation time — not full automation.

---

## Available MCP Servers

| Server | What it does |
|---|---|
| **Paper** (`paper-desktop`) | Read/write designs in the Paper app — screenshots, JSX export, computed styles, node editing |
| **Figma** | Read designs from Figma files — context, screenshots, variables, Code Connect |
| **IDE** | Diagnostics and code execution in the editor |

---

## Workflow 1 — Paper → Code

Use this when you have a design in Paper and want to implement it into the React codebase.

### Trigger
```
/paper-desktop:design-to-code
```
Or describe it directly:
> "Look at the [page/artboard name] in Paper and implement it as a React component following the project conventions."

### What Claude does
1. Calls `get_basic_info` to orient to the open file
2. Takes a `get_screenshot` of the target artboard
3. Uses `get_computed_styles` and `get_jsx` for exact values — never eyeballs from screenshots
4. Translates Paper CSS to this project's conventions (see **Token Mapping** below)
5. Writes or edits files in `frontend/src/`

### Tips
- Select the artboard you want implemented before triggering — Claude reads the selection
- Name layers clearly in Paper — Claude uses layer names to produce readable component code
- If a component already exists, say "update X to match the Paper design" rather than "implement" — Claude will modify in-place

---

## Workflow 2 — Code → Paper

Use this when you have a working React component and want to design-iterate it visually.

### Trigger
```
/paper-desktop:code-to-design
```
Or:
> "Take the [ComponentName] component and build it in Paper for design review."

### What Claude does
1. Reads the component source
2. Extracts the design tokens and structure
3. Creates a new Paper artboard using the project's palette and type scale

---

## Workflow 3 — Figma → Code

Use this when a design lives in Figma (not Paper) and you want to implement it.

### Trigger
Provide the Figma URL and say:
> "Implement this Figma design as a React component: [figma.com URL]"

Or use the skill directly:
```
/implement-design
```

### What Claude does
1. Calls `get_design_context` on the Figma URL for structure and tokens
2. Takes a `get_screenshot` for visual reference
3. Maps Figma styles to the project's CSS custom properties
4. Writes the component using `text-display`, `text-mono`, etc.

### Tips
- Figma variables and styles map best when the Figma file uses the same token names as this project
- For Code Connect setup (mapping Figma components to code components), use `/figma:figma-code-connect`

---

## Workflow 4 — Design Review in Paper

Use this at the start of a design/implementation session to orient Claude to current designs.

### Trigger
> "Connect to Paper and review the current designs."

Claude will:
1. Load the Paper guide
2. List files → open "Exit Wave"
3. Screenshot all 5 pages and give a design critique

This is useful before any implementation work so Claude has visual context without needing a Figma URL.

---

## Token Mapping

When translating Paper/Figma designs to code, these are the correct mappings for this project.

### Colors

| Visual role | CSS custom property | Hex |
|---|---|---|
| Page background (dark) | `--color-void` / `var(--color-void)` | `#010313` |
| Primary accent / blue | `--color-signal` | `#004df1` |
| Lighter blue (small text) | `--color-ew-blue-01` | `#397eff` |
| Light text on dark | `--color-bone` | `#e6e6e6` |
| Signal border | `--color-signal-border` | `rgba(0,77,241,0.5)` |
| Signal dim fill | `--color-signal-dim` | `rgba(0,77,241,0.2)` |
| Signal ghost | `--color-signal-ghost` | `rgba(0,77,241,0.06)` |

### Typography

| Use case | Class | Font |
|---|---|---|
| Wordmarks, big lore headers, titles | `.text-display` | Ohno Fatface |
| Nav labels, section headers, archive rows | `.text-condensed` | Field Gothic |
| All UI chrome, metadata, timestamps | `.text-mono` | Tchig Mono |
| Drop cap initials only | `.text-dropcap` | Amador |

### Glow effects

| Effect | Class |
|---|---|
| Blue signal glow on text | `.glow-signal` |

### Rules
- **No rounded corners** — `border-radius: 0` everywhere (`--radius: 0`)
- **No pure black** — use `--color-void` (`#010313`) not `#000000`
- **No humanist/geometric sans** — no Inter, DM Sans, Poppins
- **No `clamp()`** — use `calc()` or `cqw`/`vw` units

---

## Giving Claude Better Design Context

When asking Claude to implement UI without a specific skill trigger, front-load the context:

**Less effective:**
> "Add a new card component"

**More effective:**
> "Add a track status card. Use the Paper design as reference — it's on the Home page artboard, the 'Track Row' layer group. Background: `--color-signal-ghost`, border: `--color-signal-border`, text in `.text-mono`. Sharp corners, no radius."

The more you reference the existing token names and layer names, the less Claude has to infer — and the closer the output matches the design intent.

---

## Figma Code Connect (future)

When the design system grows, wiring Figma components to code components prevents drift. Use:
```
/figma:figma-code-connect
```
This creates `.figma.ts` mapping files so Figma's Dev Mode shows real component code for each design element.

---

## What's Not Set Up (and why)

| Tool | Status | Reason |
|---|---|---|
| Notion | Not used | Kirby panel handles content; redundant for this project size |
| Automated Figma sync | Not set up | Semi-manual trigger (Workflow 3) fits the current pace |
| CI/CD design review | Not set up | cPanel deployment; no CI pipeline yet |
