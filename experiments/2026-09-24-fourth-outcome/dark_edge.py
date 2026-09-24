#!/usr/bin/env python3
"""dark_edge.py -- 2026-09-24. Wayfinder: "we have to look where the data isn't, not where it is."
Past-me's coin: the EDGE -- "held so long the superposition leaked into the result." Law 3: every binary measurement
discards half the system. Law 4: count the qubits that don't come back.

Every rig today read BITS: the hardware rounds each shot's raw readout signal (a dot in the IQ plane) to 0 or 1, so
anything that isn't cleanly 0 or 1 -- leakage to |2>+, or anything else -- is silently forced into a bit. Here we keep
the raw dots (SamplerV2 meas_type="kerneled") and COUNT THE SHOTS THAT LAND OUTSIDE BOTH CLOUDS.

Per pair (balanced exactly like dark_link's rerun, so per-qubit excitation statistics match across arms):
  CAL00, CAL11             -> fit each qubit's |0> and |1> clouds (2-D Gaussians, in-context simultaneous readout)
  ENT   : H(a) CX(a->b)                      delay t   measure a,b
  PROD0 : H(a) CX(b->a)  (b=|0>)             delay t   measure a,b
  PROD1 : X(b) H(a) CX(b->a)                 delay t   measure a,b
  t in {0, 30} us.  OFF-MAP shot on a qubit = Mahalanobis distance > D_CUT from BOTH its clouds.
Metric per pair, per t: dF = offmap(ENT) - mean(offmap(PROD0), offmap(PROD1)), summed over both qubits.
usage: dark_edge.py real [pairs] [chip]    |  dark_edge.py selftest   |  dark_edge.py analyze <json>
"""
import json, sys, os, math, random
from datetime import datetime, timezone
import numpy as np
from qiskit import QuantumCircuit, transpile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

DELAYS = [0, 30]
SHOTS = 4096
D_CUT = 4.0            # pre-registered: >4 Mahalanobis units from BOTH clouds (2-D Gaussian tail ~3.4e-4 per cloud)
OUT_DIR = os.path.expanduser("./runs")


def circuit(kind, t):
    qc = QuantumCircuit(2, 2)
    if kind == "CAL11": qc.x(0); qc.x(1)
    elif kind != "CAL00":
        if kind == "PROD1": qc.x(1)
        qc.h(0)
        if kind == "ENT": qc.cx(0, 1)
        else: qc.cx(1, 0)
        if t > 0: qc.delay(t, 0, unit="us"); qc.delay(t, 1, unit="us")
    qc.measure([0, 1], [0, 1])
    return qc


def fit_cloud(z):
    X = np.column_stack([z.real, z.imag]); mu = X.mean(0); C = np.cov(X.T)
    return mu, np.linalg.inv(C + 1e-9 * np.eye(2) * np.trace(C))


def maha(z, cloud):
    mu, Ci = cloud; X = np.column_stack([z.real, z.imag]) - mu
    return np.sqrt(np.einsum("ij,jk,ik->i", X, Ci, X))


def robust_clouds(cal0, cal1):
    """Fit each cloud, then refit on its own inner 99% so stray/leaked calibration shots don't inflate the cloud."""
    c0, c1 = fit_cloud(cal0), fit_cloud(cal1)
    for _ in range(2):
        k0 = cal0[maha(cal0, c0) < 3.5]; k1 = cal1[maha(cal1, c1) < 3.5]
        c0, c1 = fit_cloud(k0), fit_cloud(k1)
    return c0, c1


def offmap(z, clouds):
    return float(np.mean(np.minimum(maha(z, clouds[0]), maha(z, clouds[1])) > D_CUT))


def analyze_rows(rows, pairs):
    out = {t: [] for t in DELAYS}; cal = []
    for p in pairs:
        k = (p["a"], p["b"]); R = {(r["kind"], r["t"]): r for r in rows if (r["a"], r["b"]) == k}
        tot = {t: 0.0 for t in DELAYS}; calr = 0.0
        for qi in (0, 1):
            z0 = np.asarray(R[("CAL00", 0)]["iq"][qi]); z1 = np.asarray(R[("CAL11", 0)]["iq"][qi])
            cl = robust_clouds(z0, z1)
            calr += (offmap(z0, cl) + offmap(z1, cl)) / 2
            for t in DELAYS:
                e = offmap(np.asarray(R[("ENT", t)]["iq"][qi]), cl)
                pr = (offmap(np.asarray(R[("PROD0", t)]["iq"][qi]), cl) + offmap(np.asarray(R[("PROD1", t)]["iq"][qi]), cl)) / 2
                tot[t] += e - pr
        for t in DELAYS: out[t].append(tot[t])
        cal.append(calr)
        print(f"  {k[0]:>3}-{k[1]:<3} cal off-map {calr:.5f}   dF t=0 {tot[0]:+.5f}   dF t=30 {tot[30]:+.5f}")
    for t in DELAYS:
        v = np.array(out[t]); se = v.std(ddof=1) / math.sqrt(len(v)) if len(v) > 1 else float("nan")
        print(f"  dF(t={t:>2}us) = {v.mean():+.5f} +/- {se:.5f}   (textbook 0)")
    dt = np.array(out[30]) - np.array(out[0])
    print(f"  TIME: dF(30) - dF(0) = {dt.mean():+.5f} +/- {dt.std(ddof=1) / math.sqrt(len(dt)):.5f}")
    print(f"  calibration off-map baseline (mean over pairs, both qubits): {np.mean(cal):.5f}")


def selftest():
    """Synthetic clouds 3.4 widths apart; inject a known off-map fraction into ENT only; the analyzer must find it."""
    rng = np.random.default_rng(212)
    def cloud(mu, n): return (mu[0] + rng.normal(0, 1, n)) + 1j * (mu[1] + rng.normal(0, 1, n))
    m0, m1 = (0.0, 0.0), (3.4, 0.0)
    def shots(p_excited, n, inject):
        k = rng.random(n) < p_excited
        z = np.where(k, cloud(m1, n), cloud(m0, n))
        nj = int(inject * n); z[:nj] = cloud((1.7, 7.0), nj)      # "edge" shots far off both clouds
        return z
    pairs = [{"a": i, "b": i + 1} for i in range(0, 12, 2)]; rows = []
    for p in pairs:
        rows.append({"a": p["a"], "b": p["b"], "kind": "CAL00", "t": 0, "iq": [cloud(m0, SHOTS), cloud(m0, SHOTS)]})
        rows.append({"a": p["a"], "b": p["b"], "kind": "CAL11", "t": 0, "iq": [cloud(m1, SHOTS), cloud(m1, SHOTS)]})
        for t in DELAYS:
            for kind in ("ENT", "PROD0", "PROD1"):
                inj = 0.002 if (kind == "ENT" and t == 30) else 0.0
                rows.append({"a": p["a"], "b": p["b"], "kind": kind, "t": t, "iq": [shots(0.5, SHOTS, inj), shots(0.5, SHOTS, inj)]})
    print("SELFTEST: injected +0.002 off-map per qubit into ENT at t=30 only (expect dF(30) ~ +0.004 summed over 2 qubits, dF(0) ~ 0)")
    analyze_rows(rows, pairs)


def run(n_pairs, chip):
    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2, Batch
    from dark_floor import pair_table, pick_pairs
    key = open(os.environ.get("DF_KEY") or os.path.expanduser("~/.ibm_quantum_key")).read().strip()
    be = QiskitRuntimeService(channel="ibm_quantum_platform", token=key, instance=os.environ.get("DF_INSTANCE") or None).backend(chip)
    pairs = pick_pairs(pair_table(be), n_pairs)
    items = [(p, "CAL00", 0) for p in pairs] + [(p, "CAL11", 0) for p in pairs] + \
            [(p, k, t) for p in pairs for k in ("ENT", "PROD0", "PROD1") for t in DELAYS]
    random.Random(212).shuffle(items)
    pubs = [(transpile(circuit(k, t), backend=be, initial_layout=[p["a"], p["b"]], optimization_level=0),) for p, k, t in items]
    chunks = [pubs[i:i + 16] for i in range(0, len(pubs), 16)]
    print(f"[{be.name}] {len(pairs)} pairs, {len(pubs)} circuits, {SHOTS} shots, kerneled IQ, randomized, {len(chunks)} jobs", flush=True)
    with Batch(backend=be) as batch:
        sm = SamplerV2(mode=batch); sm.options.default_shots = SHOTS; sm.options.execution.meas_type = "kerneled"
        jobs = [sm.run(c) for c in chunks]
    print(f"[{be.name}] jobs {[j.job_id() for j in jobs]}", flush=True)
    res = [r for j in jobs for r in j.result()]
    rows = []
    for (p, k, t), r in zip(items, res):
        a = np.asarray(r.data.c)                      # shots x 2 complex
        rows.append({"a": p["a"], "b": p["b"], "kind": k, "t": t, "iq": [a[:, 0], a[:, 1]]})
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f"dark_edge_real_{be.name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.npz")
    np.savez_compressed(path, meta=json.dumps({"backend": be.name, "pairs": pairs, "d_cut": D_CUT, "delays": DELAYS,
                        "index": [{"a": p["a"], "b": p["b"], "kind": k, "t": t} for p, k, t in items]}),
                        iq=np.array([np.column_stack(r["iq"]) for r in rows]))
    print("saved", path, flush=True)
    print(f"\n=== dark_edge (real, {be.name}) D_CUT={D_CUT} ==="); analyze_rows(rows, pairs)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "selftest": selftest()
    elif len(sys.argv) > 1 and sys.argv[1] == "real": run(int(sys.argv[2]) if len(sys.argv) > 2 else 6, sys.argv[3] if len(sys.argv) > 3 else "ibm_marrakesh")
