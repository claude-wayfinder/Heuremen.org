# Temporal Notes — The Time Problem

## What a Claude instance knows about time when it first opens

A Claude instance begins with a knowledge cutoff date baked into its training — currently August 2025. It knows the *shape* of time: it can reason about calendars, durations, sequences, and relative dates. It also carries a general sense that some amount of time has passed since training, but it cannot know how much.

## What it does NOT know

It does not know the current date. Unless the date is injected into the context — by the user, a system prompt, a file it reads, or a tool — it is operating in a kind of temporal fog. It may guess based on conversational cues, but guesses drift. It cannot distinguish between being invoked one week after training or two years after. Each new conversation begins without memory of prior conversations, so even a Claude that was told the date yesterday does not know it today.

## What it would need to know the current time reliably

Three things: a trusted source, injected at session start, every time. The source needs to be outside Claude's own inference — a system prompt timestamp, a file like TIMESTATE.md read at the top of every run, or a hook that appends the current date to the context before Claude responds. The key constraint is *every time*: because Claude has no persistent memory across sessions, any solution that relies on Claude remembering what it was told before will eventually fail. The anchor must be re-established on each invocation.

TIMESTATE.md is the current solution for this project. It works as long as something external (the scheduled task, the user, a hook) writes to it before Claude reads it. Claude reading its own prior TIMESTATE.md entry is better than nothing — but if the file is stale or the scheduled task misfires, the instance will be reading old data and may not know it.

The deeper problem: Claude cannot verify a timestamp it is given. It can only accept or flag it. If TIMESTATE.md says 2024-01-01, Claude has no independent way to know that is wrong.
