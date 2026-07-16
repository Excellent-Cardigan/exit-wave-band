# The Black Heron — a feather study (Clojure / Quil)

A generative feather, grown rather than drawn. This is the Clojure port of the
browser tool in `public/tools/black-heron/`, rewritten in the idiom I associate
with Tyler Hobbs: the shape is a scaffold, and everything that makes it feel
alive comes from **accumulation and controlled imperfection**.

Two techniques carry the piece:

- **The vane is washed, not filled.** A single outline polygon is deformed by
  recursive midpoint displacement (`geometry/deform`) and painted ~46 times at
  `alpha 7`. No layer's edge is a line, and the overlaps build the soft,
  irregular boundary of a watercolour wash.
- **The barbs are released into a flow field.** Each barb starts on the shaft
  with an outward throw and is then combed through a Perlin field
  (`geometry/trace-barb`), so it drifts, curves, and occasionally frays — the
  way real heron plumage combs and parts — instead of radiating as rigid spokes.

Colour is held to almost nothing. One barb in eight is allowed to catch a single
bright note; the rest are close-valued body shades over a near-black ground.

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
