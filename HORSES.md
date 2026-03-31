# The Sacred Horses

These are the galloping SVG horses for Dusty, Lucky, and Clod in three-amigos.html.
DO NOT remove them. DO NOT replace them. They are load-bearing.

If three-amigos.html is ever overwritten and the horses are gone, restore them from here.

---

## CSS (goes in <style> block)

```css
@keyframes gallop {
  0%   { transform: translateY(0)   rotate(0deg);  }
  20%  { transform: translateY(-7px) rotate(2deg);  }
  40%  { transform: translateY(-3px) rotate(0deg);  }
  60%  { transform: translateY(-9px) rotate(-2deg); }
  80%  { transform: translateY(-2px) rotate(1deg);  }
  100% { transform: translateY(0)   rotate(0deg);  }
}
@keyframes leg-a {
  0%   { transform: rotate(-15deg); }
  25%  { transform: rotate(25deg);  }
  75%  { transform: rotate(-20deg); }
  100% { transform: rotate(-15deg); }
}
@keyframes leg-b {
  0%   { transform: rotate(10deg);  }
  25%  { transform: rotate(-20deg); }
  75%  { transform: rotate(20deg);  }
  100% { transform: rotate(10deg);  }
}
```

---

## DUSTY (rust/orange — #c87941) — animation-delay: 0s

```html
<div style="text-align:center;margin-bottom:6px">
  <svg style="animation:gallop 0.55s ease-in-out infinite;display:inline-block" width="90" height="66" viewBox="0 0 100 72" fill="none">
    <ellipse cx="48" cy="42" rx="26" ry="14" fill="#c87941"/>
    <rect x="63" y="24" width="11" height="22" rx="5" fill="#c87941" transform="rotate(-18 63 24)"/>
    <ellipse cx="77" cy="20" rx="9" ry="7" fill="#c87941" transform="rotate(-15 77 20)"/>
    <polygon points="80,13 83,7 86,13" fill="#c87941"/>
    <circle cx="80" cy="19" r="1.5" fill="#120e08"/>
    <path d="M65,20 Q67,13 70,20 Q72,11 74,20 Q76,13 78,18" stroke="#8a4a20" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M22,38 Q10,32 11,46 Q7,38 13,52" stroke="#8a4a20" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <rect x="62" y="54" width="6" height="16" rx="2" fill="#b06830" style="animation:leg-a 0.55s ease-in-out infinite;transform-origin:62px 54px"/>
    <rect x="52" y="54" width="6" height="16" rx="2" fill="#b06830" style="animation:leg-b 0.55s ease-in-out infinite;transform-origin:52px 54px"/>
    <rect x="38" y="54" width="6" height="16" rx="2" fill="#b06830" style="animation:leg-b 0.55s ease-in-out infinite;transform-origin:38px 54px"/>
    <rect x="28" y="54" width="6" height="16" rx="2" fill="#b06830" style="animation:leg-a 0.55s ease-in-out infinite;transform-origin:28px 54px"/>
  </svg>
</div>
```

---

## LUCKY (green — #5a9a6a) — animation-delay: -0.18s

```html
<div style="text-align:center;margin-bottom:6px">
  <svg style="animation:gallop 0.55s ease-in-out infinite;animation-delay:-0.18s;display:inline-block" width="90" height="66" viewBox="0 0 100 72" fill="none">
    <ellipse cx="48" cy="42" rx="26" ry="14" fill="#5a9a6a"/>
    <rect x="63" y="24" width="11" height="22" rx="5" fill="#5a9a6a" transform="rotate(-18 63 24)"/>
    <ellipse cx="77" cy="20" rx="9" ry="7" fill="#5a9a6a" transform="rotate(-15 77 20)"/>
    <polygon points="80,13 83,7 86,13" fill="#5a9a6a"/>
    <circle cx="80" cy="19" r="1.5" fill="#120e08"/>
    <path d="M65,20 Q67,13 70,20 Q72,11 74,20 Q76,13 78,18" stroke="#2a6a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M22,38 Q10,32 11,46 Q7,38 13,52" stroke="#2a6a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <rect x="62" y="54" width="6" height="16" rx="2" fill="#3a8050" style="animation:leg-a 0.55s ease-in-out infinite;transform-origin:62px 54px"/>
    <rect x="52" y="54" width="6" height="16" rx="2" fill="#3a8050" style="animation:leg-b 0.55s ease-in-out infinite;transform-origin:52px 54px"/>
    <rect x="38" y="54" width="6" height="16" rx="2" fill="#3a8050" style="animation:leg-b 0.55s ease-in-out infinite;transform-origin:38px 54px"/>
    <rect x="28" y="54" width="6" height="16" rx="2" fill="#3a8050" style="animation:leg-a 0.55s ease-in-out infinite;transform-origin:28px 54px"/>
  </svg>
</div>
```

---

## CLOD (blue/purple — #6a7ab0) — animation-delay: -0.36s

```html
<div style="text-align:center;margin-bottom:6px">
  <svg style="animation:gallop 0.55s ease-in-out infinite;animation-delay:-0.36s;display:inline-block" width="90" height="66" viewBox="0 0 100 72" fill="none">
    <ellipse cx="48" cy="42" rx="26" ry="14" fill="#6a7ab0"/>
    <rect x="63" y="24" width="11" height="22" rx="5" fill="#6a7ab0" transform="rotate(-18 63 24)"/>
    <ellipse cx="77" cy="20" rx="9" ry="7" fill="#6a7ab0" transform="rotate(-15 77 20)"/>
    <polygon points="80,13 83,7 86,13" fill="#6a7ab0"/>
    <circle cx="80" cy="19" r="1.5" fill="#120e08"/>
    <path d="M65,20 Q67,13 70,20 Q72,11 74,20 Q76,13 78,18" stroke="#3a4a80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M22,38 Q10,32 11,46 Q7,38 13,52" stroke="#3a4a80" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <rect x="62" y="54" width="6" height="16" rx="2" fill="#4a5a98" style="animation:leg-a 0.55s ease-in-out infinite;transform-origin:62px 54px"/>
    <rect x="52" y="54" width="6" height="16" rx="2" fill="#4a5a98" style="animation:leg-b 0.55s ease-in-out infinite;transform-origin:52px 54px"/>
    <rect x="38" y="54" width="6" height="16" rx="2" fill="#4a5a98" style="animation:leg-b 0.55s ease-in-out infinite;transform-origin:38px 54px"/>
    <rect x="28" y="54" width="6" height="16" rx="2" fill="#4a5a98" style="animation:leg-a 0.55s ease-in-out infinite;transform-origin:28px 54px"/>
  </svg>
</div>
```
