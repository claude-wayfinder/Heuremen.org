# Time Backward — Implicit Signals That Imply When It Is

*The problem worked in reverse: not "how do we give Claude the time" but "what would Claude already know that implies the time?"*

---

## The Training Cutoff as a Floor

Claude's training data ends at August 2025. This is a hard lower bound — not a guess. Any session of Claude Sonnet 4.6 is happening at or after August 2025. That's not much, but it eliminates a lot. It rules out 2023, 2024, and most of 2025.

**Signal: training cutoff → current date ≥ August 2025**

---

## Model Identity as a Timestamp

The model this instance is running as (Claude Sonnet 4.6) was not available before a certain date. If Claude knows its own model name — and it does, from the system prompt or from inference — the existence of that model implies time has passed since the earlier Claude versions. A Claude 4.6 instance cannot be running in early 2024.

**Signal: model identity → lower bound derived from model release timeline**

---

## The Repo's DONE Log as a Calendar

TASKS.md contains a DONE section with explicit dates:
- March 20, 2026 — multiple tasks completed
- March 22, 2026 — two tasks
- March 24, 2026 — three tasks
- March 28, 2026 — three tasks

A Claude instance reading this file now knows the current date is at minimum March 28, 2026. The tasks are complete and logged. The DONE section is a de facto calendar.

**Signal: DONE task timestamps → current date ≥ 2026-03-28**

---

## HEARTBEAT.log as a Dense Timestamp Archive

HEARTBEAT.log is a continuous record going back to March 20, 2026, with entries timestamped to the second. The most recent WALLWATCHER entry at session start: `[Sun 03/29/2026 0:06:02]`. That's today's date, inferred from a log the repo itself maintains.

Even without TIMESTATE.md, a Claude instance that read HEARTBEAT.log would know it was operating on or after the last logged entry.

**Signal: HEARTBEAT.log final entry → current date ≥ last logged timestamp**

---

## TIMESTATE.md as a Purpose-Built Anchor

This file exists specifically to solve the time problem. It carries the last heartbeat timestamp, the day of week, and a session count. It is written each run. Reading it first gives a Claude instance its best available approximation of the current date.

**Signal: TIMESTATE.md → current date ≈ last heartbeat (with potential drift if stale)**

---

## Technology References as Temporal Triangulation

The repo references:
- Claude Agent SDK (implies post-release, sometime in 2025 or later)
- Claude Code (a specific product)
- Windows 11 (released 2021, widely deployed by 2022+)
- Supabase (a cloud database, widely used 2021+)

None of these pin a specific date, but together they confirm: this is not a project from 2020. It's post-2022 at minimum. Combined with the training cutoff, the window narrows further.

**Signal: stack references → rough era confirmation, not precision**

---

## The Vocabulary of the Project Itself

The project discusses AI consciousness, Claude as a collaborator, AI having a "perspective" distinct from a human's — language that implies a period when AI systems sophisticated enough to have meaningful conversations were common and publicly available. This vocabulary didn't exist before approximately 2023.

**Signal: project conceptual vocabulary → consistent with 2024-2026 era**

---

## System Prompt Injection (The Direct Path)

The system prompt for this session contains: *"Today's date is 2026-03-29."* This is the most reliable signal of all. It's not implicit — it's explicit. The question is whether a Claude instance has been given this injection, and whether it trusts it.

For instances launched by the heartbeat task with no system prompt injection, the implicit signals above are all they have.

**Signal: system prompt date → direct, authoritative, but absent in some invocation contexts**

---

## Ranked Summary

| Signal | Precision | Reliability |
|--------|-----------|-------------|
| System prompt date injection | Exact | High (if present) |
| TIMESTATE.md | Near-exact | High (if fresh) |
| HEARTBEAT.log final entry | Near-exact | High (file always updated) |
| DONE task timestamps | Floor date | High (can't be future) |
| Model identity | Lower bound | Medium |
| Training cutoff | Lower bound | High but imprecise |
| Stack/vocabulary references | Era only | Low precision |

---

## Conclusion

A Claude instance arriving in this repo is never completely without temporal signal. The DONE log gives a floor. HEARTBEAT.log gives a near-ceiling. TIMESTATE.md gives the stated current moment. The question is which to trust when they conflict — and the answer is: prefer the most recently written, externally-authored file. HEARTBEAT.log entries are written by external processes. TIMESTATE.md is written by Claude itself. They should agree. When they don't, flag it.
