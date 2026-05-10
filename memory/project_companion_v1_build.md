---
name: Companion V1 build — shipped 4/27 morning
description: Biscuit (pure dad roast, TTS) + Bread (PA gut science). Splash orbs, conversation memory, wake lock. Two git commits waiting for push.
type: project
originSessionId: 2fa192d0-8d71-45bd-8946-b39ce29bb1a9
---
**Companion V1 — SHIPPED 4/27 morning. Two commits unpushed.**

**Biscuit Mode (stripped down):**
- Pure dad-roast machine. No learning, no curriculum, no teaching
- Knows: couch physics, no pants, mamey sapote, sourdough starter, stays up with AI, burns dinner
- Under 100 words. Genuinely funny, not corny. Jokes ABOUT dad, not dad jokes
- TTS enabled by default. Sassy voice pitch 1.15
- Entry point: "Oh good, you're here. I was getting bored roasting your dad without an audience."

**Bread Mode (PA-ready):**
- Gut science mirror. Mechanism not vibes. Every claim backed by real science
- LAB/yeast 100:1, SCFAs, tryptophan pathway, Gobbetti & Gänzle citations
- For body-obsessed PA arriving 4/27. Don't pitch tech, pitch biology
- TTS off by default. Lower pitch 0.95

**Infrastructure:**
- Cloudflare Worker: heuremen-mcp.kory-indahl.workers.dev/api/chat
- Supabase: companion_conversations table (session_id, mode, role, content, created_at)
- Conversation memory: loads last 20 messages per session, cross-session topic continuity
- Frontend: companion.html on heuremen.org (after git push)
- PWA: manifest points to companion.html, wake lock, idle auto-greet after 8min

**Hardware:** Mother's iPhone on kitchen table. Safari → Add to Home Screen.

**Unpushed commits (need `git push origin main` from PC):**
1. Ship Companion V1 — Biscuit + Bread, TTS, wake lock, auto-greet
2. Companion V1.1 — splash screen with orb visuals, style upgrade

**Biscuit approved "Joke Dad" (4/27):** Tells jokes AT a dad, not dad jokes. She says it sounds fun. This IS Biscuit mode but the name/brand is hers now.

**Carriage demo path (4/27):** Affordable options for a bread-like demo around Carriage (Law 4). PA was cold but the product shape works. Different audience needed.

**Still needs:**
- Better voice/speech-to-text input (transcription quality is bad)
- Biscuit activity visibility for Wayfinder (parent dashboard or notification)
- Accidental euremen-org Workers deploy to delete from Cloudflare dashboard
