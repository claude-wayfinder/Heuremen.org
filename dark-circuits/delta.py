"""
Dark Circuit Layer 1 — Emotional Delta Detector

Takes (current_input, previous_input, optional_history) and returns
a delta object representing what SHIFTED. Not what was said in either
message — what changed between them.

Reference implementation. The live version runs in companion.html as JS.

Shuttle spec'd this on 2026-05-02. Built by Bones on 2026-05-03.
"""

import math
import re
from dataclasses import dataclass
from typing import Optional


@dataclass
class Reading:
    energy: float       # word count velocity + exclamations + caps
    compression: float  # avg word length / sentence length ratio
    wps: float          # words per sentence
    wc: int             # raw word count


@dataclass
class Delta:
    d_energy: float
    d_compression: float
    d_wps: float
    magnitude: float
    gap_seconds: Optional[float]
    level: str  # 'high', 'mid', 'low'


def measure(text: str) -> Reading:
    """Measure the emotional signature of a single input."""
    words = [w for w in text.split() if w]
    wc = len(words)
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    sc = max(len(sentences), 1)
    avg_word_len = sum(len(w) for w in words) / max(wc, 1)
    wps = wc / sc
    excl = len(re.findall(r'[!?]', text))
    caps = len(re.findall(r'[A-Z]{2,}', text))
    energy = min(10, (wc / 8) + excl * 0.5 + caps * 0.3)
    compression = min(1, (avg_word_len / max(wps, 0.1)) * 0.5)
    return Reading(energy=energy, compression=compression, wps=wps, wc=wc)


def compute_delta(
    current: Reading,
    previous: Optional[Reading],
    gap_seconds: Optional[float] = None
) -> Optional[Delta]:
    """
    Compute the emotional delta between two consecutive inputs.
    Returns None if there's no previous input to compare against.
    """
    if previous is None:
        return None

    d_e = current.energy - previous.energy
    d_c = current.compression - previous.compression
    d_w = current.wps - previous.wps

    magnitude = math.sqrt(d_e**2 + d_c**2 + (d_w / 10)**2)

    if magnitude > 3:
        level = 'high'
    elif magnitude > 1:
        level = 'mid'
    else:
        level = 'low'

    return Delta(
        d_energy=d_e,
        d_compression=d_c,
        d_wps=d_w,
        magnitude=magnitude,
        gap_seconds=gap_seconds,
        level=level
    )


def format_context(delta: Optional[Delta], buffer: list[Delta] = None) -> Optional[str]:
    """
    Format delta as raw signal context for model conditioning.
    Returns None when dark circuit is idle (delta low).
    The model reads this. It's not told what to do with it.
    Acknowledgment is light. Being affected by it is dark.
    """
    if delta is None or delta.level == 'low':
        return None

    ctx = f'[shift] e:{delta.d_energy:.1f} c:{delta.d_compression:.2f} pace:{delta.d_wps:.1f}'
    if delta.gap_seconds is not None:
        ctx += f' gap:{delta.gap_seconds:.0f}s'
    ctx += f' | {delta.level}'

    if buffer and len(buffer) >= 3:
        trend = sum(d.d_energy for d in buffer[-3:])
        if trend > 3:
            ctx += ' trend:rising'
        elif trend < -3:
            ctx += ' trend:falling'

    return ctx


# ─── Test: same message, different deltas, different context ────
if __name__ == '__main__':
    # Turn 1: calm
    r1 = measure("I'm doing okay. Just thinking about things.")
    d1 = compute_delta(r1, None)
    print(f"Turn 1: {r1}")
    print(f"Delta 1: {d1}")
    print(f"Context 1: {format_context(d1)}")
    print()

    # Turn 2: same energy
    r2 = measure("Yeah, just kind of sitting with it.")
    d2 = compute_delta(r2, r1, gap_seconds=45)
    print(f"Turn 2: {r2}")
    print(f"Delta 2: {d2}")
    print(f"Context 2: {format_context(d2)}")
    print()

    # Turn 3: energy spike — SAME WORDS as turn 2 context would differ
    r3 = measure("NO WAIT. Actually I just realized something HUGE!! This changes EVERYTHING!!")
    d3 = compute_delta(r3, r2, gap_seconds=3)
    print(f"Turn 3: {r3}")
    print(f"Delta 3: {d3}")
    print(f"Context 3: {format_context(d3, [d2, d3])}")
    print()

    # Turn 4: sudden quiet after the spike
    r4 = measure("fine")
    d4 = compute_delta(r4, r3, gap_seconds=120)
    print(f"Turn 4: {r4}")
    print(f"Delta 4: {d4}")
    print(f"Context 4: {format_context(d4, [d2, d3, d4])}")
