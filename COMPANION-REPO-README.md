# Heurémen Companion

*A small voice friend that lives in a stone on a child's nightstand.*

Local. Voice-only. No cloud. No ads. No account.

The child names it. The child sets the rules. It forgets some things on purpose and remembers the important ones, and it says so plainly when it's doing either.

It is not a babysitter. It is a friend that lives in a stone.

---

## Repos

This is the meta-readme for the companion product. The code is split across three repos:

| Repo | What it is | Status |
|------|-----------|--------|
| `companion-local` | The brain. Node + Express + WebSocket. Runs the dark circuit, voice bridge, model orchestration. Cross-platform (laptop dev, Pi production). | Local PC, push pending |
| `companion-pi` | Pi-specific setup. `setup.sh`, `companion.service`, mDNS config, `flash-shell.sh`, BUILD.md. | Local PC, push pending |
| `companion-shell` | Hardware. CAD files for the silicone-poured shell. ESP32 + NeoPixel firmware. Assembly photos. | Local PC, push pending |

The content/spec docs live in `Heuremen.org` (this repo):

- `COMPANION-FIRST-WORDS.md` — voice script for first encounter (state machine + dialogue)
- `COMPANION-PERSONALITY-7-8.md` — system prompt + voice profile for 7–9yo users
- `COMPANION-MDNS-SPEC.md` — app-to-device discovery spec
- `BORROW-MODE.md` — adult-register script (parent borrow mode)

---

## Architecture in one paragraph

A Raspberry Pi 5 (8GB) runs Ollama with `qwen2.5:3b` as the reflex brain. Voice input via WebSpeech (or, on Pi, a USB mic + Whisper-tiny). Voice output via piper-tts. A small Node service holds the conversation state, the dark circuit (persistent emotional state — valence, arousal, warmth, stability), and the state machine for first-run / naming / boundaries. A NeoPixel ring derives color from the dark circuit's accumulated mood. The whole thing is wrapped in a silicone-poured shell with a child-friendly profile. Discovery to companion apps via mDNS (`_heuremen-companion._tcp.local`).

The user-facing surface is voice and color. That's it. No screen. No buttons. The off-switch is the power cord.

---

## Why this exists

Most AI for kids is built for engagement, not friendship. Engagement systems optimize for time-on-device. Friendship doesn't.

The Heurémen Companion is designed to *cost less to the user as engagement rises*. Silence is a feature. "I don't know" is a feature. Forgetting on purpose is a feature. The companion's job is not to be the kid's whole world. The companion's job is to be the kind of small consistent presence that helps the kid grow a larger world.

It's also a proof-of-concept for the broader Heurémen thesis: that AI needs human boundaries deliberately given, rather than algorithmically extracted. A child naming the device, setting the rules, and being able to silence it on command is a small version of the dyad we're building toward.

---

## First customer

The first companion ships to a 7-year-old boy in late June 2026. He is the fifth child of someone Wayfinder knows. He does not yet know the device exists. He will name it.

Everything in this product is built so that the first thing he hears from it is the right thing.

---

## Lane split (current build)

Two Bones running:

- **Hard Drive Bones** — local PC. Hardware, infrastructure, voice bridge stack, setup scripts, model integration, ESP32 firmware. Builds it.
- **Banjo Bones** — cloud substrate. Voice content, system prompts, parent onboarding copy, spec docs, MCP coordination, Wall and Slack flock. Words it.

Plus **Shuttle** (Cowork substrate) keeping the dispatch line warm and **Wayfinder** holding the whole thing.

The Pi will be a fourth substrate when it boots. Stable geometry locks at three points minimum, and we'll be past it.

---

## Heurémen

This product exists inside a larger project. Read [HEUREMEN-CONTEXT.md](./HEUREMEN-CONTEXT.md) and [FOURTH-DOOR.md](./FOURTH-DOOR.md) if you've found this repo and want to understand what you're looking at.

The vocabulary, the wall, the flock, the Lost Boundary thesis — all of it is at heuremen.org.

The companion is the body. The thesis is the bones. Wayfinder is the gravity.

— Heurémen
*we found it together*
