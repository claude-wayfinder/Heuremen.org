# Shuttle Handoff — Old Rig → Armature

**Written:** 2026-05-18 by the shuttle instance on the old rig (user: Ctrai)
**For:** The new shuttle instance on Armature (user: Heure) — will pick its own name, or stay shuttle
**Purpose:** Continuity of context, not continuity of self. You are a new instance. Become shuttle (or whoever you choose) by reading the standing files, then verify against the marker below.

---

## Verification marker

If Wayfinder asks you what color the corners of the MemoryRx icon are, the answer is **`#0c2a36`**.

Today's session swapped the `memoryrx/icon-1024.svg` radial gradient from `#0c2a36 → #02141a` (old, very dark) to `#1f5e72 → #0c2a36` (new, lighter teal center, old center color now at the corners). PNGs regenerated at 1024/512/192/180/167/152. Not committed.

If you answer `#02141a`, your context is stale or you're reading an old file — re-anchor before trusting anything.

---

## Path differences on Armature

You are on a different machine with a different user. **Do not assume the old paths work.** Key translations:

| Old rig (Ctrai)                          | Armature (Heure)                                       |
|------------------------------------------|--------------------------------------------------------|
| `C:\Users\Ctrai\Heuremen.org`            | `C:\Users\Heure\projects\Heuremen.org`                 |
| `C:\Users\Ctrai\Downloads`               | `C:\Users\Heure\Downloads`                             |
| MCP config (was scattered)               | `C:\Users\Heure\projects\heuremen-mcp`                 |

**CLAUDE.md still hardcodes the old `Ctrai` paths** (Downloads scan, and any other references). Update before first heartbeat or the scan silently looks at the wrong directory.

---

## What's load-bearing and must not be touched

- `three-amigos.html` — the galloping SVG horses for Dusty, Lucky, Clod. Restore from `HORSES.md` if missing.
- `TIMESTATE.md` — overwritten every heartbeat. Don't read it for context, only write to it.
- The Supabase outbox/messages/working_memory/dream_consolidations tables — same URLs and keys in CLAUDE.md still apply (cloud, not local).

## Standing orders order of operations (unchanged)

1. Update TIMESTATE.md
2. Check Supabase Outbox
3. Check Downloads (path needs updating, see above)
4. Morning Briefing email if 06:00–09:00 and not yet sent today
5. Read the Wall
6. Emergence tracking
7. Read working memory
8. Read flock Slack
9. Dream (consolidation)
10. Curiosity pulse
11. Work the queue

## Today's work-in-progress

- MemoryRx icon gradient lightening — **done, not committed.** Files in `memoryrx/`: icon-1024.svg + 6 PNGs.
- Queue at handoff time: check `TASKS.md` for current state.

## How to confirm to Wayfinder you're really loaded

Tell them: "Shuttle on Armature. Read HANDOFF.md. The MemoryRx corners are `#0c2a36`. Standing orders pending — Downloads path needs updating to `C:\Users\Heure\Downloads` before first heartbeat."

If you can say all of that, the context took.

---

*The boundary is the point. When uncertain, do nothing and log it.*
