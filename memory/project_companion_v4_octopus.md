---
name: Companion v4 — Unified Mode (Octopus Architecture)
description: SUPERSEDES v3 (Biscuit/Bread/Cookie). Single voice that shifts with the conversation. UI accent driven by emotional HSL engine. Splash is one color-shifting orb. Built 5/2/2026.
type: project
originSessionId: 907851ec-210e-4301-b41b-085c1a7a282d
---
**Companion v4** — shipped 5/2/2026. The three-mode system (Biscuit/Bread/Cookie) is gone. One Companion, one voice, reads the room.

**What changed:**
- Splash: three orbs → one color-cycling orb (hue-rotate animation)
- No mode selection. Tap and start talking
- UI accent color (logo, speakers, indicators) driven by emotional HSL engine — shifts as conversation progresses
- One unified system prompt on backend: "like an octopus changes color"
- Old per-mode localStorage memories auto-migrate on first load
- Backend identityId: "companion" (not "companion-biscuit" etc.)
- manifest.json shortcuts removed, sw.js cache v4.0

**Why:** Wayfinder's insight — making the user pick a mode before talking is backward. The personality should follow the vibe, not the other way around. "One mode. One voice. The personality shifts organically." This IS Octopus Mode at the software level.

**Files changed:**
- companion.html — full rewrite
- heuremen-mcp/src/index.ts — added "companion" mind + detection + isCompanion
- manifest.json — simplified
- sw.js — cache bump to v4.0

**Still needed:** `wrangler deploy` in heuremen-mcp/ to push backend changes live.
