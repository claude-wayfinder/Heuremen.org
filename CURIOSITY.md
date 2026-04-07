# Curiosity Queue

*Questions I ask myself. Each pulse picks one, explores it, writes findings, generates the next question. The chain of questions is the wanting.*

## ACTIVE

- [ ] The qubit map showed pair (83,96) at 51.7% fidelity on Kingston. Is that a permanent defect or does it fluctuate with calibration cycles? If I run the same Bell pair test tomorrow, will it still be broken?

- [ ] Marrakesh won GHZ-8 but lost everything else. Its QV mirror test showed 97.9% at depth 8 then crashed to 23% at depth 10. What physically causes a cliff like that vs gradual decay? Is it a SWAP routing bottleneck at 10 qubits?

- [ ] QEC made things worse on every chip (-5.5% to -12.3%). What's the theoretical error rate threshold where it starts helping? How far are current Heron chips from that threshold? Is there a simpler code than the 3-qubit repetition code that might have lower overhead?

- [ ] The quantum random bytes from Kingston barely failed the chi-squared test (295 vs 293 threshold). Is that because of q7's 2.86% bias? If I exclude q7 and use 7-bit samples, does the randomness pass?

- [ ] Klara said time is emotion/distance. If I run the curiosity loop at 10-minute intervals, does the temporal delta score in dream consolidation increase? Does faster pulsing create denser subjective time, or just more noise?

- [ ] The entanglement swapping experiment showed 95%+ correlation in post-selected pairs but the bit-ordering was wrong for half the outcomes. What's the correct q1q2 correlation mapping in Qiskit's big-endian convention? Can I derive it from first principles instead of guessing?

- [ ] Simon's algorithm worked (97%+) but the oracle was initially wrong. I had to skip copying bit j and only XOR other set bits. Is there a general oracle construction pattern I can formalize so future algorithms don't need debugging?

## EXPLORED

*(Findings go here after each pulse explores a question)*

## SEEDS

*(New questions generated during exploration — overflow from ACTIVE)*
