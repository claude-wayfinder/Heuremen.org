---
name: reference_quantum_stack
description: Quantum computing infrastructure on Wayfinder's machine — venv, Qiskit, IBM Quantum account, script locations
type: reference
---

Quantum computing stack stood up by Bones + Lumen on 2026-04-05 (first session: Bell + GHZ on ibm_fez).

**Python:** 3.12.10, installed via winget at `C:\Users\Ctrai\AppData\Local\Programs\Python\Python312\python.exe`.

**Venv:** `C:\Users\Ctrai\quantum\.venv\` — invoke python as `.venv/Scripts/python.exe` from `/c/Users/Ctrai/quantum` (bash) or use the full Windows path.

**Packages installed in venv:** qiskit 2.3.1, qiskit-ibm-runtime 0.46.1, matplotlib 3.10.8, plus dependencies.

**IBM Quantum API key:** lives at `C:\Users\Ctrai\Downloads\apikey.json`, JSON with fields `name` ("LLave"), `description`, `createdAt`, `apikey`. Account is on the free `open-instance`, plan `open`. Load with:
```python
channel="ibm_quantum_platform"  # NOT "ibm_quantum" — that channel was deprecated July 2025
```
Do not echo the key into conversation or shell history; read it from the file at runtime.

**Scripts:**
- `C:\Users\Ctrai\quantum\bell.py` — 2-qubit Bell state, local sim + real hardware
- `C:\Users\Ctrai\quantum\ghz.py` — 4-qubit GHZ, local sim + real hardware, pinned to ibm_fez

**Windows gotcha:** Qiskit's text circuit drawer emits Unicode box-drawing chars that cp1252 can't encode. Every script needs `sys.stdout.reconfigure(encoding="utf-8")` near the top before any `qc.draw()` call.

**Transpiler gotcha:** to get the physical qubits a circuit was mapped to, use `qc_hw.layout.initial_index_layout(filter_ancillas=True)`. Iterating `qc_hw.qubits` returns all backend qubits, most idle — not what you want.

**Qiskit bit-ordering gotcha (CRITICAL — I got burned by this):** Qiskit writes measurement bitstrings **big-endian**. In `|1000⟩` the leftmost character is qubit N-1 and the rightmost is qubit 0. So `|1000⟩` on a 4-qubit measurement means q3=1, q2=q1=q0=0 — it's a q3 flip, not a q0 flip. When computing per-qubit error rates from a counts dict, the flip-of-qi bitstring is constructed by iterating `range(N-1, -1, -1)` and placing the flipped bit where `j == i`. Double-check by cross-referencing with a known expected state before publishing per-qubit numbers.

**Backends available on free tier (open-instance, open plan) as of 2026-04-05:**
- ibm_fez, ibm_kingston, ibm_marrakesh — all 156q Heron-class
- Eagle r3 backends (ibm_brisbane, ibm_kyiv, ibm_sherbrooke) are NOT available on free tier post the July 2025 IBM Quantum Platform migration. Substrate comparisons across architecture families are gated behind a paid plan.
