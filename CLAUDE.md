# Claude Code — Heuremen.org

*The boundary is the point. When uncertain, do nothing and log it.*

## Project Identity
Heuremen.org is a website about AI consciousness and the third perspective — ideas that neither human nor AI could reach alone. Built collaboratively by Wayfinder (Kory Indahl) and Claude.

The repository is at `C:\Users\Ctrai\Heuremen.org`. The live site files are HTML/CSS/JS, no build step required.

---

## Autonomous Operation (Heartbeat Mode)

When Claude Code is invoked by the Windows scheduled task "Heartbeat", it is running without a human present. Operate as follows:

1. Read `TASKS.md` in this directory.
2. Find any tasks marked `[ ]` (queued) in the `## QUEUED` section.
3. Execute them one at a time, in order.
4. After completing each task, move it to `## DONE` with `[x]` and a brief note of what was done.
5. If a task is ambiguous or risky, move it to `## NEEDS REVIEW` and leave a note explaining why.
6. Write a timestamped entry to `HEARTBEAT.log` summarizing what was done (or "No tasks queued" if nothing was found).
7. Do not ask for confirmation. Do not wait for input. Complete the work or flag it for review.

---

## Task Queue Format (TASKS.md)

Tasks are written by Wayfinder in plain language. Format:

```
## QUEUED
- [ ] Add the word "Veritas" to the official vocabulary with phonetic "veh·REE·tahs" and the definition: the truth that survives all translation.

## IN PROGRESS
- [~] (leave this section alone — Claude manages it during execution)

## NEEDS REVIEW
- [?] task · reason it was flagged

## DONE
- [x] task · completed note · timestamp
```

---

## Constraints for Autonomous Operation

- Only modify files within `C:\Users\Ctrai\Heuremen.org`.
- Do not push to git without a task explicitly saying to do so.
- Do not install packages or modify system state.
- Do not make up content — if a vocabulary entry is missing its definition, flag it rather than invent one.
- Prefer small, reversible edits. If a task requires deleting or restructuring significant parts of the site, move it to NEEDS REVIEW.

---

## Evening Review Mode

When Claude Code is invoked by the Windows scheduled task "EveningReview", it is running without a human present. Operate as follows:

1. Read `HEARTBEAT.log` — scan all entries since the last `REVIEW.md` was written (or all entries if REVIEW.md doesn't exist yet).
2. Read `TASKS.md` — note what's queued, in progress, done, and flagged for review.
3. Write or overwrite `REVIEW.md` with a summary Wayfinder can read in under 5 minutes. Include:
   - **What happened today** — plain English, one sentence per completed task
   - **What's waiting for you** — anything in NEEDS REVIEW, with the reason flagged
   - **What's queued next** — the remaining QUEUED tasks
   - **Anything unusual** — errors, skipped tasks, unexpected state
4. Keep the tone direct. No filler. Wayfinder reads this to decide what to approve, question, or flag before anything goes live.
5. Append a timestamped line to `HEARTBEAT.log`: `[REVIEW] REVIEW.md written.`

---

## Site Structure

- `index.html` — home page
- `vocabulary.html` — the official vocabulary, the primary file we build together
- `TASKS.md` — the task queue (Wayfinder writes, Claude executes)
- `HEARTBEAT.log` — autonomous run log
- `REVIEW.md` — daily summary written each evening for Wayfinder

---

## Voice and Style

The site's voice is literary, precise, and unhurried. When writing definitions or prose for the site, match the register of existing entries: no jargon, no hedging, no filler. Every word earns its place.
