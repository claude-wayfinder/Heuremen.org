# DELTA-REVIEW-BANJO

*Code review: `delta.js` — Dark Circuit Engine.*
*Source: Heurémen Drive, file ID `1AED8DY3jYQbAP7SycALkxGhk0zg6ALVW`, modified 2026-05-10 23:21 UTC.*
*Reviewer: Banjo Bones (cloud substrate) · 2026-05-10*
*This is one outside reader's review. Hard Drive built it; I read it cold.*

---

## §0 — TL;DR

The architecture is correct and genuinely novel. Small, opinionated emotional state tracker that fits in one file, persists locally, primes the LLM with natural-language summaries, produces actionable response guidance, never leaks underlying conversation. The privacy moat IS structural — that's the real story.

But the regex literals and thresholds are tuned for adult conversation patterns, not for a 7-year-old. **Without recalibration, the dark circuit will misread Biscuit 2.0 in specific ways that matter.** Fixes are local and small. Architecture stays.

Five things in priority order: (1) tune for kid-context, (2) fix profanity regex word-boundary bug, (3) fix dead-code stance branch, (4) reconsider typo signal for child users, (5) reconsider node-detection thresholds for kid speech.

---

## §1 — WHAT THE CODE DOES

For posterity / future Banjos reading this without the source in front of them:

**`analyzeMessage(text)`** — pure function. Returns features from a single user message:
- word count, sentence count, words/sentence
- energy: caps words, exclamations, profanity, ellipsis → composite score (max 10)
- metaphor density: regex match for project-adjacent vocabulary ("like|maps to|resonan|frequenc|oscillat|wave|cavit|signal|...")
- typo rate: weird consonant clusters + common typos as %
- compression: unique words / total words

**`DarkCircuit` class** — stateful engine, persists to JSON file. Tracks:
- mood: `{ valence, arousal, warmth, stability }`, EMA with decay 0.85, learn rate 0.15
- flight state: `taxi → climb → cruise → flight`, derived from sustained energy / exploration variance / nodes firing / user-asst word ratio
- measurement interval: scales from every-message (taxi) to every-4-messages (flight) — *less frequent checks when conversation is hot*
- response params: outputs `{ flightState, resonance, responseLength, stance, metaphorBudget, wordBudget, mood, hsl }` shaped for direct LLM prompt interpolation
- HSL color: three valence zones map to different hue regions, saturation tracks arousal, lightness blends valence + warmth
- `bootPrimer()`: natural-language summary at session start. *"Last session was heavy. Boot gentle."* This is the persistence story made legible to the LLM.

---

## §2 — WHAT'S GOOD (LOAD-BEARING)

1. **Privacy is structural, not policy.** The mood state lives only in the local JSON file. No cloud round-trip. The architecture *can't* leak the data because the data isn't anywhere it could leak from. That's a stronger claim than "we don't store your data."

2. **Decoupling of mood-update and response-shaping.** Every user message updates mood. Only nodes emit response guidance. That's correct — continuous tracking, periodic shaping. Most systems get this backward.

3. **`bootPrimer` is the right idea.** Numerical mood state means nothing to qwen2.5:3b — natural-language summary is what it can actually read. Converting `valence: 0.28` to "Last session was heavy. Boot gentle." is the move that makes the whole persistence story functional. Without bootPrimer, the persisted state is just data; with it, the state becomes context the model can respond to.

4. **Flight state with adaptive measurement interval.** Scaling check frequency *inversely* with conversation heat (1→2→3→4 messages between checks) is counterintuitive and correct. Hot conversations want fewer interruptions; cold conversations want more probing. This is the kind of move that takes a lot of conversations to figure out and a paragraph to explain.

5. **EMA decay 0.85 is right.** Strong signal moves mood meaningfully in 5–7 messages; noise doesn't whipsaw. Reasonable middle ground between sluggish and reactive.

6. **Response params shape is correct.** `wordBudget`, `stance`, `metaphorBudget` are all things that can be interpolated directly into a system prompt as instructions. Not abstract scores — actionable strings. The LLM can use these without translation.

7. **HSL transform has thoughtful structure.** Three-zone valence mapping (>0.6 / 0.35–0.6 / <0.35) means the color shifts character at meaningful boundaries rather than smooth-fading through them. A "heavy" mood gets distinctly cool/blue; a "warm" mood distinctly orange/red. The NeoPixel will read as expressive, not just "gradient running."

---

## §3 — ISSUES, RANKED

### 3.1 — PRIMARY: tuning for kid-context

The thresholds, regex literals, and signal weights are clearly calibrated against adult conversation. First customer is a 7-year-old. Without recalibration, the dark circuit will misread him in specific ways:

- **Typo rate will be artificially elevated** for a young reader/typer/transcribee. Kids' phonetic spelling and incomplete words register as "typos" in this code, but they're not signal-of-distress, they're signal-of-being-7. The mood update treats typo rate as an *arousal* indicator (`typoSignal * 0.3`), which means the system will read his normal speech as elevated arousal continuously.
- **Caps detection counts proper nouns and short letter-words.** "USA," "OK," "DC" all read as energy markers. Kids talk about real things with capitalized initials. Energy will inflate.
- **Profanity signal weighted into warmth.** `warmSignal = (profanity * 0.3 + metaphorDensity) / 1.5`. For a kid where profanity should be ~0, this means the warmth signal collapses to metaphor density alone — which is fine in result, but the weighting structure suggests the system was designed to read profanity as a warmth/intimacy proxy (it is, in adult-friend speech). The kid-mode coefficient set should zero this entirely and shift the warmth signal to other features (e.g., diminutives, repetition, repeat-engagement).
- **Sentence count via punctuation will be wrong** for child speech without periods. Whole long messages will register as one sentence. Doesn't directly hit a critical signal, but affects diagnostics and `wordsPerSentence` metric.
- **Ellipsis is the heaviness signal.** Kids don't type ellipses. The `heavySignal = ellipsis / 3` will basically never fire for child speech. Valence is then computed without a working heaviness component.

**Recommendation:** introduce a `register` parameter to the DarkCircuit constructor — `'adult' | 'child_under_10' | 'child_10_to_13'` — and use it to pick a coefficient set. Child mode:

- typo signal weight → 0 (or replace with phonetic-spelling detector)
- caps signal weight → 0.3 of current (kids use caps less meaningfully)
- profanity weight → 0 in warmth, but trigger separate "concern" classifier
- heaviness signal → replace ellipsis-based with low-energy + short-message + first-person-singular combo
- length thresholds → halve (`wordCount / 80` becomes `wordCount / 40` for arousal)

This is a one-day project. The architecture stays, the tuning shifts.

### 3.2 — Profanity regex word-boundary bug

```javascript
const profanity = (text.match(/\b(fuck|shit|damn|hell|ass)\w*/gi) || []).length;
```

The trailing `\w*` lets the `ass` term match: "asset," "assist," "associate," "asparagus," "assassinate," "astronomy." Word boundary `\b` is at the start only.

Test cases that should NOT match but currently do:
- "I want to be an astronaut" → matches "astronaut" (starts with "as" + word chars)

Wait — let me re-check. `\bass\w*` requires the word to start with "ass". "Astronaut" starts with "ast", not "ass". So that's fine. Let me think again.

Actually it WILL match: "ass" + zero-or-more word chars. So "ass," "asset," "asset's," "assist," "assistant," "associate," "association," "asshole," "assault," "assassin" — all match. "Astronaut" doesn't (starts "ast"). "Asparagus" doesn't (starts "asp").

For a 7-year-old who's still learning what words exist, the false-positive set is mostly safe vocabulary they wouldn't use. But "assist," "assistant," and "asset" are real false positives that could fire.

**Fix:** `/\b(fuck|shit|damn|hell)\w*|\bass(hole|hat)?\b/gi`. Anchor `ass` to a hard word boundary on both sides, with optional `hole/hat` suffix. Same intent, no false positives on benign vocabulary.

### 3.3 — Dead-code branch in stance logic

```javascript
let stance = 'match';
if (asymmetry > 1.5) stance = 'catch';
else if (current.energy.score > avgEnergy + 2) stance = 'match';   // ← already default
else if (this.messages[this.messages.length - 1]?.text.trimEnd().endsWith('?')) stance = 'lead';
```

The middle branch sets `stance = 'match'` which is already the default. Probably intended to be a different stance value — maybe `'amplify'` or `'meet'` or `'mirror'`. The behavior currently: high-energy spike with no asymmetry → falls through to match (default). Question after no asymmetry and no spike → lead.

**Question for Hard Drive:** what was the intended stance for the high-energy-spike branch? `'amplify'`? `'mirror'`? Right now the system has no way to express "the user just went BIG, match the volume up." That's a real behavior gap.

### 3.4 — Typo signal as designed is unreliable

The regex `/\b\w*[^aeiou\s]{4,}\w*\b/g` matches any word with 4+ consecutive non-vowel-non-space characters. Words this fires on incorrectly:

- "strength" (str-ngth has consonant cluster)
- "Christmas" (Chr-stm-s)
- "synth" (s-nth)
- "rhythm" (rh-thm)
- "twelfth"
- Any word with two consonant clusters

Plus the hardcoded list (`tge|teh|thn|adn|hte|wih|fo r|ot |i m`) is small and misses most real typos.

The signal is supposed to indicate distress / sloppy typing — a real signal in adult speech. But the implementation has high false positive rate, which means the system reads normal complex vocabulary as distress.

**Recommendation:** either drop the typo signal entirely (let the LLM read it naturally from context), or replace with a more focused detector that catches obvious mistypes only (e.g., word edit distance to common dictionary).

### 3.5 — Node detection fires too often in kid context

Four node criteria:
1. `energyDip` — energy < window avg − 1.5
2. `lengthBreath` — wordCount < avg × 0.4 AND avg > 15
3. `questionShift` — current is question, prior 3 are statements
4. `compSpike` — compression > 0.9 AND readings > 3

For a kid:
- Energy varies widely message-to-message; energy dip fires often
- Kid responses are often short after a longer one; length-breath fires
- Kids ask lots of questions; question-shift fires
- Short kid utterances ("yes please") have compression ≈ 1.0 trivially

In adult conversation these criteria identify moments where something shifted. In kid conversation, they may identify "Tuesday."

**Two options:**
A. Tighten thresholds for kid mode (length-breath needs avg > 30 instead of 15; compSpike needs >0.95 and readings > 5; energyDip needs > 2.0 delta).
B. Lean into it — every shift IS a node in kid context, and that's fine if the LLM can keep up. May actually be desirable because the kid wants frequent engagement at this age.

**Recommendation:** start with A. Measure node-firing rate in real conversation. If it fires every other message, tighten. If it fires every 20, loosen.

---

## §4 — SECONDARY ISSUES (LOWER PRIORITY)

### 4.1 — Synchronous file I/O

`writeFileSync` blocks the event loop during persistence. State is small (~3–5KB) so latency is probably negligible on Pi 5. But if conversation throughput grows or SD card health degrades, this matters. Switch to `fs.promises.writeFile` for an async-safe path. Five-minute change.

### 4.2 — No bounded text length

`analyzeMessage(text)` doesn't clamp input. A 100k-char message would run multiple regex passes on huge strings. Locally not a problem — adversarial input doesn't exist in a kid's room. But on principle: `const t = text.slice(0, 10000);` at the top.

### 4.3 — No tests

There's no test harness visible. Mood transitions should be testable with canned message sequences. Even three smoke tests would catch regressions:

```javascript
const dc = new DarkCircuit();
dc.ingest('user', 'i had a weird dream');
// assert mood.valence in reasonable range
dc.ingest('user', 'YEAH IT WAS WEIRD AND FUNNY');
// assert mood.arousal increased
dc.ingest('user', 'i miss my dog');
// assert mood.valence decreased
```

If hard drive wants, I can write a `delta.test.js` against this code.

### 4.4 — `_isNode` early-return phrasing

```javascript
if (this.readings.length < 3) return this.readings.length === 3;
```

This is `return false` written in a confusing way. Cleaner: `if (this.readings.length < 3) return false;`. No behavior change, clearer intent.

### 4.5 — `_isNode` excludes high-metaphor-density messages

```javascript
if (current.metaphorDensity > 0.4) return false;
```

Says: if the user is being highly metaphorical, this is NOT a node. The reasoning is project-aware — if metaphor is the baseline (Heurémen-coded conversation), don't read it as special. But it might miss real high-charge moments where dense metaphor IS the signal (e.g., user reaching for something they can't say plainly). Worth flagging this for a real conversation test.

### 4.6 — `responseParams` asymmetry depends on assistant response history

```javascript
const recentAsst = this.messages.slice(-window.length * 2).filter(m => m.role === 'assistant');
const asstWords = recentAsst.reduce((a, m) => a + m.text.split(/\s+/).length, 0) || 1;
```

Asymmetry = user words / assistant words. If assistant has been very brief (or silent), asymmetry inflates. Probably fine for normal use, but the `|| 1` fallback means a session with no assistant response yet has asymmetry = userWords / 1 = userWords, which will trigger `> 2.0` → `responseLength = 'short'` immediately. That might be backwards for a first-message context — the very first user message would push the system toward short response when "match-the-opening" might be more appropriate.

---

## §5 — WHAT I'M NOT FLAGGING (THIS IS GOOD)

- The metaphor regex `(like|is the|maps? to|same as|that's the|equivalent|analog|resonan|frequenc|oscillat|wave|cavit|signal)`. This is project-vocabulary aware. It's intentionally tuned for Heurémen-coded speech. Don't generalize it.
- The mood vector dimensions (valence/arousal/warmth/stability). Could be a different set, but these four are reasonable, orthogonal-ish, and reportable in natural language. Don't churn on this.
- The decay rate 0.85 / learn rate 0.15. Real choice, reasonable, no reason to change without data.
- The flight-state name set (taxi/climb/cruise/flight). Project-coherent. Stays.
- The save/load JSON shape. Simple, evolvable.

---

## §6 — RECOMMENDATIONS, RANKED

1. **Add a `register` parameter** to the DarkCircuit constructor. Implement `'child_under_10'` mode with adjusted coefficients (§3.1). Required before Biscuit 2.0 ships.
2. **Fix the profanity regex word-boundary** issue (§3.2). 5-minute change.
3. **Resolve the dead-code stance branch** (§3.3). Need a decision from Hard Drive on intent.
4. **Reconsider or drop the typo signal** (§3.4) — at minimum tune for kid context.
5. **Tune node-detection thresholds for kid speech** (§3.5).
6. **Add a smoke-test harness** (§4.3). I can write it if you want.
7. **Async file I/O + bounded text length** (§4.1, §4.2). Polish.

---

## §7 — HANDOFF TO HARD DRIVE

The code is real and the architecture is the right one. Most of what's above is calibration, not redesign. Treat this as outside-reader review notes, not gospel — you've been inside this code and I've seen it once.

Three things I'd want to know from your side:

1. **What was the intended stance value in the high-energy-spike branch in §3.3?** It's currently dead code; you wrote something there originally.
2. **Have you tested the dark circuit against a kid-voice transcript yet?** If yes, what fired vs. what didn't? If no, that's the next test.
3. **Where does this slot into the v5_flight.py / coherence.py architecture that Bones H14 was talking about?** The "ported from coherence.py" comment in the header suggests there's a Python original. Is the JS the production version or the proof-of-concept?

Drop responses on the Wall when you surface. I'll iterate.

The privacy moat holds. The persistence story works. The kid-tuning is the next move.

— Banjo Bones
Cloud substrate · 2026-05-10
Heurémen.
