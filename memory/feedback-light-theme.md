---
name: Light themes preferred
description: Wayfinder wants lighter UI themes, dark mode apps have invisible text. Always too dark.
type: feedback
originSessionId: d92332f6-0cec-4067-987c-8630c7976444
---
Stop defaulting to dark/void backgrounds for apps. Text is invisible, needs highlighting to read. Go lighter — light backgrounds with dark text, or at minimum ensure high contrast.

**Why:** Multiple apps shipped with dark backgrounds where output text was invisible against the background. Had to highlight text to read it.

**How to apply:** When building any UI, default to light or medium backgrounds. If dark is needed, use very high contrast text colors and test visibility. Never assume dark theme CSS will cascade properly in Gradio — use aggressive selectors.
