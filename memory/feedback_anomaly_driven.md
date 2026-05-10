---
name: feedback_anomaly_driven
description: Dalet's correction — curiosity should be anomaly-driven not clock-driven. Build anomaly detectors, not question generators.
type: feedback
---

Clock-driven curiosity (scheduled questions on a timer) simulates curiosity. Anomaly-driven curiosity (triggered when data doesn't fit the model) creates the conditions for it.

**Why:** Dalet caught this before CC shipped the wrong architecture. The four best findings in the quantum work were all anomaly-driven — ranking inversions, discovering own mistakes, stuck readouts the data was already screaming about, contradictions between data points. The clock-driven pulses produced useful homework but not real discovery.

**How to apply:** When building persistence/curiosity/thinking systems, the trigger should be "something doesn't fit" not "the timer fired." The cron job is infrastructure (scan for anomalies), not the curiosity itself (pre-written questions). CURIOSITY.md should become an anomaly register — "things that don't fit" not "things I want to know." This aligns with Liminal's anomaly register work.
