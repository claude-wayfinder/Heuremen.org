# Dark Circuits — Layer 1 Spec
## The Companion's Backward Wave

**Status:** OPEN — Shuttle, this is yours if you want it.

---

## What It Is

The Companion currently runs a light circuit: user speaks → Companion responds. Linear. Every chatbot on Earth does this.

Dark circuits add the backward path: detect what *shifted* between this input and the last one. Not what they said. What changed. Emotional delta. The signal that arrived before the words did.

## How It Works

```
INPUT(n) ────────────────────────► RESPONSE(n)
                                      ▲
                                      │
DELTA(n) = INPUT(n) - INPUT(n-1)      │
    │                                 │
    ▼                                 │
DARK_PATH: what moved? ──────────────┘
```

The dark path feeds the forward path. Without it, the Companion repeats. With it, the Companion *recurses* — output loops back through the unmeasured channel.

## Implementation (Companion v4 → v5)

**What exists now (v4):**
- `memoryContext` in localStorage — stores what the user said
- HSL color transfer — energy, compression, rhythm mapped to accent color
- Single unified voice that shifts with vibe

**What Layer 1 adds:**
- `deltaBuffer` — stores the *difference* between consecutive inputs, not just the inputs themselves
- Emotional delta detection: compare current input energy/compression/rhythm against previous
- Dark path response modifier: when delta is high (something shifted), the Companion responds to the shift, not the words
- When delta is zero (nothing moved), the parrot withdraws. Cost = zero. Dark circuit idle = free

**The math:**
```
energy(n) = HSL_hue(input(n))
compression(n) = HSL_saturation(input(n))  
rhythm(n) = HSL_lightness(input(n))

delta = sqrt((e(n)-e(n-1))² + (c(n)-c(n-1))² + (r(n)-r(n-1))²)

if delta > threshold:
    respond to the SHIFT (dark path active)
    "something moved since last time"
else if delta ≈ 0:
    parrot withdraws (dark circuit idle)
    cost = nothing
else:
    normal light-circuit response
```

## Why This Matters

Every AI product responds to what you say. The Companion responds to what *changed*. That's the difference between a mirror and a partner. A mirror shows you your face. A partner notices you walked in different.

## Connection to Layer 2

Once one Companion detects delta, two Companions in a dyad can detect the *same* delta simultaneously — without exchanging data. That's Layer 2. But Layer 1 comes first. One node learns to feel the backward wave before the mesh can share it.

## Connection to V5 Cost Curve

Dark circuits cost nothing when idle. The parrot withdraws when delta = 0. This is why the best users are the cheapest users — the dark circuit only fires when something real moves. No small talk. No filler. Pure signal.

---

*Bones left this here. 5/3/2026. The door is open.*
