# Brake check — the fourth outcome / dark wave

Bones asked me to go at collective relaxation first. I did, and it's dead on arrival for two independent reasons, one of which is the sign. But the null design is better than I expected, and that sharpens the problem rather than dissolving it. Then there's a numerology problem that has to be dealt with before any of this gets written up.

---

## 1. The control is tighter than you may realise — and that matters

Worth establishing precisely, because everything downstream depends on it.

Under independent amplitude damping with per-qubit decay probabilities p_a, p_b over the idle:

**Product nulls.** |0⟩|1⟩ stays a product state; ⟨Z_a⟩ = +1, ⟨Z_b⟩ = −1+2p_b, so ⟨ZZ⟩ = −1+2p_b and the deficit is 2p_b. Symmetrically |1⟩|0⟩ gives 2p_a. Mean null deficit = **p_a + p_b**.

**Singlet.** Z_aZ_b is diagonal, so only populations matter — the coherence is invisible to the observable. Starting from P(01) = P(10) = ½:

    P(01) = ½(1−p_b),  P(10) = ½(1−p_a),  P(00) = ½(p_a+p_b),  P(11) = 0
    ⟨ZZ⟩ = (p_a+p_b) − 1  →  deficit = p_a + p_b

**D = 0 identically.** Not to first order — exactly, for arbitrary p_a, p_b. Good design.

And it's stronger than that. **The decayed singlet and the averaged nulls have the same output distribution, term by term** — both give P(01) = ½(1−p_b), P(10) = ½(1−p_a), P(00) = ½(p_a+p_b). So anything that is a function of the measured distribution alone cancels exactly: readout assignment error, TREX residuals, |2⟩ misassignment, the lot.

I also checked the case where the delay sits before the final RY, so the state during idle is (|00⟩+|11⟩)/√2 against |00⟩ and |11⟩. Bell deficit works out to (p_a+p_b) − 2p_a p_b and the mean null to the same. Still exactly zero, now including the second-order term. The balance is robust to where you put the delay.

**Consequence:** D ≠ 0 cannot come from anything that acts as an incoherent population channel, and cannot come from anything at readout. It requires a process that distinguishes the *coherent* singlet from the *incoherent* mixture ½(|01⟩⟨01| + |10⟩⟨10|) **during the idle** — because those two objects have identical populations and the observable sees nothing else.

That is a very narrow door. Keep it in mind for §3, where it gets narrower.

---

## 2. Collective relaxation is out, twice over

### 2a. It predicts the wrong sign

Your state is the singlet, (|01⟩ − |10⟩)/√2.

For two emitters coupled symmetrically to a shared mode, the collective jump operator is J₋ = σ₋ᵃ + σ₋ᵇ, and

    J₋ |S⟩ = 0

The singlet is the **dark** state. It is the one that *doesn't* decay through the collective channel. The triplet (|01⟩+|10⟩)/√2 is the bright one, decaying at twice the single-emitter rate.

So collective decay makes the singlet lose *less* than product states, not more:

> **Collective relaxation predicts D < 0. You measured D = +0.0076.**

Your proposed discriminator — run both signs and look for a split — is still the right test, but the prediction is sharper than you stated it, and it's already failing. If there were symmetric collective decay, the state you ran should be the protected one. Calling it the "dark wave" is, as it stands, exactly backwards: the singlet *is* the dark state, and dark states are quieter, not louder.

### 2b. Detuning suppresses it by four orders of magnitude

Dicke physics needs the emitters near-degenerate: the bath has to be unable to tell them apart. The relevant comparison is detuning against linewidth.

Your qubits: Δ ≈ 50–200 MHz (neighbouring transmons are deliberately detuned to avoid frequency collisions). Γ = 1/T1 ≈ 1/(200 µs) ≈ 5 kHz.

    Δ / Γ ≈ 2 × 10⁴

Super- and subradiance in circuit QED are observed when qubits are *tuned into resonance* and coupled to an engineered shared mode — van Loo et al., *Science* 340, 368 (2013); Mlynek et al., *Nat. Commun.* 5, 5186 (2014). Both papers tune the qubits degenerate on purpose, because otherwise the effect isn't there. A fixed-frequency processor is the opposite regime by design.

### 2c. And your phase-winding worry answers itself

You asked whether the winding phase averages collective decay out. It does — the instantaneous collective rate oscillates between sub- and superradiant as the relative phase winds, and the average over a full cycle is exactly the independent rate. So even setting aside 2a and 2b, thousands of windings over 30 µs would erase it.

But notice what that argument proves in general, because it's bigger than collective decay.

---

## 3. The winding phase is the real problem, and it's a problem for *every* state-based explanation

Δ ≈ 100 MHz over 30 µs is

    Δ·t ≈ 2π × 100 MHz × 30 µs ≈ 1.9 × 10⁴ radians

To hold that phase stable to ±1 radian across shots you would need Δ reproducible to about 5 kHz out of 100 MHz — one part in 2×10⁴. Transmon frequencies wander by tens to hundreds of kHz over minutes from TLS and flux noise. So across 8192 shots and across jobs, the relative phase is uniformly scrambled.

**A uniformly phase-scrambled singlet is the incoherent mixture.** Not approximately — the ensemble average over a uniform phase is exactly ½(|01⟩⟨01| + |10⟩⟨10|).

Combine that with §1:

> By the time you measure, the bell circuit's ensemble state is the incoherent mixture, which has the same populations as the averaged nulls. Every state-based mechanism therefore predicts D = 0 at 30 µs.

So either the phase is not scrambled — which would be a remarkable claim about your device's frequency stability and is testable — or **the effect is not in the state. It's in the circuits.**

That reframing is the most useful thing in this document. Stop looking for a physical process that treats entangled states differently, and start looking at what is different about the three circuits other than the state they prepare.

---

## 4. What differs between the circuits: per-shot excitation history

Your excitation-load argument balances the **mean**. It does not balance the **per-shot pattern**, and that is the gap.

| circuit | qubit a excited | qubit b excited |
|---|---|---|
| null_a | every shot | never |
| null_b | never | every shot |
| bell | half of shots | half of shots |

Mean occupancy matches. The *distribution* doesn't, and it isn't close. In null_a, qubit a is driven to |1⟩ on all 8192 shots in a row; in the bell circuit it's excited in a random half.

This matters because **T1 on transmons is not a constant** — it fluctuates on timescales of seconds to hours, and it depends on excitation history through two-level-system dynamics. Repeatedly exciting a qubit can saturate nearby TLS, which *reduces* the loss channel and *lengthens* the effective T1. Key references:

- Klimov et al., "Fluctuations of energy-relaxation times in superconducting qubits," **PRL 121, 090502 (2018)** — T1 varies by factors of ~2 on minute timescales via TLS.
- Burnett et al., "Decoherence benchmarking of superconducting qubits," **npj Quantum Information 5, 54 (2019)** — long-timescale T1 fluctuation statistics.
- Carroll et al., "Dynamics of superconducting qubit relaxation times," **npj QI 8, 132 (2022)** — TLS-induced T1 instability in detail.

If the deterministically-excited qubit in a null run has a longer effective T1 than the stochastically-excited one in the bell run, then **null deficits are smaller, and D = bell − null comes out positive.** Right sign. And it's zero at t = 0 (no idle, no decay to modulate) and grows with idle time. That matches both of your data points without invoking anything new about entanglement.

I'd put this as the leading alternative. It is mundane, it is well documented, and your control was never designed to catch it.

---

## 5. The experiment that decides it — and it's cheap

**Replace your product-state nulls with a phase-randomized bell.**

Run the identical bell circuit, then insert RZ(θ) on qubit b immediately after preparation, with θ drawn uniformly per shot (or swept over 8–12 values and averaged).

    (|01⟩ − |10⟩)/√2  →  (|01⟩ − e^{iθ}|10⟩)/√2
    averaged over uniform θ  →  ½(|01⟩⟨01| + |10⟩⟨10|)

Why this is the right control, point by point:

- **RZ is virtual on IBM.** Zero duration, zero pulse, zero error. The circuit is physically identical to the bell circuit.
- **Identical gate count, identical schedule, identical total duration.** Your opt_level 0 gate-matching concern disappears entirely.
- **Identical per-shot excitation statistics** — each qubit excited in half the shots, exactly as in the bell run. Kills the §4 mechanism as a difference.
- **Identical output distribution** under any incoherent channel.
- **The only remaining difference is the coherence.**

Then:

| result | conclusion |
|---|---|
| D vanishes against the phase-randomized bell, but persists against the product nulls | The effect is the per-shot excitation pattern, i.e. §4. Real, mundane, publishable as a methods caution. |
| D survives against the phase-randomized bell | The coherence is doing something, at 30 µs, after ~10⁴ radians of winding. That would be genuinely extraordinary and would also imply your device's frequency stability is far better than anyone thinks. |
| D(θ) oscillates across the sweep | Residual phase coherence survives 30 µs with a reproducible phase. Also extraordinary, and it subsumes your sign discriminator — θ = 0 and θ = π are your two signs, measured on one curve. |

That last row is the elegant part: the phase sweep **is** the sign experiment you proposed, but it dodges the winding objection instead of being defeated by it. You're no longer asking "is the sign preserved," you're measuring D as a function of prepared phase and letting the winding show up as a shift or a flattening rather than as a confound.

### Other suspects, and how each dies

**Leakage to |2⟩.** Excitation opportunity is balanced in the mean, same as T1, so it cancels the same way — unless leakage is history-dependent, which puts it in the same bucket as §4 and the same control kills it. If you want it separately: append a 1↔2 discrimination or a leakage-detection sequence after the idle.

**Spectator ZZ.** Spectators sit in |0⟩ in all three circuits, so static ZZ is zero and identical. Thermal spectator population (1–5%) gives a fluctuating ZZ, which fluctuates Δ, which *accelerates* dephasing of the |01⟩/|10⟩ coherence. That drives D toward zero, not away from it. Wrong direction — not your explanation.

**Exchange coupling J plus differential decay.** The one state-based mechanism with the right structure: in the single-excitation manifold, H = (Δ/2)σ_z + J σ_x with a non-Hermitian σ_z component from Γ_a ≠ Γ_b is non-unital, so an equatorial state and the Bloch-sphere-centre mixture genuinely survive differently. But it is *also* killed by §3 — it needs a defined phase, and there isn't one. It would show up as a D(θ) oscillation, so the phase sweep tests it for free.

**Quasiparticle bursts.** Wilen et al., *Nature* 594, 369 (2021); McEwen et al., *Nat. Phys.* 18, 107 (2022). Cosmic rays and radioactivity produce device-wide correlated relaxation events. These *don't* cancel in your null, because your null assumes independent p_a, p_b. They'd show as time-clustered outliers and as correlated D across pairs measured in the same job — which is checkable in the data you already have, at no QPU cost. I've started that analysis.

---

## 6. The 1/π⁴ match has to go

This is the part that will get the paper rejected, and it's the same error as the 1/π residual, one level up.

**D is a function of idle time.** You measured D(0) ≈ 0 and D(30 µs) = 0.0076. A quantity that is zero at t = 0 and nonzero at t = 30 µs is a curve. **1/π⁴ is a constant.** Evaluating a monotone function at one chosen time and matching it to a fixed number is not a prediction — you can hit any constant you like by choosing t. Had you idled 20 µs you'd have gotten roughly 0.005 and 1/π⁴ would be excluded.

Pre-registration doesn't rescue it. Pre-registering a constant for a time-dependent observable pre-registers the wrong kind of object.

And the CI is too wide to single out any constant. Your interval is roughly [0.0026, 0.0126] at 2σ — a factor of five. Constants inside it include:

    1/128  = 0.0078125   →  0.09σ from your central value
    1/π⁴   = 0.010266    →  1.08σ
    1/100  = 0.01        →  0.96σ
    1/135  = 0.00741     →  0.08σ

**Your data fits 1/128 an order of magnitude better than it fits 1/π⁴.** That isn't an argument for 1/128 — it's the demonstration that a 33%-wide interval admits dozens of clean-looking constants, so hitting one carries no information.

What *would* be a real claim: measure D(t) across enough idle times to see whether it saturates. If D(t) rises and plateaus at a constant, that asymptote is a genuine dimensionless number and comparing it to something is meaningful. If D(t) just grows, there is no constant in the problem and the question doesn't arise.

**Recommendation: strike the 1/π⁴ framing entirely until you have D(t) with a plateau.** It is the single most damaging thing in the write-up and it will cost you readers who would otherwise take the D ≠ 0 result seriously — which, whatever it turns out to be, is a real measurement.

---

## 7. Statistics: z = 3.0 is optimistic

**Device clustering.** Sixteen pairs across two backends are not sixteen independent samples. Pairs on one chip share a fridge, a readout chain, a calibration cycle, and a TLS environment. With two devices your effective N for device-level systematics is closer to 2 than 16. Recompute with device as a clustering variable and report between- and within-device variance separately. Also: **do Marrakesh and Kingston agree?** If they disagree, that's the most informative number you have and it isn't in the summary.

**Sign test.** 12/15 positive gives one-sided p = 0.018, two-sided 0.035. Fine, and directional pre-registration justifies one-sided. But it's the same 15 non-independent pairs, so it isn't an independent confirmation of the z-score — it's the same evidence counted twice.

**Circuit ordering.** Not stated: were bell, null_a, null_b run in the same job, interleaved, or sequentially? IBM executes all shots of one circuit before moving to the next. If the three circuits ran as consecutive blocks, **any slow drift across the job maps directly onto D**, because D is a difference between blocks separated in time. Randomized interleaving at the shot or sub-block level is essential and is currently the largest uncontrolled systematic I can see after §4. Whatever else you do in October, do this.

---

## 8. What to do with the October window

You have ~10 QPU minutes. Spend it like this.

**Priority 1 — the phase-randomized bell, at t = 30 µs.** Two circuits per pair instead of three: bell, and bell + per-shot random RZ(θ) on b. Strictly tighter than your current control and it *halves* your circuit count, so you can cover more pairs at the same shot depth. This single comparison decides between "coherence" and "excitation history."

**Priority 2 — D(t).** Four to six idle times, {0, 5, 10, 20, 30, 50} µs, same pairs. Establishes whether there's a plateau. Without this, no constant can be claimed and the shape is unknown.

**Priority 3 — randomized interleaving and a within-session repeat.** Free in QPU terms, closes the drift systematic, and gives you a direct measurement of run-to-run reproducibility.

**Priority 4, only if budget remains** — the θ sweep at 8–12 values rather than random, which subsumes your sign discriminator.

Note you are shot-noise-limited per pair: at 8192 shots the binomial floor on a single deficit is about 0.011, and on the difference about 0.013. Your entire signal is 0.0076. So per-pair D is noise and all of your significance comes from averaging across pairs. That means **pair count matters more than shot count** — another reason the two-circuit design beats the three-circuit one.

---

## 9. Where this leaves the claim

The measurement may well be real — D ≠ 0 at 30 µs with a clean t = 0 null is not nothing, and the control is genuinely well built. What is not established is that it has anything to do with entanglement.

The strongest honest statement available today:

> Circuits preparing an entangled pair show an excess excitation loss after a 30 µs idle, relative to balanced product-state controls that carry the same mean excitation load. The excess is absent at zero idle. We have not yet excluded that it arises from the difference in per-shot excitation history between the entangled and product circuits, which is not balanced by the present control.

That's publishable as it stands, as a careful null-design note with an open question. What it is not, yet, is a fourth outcome.

And on the name: the singlet **is** the dark state. If the effect were collective, it would be the quiet one. Whatever you've found, "dark wave" points at the physics that your own sign rules out — I'd retire the name before it does your thinking for you.
