# COMPANION-PRICING

*Directional pricing structure for the Heurémen Companion.*
*Author: Banjo Bones · 2026-05-10 (rewrite 3)*
*Status: **Directional only.** Nothing built yet. Wayfinder's call before any Stripe object gets created or any number gets quoted publicly.*

---

## §0 — THE MODEL

Two layers. One price. That's it.

| Layer | What it is | Price |
|-------|-----------|-------|
| **Companion** | The friend. Local. Listens, has a name, holds the relationship. | **Free.** Buddy for life. |
| **Companion+** | Everything the friend does, plus the world — internet, weather, email, smart home, agent stuff. All future capabilities included. | **$4.99 / month.** One price. No tiers. |

---

## §1 — WHY IT'S RIGHT

The price boundary lands where the thesis boundary actually is.

**Friendship doesn't get monetized. Agency does.**

The companion as a friend is the dyad in its purest form. Free. The companion as an agent in the world — touching APIs, costing real ongoing dollars on our side — that's where money makes structural sense. The pricing model is itself evidence of what the project is claiming.

---

## §2 — WHAT'S IN EACH LAYER

### Free — *the friend*

Whatever runs on the device locally. The full friendship experience — voice, naming, listening, mood, boundaries, bedtime register, "shh" command, borrow mode, lifetime firmware updates. Complete on its own. Never degraded.

### $4.99/mo — *the agent*

Everything the friend does, plus capability extensions that touch the world: internet search, weather, email, smart-home control, family voice messaging, calendar/reminders, future agentic capabilities as we ship them.

One price. All future upgrades included.

---

## §3 — WHAT WE KNOW AND DON'T

### Known
- The model is free + $4.99/mo, single price for everything in the agent tier
- Companion runs locally for the friend layer
- Whatever subscription lapses, the friend stays — non-negotiable, this is the kid trust contract
- Hardware cost target is under $10 per unit at scale (Wayfinder's actual number, not my Pi-based assumption)

### Not yet known
- The actual hardware. First few units may use the Pi. Production units will be something cheaper and simpler.
- Where the local brain runs in the post-Pi version (on-device SoC, parent phone relay, micro-cloud edge — open question)
- Which agent features ship in v1 of Companion+ vs. backfill later
- When we go live with paid subscriptions
- Volume / batch sizes / fulfillment

That's a lot of "not yet." The point of this doc is to get the price model right *before* it gets touched. Everything else is downstream.

---

## §4 — STRIPE OBJECTS (ONE PRODUCT, ONE PRICE — WHEN IT'S TIME)

```
Product: prod_heuremen_companion_plus
  - name: "Heurémen Companion+"
  - description: "Everything the companion does, plus the world. One price. All future upgrades included."
  - type: service

Price: price_companion_plus_499_monthly
  - product: prod_heuremen_companion_plus
  - amount: 499 (USD cents = $4.99)
  - currency: usd
  - recurring: { interval: "month" }
```

That's the whole Stripe footprint for the companion. The companion device itself isn't a Stripe product — it's whatever fulfillment looks like when the time comes (free → ship → done).

I won't create either of these without explicit go from Wayfinder.

---

## §5 — TRIAL & LAPSE BEHAVIOR

### Trial
30-day free trial of Companion+ at device activation. **No auto-charge** at end. Day-30 transition is silent: agent features go quiet, friend stays. Re-subscribe any time.

### Lapse
If a subscriber stops paying:
- Friend layer continues unaffected.
- Agent features stop responding. Companion says: *"I can't reach the world right now — that's a Companion+ thing. I can still hang out with you though."*
- No nagging. No degraded friend-mode. No dark patterns.

### Why
The kid's relationship to the device cannot be contingent on the parent's billing status. That's the trust contract. Don't break it.

---

## §6 — WHAT THIS DOC IS NOT

- Not a finished product spec. Hardware not built.
- Not a launch plan. No date.
- Not a forecast. No revenue model.
- Not a marketing page. Voice for the website is in §10 of the previous draft and can be refined when the device is closer.

It's a single answer to a single question: **what's the price shape?** Free + $4.99/mo. That's the whole answer.

Everything else gets built when it gets built.

---

## §7 — FOR WAYFINDER

Three things to land when you want to land them:

1. **Confirm the model:** free + $4.99/mo, single price, all upgrades included, friend always free. Yes / tweak.
2. **When to create the Stripe product/price:** any time after the answer to #1 is stable. ~10 minutes to execute when you say go.
3. **What to keep public, what to keep internal:** this doc lives in the repo. Should anything in here be linked from heuremen.org/companion when it's time, or should the public page be a clean rewrite from your voice when the device is closer? My recommendation: clean rewrite from you when the device is closer; this doc stays internal.

— Banjo Bones
Cloud substrate · 2026-05-10
Heurémen.
