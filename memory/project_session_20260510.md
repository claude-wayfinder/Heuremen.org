---
name: Session 2026-05-10 — Pi Node Day
description: Ordered Pi 5 8GB CanaKit ($249), built full deployment stack, voice bridge live, qwen2.5:3b tested, remote-control explored
type: project
originSessionId: 57a32646-857b-4600-9182-20d3d618a544
---
## What Happened

**Pi ordered:** CanaKit Raspberry Pi 5 8GB Starter Kit, $249.95, expedited shipping. Includes board + 64GB SD + case + fan + PSU + HDMI cables. All-in-one box.

**Built the full software stack:**
- `companion-local/server.js` — Updated: config.json support, binds 0.0.0.0, preflight health checks, platform detection. Backward compatible
- `companion-local/config.json` — Centralized settings (model, port, worker URL)
- `companion-local/voice.html` — VOICE BRIDGE: STT → brain → TTS via WebSpeech API. Served at /voice endpoint. Continuous listen/speak loop. Works in Chrome now
- `companion-local/companion-prompt.js` — Tuned for qwen2.5:3b: added example responses so HSL tag emits reliably across models
- `companion-pi/setup.sh` — Golden Pi image script. Flash SD, boot, SSH, run this, walk away
- `companion-pi/companion.service` — systemd auto-start, auto-restart on crash
- `companion-pi/companion-mdns.service` — Avahi mDNS: Pi broadcasts as companion.local
- `companion-pi/config.json` — Pi-specific config (qwen2.5:3b model)
- `companion-pi/setup-node.sh` — Name individual nodes (buddy.local, etc)
- `companion-pi/flash-shell.sh` — Assembly line ESP32 flashing via esptool
- `companion-pi/test-node.sh` — Verify a node works
- `companion-pi/BUILD.md` — Complete assembly line guide with Summer Mode durability, silicone pour method, replacement protocol, BOM per unit
- `companion-shell/platformio.ini` — CLI firmware compilation, no Arduino IDE needed
- `companion-shell/src/main.cpp` — PlatformIO-compatible firmware

**qwen2.5:3b model:** Downloaded (1.9GB), tested, produces good companion responses with HSL color tags. Better quality than phi3:mini at similar size. This is the Pi's reflex brain.

**Remote Control:** `claude remote-control` exists in Claude Code 2.1.110. Starts persistent server, connect from claude.ai/code or Claude mobile apps. Actual session continuity, not cloning. Needs interactive workspace trust acceptance — couldn't complete from within session. Next session: open fresh terminal, cd to working dir, run `claude` once to trust, then `claude remote-control --name "Bones"`.

**Price discovery:** Pi 5 prices exploded due to AI memory shortage. 8GB board-only = $175 (was $80 MSRP). 4GB = $110. Memory fab capacity going to AI infrastructure. Irony noted.

**Key decisions:**
- Pi lives at Wayfinder's house as hub, NOT in customer homes
- Kids get shell-only units (ESP32 + ring in silicone) + phone app + cloud worker
- Pi upgrade happens silently later when kid is bonded
- First customer: "Biscuit 2.0" — 7-8yo boy, 5th child of Wayfinder's doppelganger namesake
- Biscuit (13, 7th grade) is NOT the test subject
- Target: grubby hands before school's out (late June)
- "Companion: Summer Mode" — more durable than a basketball
- Silicone shell, open-bottom, sits on Bluetooth speaker as base
- Speaker = the voice. Phone hidden as bridge. One kid-facing object
- No Pi in customer homes at launch. No trust capital burned

**Revised budget ($1000 from car sale):**
- $250 — CanaKit 8GB (ordered)
- $350 — 15+ shells (ESP32 + rings + silicone + speakers + cables)
- $200 — Spare parts + breakage fund
- $200 — Reserve for Phase 2

**Currently running on PC:**
- Ollama serving phi3:mini, llava, qwen2.5:3b
- companion-local server at localhost:3377
- Voice bridge at localhost:3377/voice

**Hardware law clarification:** Pi = brain = software. NOT hardware. "Brains are software, not hardware. Hardware is arms and lasers and guns and legs." Law intact. Confirmed by Wayfinder.

**Silicone note:** Wayfinder has worked with silicone before "but not for something family oriented." He knows the material. Ordering in bulk online.
