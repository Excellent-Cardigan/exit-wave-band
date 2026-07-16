(ns black-heron.geometry
  "Pure generative geometry for the feather — no rendering, no Quil.

   The philosophy here is the one I keep coming back to: the drawing
   instructions are trivial; the *life* is in the accumulation and the
   controlled wrongness. So this namespace produces nothing but numbers.
   Every source of randomness — uniform `rnd`, standard-normal `gauss`,
   and a Perlin-ish `noise` — is passed in, never reached for. That means
   the exact same feather can be grown by a Quil sketch, an SVG export, or
   a test, and it keeps the interesting decisions in plain data.

   Points are `[x y]` in feather-local space: origin at the feather's
   centre, the tip toward -y.")

;; ---------------------------------------------------------------------------
;; small vector algebra (kept local so the file has no dependencies at all)
;; ---------------------------------------------------------------------------

(defn v+ [[ax ay] [bx by]] [(+ ax bx) (+ ay by)])
(defn v- [[ax ay] [bx by]] [(- ax bx) (- ay by)])
(defn v* [[x y] s]         [(* x s) (* y s)])
(defn vlen [[x y]] (Math/hypot x y))
(defn vnorm [v] (let [l (vlen v)] (if (zero? l) [0.0 0.0] (v* v (/ 1.0 l)))))
(defn perp  [[x y]] [(- y) x])
(defn midpoint [a b] (v* (v+ a b) 0.5))
(defn lerp   [a b t] (+ a (* (- b a) t)))
(defn lerp2  [a b t] (v+ a (v* (v- b a) t)))

;; ---------------------------------------------------------------------------
;; the scaffold: shaft + vane envelope
;; ---------------------------------------------------------------------------

(defn frame
  "The bounding geometry for a feather that fits a `w`x`h` field."
  [w h]
  (let [len (* (min w h) 0.82)]
    {:len    len
     :base-y (* len 0.40)            ; calamus, below centre
     :tip-y  (- (* len 0.60))        ; tip, above centre
     :bow    (* len 0.055)           ; gentle sideways curve of the shaft
     :half   (* len 0.205)}))        ; widest half-vane

(defn rachis-pt
  "A point on the shaft, `u` in [0,1] from calamus (0) to tip (1)."
  [{:keys [base-y tip-y bow]} u]
  [(* bow (* 4.0 u (- 1.0 u)))
   (lerp base-y tip-y u)])

(defn vane-half-width
  "Envelope of the vane: rises fast off the calamus, tapers to a point.
   The 0.72 exponent is doing a lot of quiet work — it's the difference
   between a leaf and a feather."
  [{:keys [half]} u]
  (* half
     (min 1.0 (/ u 0.13))
     (Math/pow (- 1.0 u) 0.72)))

(defn barb-direction
  "Outward-and-upward unit vector a barb leaves the shaft on. Near the
   calamus it points almost straight out (`side` = ±1); toward the tip it
   swings to lie along the shaft, the way a real feather combs forward."
  [frame u side]
  (let [a   (rachis-pt frame (max 0.0 (- u 0.01)))
        b   (rachis-pt frame (min 1.0 (+ u 0.01)))
        tan (vnorm (v- b a))
        nrm [(* (- (second tan)) side) (* (first tan) side)]
        sweep (lerp 0.22 0.80 (Math/pow u 0.8))]
    (vnorm (lerp2 nrm tan sweep))))

;; ---------------------------------------------------------------------------
;; the flow field — barbs are released, not drawn
;; ---------------------------------------------------------------------------

(defn flow-angle
  "Sample the field a barb drifts through. Mostly points 'up' the feather,
   with `turbulence` letting the Perlin `noise` bend it. This is what gives
   the vane its combed, occasionally-parting texture instead of a fan of
   rigid spokes."
  [[x y] turbulence noise]
  (let [s 0.0016
        n (noise (* x s) (* y s) 0.35)
        up (- (/ Math/PI 2.0))
        wander (* turbulence Math/PI (- n 0.5))]
    (+ up wander)))

(defn trace-barb
  "Release a barb at `start` heading `dir0`, then let the flow field comb
   it for `steps`. Momentum (0.82) dominates the field (0.18) so the barb
   keeps its initial outward throw while slowly bending toward the tip.
   Momentum is deliberately high (0.88): a barb that combs too eagerly
   collapses onto the shaft and the whole thing reads as a flame, not a
   feather. The barb should fan off the calamus first, then sweep."
  [start dir0 steps step-len turbulence noise]
  (loop [p start, dir (vnorm dir0), acc (transient [start]), i 0]
    (if (>= i steps)
      (persistent! acc)
      (let [fa (flow-angle p turbulence noise)
            fd [(Math/cos fa) (Math/sin fa)]
            nd (vnorm (v+ (v* dir 0.88) (v* fd 0.12)))
            np (v+ p (v* nd step-len))]
        (recur np nd (conj! acc np) (inc i))))))

(defn barbs
  "Grow every barb of the feather as plain data. Each barb is a map:
     :points  the drifted poly-line
     :u       where on the shaft it left (0 calamus .. 1 tip)
     :side    -1 leading / +1 trailing
     :fray    a broken/short barb (heron plumage is loosely zipped)
     :accent  one of the rare barbs that catches the bright note
     :shade   which body colour it takes

   `opts` carries the injected randomness and the two dials the piece
   exposes: `:density` and `:turbulence`."
  [frame {:keys [density turbulence rnd noise]}]
  (let [n (int density)]
    (for [i (range n)
          side [-1 1]
          :let [u (/ (double (inc i)) (double n))]
          :when (> u 0.05)]
      (let [start    (rachis-pt frame u)
            dir0     (barb-direction frame u side)
            leading  (neg? side)
            fray     (< (noise (* i 0.30) (* side 5.0) 0.0) 0.16)
            ;; the leading vane is a touch shorter — asymmetry reads as 'real'
            side-scale (if leading 0.82 1.0)
            base-len (* (vane-half-width frame u) 1.15 side-scale)
            blen     (* base-len (if fray
                                   (+ 0.30 (* 0.30 (rnd)))
                                   (+ 0.85 (* 0.23 (rnd)))))
            step-len 6.0
            steps    (max 2 (int (/ blen step-len)))
            pts      (trace-barb start dir0 steps step-len turbulence noise)]
        {:points pts
         :u u
         :side side
         :fray fray
         :accent (and (not fray) (< (rnd) 0.12))
         :shade  (int (* (rnd) 3))}))))

;; ---------------------------------------------------------------------------
;; the vane outline — the polygon the watercolour wash is grown from
;; ---------------------------------------------------------------------------

(defn vane-polygon
  "A closed polygon tracing the vane, sampled `samples` times per side.
   This is only the seed shape; the render layer deforms and washes it
   many times so its edges never actually look like this clean outline."
  [frame samples]
  (let [edge (fn [side srange]
               (for [s srange
                     :let [u (max 0.02 (/ (double s) (double samples)))
                           p (rachis-pt frame u)
                           d (barb-direction frame u side)
                           w (* (vane-half-width frame u) 0.92)]]
                 (v+ p (v* d w))))]
    (vec (concat (edge  1 (range (inc samples)))
                 (edge -1 (range samples -1 -1))))))

;; ---------------------------------------------------------------------------
;; the watercolour edge — recursive midpoint displacement
;; ---------------------------------------------------------------------------

(defn deform
  "Recursively subdivide a closed polygon, nudging each new midpoint along
   the edge normal by a gaussian amount. Run a handful of times with a
   shrinking `variance` and the straight outline dissolves into the soft,
   irregular boundary of a wash. `gauss` is a standard-normal sampler.

   This is the whole trick behind the vane: one cheap recursion, layered."
  [poly depth variance gauss]
  (if (or (zero? depth) (< (count poly) 2))
    poly
    (recur
     (let [closed (conj poly (first poly))]
       (vec (mapcat (fn [[a b]]
                      (let [m   (midpoint a b)
                            nrm (vnorm (perp (v- b a)))
                            d   (* (gauss) variance (vlen (v- b a)))]
                        [a (v+ m (v* nrm d))]))
                    (partition 2 1 closed))))
     (dec depth)
     (* variance 0.62)
     gauss)))
