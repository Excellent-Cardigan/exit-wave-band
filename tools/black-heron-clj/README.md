# The Black Heron — a feather study (Clojure / Quil)

A generative feather, grown rather than drawn. This is the Clojure port of the
browser tool in `public/tools/black-heron/`, rewritten in the idiom I associate
with Tyler Hobbs: the shape is a scaffold, and everything that makes it feel
alive comes from **accumulation and controlled imperfection**.

Three techniques carry the piece:

- **The vane is washed, not filled.** A single outline polygon is deformed by
  recursive midpoint displacement (`geometry/deform`) and painted ~60 times.
  The layers' tints walk a subtle warm↔cool ramp (`palette/wash-ramp`), a few
  darker passes seat the outer edge, and a few lighter *inset* passes lift the
  spine — so the vane glows from within rather than reading as a flat fill.
- **The barbs are released into a flow field.** Each barb starts on the shaft
  with an outward throw and is combed through a Perlin field
  (`geometry/trace-barb`) with a little per-barb momentum variation, so
  neighbours don't curve in lockstep.
- **The vane parts into locks.** A coarse, low-frequency `geometry/parting`
  field opens gaps in *clusters* and lets barbs lean away from them — the
  loosely-zipped look of real heron plumage, instead of random speckle.

Colour is held to almost nothing: close-valued body shades (a continuous
`:tone` per barb) over a near-black ground, with a handful of barbs catching a
single bright note. The specimen sits on a faint plate-tone halo and is
'placed' with a small seeded rotation and off-centre nudge — a natural-history
plate, not a rigid axis.

## Design

The interesting decisions are kept out of the renderer on purpose:

| namespace | role |
|---|---|
| `black-heron.geometry` | **pure** generative math — vectors, shaft, vane envelope, flow-field barbs, watercolour `deform`. All randomness (`rnd`, `gauss`, `noise`) is injected, so the same algorithm drives the sketch, an export, or a test. |
| `black-heron.palette`  | curated palettes as plain data (`void signal` — the Exit-Wave nod — plus `ash heron` and `oxblood dusk`). |
| `black-heron.core`     | the Quil hands: seed the world, grow the barbs, lay down washes and marks. |

## Run

Requires a JVM and the [Clojure CLI](https://clojure.org/guides/install_clojure).

```bash
cd tools/black-heron-clj
clj -M:run          # opens the sketch window
```

or from a REPL:

```clojure
(require 'black-heron.core)
(black-heron.core/launch)
```

### Controls

| key | action |
|---|---|
| `SPACE` | new seed (new feather) |
| `P` | cycle palette |
| `↑` / `↓` | barb density |
| `←` / `→` | flow turbulence |
| `S` | save a PNG beside where you launched |

The seed fully determines the feather — same seed, same bird.

## Note on the two versions

The original `public/tools/black-heron/` (p5.js, in-browser, slider UI + PNG
export) still stands. This Clojure version trades the live control panel for the
generative sensibility above: fewer knobs, more layers, run-and-save.
