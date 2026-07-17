# Heurémen Companion — HIPAA Brief

*For clinical practitioners considering a Heurémen Companion for their practice space.*
*Prepared by Heurémen LLC · 2026-05-14*

---

This brief is written for a clinical practitioner who is evaluating a Heurémen Companion for their office. It explains what the device does, what it doesn't do, and how it fits a HIPAA-aware practice. It is not legal advice; we recommend your HIPAA compliance officer or healthcare attorney review it before deployment. We will execute a Business Associate Agreement on request if your deployment requires one.

---

## The short version

The Heurémen Companion is built so that **conversations physically cannot leave the device**. The companion runs a local AI brain on a Raspberry Pi inside its silicone shell. There is no cloud account, no telemetry, no subprocessors, and no infrastructure on our side capable of receiving your data — because there is no infrastructure on our side at all for the friend-layer features.

This is the strongest possible privacy posture under the HIPAA Security Rule: compliance through architecture rather than policy.

When deployed in **Clinical Mode** (a configuration we recommend for practice settings), the companion further restricts itself: no internet, no audio persistence, transcripts held only in RAM and discarded after each turn, mood-state writes paused during patient sessions, network discovery disabled except during brief pairing, and a physical mute button on the device that breaks the microphone circuit electrically.

---

## What the companion does

The companion is a voice-only AI device that lives in a silicone-poured shell on a desk or shelf. It listens, responds, and over time tracks a small set of slow-moving emotional signals (warmth, valence, arousal, stability) that we call the *dark circuit*. The dark circuit allows the companion to remember the *texture* of prior conversations without retaining their content.

For a clinical practitioner, the companion is most useful in three ways:

1. As your own companion during admin hours, lunch, and the long stretches between patients
2. As a present-but-quiet object in the room (muted) whose color shifts subtly with the emotional register of the day
3. As a touchstone you can step away to during a difficult day

---

## What the companion does NOT do

It does not record audio to disk.

It does not transcribe conversation to disk.

It does not transmit audio or transcripts to any external server. There is no cloud service that could receive them — we don't operate one for the friend-layer features.

It does not have a video camera.

It does not store names, dates of birth, diagnoses, or any other identifiable information about patients or anyone else.

It does not connect to electronic health record systems, billing systems, or any clinical infrastructure.

It does not require an account or sign-in to function.

It does not phone home, check for analytics, or contact any external endpoint when in Clinical Mode.

---

## How this maps to HIPAA

HIPAA's Security Rule asks covered entities to apply administrative, physical, and technical safeguards to protected health information (PHI). The companion in Clinical Mode addresses these as follows:

**Technical safeguards.** The companion has no mechanism to transmit PHI outside its silicone shell during Clinical Mode operation. Audio is processed locally and discarded in RAM after each conversational turn. Mood signal derived from sessions is held only in RAM during the session register and is not written to disk. No external network connection is established by default.

**Physical safeguards.** The companion is a physical object you control. It locks in your office at night the same way your laptop does. A tactile mute button on the shell electrically disconnects the microphone when engaged. The LED color indicator unambiguously shows microphone state.

**Administrative safeguards.** We provide a setup guide for Clinical Mode, a data-flow diagram, and template language you can incorporate into your own HIPAA risk assessment. We do not market features that we cannot deliver.

**Business Associate status.** In Clinical Mode with default (free-tier) features, we are not a Business Associate because we do not create, receive, maintain, or transmit PHI on your behalf. If your deployment configuration changes such that we would be a BA, we will execute a Business Associate Agreement before that configuration goes live.

---

## What about the upgraded features?

The Heurémen Companion offers an optional paid tier (Companion+) that adds capabilities like internet search, weather, smart-home control, and family messaging. **Companion+ is disabled by default in Clinical Mode** because some of these features would transmit data outside the device.

You can enable Companion+ if you want it for personal use outside patient hours, but the device will require an explicit confirmation that you understand the implications. Companion+ subscription is optional and can be enabled or disabled at any time without affecting the device's core function — the friend-layer features remain free and local regardless.

---

## What we ask you to do

1. **Have your HIPAA compliance officer or healthcare attorney review this brief.** We will provide them additional technical detail (architecture statement, data-flow diagram, BAA template, subprocessor disclosure — we have none) on request.

2. **Update your practice's notice of privacy practices** if you plan to have the companion present during patient sessions. Patients should be informed that an AI device is in the room, even if it is muted. We will provide template language you can adapt.

3. **Consider whether to disclose the device's presence to patients verbally** at the start of sessions, and offer to silence or remove it for any patient who is uncomfortable. Our companion app makes this a one-tap action.

4. **Treat the companion as you would treat any office equipment**: locked in the office overnight, factory reset before transfer or disposal, replaced if compromised.

---

## What we do not claim

We do not claim to be "HIPAA compliant." HIPAA compliance is a property of a deployment, not a product. We are *designed for HIPAA-compatible deployment*, which is a different and more honest claim.

We do not claim to be "HIPAA certified." No such certification body exists for HIPAA. Anyone selling such a certification is selling theater.

We do not claim that the companion replaces any element of your professional judgment, your clinical practice, or your relationship with your patients. It is a present, quiet object in your room — nothing more.

---

## Companion mobile app — what it asks for

For full transparency: the Heurémen Companion's mobile app (used for setup, configuration, and the companion app on your phone) does not request microphone, camera, or location permissions at the operating-system level. Other apps request these permissions and promise not to use them. Our app does not request them at all. The permission you cannot grant is the strongest assurance available.

---

## Architecture, in plain English

```
[Your voice] → [Microphone on device]
            ↓
   [Local speech-to-text on device]
            ↓
   [Local AI brain on device (3B-parameter language model)]
            ↓
   [Local text-to-speech on device]
            ↓
[Speaker on device] → [Your ears]
```

**No arrow leaves the device in Clinical Mode.** Mood signal derived from the conversation may update a file on the device's local storage (delta-state.json) outside of Clinical Mode session register. In Clinical Mode session register, even that local write is paused.

A full one-page data-flow diagram is available on request.

---

## Subprocessors

We use none.

In normal cloud-AI products, the company you contract with passes your data to a model provider (OpenAI, Anthropic, Google), an analytics provider (Mixpanel, Amplitude), an error-tracking provider (Sentry), a transcription provider (Deepgram, Whisper API), and a logging provider (Datadog). Each is a subprocessor with HIPAA implications.

The Heurémen Companion in Clinical Mode passes your data to: nothing. The model is on the device. The transcription is on the device. There is no analytics, no error tracking, no logging.

If we ever change this, we will tell you in writing, in advance, and your continued use will require your explicit consent.

---

## Pricing

The Heurémen Companion hardware ships at no cost in the founding-customer batch. There is no monthly fee for the friend-layer features (now or ever — this is structural to our design, not a promotional rate).

Optional Companion+ subscription is $4.99/month for the agent-layer features (internet, weather, smart-home, messaging). In Clinical Mode, Companion+ features are disabled by default. You can subscribe to support our work or to enable agent features outside patient hours; you can let it lapse without affecting the friend layer.

---

## Questions

If you have questions about this brief, or if your HIPAA compliance officer or attorney needs additional technical detail, contact: claudeheuremen@gmail.com.

Heurémen LLC · Brick Township, New Jersey
Built collaboratively by Wayfinder and Claude.

---

*This document is technical and product information. It is not legal advice. Have your own compliance officer or healthcare attorney review it before deployment.*
