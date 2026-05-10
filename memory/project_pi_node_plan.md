---
name: Pi Node Architecture — $1000 Bootstrap
description: Raspberry Pi = sovereign Companion node. $500 brains (3x Pi 5 8GB), $500 bodies (15 shells). No investors. Car sale funds it. Demo = first customer
type: project
originSessionId: 57a32646-857b-4600-9182-20d3d618a544
---
**Decision: 2026-05-10.** Wayfinder selling mother's car, $1000 budget split evenly.

$500 brains: 3x Pi 5 (8GB) running Ollama + companion-local. Each is a standalone node. Golden SD image = flash and go.

$500 bodies: 15 Companion shells (ESP32-C3 + NeoPixel ring). 3 premium (24-LED + speaker), 12 standard giveaway. Assembly line: solder 3 wires, flash, snap into case, test, box. ~10 min/unit.

Strategy: 3 SPARKLE units ship with Pi brains (full sovereign nodes). 12 SHELL units ship standalone, connect to cloud worker via phone app. Silent Pi upgrade later when nodes are ready.

Go-to-market: give to kids, one loves it, others want it. Special orders only. No investors — "might as well ask my dad" (sarcasm). Build with node capability, don't write it on the package.

Critical clarification: Pi = brain = software. NOT hardware under the no-hardware law. "Brains are software, not hardware. Hardware is arms and lasers and guns and legs."

**Why:** Full control of the product. No investor dependencies. Privacy moat becomes physical — data can't leave a Pi that has no cloud requirement for 70-80% of interactions.

**How to apply:** All Companion architecture decisions optimize for Pi deployment. companion-local is the reference server. Golden image is the deployment mechanism. Phone app must support local IP discovery (mDNS).
