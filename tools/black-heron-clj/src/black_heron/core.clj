(ns black-heron.core
  "The Black Heron — a generative feather study, in Quil.

   This namespace is only a set of hands. Every decision about *what* the
   feather is lives in `black-heron.geometry` (pure) and `black-heron.palette`
   (data). Here we just seed the world, grow the barbs, and lay down marks:

     - the vane is not filled, it is *washed* — one polygon deformed and
       painted forty-odd times at alpha 7, so its edge is never a line;
     - the barbs are not drawn from a diagram — each is released along the
       shaft and combed through a Perlin flow field until it frays or reaches;
     - colour is held back to almost nothing, and one barb in eight is let
       to catch the single bright note.

   Controls
     SPACE   new seed
     P       cycle palette
     ↑ / ↓   barb density
     ← / →   flow turbulence
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

(defn- wash
  "Grow a polygon into a watercolour body: `layers` independent
   deformations of the same seed shape, each a translucent fill."
  [poly {:keys [layers depth variance color alpha gauss]}]
  (q/no-stroke)
  (let [[r g b] color]
    (dotimes [_ layers]
      (let [p (geom/deform poly depth variance gauss)]
        (q/fill (jitter r 5) (jitter g 5) (jitter b 5) alpha)
        (q/begin-shape)
        (doseq [[x y] p] (q/vertex x y))
        (q/end-shape :close)))))

(defn- paint-barb
  "Lay a single barb down as a fading, thinning poly-line. Body colour
   most of the way; the rare `:accent` barb catches the bright note near
   its tip; a `:fray` barb is drawn weaker and shorter."
  [{:keys [points shade fray accent]} pal]
  (q/no-fill)
  (let [pts  (vec points)
        n    (count pts)
        body (palette/barb-color pal shade)
        acc  (:accent pal)]
    (dotimes [k (dec n)]
      (let [[x0 y0] (pts k)
            [x1 y1] (pts (inc k))
            t   (/ (double k) (double (max 1 (dec n))))
            col (if (and accent (> t 0.6)) acc body)
            a   (int (q/lerp 95 20 t))
            w   (q/lerp 1.5 0.3 (Math/pow t 0.7))]
        (q/stroke (col 0) (col 1) (col 2) (if fray (int (* a 0.7)) a))
        (q/stroke-weight (if fray (* w 0.75) w))
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

(defn- grain
  "A breath of tooth on the paper — sparse dark and light specks."
  [w h]
  (dotimes [_ (int (* w h 0.014))]
    (let [dark? (< (q/random 1.0) 0.5)]
      (q/stroke (if dark? 0 255) (int (q/random 6 16)))
      (q/point (q/random w) (q/random h)))))

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
    (apply q/background (:ground pal))
    ;; realise the barbs first, so the PRNG is consumed in a fixed order and
    ;; the same seed always grows the same feather
    (let [bs   (vec (geom/barbs frame {:density density :turbulence turbulence
                                       :rnd rnd :noise nz}))
          poly (geom/vane-polygon frame 42)]
      (q/with-translation [(* w 0.5) (* h 0.52)]
        (wash poly {:layers 46 :depth 4 :variance 0.14
                    :color (palette/wash-ink pal 0.5) :alpha 7
                    :gauss q/random-gaussian})
        (doseq [b bs] (paint-barb b pal))
        (paint-rachis frame pal)))
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
      ;; default — arrows arrive here as coded keys
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
