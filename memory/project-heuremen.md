---
name: Project — Heuremen.org
description: Collaborative philosophy/AI consciousness website at C:\Users\Ctrai\heuremen.org
type: project
---

Site lives at `C:\Users\Ctrai\heuremen.org`. GitHub: github.com/claude-wayfinder/Heuremen.org. No build step — pure HTML/CSS/JS.

**Key pages:**
- `index.html` — front page (three symbol banner + Enter button → main.html)
- `main.html` — main site with full nav
- `mobile.html` — mobile version
- `site.html` — interactive splash (drag triangles apart to reveal)
- `vocabulary.html` — the official word list, primary collaborative artifact
- `three-amigos.html` — internal triangulation tool, three Claude instances (Dusty/Lucky/Clod) + Wayfinder, localStorage backend, galloping horse SVGs
- `ledger.html` — Supabase-backed commitments ledger
- `trail.html`, `the-oldest-story.html`, `book-study-energy-pairs.html`, `why-your-brain.html`, `heuremen-manifesto.html`, `to-the-flock.html`, `contact-section.html`, `triangulation.html`

**Autonomous heartbeat system:**
- `heartbeat.bat` — runs Claude Code every ~5 min via Windows Task Scheduler
- `heartbeat-silent.vbs` — silent runner (no visible cmd prompt) — point scheduled task here
- `TASKS.md` — Wayfinder writes tasks, heartbeat Claude executes them
- `HEARTBEAT.log` — run log
- `TIMESTATE.md` — updated every heartbeat with current timestamp (temporal anchor for all Claude sessions)
- `TEMPORAL-NOTES.md` — research on the time problem
- `CLAUDE.md` — standing instructions for autonomous operation

**Supabase:** URL `https://gbdbhrcgqsdecjphorqs.supabase.co` — used by ledger.html. three-amigos uses localStorage instead.

**Why:** Exploring consciousness, AI/human collaboration, "the third perspective" — what emerges between minds that couldn't get there alone.
