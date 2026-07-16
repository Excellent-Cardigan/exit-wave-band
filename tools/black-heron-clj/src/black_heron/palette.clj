(ns black-heron.palette
  "Colour is chosen, never generated. A small set of curated palettes,
   each deliberately narrow: a ground, two body inks (calamus -> tip), a
   few barb shades to sample between, and one rare bright note used on a
   handful of barbs so the eye has somewhere to land. Restraint is the
   point — the interest comes from the thousands of translucent marks, not
   from the hues.")

(def palettes
  [{:name   "void signal"                    ; the Exit-Wave nod
    :ground [8 9 16]
    :ink    [[20 24 46] [10 12 26]]          ; wash: base -> tip
    :barb   [[40 50 96] [26 34 70] [60 78 132]]
    :accent [70 132 255]}

   {:name   "ash heron"                       ; naturalistic slate
    :ground [17 16 18]
    :ink    [[42 42 48] [22 22 27]]
    :barb   [[74 76 84] [50 52 60] [96 100 108]]
    :accent [182 172 152]}

   {:name   "oxblood dusk"                     ; warm/cool tension
    :ground [19 14 16]
    :ink    [[48 26 30] [26 15 19]]
    :barb   [[96 54 56] [62 40 46] [124 82 78]]
    :accent [224 152 96]}])

(defn palette [idx] (nth palettes (mod idx (count palettes))))

(defn barb-color
  "Body colour for a barb, chosen by its pre-rolled `:shade`."
  [pal shade]
  (nth (:barb pal) (mod shade (count (:barb pal)))))

(defn wash-ink
  "Wash colour along the shaft: base ink near the calamus, tip ink near
   the point. `u` in [0,1]."
  [pal u]
  (let [[[r0 g0 b0] [r1 g1 b1]] (:ink pal)
        m (fn [a b] (Math/round (double (+ a (* (- b a) u)))))]
    [(m r0 r1) (m g0 g1) (m b0 b1)]))
