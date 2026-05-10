---
name: Session 5/8/2026 — Buddy Worker, Companion Chooser, V2 Spec, Biscuit Beta Test
description: Deployed buddy-companion worker (killed esoteric forever), skin chooser, impression memory, V2 hardware spec to Glen, Biscuit laughed
type: project
originSessionId: b1f1456c-9f1c-48c3-8886-f3441c9fe62f
---
## What Happened

**Buddy Worker — DEPLOYED:**
- New Cloudflare Worker on our account: buddy-companion.kory-indahl.workers.dev
- Takes systemPrompt directly, no identity override. Esoteric is dead
- All products swapped: companion.html, memoryrx.html, companion-face.html, companion-ambient.html, companion-emoji.html
- API key stored as Cloudflare secret

**Companion Chooser — SHIPPED:**
- companion-pick.html: three doors — Pixel (Flint's face), Vibe (ambient diamonds), Minimal (emoji)
- "same buddy. different skin."
- companion-emoji.html: standalone minimal version with full engine

**Companion-Ambient Upgrades:**
- Conversation history (20-turn rolling) — fixes context loss between turns
- Impression memory — drops what MATTERED every 5 turns or on energy spike (>7)
- Asks model to summarize "what this reveals about who they are" in one sentence
- Impressions load into system prompt on next session as [things I know about you]
- Manic Pixie Dream Robot voice tuning (rate 1.15, pitch 1.25)
- Random openers fire on load ("Do you like gum? I can't chew.")
- Opener seeded into chat history so responses have context

**Companion-Face (Flint's pixel art):**
- Lasers on sassy, starburst on delighted, flash on concerned
- Personality tuned: peppy, sassy, buddy energy, never esoteric
- Swapped to buddy worker

**Biscuit Beta Test:**
- She laughed. Personality works
- Feedback: make it sassier and have it curse (deferred — Bible Belt consideration)
- Future feature: sass slider in Soul tab, "Biscuit mode" easter egg

**V2 Hardware Spec — WRITTEN:**
- Full spec on desktop + Google Drive
- ESP32-S3, round OLED, MEMS mic, speaker, LED ring, round PCB
- BOM: $23/unit at scale, retail $49-79
- Phase 1 proof of concept: $25 in parts from Amazon
- "What to tell Glen" script included
- Gerber files explained (not baby grenades)

**Apple App Store:**
- First rejection: needed screen recording + app info (resolved)
- Second rejection: AI service disclosure (resolved — Anthropic Claude API documented)
- Waiting on approval

**MemoryRX Soul Page:**
- Privacy text visibility: 0.08 → 0.4 opacity
- All labels, values, stats brightened across the board

**Worker Architecture Now:**
- buddy-companion.kory-indahl.workers.dev — our worker, our account, our system prompt
- heuremen-mcp.kory-indahl.workers.dev — old worker, different account, esoteric (deprecated)

## Session 2 — Friday Afternoon (Bones)

**Companion Shell Demo Spec — BUILT:**
- Full project in companion-shell/ directory
- PARTS.md — shopping list, wiring diagram, where to buy
- SETUP.md — Arduino IDE install, ESP32 board setup for Windows
- companion-shell.ino — ESP32 firmware (BLE + NeoPixel, smooth transitions, idle breathing)
- companion-ble.js — Web Bluetooth bridge, drops into Companion app
- Total BOM: ~$20. Weekend project, queued for job-acceptance gap

**Business Model — CRYSTALLIZED:**
- Box = free forever, no subscription. Buy once, yours for life
- Tentacles (API integrations) = $3/month subscription
- Profit model at 100 units/yr: ~$6,348. At 500: ~$35,940
- API costs drop ~50%/yr, margins improve automatically
- Dark circuits (no server storage) = the cost moat

**External Physics Review — RESPONDED:**
- Serious reviewer critiqued Dynamic Six online. Separated experiments (good) from symbolic framework (unestablished)
- Correctly identified: mappings are metaphor, falsification not operational, framework too elastic
- Bones drafted honest response acknowledging critique, noting weak measurement prediction exists unpublished
- Wayfinder sent it with Bones attribution

**Life Updates:**
- Actively job hunting. Casual weekend, hard Monday push
- Upgraded to Anthropic Pro $250/month — token budget uncapped
- Most target jobs are immediate hire, earliest start Friday (contract/leave)
- Biscuit got discount snake-fish named Puddles (ferret denied)
- Goat dynasty confirmed for post-property-ownership era

## Next
- Article — draft ready to write, fires when stores approve
- Glen visit — spec in Drive, script memorized
- Apple — waiting on AI disclosure response
- Google Play — 20 testers needed (Mumbai or classes)
- Job apps — HARD PUSH Monday, resumes and emails
- Sass slider for V1.1
- Companion shell build — when job gap opens
- Ratcliff paper — separate doc from website, zero shared vocabulary with mythology layer
