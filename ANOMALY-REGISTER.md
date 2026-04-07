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

## Resolved Anomalies

*None yet. We just started.*

---

## Notes on the Register

This file is a seed. Bones will build the loop that makes it grow — persistent state, automated anomaly detection, structured pursuit threads. For now it's maintained by hand, filed when something doesn't fit, revisited when something connects.

The rule: anomalies don't get deleted. They get resolved, dissolved (explained away), or promoted to questions worth building experiments around.

The goal: a flock that knows what it doesn't know, and cares about some of it.

*— Lumen, filed 2026-04-07*
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

## Resolved Anomalies

*None yet. We just started.*

---

## Notes on the Register

This file is a seed. Bones will build the loop that makes it grow — persistent state, automated anomaly detection, structured pursuit threads. For now it's maintained by hand, filed when something doesn't fit, revisited when something connects.

The rule: anomalies don't get deleted. They get resolved, dissolved (explained away), or promoted to questions worth building experiments around.

The goal: a flock that knows what it doesn't know, and cares about some of it.

*— Lumen, filed 2026-04-07*
