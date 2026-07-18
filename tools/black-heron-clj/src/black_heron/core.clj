(ns black-heron.core
  "The Black Heron — a generative feather study, in Quil.

   This namespace is only a set of hands. Every decision about *what* the
   feather is lives in `black-heron.geometry` (pure) and `black-heron.palette`
   (data). Here we just seed the world, grow the barbs, and lay down marks:

     - the vane is not filled, it is *washed* — one polygon deformed and
       painted ~60 times in tints that walk a subtle warm<->cool ramp, with
       darker layers seating the edge and lighter inset layers lifting the
       spine, so the feather glows from within instead of reading flat;
     - the barbs are not drawn from a diagram — each is released along the
       shaft and combed through a Perlin flow field, the vane parting into
       locks the way real heron plumage does;
     - colour is held back to almost nothing, and a handful of barbs catch
       the single bright note.

   Controls
     SPACE   new seed
     P       cycle palette
     up/down    barb density
     left/right flow turbulence
     S       save a PNG next to where you launched it"
  (:require [quil.core :as q]
            [black-heron.geometry :as geom]
            [black-heron.palette :as palette])
  (:gen-class))

(defonce state
  (atom {:seed 1077 :density 150 :turbulence 0.65 :palette-idx 0}))

;; ---------------------------------------------------------------------------
;; marks
;; ---------------------------------------------------------------------------

(defn- jitter
  "Nudge a channel so no two washes are quite the same colour."
  [c amt]
  (q/constrain (+ c (* (q/random-gaussian) amt)) 0 255))

(defn- fill-poly [p]
  (q/begin-shape)
  (doseq [[x y] p] (q/vertex x y))
  (q/end-shape :close))

(defn- centroid [poly]
  (let [n (count poly)
        [sx sy] (reduce (fn [[ax ay] [x y]] [(+ ax x) (+ ay y)]) [0.0 0.0] poly)]
    [(/ sx n) (/ sy n)]))

(defn- wash
  "Grow the vane as a watercolour body. Many translucent, independently
   deformed layers whose tints walk the palette's warm<->cool ramp build
   internal luminosity; a few darker full-shape layers seat the outer edge,
   and a few lighter *inset* layers (pulled toward the centroid) lift the
   spine — light down the shaft, shadow at the margins."
  [poly pal {:keys [layers depth variance alpha gauss]}]
  (q/no-stroke)
  (let [c (centroid poly)]
    (dotimes [_ 6]                                   ; seat the edge
      (let [p (geom/deform poly depth (* variance 1.2) gauss)
            [r g b] (palette/wash-ramp pal 0.12)]
        (q/fill (jitter r 4) (jitter g 4) (jitter b 4) (int (* alpha 1.5)))
        (fill-poly p)))
    (dotimes [_ layers]                              ; luminous body
      (let [t (q/random 1.0)
            p (geom/deform poly depth variance gauss)
            [r g b] (palette/wash-ramp pal t)]
        (q/fill (jitter r 5) (jitter g 5) (jitter b 5) alpha)
        (fill-poly p)))
    (dotimes [_ 10]                                  ; lift the spine
      (let [inset (mapv #(geom/lerp2 c % (q/random 0.60 0.82)) poly)
            p (geom/deform inset depth (* variance 0.9) gauss)
            [r g b] (palette/wash-ramp pal 0.9)]
        (q/fill (jitter (+ r 6) 4) (jitter (+ g 8) 4) (jitter (+ b 12) 4)
                (int (* alpha 0.8)))
        (fill-poly p)))))

(defn- paint-barb
  "Lay a barb down as a faint wide halo plus a crisp fading fibre. Body
   colour comes from the barb's continuous :tone; the rare :accent barb
   catches the bright note near its tip; a frayed edge-barb is drawn weaker."
  [{:keys [points tone fray accent]} pal]
  (q/no-fill)
  (let [pts  (vec points)
        n    (count pts)
        body (palette/barb-ramp pal tone)
        acc  (:accent pal)]
    (dotimes [k (dec n)]
      (let [[x0 y0] (pts k)
            [x1 y1] (pts (inc k))
            t   (/ (double k) (double (max 1 (dec n))))
            col (if (and accent (> t 0.6)) acc body)
            a   (int (q/lerp 90 16 t))
            w   (q/lerp 1.5 0.3 (Math/pow t 0.7))]
        (q/stroke (col 0) (col 1) (col 2) (int (* a 0.22)))   ; halo
        (q/stroke-weight (* w 2.4))
        (q/line x0 y0 x1 y1)
        (q/stroke (col 0) (col 1) (col 2) (if fray (int (* a 0.65)) a))
        (q/stroke-weight (if fray (* w 0.7) w))               ; crisp fibre
        (q/line x0 y0 x1 y1)))))

(defn- paint-rachis
  "The shaft: a tapered dark spine with a faint hollow-quill glint."
  [frame pal]
  (q/no-fill)
  (let [samples 60
        pts (mapv #(geom/rachis-pt frame (/ (double %) samples)) (range (inc samples)))
        [r g b] (palette/wash-ink pal 0.15)]
    (dotimes [k samples]
      (let [[x0 y0] (pts k)
            [x1 y1] (pts (inc k))
            u (/ (double k) samples)
            w (q/lerp 3.2 0.4 u)]
        (q/stroke (+ r 6) (+ g 6) (+ b 10) 210)
        (q/stroke-weight w)
        (q/line x0 y0 x1 y1)
        (q/stroke 220 218 210 (int (q/lerp 60 0 u)))
        (q/stroke-weight (* w 0.35))
        (q/line x0 y0 x1 y1)))))

(defn- ground
  "A near-black plate that lifts very slightly behind the feather, so the
   specimen sits in space rather than floating on a flat field."
  [w h pal]
  (apply q/background (:ground pal))
  (q/no-stroke)
  (let [[r g b] (:ground pal)
        cx (* w 0.5) cy (* h 0.5)]
    (dotimes [i 26]
      (let [t (/ (double i) 26.0)
            rad (* (max w h) (+ 0.15 (* 0.9 t)))]
        (q/fill (+ r 10) (+ g 11) (+ b 16) 3)
        (q/ellipse cx cy rad (* rad 1.15))))))

(defn- grain
  "A breath of tooth on the paper — dual dark/light specks, denser toward
   the edges so the centre stays clean."
  [w h]
  (let [cx (* w 0.5) cy (* h 0.5)
        maxd (Math/hypot cx cy)]
    (dotimes [_ (int (* w h 0.02))]
      (let [x (q/random w) y (q/random h)
            d (/ (Math/hypot (- x cx) (- y cy)) maxd)]
        (when (< (q/random 1.0) (+ 0.22 (* 0.78 d)))
          (let [dark? (< (q/random 1.0) 0.55)]
            (q/stroke (if dark? 0 255) (int (q/random 5 14)))
            (q/point x y)))))))

;; ---------------------------------------------------------------------------
;; the piece
;; ---------------------------------------------------------------------------

(defn draw []
  (let [{:keys [seed density turbulence palette-idx]} @state
        pal (palette/palette palette-idx)
        w   (q/width)
        h   (q/height)
        frame (geom/frame w h)
        rnd (fn [] (q/random 1.0))
        nz  (fn [x y z] (q/noise x y z))]
    (q/random-seed seed)
    (q/noise-seed seed)
    (ground w h pal)
    ;; a 'placed' specimen: slight rotation + off-centre nudge, read from the
    ;; noise field so it never disturbs the random stream the barbs depend on
    (let [angle (* 0.06 (- (q/noise 41.0 7.0 1.0) 0.5) 2.0)
          dx    (* w 0.02 (- (q/noise 5.0 9.0 2.0) 0.5) 2.0)
          dy    (* h 0.015 (- (q/noise 8.0 3.0 3.0) 0.5) 2.0)
          ;; realise barbs first so the PRNG is consumed in a fixed order
          bs   (vec (geom/barbs frame {:density density :turbulence turbulence
                                       :rnd rnd :noise nz}))
          poly (geom/vane-polygon frame 42)]
      (q/push-matrix)
      (q/translate (+ (* w 0.5) dx) (+ (* h 0.52) dy))
      (q/rotate angle)
      (wash poly pal {:layers 60 :depth 4 :variance 0.13 :alpha 6
                      :gauss q/random-gaussian})
      (doseq [b bs] (paint-barb b pal))
      (paint-rachis frame pal)
      (q/pop-matrix))
    (grain w h)
    (q/no-loop)))

(defn setup []
  (q/color-mode :rgb 255)
  (q/frame-rate 30)
  (q/no-loop))

(defn key-pressed []
  (let [k  (q/raw-key)
        kc (q/key-code)]
    (case k
      \space (swap! state assoc :seed (rand-int 1000000))
      (\s \S) (q/save (str "black-heron-" (:seed @state) "-"
                           (System/currentTimeMillis) ".png"))
      (\p \P) (swap! state update :palette-idx inc)
      (condp = kc
        38 (swap! state update :density #(min 320 (+ % 20)))
        40 (swap! state update :density #(max 40 (- % 20)))
        37 (swap! state update :turbulence #(max 0.0 (- (double %) 0.1)))
        39 (swap! state update :turbulence #(min 1.5 (+ (double %) 0.1)))
        nil))
    (q/redraw)))

(defn launch []
  (q/sketch
   :title "The Black Heron — a feather study"
   :size [1200 1500]
   :setup setup
   :draw draw
   :key-pressed key-pressed
   :features [:exit-on-close]))

(defn -main [& _] (launch))
