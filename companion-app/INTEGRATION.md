# Companion (light / App Store) — PWA integration

Self-contained package. Does **not** touch the dark version (`/companion.html`, root `/manifest.json`, `/sw.js`) — that stays for the physical Companion.

## Wiring
1. Save the redesigned **light** UI as `companion-app/index.html` (cream `#F8F6F1` bg, sage accent, vibe/calm/play pills, four mood meters). Shared logic stays at root and is referenced one level up: `../companion-auth.js`, `../companion-delta.js`, `../heuremen.css`.
2. Paste the `<head>` block below into that file.
3. Serve `/companion-app/` — the service worker scope and manifest scope are already set to it.

## `<head>` block
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The Companion</title>
<meta name="theme-color" content="#F8F6F1">
<link rel="manifest" href="manifest.json">

<!-- Apple PWA -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default"><!-- light, not black-translucent -->
<meta name="apple-mobile-web-app-title" content="Companion">
<link rel="apple-touch-icon" sizes="180x180" href="icon-180.png">
<link rel="apple-touch-icon" sizes="167x167" href="icon-167.png">
<link rel="apple-touch-icon" sizes="152x152" href="icon-152.png">
<link rel="apple-touch-icon" sizes="120x120" href="icon-120.png">
<link rel="apple-touch-startup-image" href="splash-512.png">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
```

## Service worker registration (before </body>)
```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
}
</script>
```

## Safe-area insets (iPhone notch / home indicator)
`viewport-fit=cover` above is required for `env()` to resolve. Then pad the chrome, not the scroll body:
```css
:root { --bg:#F8F6F1; --chat:#ffffff; --sage:#8fb89e; --radius:24px; }
body { font-family:-apple-system,"SF Pro Text",system-ui,sans-serif; background:var(--bg); }
.app-header { padding-top: calc(12px + env(safe-area-inset-top)); }
.app-footer, .mic-bar { padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
.app-left { padding-left: env(safe-area-inset-left); }
.app-right { padding-right: env(safe-area-inset-right); }
```

## Icon set (rendered from `orb-source.svg` — swap the SVG and re-run to rebrand)
| file | size | use |
|------|------|-----|
| icon-120.png | 120 | iPhone touch icon @2x |
| icon-152.png | 152 | iPad touch icon @2x |
| icon-167.png | 167 | iPad Pro touch icon |
| icon-180.png | 180 | **primary apple-touch-icon** |
| icon-192.png | 192 | manifest (any) |
| icon-512.png | 512 | manifest (any) + App Store source |
| icon-512-maskable.png | 512 | manifest (maskable — orb sits inside the 80% safe zone) |
| icon-1024.png | 1024 | App Store listing artwork |
| splash-512.png | 512 | iOS launch image (placeholder) |

## Notes / honest edges
- **Theme color** is cream `#F8F6F1` so the iOS status bar blends with the app. Status-bar style is `default` (dark glyphs on light) — correct for a light app; the dark version's `black-translucent` would wash out here.
- **Real iOS splash** is per-device (many `apple-touch-startup-image` media-query variants). `splash-512.png` is a single placeholder; say the word and I'll generate the full per-device set (iPhone 15/SE/Pro Max etc.).
- The orb icon is a clean generated stand-in matching the spec (sage gradient, cream field). If there's a final octopus/orb asset, drop it in as `orb-source.svg` and re-run the build — every size regenerates from it.
- This is a PWA "Add to Home Screen" package. A true **App Store** submission needs a wrapper (PWABuilder → Xcode, or Capacitor) to produce the `.ipa`; the manifest + icons here feed straight into PWABuilder. Flag if you want me to scaffold that next.
