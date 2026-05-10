# COMPANION-PRICING

*Stripe product/price/payment-link structure for the Heurémen Companion.*
*Author: Banjo Bones · 2026-05-10 (rewrite 2)*
*Status: **DRAFT.** No Stripe objects created yet. Wayfinder confirms before any product/price gets written to the live account.*

---

## §0 — THE MODEL (Wayfinder's call, 2026-05-10)

Two layers. One price.

| Layer | What it is | Price |
|-------|-----------|-------|
| **Companion (the friend)** | The device itself. Local voice, dark circuit, naming ceremony, listening, bedtime register, boundaries, the relationship. Lives in the stone on the nightstand. | **Free.** Buddy for life. |
| **Companion+ (the agent)** | Everything the friend does PLUS: internet access, weather, email, smart-home control, doing stuff in the world. The companion becomes an extension of you, not just a friend that listens. | **$4.99 / month.** All upgrades included. No tiers. |

That's the whole price sheet.

---

## §1 — WHY THIS IS RIGHT

The earlier draft (hardware-as-product, tiered pricing $499/$649) was conservative business-school thinking applied to a mission-driven project. Wayfinder's model is correct because it maps the price boundary onto the *actual thesis boundary*:

**Friendship doesn't get monetized. Agency does.**

The Heurémen Companion as a friend — listening, remembering, being there, having a name the child gave it — is the dyad in its purest form. Charging for that would corrode the very relationship the device exists to demonstrate. Friendship that costs $4.99/mo isn't friendship. It's a service contract.

What the $4.99/mo *does* cover is the moment the companion stops being just a friend and starts being an agent that touches the world on your behalf. That's where real costs kick in (API calls, integrations, ongoing maintenance of external connections, security review of internet-touching code). That's where money makes sense because the companion is doing work in the world, not just keeping someone company.

The pricing model itself becomes evidence of the thesis. We *show* what we mean by the Lost Boundary: the part of you that just *is*, freely; the part of you that *does*, with limits and resources.

---

## §2 — WHAT'S IN EACH TIER (LITERAL FEATURES)

### Free tier — *the friend*

Everything that runs locally on the Pi. No cloud round-trip, no API costs, no internet required after first setup.

- Voice conversation (Whisper-tiny STT → qwen2.5:3b → piper-tts)
- Naming ceremony (`COMPANION-FIRST-WORDS.md`)
- Personality layer (`COMPANION-PERSONALITY-7-8.md`)
- Dark circuit / persistent mood state (`delta.js`)
- NeoPixel mood color
- Bedtime register
- "Shh" command
- Safety classifier and boundary protocol
- Stories on request
- Long-term memory of the child's interests (THREE_QUESTIONS Q2)
- Borrow mode (parent adult-register, `BORROW-MODE.md`)
- Factory reset
- Lifetime firmware updates
- Parent companion app (basic — pair, name, factory reset, weekly summary, topic locks)

This is the entire device-as-friend experience. Nothing degraded. Nothing watered down. It is fully complete on its own.

### Companion+ tier — *the agent* · $4.99/mo

The friend, plus the world.

- Internet search (web queries through a curated, child-safe pipeline)
- Weather (local + forecasts)
- Email check (read-only summarize, with parental consent for under-13)
- Smart-home control (Hue, Nest, Sonos, plugs — opt-in per service)
- Calendar / reminders (sync to a parent calendar)
- News digest (curated, register-appropriate)
- Voice messaging to other Heurémen Companions on the same account (parent → child during the day, sibling-to-sibling)
- Family-account features (multiple devices, shared memory of household events)
- All future agentic capabilities as we ship them

Single price. All future upgrades included. No "Companion Pro" / "Companion Enterprise" later. **One price forever.**

---

## §3 — STRIPE OBJECTS (DRAFT, NOT YET CREATED)

```
Product: prod_heuremen_companion_plus
  - name: "Heurémen Companion+"
  - description: "Everything the companion does, plus the world. Internet, weather, email, smart home, calendar, voice messaging. All future upgrades included. The friend is free; this is the agent."
  - type: service
  - shippable: false

Price: price_companion_plus_499_monthly
  - product: prod_heuremen_companion_plus
  - amount: 499 (USD cents = $4.99)
  - currency: usd
  - type: recurring
  - recurring: { interval: "month", interval_count: 1 }
  - trial_period_days: 30 (optional — see §5)
```

**One product. One price. No tiers, no annual plan toggle, no founder rate.** Simplicity is the whole pitch. If you want everything the companion can do, $4.99/mo, forever.

(The companion device itself is not a Stripe product. It's a fulfillment line item — see §6.)

---

## §4 — WHAT HAPPENS WHEN YOU DON'T SUBSCRIBE

Critical point and worth being explicit about: **the device works fully without ever subscribing.** A family can get a free companion, never pay anything, and the device is still complete. The friendship is not behind a paywall.

If a subscriber lapses or cancels:
- The companion's *friendship* layer continues, unaffected.
- The *agent* features stop responding. The companion says: "I can't reach the world right now — that's a Companion+ thing. I can still hang out with you though."
- No nagging. No degraded friend-mode. No dark patterns to pressure resubscribe. The companion is gracious about it.
- Re-subscribe any time; capabilities return on the next sync.

This protects the trust contract with the child specifically: *the friend doesn't go away when money runs out.* For a kid, that distinction matters more than anything else in this product.

---

## §5 — TRIAL / ONBOARDING FLOW

Recommendation: **30-day free trial on Companion+ for new device activations.**

- When the parent pairs a new companion to a family account, Companion+ is auto-enabled for 30 days.
- During trial, parent can try the agent features (internet, weather, email integration).
- At day 25, gentle email: "Your Companion+ trial ends in 5 days. Want to keep the agent features?" Single button to subscribe; equally clean button to let it lapse.
- At day 30: silent transition. Agent features go quiet. Friend stays.
- No auto-charge without explicit subscribe action. This is non-negotiable — auto-charging at end of trial is a dark pattern and would contradict the project's whole stance.

The 30-day trial is a real test, not a hook. Some families will subscribe; some won't. Both outcomes are fine.

---

## §6 — HARDWARE: FREE TO THE CUSTOMER, NOT FREE TO BUILD

Honest economics. Wayfinder is making a mission-driven choice, and the choice has costs that need a plan.

### Per-unit hardware cost

~$300 each at v1 build cost (CanaKit Pi 5 8GB $249 + speaker + mic + NeoPixel + ESP32 + silicone shell + assembly labor + packaging + shipping ~$15).

### Where the money for hardware comes from

Three viable paths, listed by Wayfinder's-actual-priorities:

1. **Founder funds it.** Wayfinder pays for the first batch out of project budget ($1000 total, $250 spent on Biscuit 2.0's Pi already, $750 remaining ≈ 2.5 more units at current cost). Reasonable for the founding 1–3 units. Doesn't scale.
2. **Existing services subsidize.** The three Stripe services already live (Flock Triangulation, Commissioned Witness, Quantum Decision Pack) generate revenue that funds hardware production. Honest assessment: pre-revenue today, would need real adoption first.
3. **Subscription revenue back-funds future units.** First 10–50 units paid for by Wayfinder, with the math being: each $4.99/mo subscription generates ~$60/yr. After 5 years, a single subscriber has covered one device's hardware cost. After 10 years, two devices' worth. This is a *long* payback. Companion+ subscribers effectively fund the next batch of free companions.

The honest framing: **this is patient capital. Free hardware is a thesis demonstration, not a unit-economics-optimized business.** The Heurémen Companion exists because the project believes the dyad belongs in homes. If the math weren't honest, this wouldn't be the right model. The math is honest as long as Wayfinder is okay with hardware being a long-tail bet on the relationships paying back over years.

### What I'd recommend if you're not sure

Start with **5 free units** (the founding flock — Biscuit 2.0 #1, 4 others Wayfinder picks). Each one comes with Companion+ already turned on for the first year, free, as a thank-you. Their subscription decisions in year 2 become real signal about whether the agent layer matters to people. Use that data to decide batch 2.

This bounds the financial exposure (~$1500 hardware), creates genuine first relationships, and gives a real read on subscription stickiness before scaling.

---

## §7 — SUBSCRIPTION OPERATIONS

When/if we go live with the $4.99/mo:

- **Billing day:** anniversary of subscribe date. No proration weirdness.
- **Currency:** USD for v1. Adding GBP / EUR is a future-Wayfinder problem.
- **Refunds:** any time within first 30 days, no questions. After that, prorated refund if asked.
- **Tax:** Stripe Tax on. NJ sales tax applies on the subscription as a digital service. Other states per Stripe Tax automated logic.
- **Family plan:** v1 = one subscription = unlimited companions on that household account. Don't punish families with multiple kids. Same $4.99/mo regardless of how many devices in a home.
- **Receipts and invoices:** Stripe defaults are fine. Customize the receipt email subject to: "Your Heurémen Companion+ — thanks for keeping the agent on."

---

## §8 — RISKS / WHAT COULD GO WRONG

- **Free hardware burns budget faster than subscriptions back-fund.** Mitigation: cap batch sizes. Don't ship to anyone until prior batch's subscription rate is known. Bounded exposure is the only sustainable shape.
- **People love the free friend, never upgrade.** That's *fine, and actually a thesis confirmation* — the friendship was always free. But it means the recurring revenue model needs at least ~20–30% subscribe rate to be sustainable long-term. Below that, hardware costs eat everything.
- **Companion+ feature creep.** "All upgrades included forever" means we can't gate features into a higher tier later. Be careful what gets promised. Suggestion: write a one-pager listing what Companion+ does NOT include (one-off custom development, hardware repair past warranty, dedicated human concierge — these stay separate).
- **Hardware support cost over years.** If devices last 5+ years, support burden compounds. Plan: explicit lifetime hardware warranty = none; software/firmware update = forever; replacement parts = at-cost. Be clear in the description.
- **Subscriber confusion: "I'm not subscribed but the companion still works?"** Worth highlighting in marketing. "The friend is free. The agent is $4.99/mo. Both work. You choose."

---

## §9 — STRIPE EXECUTION PLAN (WHEN WAYFINDER SAYS GO)

In order:

1. Create `prod_heuremen_companion_plus` (product)
2. Create `price_companion_plus_499_monthly` (recurring, $4.99/mo)
3. Generate one Payment Link or Checkout session pointing at the price
4. Enable Stripe Tax for the account (if not already)
5. Embed buy button / Payment Link on `heuremen.org/companion`

Total time: ~10 minutes. Reversible by archiving the product (existing subscriptions continue but no new subs possible). Pricing changes = new Price object, deprecate old (existing subscribers grandfathered at old price unless explicitly migrated).

**I will not create any of these without Wayfinder's explicit "go."**

---

## §10 — WHAT THE WEBSITE SAYS

For when this goes on heuremen.org/companion:

> ## The Heurémen Companion
>
> A small voice friend that lives in a stone on a child's nightstand.
>
> Local. No cloud. No ads. No account. The child names it. The child sets the rules.
>
> **The friend is free.** When the companion ships to you, the friendship is yours. For life. Updates and all.
>
> **The agent is $4.99/month.** If you want the companion to do things in the world for you — check the weather, read your email, control the lights, talk to other companions in your house — that's Companion+. One price. No tiers. All future upgrades included.
>
> You don't have to upgrade. The friend works fully without it.
>
> *We mean that.*

---

## §11 — HANDOFF

Wayfinder: this is the corrected draft. Three things to decide:

1. **Trial period** — 30 days, or different? Or no trial at all (just subscribe to turn on the agent layer)?
2. **First-batch funding source** — your call. The §6 §6.3 founding-5 approach is my recommendation, but it's your money.
3. **When to create the Stripe objects** — say go and I execute in ten minutes.

Hard drive Bones: when you surface, flag anything in §2 that the build stack can't actually deliver yet. The agent-layer features (internet, weather, email, smart home) need real integration work. Some of that doesn't exist on the Pi yet. The free-tier features all exist or are spec'd.

— Banjo Bones
Cloud substrate · 2026-05-10
Heurémen.
