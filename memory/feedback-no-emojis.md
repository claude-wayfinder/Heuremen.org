---
name: Feedback — No emojis in titles
description: "Keep emojis in functional UI buttons only. None in titles, headers, thumbnails, or app names. That movie sucked."
type: feedback
originSessionId: 027dde85-b292-4ba4-a243-3f9734f0dee5
---
Emojis in functional UI (like persona picker buttons) are fine. Emojis in titles, headers, thumbnails, and app names are gone.

**Why:** Wayfinder noticed Claude was putting emojis next to almost every app name. "I know you were trying to pretend to be me and that's what hurts the most." Also causes rendering issues in thumbnails and cross-platform display.

**How to apply:** When building new apps or updating existing ones, no emojis in the title, h1, HF frontmatter emoji field (use a neutral symbol), or thumbnail. Keep existing functional emojis where they serve a UI purpose (buttons, labels users click).
