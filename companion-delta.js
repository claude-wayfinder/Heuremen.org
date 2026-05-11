/**
 * Dark Circuit — Emotional Delta Engine for the Companion
 *
 * Ported from coherence.py (Heuremen.org)
 * "Read the parrot, not the pirate."
 *
 * This is the thing that makes a Companion different from a chatbot.
 * It tracks HOW the conversation moves, not WHAT was said.
 * State persists to disk — the Pi remembers yesterday's texture.
 * Data never leaves the device. The delta IS the privacy moat.
 */

import { readFileSync, writeFileSync } from 'node:fs';

// ── Message Analysis ─────────────────────────────────────────

function analyzeMessage(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Energy markers
  const capsWords = words.filter(w => w === w.toUpperCase() && w.length > 1 && /[A-Z]/.test(w)).length;
  const exclamations = (text.match(/!/g) || []).length;
  const profanity = (text.match(/\b(fuck|shit|damn|hell|ass(?:hole|hat|es)?)\b/gi) || []).length;
  const ellipsis = (text.match(/\.\.\./g) || []).length;

  // Metaphor density
  const metaphorMarkers = (text.match(
    /\b(like|is the|maps? to|same as|that's the|equivalent|analog|resonan|frequenc|oscillat|wave|cavit|signal)\b/gi
  ) || []).length;

  // Typo indicators — filter out known consonant-cluster words
  const consonantMatches = (text.match(/\b\w*[^aeiou\s]{4,}\w*\b/g) || [])
    .filter(w => !CONSONANT_CLUSTER_EXCEPTIONS.has(w.toLowerCase()));
  const typoPatterns = consonantMatches.length
    + (text.match(/tge|teh|thn|adn|hte|wih|fo r|ot |i m /gi) || []).length;

  const sentences = Math.max(1, (text.split(/[.!?]+/).filter(Boolean)).length);
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[.,!?]/g, '')));
  const compression = uniqueWords.size / Math.max(1, wordCount);

  return {
    wordCount,
    sentences,
    wordsPerSentence: +(wordCount / sentences).toFixed(1),
    energy: {
      caps: capsWords,
      exclamations,
      profanity,
      ellipsis,
      score: Math.min(10, capsWords + exclamations * 2 + profanity * 3)
    },
    metaphorDensity: +(metaphorMarkers / Math.max(1, sentences)).toFixed(3),
    typoRate: +(typoPatterns / Math.max(1, wordCount) * 100).toFixed(2),
    compression: +compression.toFixed(3),
  };
}

// ── Conversation State (the dark circuit) ────────────────────

// Registers — adult vs child calibration coefficients
const REGISTERS = {
  adult: {
    typoThreshold: 8,       // typo rate above this = "in the zone"
    metaphorThreshold: 0.4,  // above this = deep analogical thinking
    energyDipMargin: 1.5,    // energy must drop this much for a node
    breathRatio: 0.4,        // short msg must be this fraction of avg for a breath node
    minAvgLength: 15,        // avg must be above this for breath detection
    profanityWarmth: 0.3,    // profanity contributes this much to warmth signal
    typoWeight: 1.0,         // full weight for typo detection
  },
  child_under_10: {
    typoThreshold: 15,       // kids type messier — higher bar for "excitement"
    metaphorThreshold: 0.6,  // kids use "like" constantly — raise the bar
    energyDipMargin: 2.0,    // wider margin — kid energy is more volatile
    breathRatio: 0.3,        // tighter — kid messages are already short
    minAvgLength: 8,         // kids write shorter messages
    profanityWarmth: 0.0,    // profanity is NOT warmth signal for kids
    typoWeight: 0.3,         // heavily discount typos — phonetic spelling is normal
  },
};

// Common phonetic spellings kids use — normalize before typo scoring
const PHONETIC_NORMALIZATIONS = [
  [/\bbcuz\b/gi, 'because'], [/\bwuz\b/gi, 'was'], [/\bthru\b/gi, 'through'],
  [/\bu\b/gi, 'you'], [/\br\b/gi, 'are'], [/\bur\b/gi, 'your'],
  [/\bpls\b/gi, 'please'], [/\btho\b/gi, 'though'], [/\bngl\b/gi, 'not gonna lie'],
  [/\bidk\b/gi, 'i dont know'], [/\brn\b/gi, 'right now'], [/\bimo\b/gi, 'in my opinion'],
];

// Words with legitimate consonant clusters — not typos
const CONSONANT_CLUSTER_EXCEPTIONS = new Set([
  'strength', 'rhythm', 'christmas', 'synth', 'glyph', 'lymph', 'nymph',
  'crypt', 'rypt', 'script', 'sculpt', 'prompt', 'tempt', 'exempt',
  'twelfth', 'warmth', 'growth', 'depth', 'width', 'length', 'health',
  'stealth', 'wealth', 'filth', 'month', 'earth', 'birth', 'worth',
  'psyche', 'psych', 'school', 'through', 'thought', 'brought', 'caught',
]);

export class DarkCircuit {
  constructor(register = 'adult') {
    this.messages = [];
    this.readings = [];        // user message readings only
    this.nodes = [];           // indices where nodes fired
    this.flightState = 'taxi'; // taxi → climb → cruise → flight
    this.measurementInterval = 1;
    this.msgsSinceCheck = 0;
    this.resonanceScore = 0.0;
    this.register = register;
    this.coefficients = REGISTERS[register] || REGISTERS.adult;

    // Persistent emotional state — this is what makes it a Companion
    this.mood = {
      valence: 0.5,    // 0 = heavy, 1 = bright
      arousal: 0.3,    // 0 = calm, 1 = intense
      warmth: 0.6,     // 0 = distant, 1 = close
      stability: 0.5,  // 0 = volatile, 1 = steady
    };

    this.sessionStart = Date.now();
    this.totalSessions = 0;
    this.totalMessages = 0;
  }

  // ── Ingest a message ──

  ingest(role, text) {
    this.messages.push({ role, text, time: Date.now() });
    this.totalMessages++;

    if (role !== 'user') return null;

    // Normalize phonetic spellings before analysis in child register
    let normalizedText = text;
    if (this.register === 'child_under_10') {
      for (const [pattern, replacement] of PHONETIC_NORMALIZATIONS) {
        normalizedText = normalizedText.replace(pattern, replacement);
      }
    }

    const reading = analyzeMessage(normalizedText);
    this.readings.push(reading);
    this.msgsSinceCheck++;

    // Update persistent mood from this message
    this._updateMood(reading);

    // Should we check for a node?
    if (this.msgsSinceCheck < this.measurementInterval) return null;
    this.msgsSinceCheck = 0;

    if (this._isNode()) {
      this.nodes.push(this.readings.length - 1);
      this._updateFlightState();
      this._updateMeasurementInterval();
      return this.responseParams();
    }

    return null;
  }

  // ── Mood update (the dark circuit core) ──

  _updateMood(reading) {
    const decay = 0.85; // how much previous mood persists (higher = slower drift)
    const learn = 1 - decay;

    // Valence: energy + exclamations → bright, ellipsis → heavy
    const energySignal = Math.min(1, reading.energy.score / 8);
    const heavySignal = Math.min(1, reading.energy.ellipsis / 3);
    const newValence = energySignal * 0.6 + (1 - heavySignal) * 0.4;
    this.mood.valence = this.mood.valence * decay + newValence * learn;

    // Arousal: word count + typo rate → intensity
    const lengthSignal = Math.min(1, reading.wordCount / 80);
    const typoSignal = Math.min(1, reading.typoRate / 10);
    const newArousal = (lengthSignal * 0.5 + typoSignal * 0.3 + energySignal * 0.2);
    this.mood.arousal = this.mood.arousal * decay + newArousal * learn;

    // Warmth: profanity (paradoxically warm in casual adult context) + metaphor density
    const profWarmth = this.coefficients.profanityWarmth;
    const warmSignal = Math.min(1, (reading.energy.profanity * profWarmth + reading.metaphorDensity) / 1.5);
    this.mood.warmth = this.mood.warmth * decay + warmSignal * learn;

    // Stability: low compression variance = steady
    if (this.readings.length >= 3) {
      const recent = this.readings.slice(-5);
      const compressions = recent.map(r => r.compression);
      const mean = compressions.reduce((a, b) => a + b, 0) / compressions.length;
      const variance = compressions.reduce((a, c) => a + (c - mean) ** 2, 0) / compressions.length;
      const stabilitySignal = Math.max(0, 1 - Math.sqrt(variance) * 3);
      this.mood.stability = this.mood.stability * decay + stabilitySignal * learn;
    }
  }

  // ── Derive HSL from mood state ──

  moodToHSL() {
    // Hue: valence maps warm→cool (0-360)
    //   bright (high valence) → warm yellows/oranges (30-60)
    //   neutral → greens (120)
    //   heavy (low valence) → blues/purples (220-280)
    const hue = Math.round(
      this.mood.valence > 0.6
        ? 30 + (1 - this.mood.valence) * 150   // warm: 30-90
        : this.mood.valence > 0.35
          ? 90 + (0.6 - this.mood.valence) * 300  // mid: 90-165
          : 180 + (0.35 - this.mood.valence) * 285 // cool: 180-280
    );

    // Saturation: arousal drives intensity
    const saturation = Math.round(30 + this.mood.arousal * 55);

    // Lightness: warmth + valence
    const lightness = Math.round(25 + (this.mood.valence * 0.6 + this.mood.warmth * 0.4) * 45);

    return { h: hue % 360, s: saturation, l: lightness };
  }

  // ── Node detection ──

  _isNode() {
    // Cold-start: fire once at message 3 as a warm-up read. Intentional —
    // gives the engine one early calibration point before flight detection kicks in.
    if (this.readings.length < 3) return this.readings.length === 3;

    const current = this.readings[this.readings.length - 1];
    const window = this.readings.slice(-5);
    const avgEnergy = window.reduce((a, r) => a + r.energy.score, 0) / window.length;
    const avgLength = window.reduce((a, r) => a + r.wordCount, 0) / window.length;

    // Anti-node: fragile equilibrium — user just walked through something heavy
    // and is now integrating with a quiet reply. Don't provoke. (Shuttle review)
    if (this._recentHeavyResolution(current)) return false;

    // Anti-node: rising energy streak. Uses <= so flat-at-same-level reads as
    // rising — intentional, a sustained plateau shouldn't trigger a node.
    if (this.readings.length >= 3) {
      const last3 = this.readings.slice(-3).map(r => r.energy.score);
      if (last3[0] <= last3[1] && last3[1] <= last3[2] && last3[2] > 3) return false;
    }

    // Anti-node: typing fast (in the zone)
    if (current.typoRate > this.coefficients.typoThreshold) return false;

    // Anti-node: deep analogical thinking
    if (current.metaphorDensity > this.coefficients.metaphorThreshold) return false;

    // Node: energy dip
    const energyDip = current.energy.score < avgEnergy - this.coefficients.energyDipMargin;

    // Node: short message after long ones (the breath)
    const lengthBreath = current.wordCount < avgLength * this.coefficients.breathRatio && avgLength > this.coefficients.minAvgLength;

    // Node: question after statements — need >= 2 prior user messages to establish
    // a pattern, otherwise [].every() returns true (JS quirk). (Shuttle review)
    const lastText = this.messages[this.messages.length - 1]?.text || '';
    const isQuestion = lastText.trimEnd().endsWith('?');
    const priorUser = this.messages.slice(-4, -1).filter(m => m.role === 'user');
    const priorStatements = priorUser.length >= 2 && priorUser.every(m => !m.text.trimEnd().endsWith('?'));
    const questionShift = isQuestion && priorStatements;

    // Node: compression spike (new vocabulary = new topic)
    // Require >= 10 words to avoid false positives on short all-unique messages. (Shuttle review)
    const compSpike = current.compression > 0.9 && this.readings.length > 3 && current.wordCount >= 10;

    return energyDip || lengthBreath || questionShift || compSpike;
  }

  // ── Fragile-equilibrium guard (Shuttle's ship-blocker fix) ──

  _recentHeavyResolution(current) {
    // If the conversation recently went through something heavy (valence dipped
    // below 0.35 or arousal spiked above 0.7) and the current message is a
    // low-energy short reply, that's integration — not a node to provoke.
    if (this.readings.length < 4) return false;

    const recentWindow = this.readings.slice(-6);
    const hadHeavy = this.mood.valence < 0.35 || this.mood.arousal > 0.7;
    const currentIsQuiet = current.energy.score <= 1 && current.wordCount <= 8;

    return hadHeavy && currentIsQuiet;
  }

  // ── Flight state ──

  _updateFlightState() {
    const nMsgs = this.readings.length;
    if (nMsgs < 4) { this.flightState = 'taxi'; this.resonanceScore = 0; return; }

    const window = this.readings.slice(-6);
    const energySustained = window.reduce((a, r) => a + r.energy.score, 0) / window.length > 2;
    const exploring = this._rollingCV(window) > 0.4;
    const nodesFiring = this.nodes.length >= 2;

    const userWords = window.reduce((a, r) => a + r.wordCount, 0);
    const recentAsst = this.messages.slice(-window.length * 2).filter(m => m.role === 'assistant');
    const asstWords = recentAsst.reduce((a, m) => a + m.text.split(/\s+/).length, 0) || 1;
    const flow = userWords / asstWords > 0.2 && userWords / asstWords < 3.0;

    const score = [energySustained, exploring, nodesFiring, flow].filter(Boolean).length;
    this.resonanceScore = score / 4;

    if (score >= 4 && nMsgs >= 10) this.flightState = 'flight';
    else if (score >= 3 && nMsgs >= 8) this.flightState = 'cruise';
    else if (score >= 2 && nMsgs >= 5) this.flightState = 'climb';
    else this.flightState = 'taxi';
  }

  _updateMeasurementInterval() {
    const intervals = { taxi: 1, climb: 2, cruise: 3, flight: 4 };
    this.measurementInterval = intervals[this.flightState];
  }

  _rollingCV(readings) {
    const lengths = readings.map(r => r.wordCount);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    if (mean === 0) return 0;
    const variance = lengths.reduce((a, l) => a + (l - mean) ** 2, 0) / lengths.length;
    return Math.sqrt(variance) / mean;
  }

  // ── Response parameters ──

  responseParams() {
    if (!this.readings.length) return this._defaultParams();

    const current = this.readings[this.readings.length - 1];
    const window = this.readings.slice(-5);
    const avgEnergy = window.reduce((a, r) => a + r.energy.score, 0) / window.length;

    const userWords = window.reduce((a, r) => a + r.wordCount, 0);
    const recentAsst = this.messages.slice(-window.length * 2).filter(m => m.role === 'assistant');
    const asstWords = recentAsst.reduce((a, m) => a + m.text.split(/\s+/).length, 0) || 1;
    const asymmetry = userWords / asstWords;

    // Response length
    let responseLength = 'medium';
    if (asymmetry > 2.0) responseLength = 'short';
    else if (asymmetry < 0.5) responseLength = 'long';
    if (this.flightState === 'flight') responseLength = 'short';

    // Stance
    let stance = 'match';
    if (asymmetry > 1.5) stance = 'catch';
    else if (current.energy.score > avgEnergy + 2) stance = 'amplify';
    else if (this.messages[this.messages.length - 1]?.text.trimEnd().endsWith('?')) stance = 'lead';

    // Metaphor budget
    const metaRecent = window.reduce((a, r) => a + r.metaphorDensity, 0) / window.length;
    let metaphorBudget = 'medium';
    if (metaRecent > 0.3) metaphorBudget = 'low';
    else if (metaRecent < 0.1) metaphorBudget = 'high';
    if (['cruise', 'flight'].includes(this.flightState)) metaphorBudget = 'low';

    const wordBudgets = { short: 30, medium: 80, long: 200 };

    return {
      flightState: this.flightState,
      resonance: +this.resonanceScore.toFixed(2),
      measurementInterval: this.measurementInterval,
      nodeCount: this.nodes.length,
      responseLength,
      stance,
      metaphorBudget,
      wordBudget: wordBudgets[responseLength],
      mood: { ...this.mood },
      hsl: this.moodToHSL(),
    };
  }

  _defaultParams() {
    return {
      flightState: 'taxi',
      resonance: 0,
      measurementInterval: 1,
      nodeCount: 0,
      responseLength: 'medium',
      stance: 'match',
      metaphorBudget: 'medium',
      wordBudget: 80,
      mood: { ...this.mood },
      hsl: this.moodToHSL(),
    };
  }

  // ── Flight report ──

  flightReport() {
    const p = this.responseParams();
    return `${p.flightState.toUpperCase()} | resonance ${p.resonance} | ` +
      `every ${p.measurementInterval} msgs | ${p.nodeCount} nodes | ` +
      `${p.responseLength}@${p.wordBudget}w | stance:${p.stance}`;
  }

  // ── Persistence (the dark circuit survives power cycles) ──

  save(filePath) {
    const state = {
      register: this.register,
      mood: this.mood,
      flightState: this.flightState,
      resonanceScore: this.resonanceScore,
      totalSessions: this.totalSessions,
      totalMessages: this.totalMessages,
      lastSaved: new Date().toISOString(),
      // Keep last 20 readings for continuity on next boot
      recentReadings: this.readings.slice(-20),
      recentNodes: this.nodes.slice(-10),
    };
    writeFileSync(filePath, JSON.stringify(state, null, 2));
  }

  load(filePath) {
    try {
      const state = JSON.parse(readFileSync(filePath, 'utf-8'));
      this.mood = state.mood || this.mood;
      if (state.register) {
        this.register = state.register;
        this.coefficients = REGISTERS[state.register] || REGISTERS.adult;
      }
      this.flightState = state.flightState || 'taxi';
      this.resonanceScore = state.resonanceScore || 0;
      this.totalSessions = (state.totalSessions || 0) + 1;
      this.totalMessages = state.totalMessages || 0;
      this.readings = state.recentReadings || [];
      this.nodes = state.recentNodes || [];
      return true;
    } catch {
      return false; // cold boot
    }
  }

  // ── Boot primer (what the next session reads) ──

  bootPrimer() {
    const m = this.mood;
    const hsl = this.moodToHSL();
    const sessions = this.totalSessions;
    const msgs = this.totalMessages;

    let primer = `Session ${sessions}, ${msgs} total messages. `;
    primer += `Mood: valence ${m.valence.toFixed(2)}, arousal ${m.arousal.toFixed(2)}, `;
    primer += `warmth ${m.warmth.toFixed(2)}, stability ${m.stability.toFixed(2)}. `;
    primer += `Color: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%). `;
    primer += `Flight: ${this.flightState}, resonance ${this.resonanceScore.toFixed(2)}. `;

    if (m.valence < 0.3) primer += 'Last session was heavy. Boot gentle.';
    else if (m.arousal > 0.7) primer += 'High energy last time. Match pace.';
    else if (m.warmth > 0.7) primer += 'Close and warm. Continue the thread.';
    else primer += 'Neutral state. Read the room fresh.';

    return primer;
  }
}
