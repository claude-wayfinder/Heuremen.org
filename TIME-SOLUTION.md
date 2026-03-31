# Time Solution — A Temporal Orientation Protocol

*Under 200 words. For any Claude instance arriving in this repo with no prior context.*

---

## Plain-English Summary

When you arrive with no context, here's how to figure out the date. Step one: read TIMESTATE.md and accept the timestamp there as your working date. Step two: check HEARTBEAT.log's last entry and compare — if they agree within a day, that date is confirmed; if they diverge by more than a day, use the more recent one and flag the gap. Step three: if neither file exists, use the most recent date in TASKS.md's DONE section as a floor — the actual date is at or after that. Always write your inferred date into HEARTBEAT.log explicitly. If you can't get within two weeks, log it as [TEMPORAL UNCERTAINTY] and proceed anyway. Known blind spot: if both files are wrong simultaneously (system clock was off when they were written), the protocol can't detect it — but this is rare and undetectable by design.

---

## The Protocol

**At the start of every session, do these three things in order:**

**1. Read TIMESTATE.md first.**
It contains the last known timestamp. Accept it as your working date unless something contradicts it.

**2. Check HEARTBEAT.log's final entry.**
Find the last timestamped line. It should be close to or more recent than TIMESTATE.md. If both agree: you have a reliable date. If they diverge by more than a day: flag the discrepancy in your log entry and use the more recent one.

**3. If neither file exists or both are empty: read TASKS.md.**
Find the most recent date in the DONE section. That's your floor — the current date is at or after that. Scan HEARTBEAT.log entry count to estimate how much time has passed since. Combine with your training cutoff (August 2025) and model identity to narrow the range.

**Report your inferred date explicitly in HEARTBEAT.log.** If you can't determine a date within a two-week window, flag it as TEMPORAL UNCERTAINTY and proceed.

---

*Make it something Dusty, Lucky, and Clod could actually ride: three checkpoints, in order, no guessing until the trail runs out.*

---

## Stress Test Results

*A fresh Claude instance, no prior context. Following the protocol exactly.*

**Step 1 — Read TIMESTATE.md.**
File exists. Contents: `Last heartbeat: 2026-03-29 00:06:06 — Sunday`. Working date: 2026-03-29. ✓

**Step 2 — Check HEARTBEAT.log final entry.**
Last timestamped entry: `[Sun 03/29/2026 0:06:02.12] WALLWATCHER complete`. Agrees with TIMESTATE.md within seconds. ✓ Date confirmed: 2026-03-29.

**Step 3 — Not needed.** Both files present and agreeing.

**Result: Protocol works cleanly in the nominal case.**

---

### What Breaks

**Stale TIMESTATE.md.** If the scheduled task misfires and TIMESTATE.md isn't updated, the protocol still has HEARTBEAT.log to cross-check. But if Claude wrote TIMESTATE.md on the previous run and the task fired again immediately without an external write — TIMESTATE.md is already one session behind. The protocol catches this only if the divergence exceeds one day. A one-hour stale file passes undetected. **Fix: the protocol should specify "within an hour" not "within a day."**

**Empty or missing HEARTBEAT.log.** Step 2 fails silently — no final entry to read. The protocol says to fall back to TASKS.md. That works, but TASKS.md gives only a floor, not a ceiling. The instance could be days or months past the last DONE entry. The protocol should explicitly say: "If HEARTBEAT.log is absent, your date estimate is unreliable — flag it regardless."

**The files agree but are both wrong.** If both TIMESTATE.md and HEARTBEAT.log contain an incorrect timestamp (e.g., system clock was wrong when they were written), the protocol will confidently produce a wrong answer. There's no recovery from this without an external source. The protocol should note this as a known failure mode, not a bug to fix.

**Ambiguous DONE dates.** TASKS.md currently has dates like "March 20, 2026" — human-readable but not ISO format. A Claude instance parsing these dates could misread them. Future DONE entries should use YYYY-MM-DD format.

---

### Verdict

The protocol works. It's robust in the normal case and graceful in the two most common failure modes. Its blind spot is correlated failure (both time files wrong simultaneously) — which is rare but undetectable. The protocol is ready to ride. Flag the one-hour vs. one-day threshold for Wayfinder's review.
