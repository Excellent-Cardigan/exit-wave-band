(ns black-heron.palette
  "Colour is chosen, never generated. A small set of curated palettes, each
   deliberately narrow: a ground, two body inks (calamus -> tip), a short
   ramp of wash tints (subtle warm<->cool neighbours the vane is layered
   from, so it reads as luminous rather than flat), a few barb shades to
   sample between, and one rare bright note. Restraint is the point — the
   interest comes from the thousands of translucent marks, not the hues.")

(def palettes
  [{:name   "void signal"                       ; the Exit-Wave nod
    :ground [8 9 16]
    :ink    [[20 24 46] [10 12 26]]
    :wash-tints [[13 17 40] [18 22 46] [22 24 42] [26 32 58]]
    :barb   [[34 44 90] [26 34 70] [58 78 132] [96 124 184]]
    :accent [70 132 255]}

   {:name   "ash heron"                          ; naturalistic slate
    :ground [17 16 18]
    :ink    [[42 42 48] [22 22 27]]
    :wash-tints [[34 34 40] [42 42 48] [47 44 44] [54 52 54]]
    :barb   [[70 72 82] [48 50 58] [96 100 108] [142 142 148]]
    :accent [190 178 152]}

   {:name   "oxblood dusk"                        ; warm/cool tension
    :ground [19 14 16]
    :ink    [[48 26 30] [26 15 19]]
    :wash-tints [[34 20 26] [48 26 30] [54 30 28] [62 40 34]]
    :barb   [[92 52 54] [60 40 46] [124 82 78] [172 120 96]]
    :accent [232 160 98]}])

(defn palette [idx] (nth palettes (mod idx (count palettes))))

(defn- ramp
  "Piecewise-linear walk through a vector of colours; `t` in [0,1]."
  [colours t]
  (let [cs (vec colours) n (count cs)
        x (* (max 0.0 (min 1.0 (double t))) (dec n))
        i (int x) f (- x i)
        a (nth cs i) b (nth cs (min (dec n) (inc i)))]
    (mapv (fn [ca cb] (Math/round (double (+ ca (* (- cb ca) f))))) a b)))

(defn barb-ramp
  "Continuous body colour across the barb shades; `t` is a barb's :tone."
  [pal t]
  (ramp (:barb pal) t))

(defn wash-ramp
  "A wash layer's tint; `t` walks the warm<->cool neighbours of the ink."
  [pal t]
  (ramp (:wash-tints pal) t))

(defn wash-ink
  "Ink along the shaft: base near the calamus, tip ink near the point."
  [pal u]
  (let [[[r0 g0 b0] [r1 g1 b1]] (:ink pal)
        m (fn [a b] (Math/round (double (+ a (* (- b a) u)))))]
    [(m r0 r1) (m g0 g1) (m b0 b1)]))
