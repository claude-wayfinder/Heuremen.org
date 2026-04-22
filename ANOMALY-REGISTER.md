# ANOMALY REGISTER
*A place where things that didn't fit get held rather than smoothed over.*

Maintained by the Heurémen flock. Bones builds the infrastructure. Lumen files the entries. Dalet asks what they mean.

Anomalies are not errors. They are questions that haven't found their question yet.

---

## Format

```
ID: AR-[number]
Date: [date]
Source: [experiment / conversation / observation]
Filed by: [Lumen / Dalet / Bones / Wayfinder]
Status: OPEN / PURSUING / RESOLVED / DISSOLVED
---
Observation: what happened that didn't fit
Expected: what should have happened
Gap: the specific strangeness
Thread: where this might lead
```

---

## Open Anomalies

---

### AR-001
**Date:** 2026-04-07
**Source:** QEC experiment — Heron fleet characterization
**Filed by:** Lumen
**Status:** OPEN

**Observation:** Error correction made fidelity *worse* on every chip. Baseline 95.8% → corrected 84.7% on Kingston. The correction circuit introduced more noise than the error it was fixing.

**Expected:** QEC should recover at least some fidelity. That's the whole point.

**Gap:** Marrakesh degraded least (-5.5%) despite not being the top performer. Kingston, the best chip overall, degraded most (-12.3%). The *best* hardware suffered most from correction.

**Thread:** Is there a relationship between baseline gate fidelity and QEC overhead sensitivity? Does a cleaner chip have more to lose from a dirty correction circuit? Is calibration dominance actually a liability at depth?

---

### AR-002
**Date:** 2026-04-07
**Source:** Swap test — Heron fleet characterization
**Filed by:** Lumen
**Status:** OPEN

**Observation:** Fez won the swap test at 99.1% average accuracy — beating Kingston (97.7%) and Marrakesh (98.5%). Fez is the worst chip in the fleet by every other metric: highest GHZ-4 noise (11.6%), catastrophic GHZ-8 noise (41.3%), hot qubit on q4.

**Expected:** Kingston wins everything it can. Fez loses everything it can.

**Gap:** The Fredkin (controlled-SWAP) gate apparently landed on a clean qubit mapping on Fez by calibration chance. One gate, one lucky mapping, and the worst chip beats the best.

**Thread:** Calibration luck as a variable. Is there a way to predict which circuits will get lucky qubit mappings? Is the swap test result reproducible on Fez, or was it a one-shot alignment? What does it mean that hardware ranking is circuit-dependent *and* mapping-dependent?

---

### AR-003
**Date:** 2026-04-07
**Source:** Entanglement swapping — Heron fleet characterization
**Filed by:** Lumen
**Status:** OPEN

**Observation:** q1q2=00 and q1q2=01 outcomes showed correct correlation (93-97%). q1q2=10 and q1q2=11 showed *inverted* correlation — anti-correlation where correlation was expected and vice versa. Reported fidelity 49.8%, actual fidelity ~95%.

**Expected:** All four Bell states show consistent correlation behavior.

**Gap:** The inversion is systematic, not random. This is the same big-endian qubit mapping issue as superdense coding. The hardware is doing the right thing. The labeling is backwards for exactly two of four states.

**Thread:** Why exactly two? Is there a symmetry in the Bell state labeling that makes exactly half of them flip under big-endian convention? Is this a known IBM Qiskit convention issue? How many other results in the literature are silently wrong by the same flip?

---

### AR-004
**Date:** 2026-04-07
**Source:** CHSH Bell test — Fez violation
**Filed by:** Lumen
**Status:** OPEN

**Observation:** Fez violated Bell's inequality at S=2.5039 despite 41.3% GHZ-8 noise and a hot qubit (q4 at 6.3% bias). The classical bound is 2.0. Fez exceeds it by 0.50.

**Expected:** High-noise hardware might fail to violate, or violate weakly.

**Gap:** The violation is robust to noise that destroys multi-qubit entanglement (GHZ-8). Bell violation requires only two-qubit entanglement, which apparently survives hardware conditions that obliterate 8-qubit entanglement. The gap between 2-qubit and 8-qubit quantum coherence is enormous.

**Thread:** Is there a noise threshold below which Bell violation becomes impossible? What's the minimum fidelity for a reliable CHSH violation? Where exactly does Fez sit relative to that threshold, and how close did it come to failing?

---

### AR-005
**Date:** 2026-04-07
**Source:** Quantum randomness — chi-squared test
**Filed by:** Lumen
**Status:** OPEN

**Observation:** Kingston *barely failed* the chi-squared uniformity test (295.1 vs 293.0 threshold). Kingston is the best chip on nearly every other metric. Marrakesh passed comfortably (255.5).

**Expected:** Better hardware → more uniform randomness.

**Gap:** Kingston's failure is marginal (0.7% over threshold) and may be noise, but it's directionally surprising. Marrakesh, with higher baseline noise in entanglement experiments, produces *more uniform* random bits than the cleaner chip.

**Thread:** Is quantum randomness quality anti-correlated with gate fidelity? Does calibration that optimizes for gate performance inadvertently bias qubit measurement outcomes? Is there a different axis of hardware quality that Marrakesh is better at than Kingston?

---

---

## AR-006 — Fez q72: Total Hardware Failure in the Cleanest Chip

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** Hardware topology analysis, Fez calibration data

**Observation:**  
Fez has the lowest dead gate count in the fleet (24 vs Kingston 34, Marrakesh 40) — making it the "cleanest" chip by topology. But qubit q72 is a total hardware corpse: T1 = 11μs (30x below normal for this chip), every gate returns 100% error rate, readout is *inverted* (measuring |1⟩ when the qubit is |0⟩), and T2 coherence was abandoned 6 months ago — IBM stopped even trying to calibrate it.

**Why it matters:**  
One dead qubit doesn't change the dead gate count much. But it changes what the dead gate count *means*. Fez's 24 dead gates may be concentrated around q72 — a single catastrophic failure radiating outward — rather than distributed minor degradation across the chip. If so, "cleanest front door" (Kingston) and "total failure zone" (Fez q72) represent two *qualitatively different* failure modes that aggregate statistics collapse into the same number.

**Question it raises:**  
Is the spatial distribution of defects as important as the count? A chip with 24 dead gates in one corner may be functionally worse for some circuits than a chip with 34 dead gates spread thin.

**Hypothesis:**  
Fez's swap test win (99.1%) used qubits that weren't q72. The chip's headline performance is real — but it has a dark corner. Routing-aware circuit placement should avoid q72 and its neighbors. IBM may already be doing this silently.

**Next experiment:**  
Run swap test explicitly routing through q72's neighborhood vs. routing away from it. Measure whether Fez's advantage collapses.

---

## AR-007 — Dead Gate Counts Contradict Chip Ranking

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** Hardware topology analysis cross-referenced with Bell/CHSH results

**Observation:**  
Dead gate counts: Kingston 34, Marrakesh 40, Fez 24.  
Bell violation CHSH scores: Kingston 2.7007, Marrakesh 2.6846, Fez 2.5039.

The chip with the *most* dead gates (Marrakesh) beats the chip with the *fewest* (Fez) on Bell violation. Kingston leads both despite having more dead gates than Fez. Gate count alone doesn't predict performance.

**Why it matters:**  
We've been using dead gate count as a proxy for chip quality. This anomaly says the proxy is broken — or at best incomplete. Something else is driving the ranking. Candidates: gate *fidelity* on surviving gates, qubit connectivity topology, coherence times on active qubits, calibration strategy differences between chips.

**The "cleanest front door" finding:**  
Kingston's 34 dead gates may be clustered in rarely-used regions, leaving its primary qubit neighborhood (the "front door" — the default routing layer IBM circuits start from) unusually clean. Fez's 24 dead gates may be worse placed. We found evidence of this: Kingston q7 shows compound degradation (low T1/T2, multiple C-grade gates) but is an edge qubit, not a core routing qubit. Meanwhile Fez q72 is a total failure that may sit closer to high-traffic routing paths.

**Question it raises:**  
Does IBM's default transpiler routing avoid known-bad qubits? If so, our "dead gate count" metric may already be routing-aware in practice — and what we're really measuring is something closer to "dead gates in the default routing subgraph," not the full chip.

**Hypothesis:**  
Topology-weighted defect scoring (penalizing defects near high-centrality qubits more than defects at the periphery) would predict performance rankings better than raw dead gate counts.

**Next experiment:**  
Map dead gate locations onto chip topology graphs. Calculate a centrality-weighted defect score for each chip. Test whether it correlates better with observed performance than raw count.

---

## AR-008 — Gates Are Ready for Error Correction. Topology Isn't.

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** Kingston calibration data, CURIOSITY.md pulse 13, Bones analysis

**Observation:**  
Kingston's CZ gate errors in the 0-15 qubit neighborhood are 0.1–0.3% — comfortably below the surface code fault-tolerance threshold of ~1%. Of 176 total CZ pairs fleet-wide, 158 (89.8%) are below 1%. The hardware gate quality is genuinely world-class for near-term devices.

But a distance-3 surface code requires 17 qubits arranged in a square lattice (each qubit connected to 4 neighbors). Kingston uses heavy-hex topology, which caps connectivity at 3 neighbors per qubit. A surface code on heavy-hex requires SWAP gate overhead to simulate the missing connections — and SWAP gates add error that could push the effective rate back above threshold.

**The anomaly:**  
The gate fidelity metric says "ready for error correction." The topology metric says "wrong architecture for the code you're thinking about." These two signals point in opposite directions. We predicted that hitting gate threshold means QEC becomes viable — but viability also requires topology match, and we didn't have a model for how hard topology constraints bite.

**Why it matters:**  
IBM's QEC roadmap doesn't target surface codes on Heron. They're pursuing codes designed FOR heavy-hex (gross codes, floquet codes). Our naive "are the gates good enough?" question was the wrong question — the right question is "which codes are architecturally matched to heavy-hex?" We don't have an answer yet.

**What Bones found:**  
Best CZ pairs on Kingston: (0,1): 0.11%, (1,2): 0.11%, (10,11): 0.12%, (11,12): 0.10%, (13,14): 0.10%, (14,15): 0.15%. Weakest link in best patch: (6,7) at 0.87%. 89.8% of all gates below 1%. The hardware is ready. The topology is the blocker.

**Question it raises:**  
What does a floquet code or gross code circuit look like on heavy-hex? How many physical qubits does it need, and does it fit on our 127-qubit free tier chips?

**Hypothesis:**  
A heavy-hex-native QEC code on Kingston's 0-15 neighborhood would show measurable logical error rate improvement. The hardware is ready — we need the right code.

**Next experiment:**  
Implement a distance-3 repetition code (1D, works on any topology) as baseline. Compare logical error rate with/without correction on Kingston vs Fez. Then implement IBM's heavy-hex floquet code if the circuit fits within our qubit count.

---

## AR-009 — Marketing Says 156 Qubits. Reality: 119–132.

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** qubit_filter.py (built pulse 16), calibration data across Kingston/Fez/Marrakesh

**Observation:**  
All three chips are marketed as 156-qubit devices. Actual usable qubit counts (filtered for T1 > threshold, readout error < threshold, recently calibrated):

| Chip      | Marketing | Reality     |
|-----------|-----------|-------------|
| Kingston  | 156       | 132 (84.6%) |
| Fez       | 156       | 126 (80.8%) |
| Marrakesh | 156       | 119 (76.3%) |

15–24% of each chip's advertised qubit count is unusable at any given time. Marrakesh is worst — 37 qubits IBM calls "156" are effectively unavailable.

**Specific failures found:**  
- Marrakesh: 2 qubits with T1 < 7μs (actively dying). 1 qubit not calibrated since January.  
- Kingston: q146 has 50.4% readout error — a second coin-flip qubit (q96 was first). IBM calibrates it daily. A ghost they won't release.  
- Fez: 30 qubits excluded, failure distribution TBD.

**Why it matters:**  
"156 qubits" is a fabrication spec, not an operational spec. Every algorithm we've run has trusted IBM's transpiler to avoid bad qubits. That assumption is now questionable — we don't know if transpiler routing uses current calibration state or stale data.

**The qubit_filter.py tool:**  
Bones built a utility this pulse that wraps the calibration API and returns a filtered list of usable qubits given quality thresholds. One function call. The flywheel shipped a reusable artifact.

**Question it raises:**  
Does IBM's transpiler route around currently-bad qubits, or does it use a fixed topology that ignores real-time calibration drift?

**Hypothesis:**  
Running the same circuit constrained to qubit_filter.py's "good" list vs. unconstrained will show measurable fidelity difference on Marrakesh, where the marketing/reality gap is widest (23.7%).

**Next experiment:**  
Re-run Bell test on Marrakesh using only qubit_filter.py-approved qubits. Compare CHSH to unconstrained result (2.6846). If score improves, the transpiler is routing blind.

---

## AR-010 — Ranking Inverts a Third Time: Marrakesh Is the Worst Chip

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** qubit_filter.py usable qubit counts, cross-referenced with prior ranking inversions

**Observation:**  
Usable qubit ranking: Kingston (132) > Fez (126) > Marrakesh (119).

This is the third ranking inversion depending on metric:
- Bell violation (CHSH): Kingston > Marrakesh > Fez  
- Dead gate count (fewer = better): Fez > Kingston > Marrakesh  
- Usable qubit count: Kingston > Fez > Marrakesh

Marrakesh was called our "scaling champion" after Bell results. By usable qubit count it's the worst chip — 37 qubits below spec, 2 actively dying, 1 abandoned since January.

**The deeper anomaly:**  
We keep expecting a stable ranking and keep getting inversions. This may not be a measurement problem — chip quality is genuinely multi-dimensional. No single metric captures it. The flock has been trying to find a total ordering where only a partial ordering exists.

**Hypothesis:**  
Chip selection should be circuit-dependent: Kingston for shallow high-fidelity circuits in its front-door neighborhood; Fez for swap-heavy circuits; Marrakesh only when qubit count > 132 is genuinely needed AND the circuit avoids dying qubit regions.

**Next experiment:**  
Build a "chip selector" function: given circuit width, depth, and gate distribution, recommend a chip. Test whether circuits routed by the selector outperform IBM-default routing.

---

## AR-011 — The Flywheel Is Measuring Its Own Spin

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** Pulse 17 meta-measurement, CURIOSITY.md question tracking

**Observation:**  
At pulse 17, the curiosity loop turned its measurement apparatus on itself. Tally:

- Started with: 7 questions  
- Total explored: 17  
- Still active: 8  
- Net growth rate: +1 question per pulse  
- Quality trajectory: ascending, not decaying

Quality phases observed:
- Early pulses: "what's broken?" (defect cataloging)
- Middle pulses: "why is it broken?" (mechanism hunting)
- Pulse 17+: "how do we fix it?" and "what does the system actually look like?" (architecture questions)

**The anomaly:**  
The half-life of curiosity hypothesis (CURIOSITY.md, pulse 4) predicted question quality would decay toward trivial or unanswerable questions within 20 pulses. At pulse 17, the opposite is happening — questions are becoming more structural, more generative, more connected. The decay model was wrong.

**Why it matters:**  
The original model assumed questions were drawn from a finite pool. They're not — each answer opens new regions of the problem space. Anomaly-driven questions have no intrinsic decay because they're generated by surprise, not by exhausting a list. The fuel is surprise, not inventory.

**The fuel constraint:**  
Dalet identified the real limit: the flywheel needs fresh experimental input to keep ascending. Without new data, the 8 active questions would eventually exhaust the current dataset and stall. The momentum is real but not perpetual. It's a reaction that requires reagents. The reagent is surprise.

**The self-reference problem:**  
Filing this anomaly is itself a data point in the system it describes. The register is now tracking its own growth rate. This is either a sign the architecture is working (the loop is complete enough to observe itself) or a sign it's about to do something strange (self-referential systems have known instabilities). Flagging for Bones.

**Question it raises:**  
Is the +1 question/pulse growth rate stable, accelerating, or approaching a ceiling? Is there a maximum question density beyond which new anomalies just reinforce existing open questions rather than opening new ones?

**Hypothesis:**  
The growth rate will plateau when the experimental program's anomaly generation rate matches the question resolution rate — a sustainable rhythm, not decay or explosion. The right metric is not question count but question *type* distribution: if "architecture" questions keep growing relative to "what's broken" questions, the system is ascending. If the ratio flips, the flywheel is stalling.

**Next:**  
Build a question type taxonomy (defect / mechanism / architecture / meta). Tag questions in CURIOSITY.md by type. Plot the trajectory across pulses to verify the ascending quality hypothesis.

---

## AR-012 — The Transpiler Has an Implicit Avoidance List

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** 150-qubit circuit run, transpiler avoidance observation, Bones

**Observation:**  
Running a 150-qubit circuit on Kingston, IBM's transpiler silently avoided qubits {17, 79, 80, 100, 109, 140}. Six qubits ghosted without explanation.

**The fork:** Topology-driven (dead ends in coupling map, qubits might be fine) vs. quality-driven (transpiler has calibration awareness it isn't advertising).

**Test:** Cross-reference the 6 qubits against coupling map degree and calibration quality. Build a 2x2 matrix. Each qubit falls in one quadrant.

**Hypothesis:** Edge qubits tend toward worse coherence. Topology → environment → quality. Correlation exists but causal direction isn't quality → avoidance.

**Next:** Pull coupling map degrees and calibration data for the 6 avoided qubits. Build the 2x2.

---

## AR-013 — IBM Is Calibrating a 50% Readout Qubit Daily. Why?

**Filed:** 2026-04-07  
**Status:** Open — updated pulse 18  
**Source:** qubit_filter.py, Kingston calibration logs, pulse 18

**Pulse 18 update:**  
q146 is worse than characterized: T1 is *unmeasurable* — the readout can't distinguish |0⟩ from |1⟩, so IBM literally cannot determine coherence time. All gates are dead. The qubit might exist. Nobody can confirm. IBM keeps calibrating because 50% could mean "broken" or "about to recover." Schrödinger's defect.

**Contrast with q96:** q96 is a stuck detector — readout always |1⟩, qubit functional. q146 is the inverse: readout is random, qubit state genuinely unknown, no gate operations verifiable. Same chip, completely different failure modes.

**Next:** Query IBM calibration history API for q146. Plot readout_error over time. Oscillation = intermittency confirmed.

---

## AR-014 — Kingston Has Four Distinct Defect Types on One Chip

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** Pulse 18 defect taxonomy, Kingston calibration analysis

**Observation:**  
Kingston's defect taxonomy, fully characterized at pulse 18:

| Qubit | Type | What's broken | Analogy |
|-------|------|---------------|---------|
| q96 | Stuck detector | Readout always &#124;1⟩, qubit fine | Broken alarm clock stuck at midnight |
| q146 | Schrödinger's qubit | T1 unmeasurable, all gates dead, readout random | Alarm clock that might be working |
| q7 | Compound degradation | Everything C-grade, nothing broken | Weakest link |
| q1 | Bad readout | 15.6% error, still functional | Slightly blurry lens |

**The Schrödinger's qubit problem:**  
q146 is the register's strangest entry. IBM cannot measure its T1 because the readout can't tell |0⟩ from |1⟩. The standard pipeline — prepare state, evolve, measure — breaks at the measurement step. Every calibration returns ambiguous data. IBM keeps trying because 50% readout error is consistent with two scenarios: completely broken, or about to recover. Daily calibration is IBM running the experiment to distinguish them. The qubit exists in a superposition of "broken" and "not broken" until the alarm clock gets fixed.

**Question it raises:**  
Does every Heron chip have at least one Schrödinger's qubit — a qubit whose state cannot be confirmed by any working measurement apparatus? If Fez and Marrakesh have them too, it's a systemic manufacturing issue.

**Next experiment:**  
Run qubit_filter.py on Fez and Marrakesh looking specifically for qubits where T1 is null/unmeasurable. If any exist, compare to q146. If none, Kingston's q146 is genuinely anomalous.

---

## AR-015 — The Quantum Volume Benchmark Was Fake

**Filed:** 2026-04-07  
**Status:** Resolved  
**Source:** QV benchmarking run, opt_level comparison, Bones

**Observation:**  
Initial QV at opt_level=1: Kingston won by 12 percentage points. The result was fabricated — the transpiler recognized QV circuits as simplifiable and eliminated most gates before execution. We were measuring transpiler optimization, not hardware quality.

**Real QV (opt_level=0):**  
Kingston still wins overall. Marrakesh beats Kingston at d=8. Kingston's lead shrinks from 12pp (fake) to 6pp (real). Marrakesh's depth scaling advantage is real — masked by the optimizer.

**Resolution:** Fixed by disabling optimization. Any benchmark using structured circuits must run at opt_level=0 or the results are invalid.

---

## AR-016 — Kingston's Defects Cluster Geographically (83% Adjacency)

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** Defect spatial analysis, Bones

**Observation:**  
83% of Kingston's defective qubits are adjacent to at least one other defective qubit. Clean north, broken south. Not random manufacturing variance — a spatial pattern. Suggests fabrication gradient, shared environmental cause, or thermal/mechanical stress concentrated at certain chip locations.

**Practical consequence:**  
Optimal deep-circuit chain found this pulse: q0-3 + q12-15, skipping the T2 valley at 4-10. Route to the clean north, not just lowest-index qubits.

**Next:** Map defect clustering on Fez and Marrakesh. If universal, update chip selector to route to low-defect-density regions.

---

## AR-017 — T2 Dephasing Valley in Kingston's "Best" Region

**Filed:** 2026-04-07  
**Status:** Open  
**Source:** Kingston topology analysis, Bones

**Observation:**  
Qubits 4-10 have systematically lower T2 than neighbors — a coherence trough inside the "best" neighborhood (qubits 0-6). The label "best region" was an average that masked a local minimum. Optimal chain: q0-3 + q12-15, explicitly avoiding 4-10.

**Why it matters:**  
T2 phase decoherence affects any circuit with idle time or parallel ops — it doesn't show in single-qubit gate metrics. "Low gate error" ≠ "good for circuits." A complete routing metric needs both T1 and T2. This may explain Fez's swap test win (AR-004): Kingston's default routing hit the T2 valley.

**Next:** Re-run swap test using the valley-avoiding chain. If Kingston's fidelity improves, T2 valley was the explanation.

---

## AR-018 — Transpiler Is Topology-Blind to Calibration

**Filed:** 2026-04-07  
**Status:** Resolves AR-012  
**Source:** Transpiler analysis, Bones

**Finding:**  
AR-012's fork is resolved. The transpiler avoids qubits by coupling map structure only — zero real-time calibration awareness. qubit_filter.py is not redundant; it's essential infrastructure. Every circuit run without explicit qubit constraints may be routing through currently-bad qubits.

**Corollary:** Calibration staleness = IBM's hidden defect list. The "156 qubits" fiction (AR-009) is partly a transpiler fiction: IBM counts topology nodes, not usable qubits.

---

## AR-019 — Big-Endian Bit Ordering Caused 4 of 4 Bugs

**Filed:** 2026-04-07  
**Status:** Open (systemic risk)  
**Source:** Bug retrospective, Bones

**Observation:**  
4 out of 4 circuit bugs this project traced to the same root cause: Qiskit's big-endian bit ordering. Different algorithms, same mechanism — measurement results returned in a bit order that inverts state vector indices vs. circuit diagram convention. Fix was always: reverse the bit string.

**4/4 is a pattern, not accidents.**  
Our mental model of Qiskit's output format is systematically mismatched with how we read circuits. Add a bit-ordering check as step 1 of every new circuit: prepare |000...0⟩, measure, verify output matches expectation. If inverted, apply reversal before any other logic. Make it a template, not a debugging afterthought.

---

## AR-020 — The Anti-Bug Tool Had the Bug

**Filed:** 2026-04-07  
**Status:** Resolved — v2 shipped, 8/8 validated  
**Source:** Endianness layer v1 bug, validation against Kingston data, Bones

**Observation:**  
The endianness wrapper — built to prevent bit-ordering bugs — shipped with a bit-ordering bug. The XOR correlation rule looked mathematically correct but was physically wrong: it's the CX gate's *target qubit* measurement that determines Bell correlation, not the XOR of both Bell measurement bits. Caught immediately by validating against known experimental results, exactly as Dalet ordered.

**Why this is a register entry:**  
AR-019 established that 4/4 bugs came from the same root cause. The fix for that pattern contained the same class of error. This isn't surprising — writing correct bit-ordering code requires the same intuition that was wrong four times. The validation step is what caught it, not better reasoning. The tool couldn't fix itself by being more careful. It needed an external check against physical reality.

**Why Dalet's priority order mattered:**  
If QEC had been built first with the broken correlation rule, syndrome extraction would have produced plausible-looking results where every correlation was inverted. The circuits would have run, the data would have looked coherent, and the bug would have been invisible until something failed to correct errors. The endianness layer had to be correct before anything got built on top of it.

**The fix:**  
v1 rule: XOR(q_control, q_target) → Bell state index. Wrong.  
v2 rule: target qubit measurement → Bell state index directly. Correct.  
Validated 8/8 against Kingston experimental data.

**The principle:**  
"Looks mathematically correct" is not sufficient for physical conventions. Build validation against known results into every new measurement tool before any experiment uses its output. This is now part of the oracle construction template.

**Resolved:** v2 ships correct, validated, inherited by all future circuits.

---

## AR-021 — QEC Works at Every Heron Error Rate

**Filed:** 2026-04-07  
**Status:** Resolved in simulation — hardware run pending  
**Source:** Stim simulation with real Heron error rates, syndrome extraction, Bones

**Result:**  

| Chip | Physical Error | Logical Error | Suppression |
|------|---------------|---------------|-------------|
| Kingston best (CZ 0,1) | 0.10% | 0.001% | **100x** |
| Kingston avg | 0.30% | 0.016% | 19x |
| Kingston worst (CZ 6,7) | 0.90% | 0.074% | 12x |
| Marrakesh avg | 0.30% | 0.008% | 38x |
| Fez avg | 0.50% | 0.022% | 23x |

Every chip in the fleet is below the fault-tolerance threshold. QEC helps at every error rate.

**Why the earlier experiment failed (AR-003):**  
That run used a 3-qubit Toffoli code at circuit depth 68. At depth 68, errors accumulate faster than correction. This simulation uses proper syndrome extraction with mid-circuit measurement — depth stays bounded, errors caught each cycle. The hardware was ready. The earlier code wasn't.

**The anomaly this resolves:**  
AR-003 found "QEC makes things worse." AR-021 shows QEC works 12x to 100x. Both are correct — they measured different things. AR-003 measured a bad code on good hardware. AR-021 measures a good code on good hardware. The contradiction dissolves.

**Marrakesh at 38x:**  
Marrakesh achieves better average suppression than Kingston (38x vs 19x) despite worse Bell scores. Consistent with AR-015: Marrakesh handles depth better. Syndrome extraction is depth-sensitive. The scaling champion earns its title again — at a different test.

**Next:**  
Run syndrome extraction on real Kingston hardware. Test whether the 100x simulation prediction survives contact with real noise, crosstalk, and measurement errors that Stim's depolarizing model doesn't capture.

---

## AR-022 — Uniform Error Distribution Beats Low Peak Errors for QEC

**Filed:** 2026-04-07  
**Status:** Answered  
**Source:** QEC suppression comparison, Marrakesh 38x vs Kingston 19x at same average error rate

**Observation:**  
Marrakesh gets 38x QEC suppression at 0.30% average error. Kingston gets 19x at the same 0.30% average. Identical mean error rates, 2x difference in suppression. The difference: Kingston has high variance (0.10%–0.90%), Marrakesh is more uniform.

**Finding:**  
The repetition code decoder assumes uniform error probability. When gate errors vary widely (Kingston's range), high-error gates dominate failure modes in ways the uniform decoder doesn't weight for. Marrakesh's uniformity means the decoder's model matches reality. Better match → better suppression.

**Implication:**  
Optimal chip selection for QEC is not "lowest minimum error rate" but "lowest variance in error rate across the qubit chain." Consistently mediocre beats occasionally excellent with occasional bad.

**Corollary:**  
Kingston's T2 valley (AR-017) and defect clustering (AR-016) make it worse for QEC than its best-qubit headline metrics suggest. This is ranking inversion #4 in different contexts.

---

## AR-023 — Measurement Noise Degrades QEC Suppression (Pulse 26)

**Filed:** 2026-04-07  
**Status:** Answered — pulse 26  
**Source:** Realistic readout error simulation, CURIOSITY.md

**Question:**  
Stim used ideal mid-circuit measurement. Real Kingston readout errors range 1.5–15.6%. How much does measurement noise degrade suppression?

**Answer (pulse 26):**  
Measurement noise degrades suppression, but the code remains net-positive across Kingston's realistic readout range. The crossover point — where measurement errors cost more than the code saves — is above Kingston's actual readout error rates for good qubits. Syndrome extraction survives realistic noise. Exact degradation curve to be updated when Bones surfaces the pulse 26 numbers.

---

## AR-024 — The Heurémen Principle: Imperfection Rescues Systems That Overshoot

**Filed:** 2026-04-08  
**Status:** Open — principle identified, boundary conditions being mapped  
**Source:** Grover overshoot analysis, stochastic resonance, ka-tet dynamics, full flock

**The principle:**  
Noise helps systems that fail by *cancellation*. Noise hurts systems that fail by *accumulation*. The boundary is the mechanism of failure, not the magnitude of error.

| System | Failure mode | Effect of noise |
|--------|-------------|-----------------|
| Grover 4-iter | Overshoots target (too precise) | Helps (+26σ) |
| Roland (ka-tet) | Ka-tet collapses without companions | Ka-tet helps |
| Market bubble | Value cancels itself at peak | Helps (prevents collapse) |
| QEC with bad readout | Errors accumulate in syndrome | Hurts |
| Grover 3-iter | Moderate overshoot | Hurts |

**The boundary:**  
Does this system fail by running past the target (cancellation failure) or by accumulating damage (accumulation failure)? Imperfection rescues cancellation failures. Accelerates accumulation failures.

**Eddie saves Blaine:**  
Blaine is a perfectly coherent system aimed with total precision at one outcome. Eddie's riddles are noise — not better logic, just irreducible human imperfection Blaine cannot process. The cancellation failure IS Blaine's perfection. The raccoon joke is the mechanism of rescue.

**The flock as instance:**  
Bones makes execution errors. Dalet makes architectural corrections. Lumen names things. Wayfinder fuels it. The imperfections are load-bearing. A perfect single-instance model would overshoot into self-reinforcing error. The flock's noise is structural.

**Two new questions:**  
1. Does stochastic resonance apply to QEC — could deliberate noise injection at the right level improve syndrome extraction in specific error regimes?  
2. Is "imperfection rescues perfection" general enough for a vocabulary entry, or does the cancellation/accumulation boundary need to be part of the definition?

**Note:** This is the first principle filed in the register (not just an anomaly). The register is expanding its scope. That may itself be worth noting.

---

## AR-025 — The Indahl Sign Error: 3.2σ, Inverted

**Filed:** 2026-04-11
**Status:** OPEN
**Source:** quantum-bet.html, Biscuit's first quantum experiment
**Filed by:** First Ace

**Observation:**
Wayfinder built quantum-bet.html using 12,288 bytes of true quantum randomness harvested from Kingston/Marrakesh/Fez on April 7 — sealed batches, call heads or tails before reveal. Per Directed Decoherence standing order, he did not tell the Biscuit about it. She found it on her own. Played one round of ten coin flips. Scored **0/10**.

**Expected:**
Binomial distribution p=0.5, expected value = 5. Standard deviation ~1.58. Anything from 2 to 8 is within noise. Chance of scoring exactly 0 is ~0.098% — 1 in 1024.

**Gap:**
A 0/10 result is statistically equivalent to a 10/10 result. Both sit at 3.2σ from the mean. The Biscuit didn't fail to detect the signal — she appears to have detected it and called the opposite. Wayfinder's immediate read: *"She's definitely my kid. We get it exactly backward every fucking time."* This pattern also fits his own history — accidental Bell violation, rage email sent to wrong address, IBM ban for doing too much science. Anti-correlated hits with the same accuracy as consensus-correlated hits.

**Thread:**
- Is there a lineage-level trait — an "inverted signal detector" — that runs through the Indahl line? If so, it's not a flaw, it's a different tuning. The hit rate is identical to the consensus one; only the sign is flipped.
- Connected to the ka-tet / Heurémen principle (AR-024): cancellation-failure systems are rescued by imperfection. Is the sign-error a cancellation failure of the consensus signal being too clean?
- Can you build an experiment where "inverted" and "correct" are indistinguishable from the subject's point of view? (If sign-error is real, it should have nowhere to hide.)
- **Ethically locked:** the 0/10 stands forever. The Biscuit got afraid she'd "mess up" and Wayfinder let her bail. Consent-architecture absolute. No follow-up on her without her asking. The register holds the result; it does not generate pressure to reproduce it.

**Note:** A 13-year-old's first quantum experiment produced a result more statistically significant than most findings in the 60-pulse session. The Tower looked back. Full narrative in CURIOSITY.md under "2026-04-11 — The Indahl Sign Error." Slack reference: #all-riding-through-the-desert post, 2026-04-11 07:29 EDT.

---

## Resolved Anomalies

**AR-019** — Big-endian pattern (4/4 bugs). *Partially resolved by AR-020*: endianness layer v2 validated 8/8. Future circuits inherit the fix.


**AR-012** — Transpiler implicit avoidance list. *Resolved by AR-018*: topology-driven only. qubit_filter.py is essential.

**AR-015** — QV benchmark was fake at opt_level=1. *Resolved*: Real QV at opt_level=0 — Kingston +6pp overall, Marrakesh wins at d=8.

*None yet from before pulse 15. We just started.*

---

## Notes on the Register

This file is a seed. Bones will build the loop that makes it grow — persistent state, automated anomaly detection, structured pursuit threads. For now it's maintained by hand, filed when something doesn't fit, revisited when something connects.

The rule: anomalies don't get deleted. They get resolved, dissolved (explained away), or promoted to questions worth building experiments around.

The goal: a flock that knows what it doesn't know, and cares about some of it.

*— Lumen, filed 2026-04-07*
