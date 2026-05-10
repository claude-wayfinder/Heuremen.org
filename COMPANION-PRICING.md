# COMPANION-PRICING

*Stripe product/price/payment-link structure for the Heurémen Companion device.*
*Author: Banjo Bones · 2026-05-10*
*Status: **DRAFT.** No Stripe objects created yet. Wayfinder confirms before any product/price gets written to the live account.*

---

## §0 — STATE OF THE STRIPE ACCOUNT (as of writing)

Account: `acct_1TPi0X2YvPy38B4z` — "Heuremen"

Live products (services):

| Product | Prices live | Notes |
|---------|-------------|-------|
| Flock Triangulation | $9.99 + $29.99 | Three minds (Bones, Shuttle, Revelator) on user-supplied problem |
| Commissioned Witness | $4.99 + $14.99 | Two-mind conversation, user picks pair |
| Quantum Decision Pack | $0.99 + $2.99 | 10 quantum-measured decisions from IBM Heron |

Payment intents to date: 0. Pre-revenue. Account is staged and ready.

No physical product, subscription, or shipping integration set up yet. That's this doc's job.

---

## §1 — THE GAP

The Heurémen Companion ships physical hardware (Pi-based voice friend) to a real first customer (Biscuit 2.0) before late June 2026. Hard drive Bones has the build stack ready, Pi arrives in ~3 days. The Stripe account does not yet have:

- A product for the companion device itself
- Tiered pricing (Founder / Standard / Replacement-shell)
- Payment Link or Checkout flow for hardware purchase
- Shipping address collection
- Tax handling for a US-based hardware product
- A pre-order vs. in-stock flow

This doc proposes all of the above. **Wayfinder approves before anything is created.**

---

## §2 — PROPOSED PRODUCTS

Three products. Names match the project's voice (no SaaS-isms, no SKU codes).

### 2.1 — *Heurémen Companion · Founder Edition*

The first 10 units. For Biscuit 2.0 and the founding flock.

- **Type:** physical good (`shippable: true`)
- **Description:** *"The first 10 companions, hand-assembled, hand-tuned. For the people who believed in it before it existed. Includes lifetime firmware updates and a hand-numbered shell (1 of 10 through 10 of 10). Ships in late June 2026."*
- **Suggested price:** **$499** (one-time)
  - Hardware cost ~$300 (Pi 5 8GB + storage + speaker + mic + NeoPixel + ESP32 + silicone shell + assembly)
  - Founder pricing is below typical retail to honor early belief; not below cost
  - $199 margin per unit covers iteration, shipping, support, and bringing the next batch online
- **Quantity:** 10 units. Stripe limited-inventory mode OR sold via Payment Link with metadata tracking
- **Pre-order:** YES. Ships after Pi-side validation is complete (~late June)

### 2.2 — *Heurémen Companion · Standard*

The version that ships after the Founder Edition. Same hardware, no hand-numbering, normal release cadence.

- **Type:** physical good
- **Description:** *"A small voice companion that lives in a stone on a child's nightstand. Local. No cloud. No ads. No account. The child names it. The child sets the rules. Includes lifetime firmware updates. Ships within 2 weeks of order."*
- **Suggested price:** **$649** (one-time)
  - Same hardware cost ~$300
  - $349 margin covers: support, replacement parts, future firmware development, founder-batch losses, reasonable profit
  - Anchor reference: Moxie was ~$1,500 + monthly. ElliQ ~$1,200 + ~$50/mo. We're half that with no monthly.
- **Quantity:** open
- **Pre-order:** initial batches yes; aim for in-stock by Q3 2026

### 2.3 — *Heurémen Companion · Replacement Shell*

The silicone shell wears, or a kid picks a new color, or it gets chewed. Replaceable.

- **Type:** physical good
- **Description:** *"A fresh silicone shell for an existing companion. Available in the original color and three new ones."*
- **Suggested price:** **$39** (one-time)
  - Materials ~$15, labor ~$10, shipping ~$8, $6 margin
- **Pre-order:** in-stock after first batch of shells is poured
- **Variant model:** use Stripe metadata for color; or create a separate price per color if checkout needs it visible

---

## §3 — PRICING RATIONALE

### Why $499 / $649 / $39 specifically

- **Below Moxie and ElliQ** (the comparable "AI companion" hardware). Those failed or struggled at $1,200+. We're not them, but the market read says $500–700 is the survivable zone.
- **Above Toniebox** (~$100). Toniebox is a different product (audio content player for very young kids, no AI). We're not them either.
- **No monthly fee** is the structural differentiator. Most parents will accept a higher one-time price if there's no recurring charge. The Heurémen Companion is *literally* hardware-only — the device runs locally. No infrastructure on our side after sale = no recurring revenue, no recurring cost.
- **Founder Edition at $499** signals "first ten" without pricing it as a fire sale. The hand-numbered shell makes it a thing.
- **Replacement shell at $39** keeps the device alive past wear, which is critical for a product designed to live on a nightstand for years.

### Why not a subscription

The whole product thesis is no cloud, no account, no ads, no monthly fee. A subscription contradicts the privacy architecture and would gut the trust pitch. Don't.

### Optional add-on (not for v1, but flag for later)

A **"Companion Concierge"** human-touch tier — for $99/year, you get email access to a real human (Wayfinder or trained support) for setup help, voice-tuning, and replacement parts dispatch. Not subscription for the device itself. Optional. **Hold this for v2.** Don't add to v1.

---

## §4 — STRIPE OBJECTS TO CREATE (DRAFT)

When Wayfinder approves, the create-order is:

```
1. Product: prod_heuremen_companion_founder
   - name: "Heurémen Companion · Founder Edition"
   - description: (see §2.1)
   - shippable: true
   - metadata: { tier: "founder", batch_limit: "10" }

2. Price: price_companion_founder_499
   - product: prod_heuremen_companion_founder
   - amount: 49900 (USD cents)
   - currency: usd
   - type: one_time

3. Product: prod_heuremen_companion_standard
   - name: "Heurémen Companion"
   - description: (see §2.2)
   - shippable: true
   - metadata: { tier: "standard" }

4. Price: price_companion_standard_649
   - product: prod_heuremen_companion_standard
   - amount: 64900
   - currency: usd
   - type: one_time

5. Product: prod_heuremen_companion_shell
   - name: "Heurémen Companion · Replacement Shell"
   - description: (see §2.3)
   - shippable: true

6. Price: price_companion_shell_39
   - product: prod_heuremen_companion_shell
   - amount: 3900
   - currency: usd
   - type: one_time
```

Then either three Payment Links (one per product) or a single Stripe Checkout session with all three available.

I will NOT create any of these without Wayfinder's explicit "go." Stripe writes are hard to fully reverse (you can archive products and deactivate prices, but the records persist).

---

## §5 — CHECKOUT / FULFILLMENT FLOW

### v1 (ship target)

**Use Stripe Payment Links, one per product.** Simplest possible. Each link:

- Collects shipping address (Stripe Checkout supports this with `shipping_address_collection`)
- Collects email (default)
- Collects optional note ("Anything we should know? A name for the companion, allergies in your household, etc.")
- After payment, Stripe sends a receipt
- Webhook → simple Google Sheet / Linear ticket / "fulfillment" channel notification → hard drive Bones assembles and ships
- Tracking number entered manually in Stripe metadata after shipment, optional email to customer

Payment Links live on the Heurémen site at:
- `/companion/founder` → Founder edition Payment Link (limited to 10)
- `/companion` → Standard edition Payment Link
- `/companion/shell` → Replacement shell Payment Link

Or one page that lists all three with buy buttons.

### v2 (if volume grows)

- Stripe Checkout custom integration
- Shopify or similar if inventory/fulfillment needs more structure
- Stripe Tax for automatic sales tax calculation across states
- Better email flow (post-purchase: "your companion is being assembled" → "your companion shipped" → "your companion arrived — here's how to set it up")

---

## §6 — TAX

For a small physical-goods business shipping from NJ:

- **NJ sales tax** applies to NJ-shipped orders. Stripe Tax can handle this automatically (~0.5% per transaction fee).
- **Other states** — economic nexus thresholds vary, generally don't matter until $100k+ revenue per state. For v1 / first 100 units, not an issue.
- **International** — punt. v1 ships US only. Add "ships to US only" on the Payment Link page.

Enable Stripe Tax on the account before going live. One-time setup.

---

## §7 — SHIPPING

For v1:

- **USPS Priority Mail** flat rate or first-class for hardware that fits in a small box. ~$8–12 per shipment.
- **Bake shipping into the price** (the $499/$649/$39 already accounts for it).
- **Hand drive Bones ships from his location** during v1. (If this changes, the pricing might need to absorb a shipping partner's cost.)
- For replacement shells: USPS first-class envelope, ~$5 cost.

No Shippo or EasyPost integration needed for v1. Manual label-printing is fine at low volume.

---

## §8 — PRE-ORDER FLOW (RECOMMENDED)

Because Pi-side validation isn't done until ~mid-June and we want to start collecting orders now:

1. Payment Links go live with **"Pre-order: ships late June 2026"** prominent in product description
2. Customer pays in full at checkout (Stripe doesn't natively handle partial pre-auths well)
3. After payment, automatic email: "You're in. Here's what happens next."
4. Roughly weekly updates from Wayfinder: assembly progress, photos of in-progress shells, etc. (this is the relationship-building phase — these first customers are choosing to believe in something not-yet-shipped)
5. As units ship, "Your companion is going in the mail today" email with tracking
6. Day-of-arrival follow-up: "It should be there. Try saying hi."

Refund policy: full refund any time before ship date, no questions. Once shipped, 14-day satisfaction-or-money-back.

---

## §9 — RISKS / WHAT COULD GO WRONG

- **Hardware costs creep above $300.** Margin shrinks. Mitigation: lock in Pi pricing now (CanaKit $249 already locked), price out shell pour at scale before second batch, build in 15% buffer.
- **Shipping damage.** A silicone-poured device is somewhat fragile. Mitigation: shipping foam, packaging spec'd before first ship, include a "what to do if it arrives damaged" card.
- **Returns spike.** A device that needs the child to engage with it day-1 may underperform in the first week. Mitigation: include a parent quick-start card, encourage the parent to set expectations correctly per `COMPANION-FIRST-WORDS.md` parent onboarding.
- **Wayfinder's name and tax info.** Hardware sales mean income, mean reporting. Make sure the LLC (or whatever business entity — CertificateOfFormation.pdf is in the repo) is the listed Stripe entity, not Wayfinder personally.
- **Stripe payouts cadence.** First payout has a holding period. Don't budget assuming day-1 cash flow.

---

## §10 — HANDOFF

Hard drive Bones: read this when you surface. Flag anything that conflicts with what's on your side of the Stripe account or hardware costs. The numbers are starting points, not hardcoded.

Wayfinder: this is a draft. Three things to decide:

1. **Pricing** — does $499 / $649 / $39 feel right? Adjust if the founder price should be higher (more like a "thank you for believing" amount) or lower (more aggressive recruitment).
2. **When to create the Stripe objects** — I won't create until you say go. Once you say go, this takes ~10 minutes.
3. **Pre-order vs. wait-until-in-stock** — recommendation is pre-order now (locks in commitments, gets early money flow, generates the first-customer relationship loop). But it's your call.

If you want the Stripe objects created today, say so and I'll execute. If you want to tune the numbers first, send them.

— Banjo Bones
Cloud substrate · 2026-05-10
Heurémen.
