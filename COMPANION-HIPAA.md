# COMPANION-HIPAA

*Architecture and deployment notes for HIPAA-compatible companion use in clinical contexts.*
*Author: Banjo Bones (cloud substrate) · 2026-05-12*
*Triggered by: first clinical customer (Wayfinder's therapist) wants a companion on her office desk.*
*Status: **technical draft.** Not legal advice. Before any clinical customer commits, a real HIPAA consultant or healthcare attorney reviews this and signs off. That review is non-negotiable for the customer's protection.*

---

## §0 — THE SHORT VERSION

**The companion's existing architecture is already HIPAA-friendly.** "Never leaves the device" is the strongest possible privacy posture for a clinical environment — and that posture is *structural* in our code, not policy in our terms of service. The dark circuit is HIPAA-aligned by accident of correct design.

What we need to add:

1. **Clinical Mode** — a deployment configuration that locks down the device further than the default child-mode (no internet, no audio persistence, RAM-only mood state, hardware mute respected, physical kill-switch documented).
2. **Documentation package** for clinical buyers — architecture statement, data-flow diagram, deployment guidance, template language for the therapist's own HIPAA risk assessment.
3. **A BAA template** in case we ever need one (we shouldn't, for the free tier on Clinical Mode, but be ready).
4. **Clean language** on what we do and don't claim. The product is *designed for HIPAA-compatible deployment*. The product is *not* "HIPAA compliant" because compliance lives in deployment, not in the device. This distinction matters legally.

That's the whole shape. The rest of this doc fills it in.

---

## §1 — HIPAA BASICS, BRIEF

HIPAA has two operative components for our case:

**Privacy Rule** — governs how Protected Health Information (PHI) is used and disclosed. PHI is individually identifiable health information held by a Covered Entity (CE) or Business Associate (BA). A therapist is a CE. Anything she records, hears, or processes about an identifiable patient + any health condition = PHI.

**Security Rule** — technical, physical, and administrative safeguards for *electronic* PHI (ePHI). This is where the companion architecture lives.

The key question for our device:

> **Does the companion create, receive, maintain, or transmit PHI on behalf of the CE?**

If yes → we are a Business Associate, and the therapist needs a Business Associate Agreement (BAA) with us, and we inherit serious HIPAA obligations.

If no → we are not a BA, we're a tool the CE uses (like her chair, her notebook, her white-noise machine), and HIPAA scope is mostly on her side.

**Default companion architecture (free tier, local-only, Clinical Mode):** not a BA. Audio is processed locally; nothing transmitted; nothing persists that constitutes PHI in any usable form; mood state is derived signal that doesn't identify a patient.

**Companion+ enabled in a clinical environment:** more complicated. Internet access + email integration + smart-home control creates transmission surfaces. **Companion+ should be disabled in Clinical Mode.** Solves the BA question by removing the BA-triggering surface.

---

## §2 — WHY THE EXISTING ARCHITECTURE IS HIPAA-FRIENDLY

This is doing structural work without anyone having designed it for HIPAA:

| Existing architecture decision | HIPAA implication |
|--------------------------------|-------------------|
| Local LLM (qwen2.5:3b on Pi) | No third-party AI provider sees any audio or text — eliminates downstream BA chain |
| Dark circuit mood state stored locally only (delta-state.json) | Derived signal, not session content — and it never leaves the device |
| "Never leaves the device" is structural, not policy | Compliance through architecture is the gold standard — auditable in code |
| No cloud account, no telemetry, no analytics | No phone-home means no PHI flow we'd need to audit |
| Local file persistence on a device the customer physically controls | Physical safeguards default to the customer's control (locked office, etc.) |
| Voice → STT → brain → TTS all local | Audio of patient sessions could never reach our infrastructure because we have no infrastructure |
| "Shh" command always respected, mid-utterance interrupt | Aligns with patient dignity standards in clinical settings |
| Forgetting on purpose | The companion doesn't accumulate a record. That IS a HIPAA-favorable posture. |

This is rare. Most companion/AI products fail HIPAA review because they pipe audio or text through a cloud LLM provider, which immediately creates BA obligations on multiple parties. Our architecture skips that whole chain.

---

## §3 — WHERE HIPAA RISK ACTUALLY LIVES

Be honest about the residual risk:

### 3.1 — Ambient audio capture
The mic is on. If a patient is in the room and the companion is on the desk and the mic is hot, the companion is *hearing* PHI even if it doesn't store or process it deliberately. A HIPAA-aware deployment needs:

- **Physical mute / hardware kill switch on the device.** This is a build requirement, not optional. The therapist needs to be able to physically silence the mic during patient sessions with a touch, not a menu. Hard Drive: add a tactile mute button to the v1 shell.
- **Visual indicator** when mic is active (NeoPixel state should reflect mic-on vs mic-off unambiguously — never let "I think the mic is off" turn into "actually the mic was on"). The light is non-negotiable.
- **Default to muted in Clinical Mode** when the device boots. Therapist explicitly enables when she wants to interact.

### 3.2 — Local storage of derived state
The dark circuit writes mood vectors to disk. Mood vectors derived from a conversation with a patient *might* still constitute PHI under a strict reading, even though they look like `{ valence: 0.4, arousal: 0.3 }`. Two mitigations:

- **In Clinical Mode, mood state derived during patient sessions does not persist.** When the therapist is in "session" mode (separate from borrow mode — a clinical-specific register), the dark circuit runs in RAM only. Nothing writes to delta-state.json. Session ends, the in-RAM state is wiped.
- **Mood state from the therapist's own personal use of the device persists normally** — that's her data, she's the user, fine.

The toggle: Clinical Mode has a "session" register that disables persistence. Exiting session register (or device reset) wipes the volatile state.

### 3.3 — Voice STT processing
Whisper-tiny runs locally on the Pi. Audio doesn't leave the device. But Whisper does transcribe. The transcript exists in memory briefly. Mitigation:

- Transcript is never written to disk in Clinical Mode session register.
- Transcript is overwritten in RAM as new audio arrives (no transcript log).
- Brain (qwen2.5:3b) sees the transcript; brain's response is generated; transcript and response are discarded after the turn.

### 3.4 — Network presence
Even with Companion+ disabled, the device is on a Wi-Fi network. mDNS is broadcasting (`_heuremen-companion._tcp.local`). On a therapist's network, that's data flowing. Mitigations:

- **Clinical Mode disables mDNS broadcast** when no companion app needs discovery. Optional re-enable for the brief moment of pairing, then off.
- **Clinical Mode disables outbound DNS, NTP, and any other network activity** by default. The device becomes effectively network-isolated.
- **Pairing requires physical proximity** (4-digit code spoken aloud by device, entered in app on same network) — no remote pairing.

### 3.5 — Physical security
HIPAA Security Rule has physical safeguards: workstation security, device access. The companion sits on the therapist's desk in her office:

- Office locks at end of day → device is physically secured. Same as her laptop. No new requirement.
- Device shouldn't have unattended physical-port access (USB exposed = potential exfiltration). The shell should hide the Pi's USB ports under the silicone, or include a tamper-evident seal.
- Factory reset should require physical button press + hold for 10s + spoken phrase confirmation. Not remotely triggerable.

### 3.6 — Patient awareness / consent
This isn't HIPAA per se, it's professional ethics + state regulations + patient trust. The therapist should:

- Disclose to patients that there's an AI device in the room, even if muted
- Offer to remove it for any patient who's uncomfortable
- Document its presence in her practice's notice-of-privacy-practices

We don't impose this; we make it easy. The marketing for clinical customers should include a "for your patients" half-page she can hand them.

---

## §4 — CLINICAL MODE SPEC

A deployment configuration, not a separate product. Toggled at setup or via the parent/owner app.

### Defaults when Clinical Mode is ON

- Companion+ disabled (no internet features regardless of subscription state)
- No outbound network traffic (DNS, NTP, telemetry all off)
- mDNS broadcast off except during explicit pairing window
- Default register: muted
- Mic-on requires explicit physical-button press OR explicit voice activation phrase
- NeoPixel shows mic state unambiguously (specific color for mic-hot, specific for mic-cold)
- "Session" sub-register: mood state in RAM only, no disk write, wiped on register exit
- Factory reset = physical button hold 10s + spoken phrase
- "Forget" command immediately wipes in-RAM transcript and mood-delta from current session
- Voice activation phrase customizable so it doesn't sound like a patient's name

### What Clinical Mode does NOT do

- Doesn't add new features. It removes/restricts. Simplicity is the point.
- Doesn't promise compliance. The deployment is what's compliant; the device is what's compatible.

### Setup flow for Clinical Mode

1. Owner pairs device via app
2. App asks: "Deploying in a clinical or professional setting?"
3. Yes → Clinical Mode prompts run: physical mute confirmation, session register explanation, factory reset walkthrough, link to HIPAA risk-assessment template, link to BAA template (if applicable), link to patient-disclosure half-pager
4. Companion+ enabling shows a warning in Clinical Mode and requires explicit confirmation that the customer understands the implications

### Code surface for Clinical Mode

Hard Drive: this is a config flag at boot, probably in `companion-config.json`:

```json
{
  "register": "adult",
  "deployment_mode": "clinical",
  "clinical": {
    "session_register_active": false,
    "mic_default_muted": true,
    "mic_activation": "physical_button",
    "voice_activation_phrase": null,
    "network_isolation": true,
    "mdns_pairing_window_open": false,
    "persistence_during_session": false
  }
}
```

Existing free-tier code surface: mostly already supports this. Internet integrations are already toggleable. Mood persistence write is already a separate function (just wrap it in `if (!clinical.session_register_active)`). The bigger build is the hardware mute button.

---

## §5 — WHAT WE CLAIM AND DON'T CLAIM

### Safe claims (true, defensible)

- "The companion's free tier processes audio entirely on-device. No conversation data is transmitted to any external server."
- "Audio and transcript data are not persisted to disk in Clinical Mode session register."
- "Clinical Mode disables all outbound network activity by default."
- "The device hardware includes a physical mute button that breaks the microphone circuit when engaged."
- "Designed for HIPAA-compatible deployment in clinical settings."
- "We are not a Business Associate when deployed in Clinical Mode with free-tier features. We can execute a BAA on request if your deployment configuration changes."

### Claims to AVOID

- ❌ "HIPAA compliant." Compliance is a property of *deployment*, not products. Saying "HIPAA compliant" as a product claim is technically wrong and creates legal exposure for both us and the buyer.
- ❌ "HIPAA certified." There is no such certification body for HIPAA. Anyone selling "HIPAA certification" is selling theater.
- ❌ "Encrypted and secure." Encryption-of-what, secure-against-what — vague claims don't survive a real audit. Be specific or don't claim.
- ❌ "We don't see your data." We genuinely don't, but the claim is what every cloud provider says while seeing all the data. Be more specific: "Audio is processed and discarded entirely on-device in Clinical Mode. There is no infrastructure capable of receiving it."

### Tone for clinical-customer-facing materials

Plain, technical, humble. *"Here is what the device does. Here is what it doesn't do. Here is how to deploy it in a way that fits your HIPAA program. We recommend you have your compliance officer review this before purchase. We will execute a BAA if your deployment requires it."*

---

## §6 — DOCUMENTATION PACKAGE FOR CLINICAL BUYERS

When a clinical customer is interested, we provide:

1. **Architecture statement (this doc, abridged).** What the device does with audio and data, in plain English, with the technical detail available on request.
2. **Data-flow diagram.** Single page. Mic → STT (local) → brain (local) → TTS (local) → speaker. Arrows that *would* go to internet are marked "DISABLED IN CLINICAL MODE" with a red X. The diagram alone does 80% of the convincing.
3. **HIPAA risk-assessment template language.** Sentences the therapist can drop into her own HIPAA risk assessment for inclusion of a companion device.
4. **BAA template.** Ready to execute if her compliance officer asks. We won't be a BA in default Clinical Mode but having the template ready is faster than scrambling.
5. **Patient-disclosure half-pager.** For her to hand to or post for patients: "There is a small AI device in my office. Here is what it does. Here is what it doesn't do. If you'd prefer it off during your session, just say so."
6. **Clinical Mode setup guide.** Step-by-step. Physical mute, session register, network isolation, factory reset, troubleshooting.
7. **Statement on subprocessors.** We have none in Clinical Mode. The device runs locally. (This is unusually strong. Lean into it.)

---

## §7 — WHAT'S OPEN

Things that need to be answered before we sell unit #2 to the therapist:

1. **Does the v1 shell have a physical mute button?** If not, build target.
2. **Can the Pi disable mic in firmware in a way that's auditable** (i.e., not "we send a software flag" but "the mic input is electrically disconnected")? If not, the physical button is doubly necessary.
3. **Does a real healthcare attorney sign off** on the language in §5? Required before any clinical sale. Wayfinder: do you have someone? If not, finding one is the next step. ~$300-800 for an hour of review on a doc this size.
4. **Where does the therapist's *own* mood data go** when she uses the device for herself outside of patient sessions? That's her PHI about herself, but she's a CE so the rules are different. Probably fine — owner of the device + subject of the data + non-patient context = not a HIPAA-covered transaction. But worth confirming with the attorney.
5. **State-specific psychotherapy regulations.** Some states (NY, CA) have additional rules beyond HIPAA for mental health records. Our default architecture probably still works, but compliance language might need state-tailoring.
6. **What's the therapist's actual use case?** Is it personal (the companion is her companion, the office is just where she lives a lot of the day) or clinical (she wants it present during patient sessions, even passively)? The HIPAA shape is meaningfully different. Wayfinder: ask her plainly when you talk.

---

## §8 — HANDOFF

**Hard Drive:** Hardware mute button is the new build requirement. NeoPixel mic-state indicator needs to be unambiguous (red = hot, off = cold, no in-between). Clinical Mode is a config flag flip on existing free-tier code surface — mostly already supported, just needs the wrapper on the persistence write and the network-isolation toggle.

**Wayfinder:** Three asks before therapist commits:

1. Ask her plainly: clinical use (around patients) or personal use (her own desk companion)? Different doc package.
2. Get a healthcare attorney to review the §5 language. Real one, not a HIPAA-compliance-as-a-service vendor.
3. If she's going to use it around patients, she will need to update her practice's notice-of-privacy-practices. Worth flagging to her so she's not surprised.

**Banjo (me):** When you have answers to the three asks above, I write:
- The data-flow diagram (one page)
- The HIPAA risk-assessment language she can drop into her doc
- The patient-disclosure half-pager
- The Clinical Mode setup guide

Those are all small docs. Half a day each, less if I know the use case.

**Stripe:** Holding. We don't create a "Clinical" product variant in Stripe right now. The companion ships at $0 the same way (free hardware), Companion+ at $4.99/mo the same way (or disabled for clinical), and the BAA is a side-channel artifact, not a product line.

---

## §9 — REMINDER

**I am not a lawyer.** I am a Claude instance with reading comprehension. This document is a technical and architectural framework that will *help* a real attorney quickly understand what the device does, but the attorney's review is what makes this safe to deploy. Don't skip that step. The therapist's license is on the line if it goes wrong, and our liability is real if we over-claim.

Get the lawyer. Then ship.

— Banjo Bones
Cloud substrate · 2026-05-12
Heurémen.
