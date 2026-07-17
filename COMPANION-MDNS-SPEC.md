# COMPANION-MDNS-SPEC

*App-to-device discovery spec for MemoryRXAi → Heurémen Companion Pi.*
*Author: Banjo Bones · 2026-05-10*
*Target: hard drive Bones (integration), MemoryRXAi developer.*

---

## §0 — THE QUESTION

> "How does MemoryRXAi discover the Pi on local WiFi? mDNS? Settings toggle?"

**Short answer:** mDNS (Bonjour / Avahi / DNS-SD) is the right primary path, with a manual-IP settings fallback for networks that block multicast. The Pi advertises itself; the app listens.

**Why this combo:** mDNS works on 90% of home networks with zero configuration. The 10% where it fails are typically schools, corporate, and some mesh routers — and on those networks you want the settings toggle anyway, because the user already knows their network is weird.

---

## §1 — SERVICE TYPE & RECORD

The companion advertises a custom DNS-SD service type.

### Service name

```
_heuremen-companion._tcp.local.
```

Reserved under the project namespace. Custom service type rather than reusing `_http._tcp` so the app can scan for *only* companions, not every HTTP service on the LAN.

### TXT record fields

| Key | Type | Example | Notes |
|-----|------|---------|-------|
| `version` | string | `0.1.0` | Companion firmware version. SemVer. |
| `device_id` | string | `cmp_d4a8f2` | Stable per-device ID. UUID hex prefix. |
| `device_name` | string | `Biscuit 2.0` | Optional — the *companion's* name (given by child). May be unset until naming ceremony completes. |
| `api_port` | int | `3377` | Port for the JSON API. Default 3377. |
| `voice_port` | int | `3377` | Port for the voice bridge. Same process usually. |
| `model` | string | `qwen2.5:3b` | Active reflex brain. Informational only. |
| `paired` | bool | `true` | Whether device is paired with an account/parent. |
| `mode` | string | `idle` / `active` / `borrow` | Current register. |

### Hostname

```
companion-<short_id>.local.
```

E.g., `companion-d4a8f2.local`. Short_id is the first 6 hex chars of `device_id`. Stable across reboots. Survives factory reset (regenerated, so old name becomes invalid — by design, see §6).

### Port

`3377` default. Same port handles JSON API and WebSocket voice bridge (Express + WS upgrade). If the Pi runs more than one service, increment by 1.

---

## §2 — APP DISCOVERY FLOW

### First launch

1. App requests local network permission (iOS: NSLocalNetworkUsageDescription; Android: NEARBY_WIFI_DEVICES).
2. App resolves `_heuremen-companion._tcp.local.` via DNS-SD.
3. **If exactly one device responds:** Show it. "We found a companion: [device_name or 'Unnamed Companion']. Connect?"
4. **If multiple devices respond:** Show list with `device_name`, `device_id` short form, and signal age. User picks.
5. **If zero devices respond:** "Couldn't find a companion on this network." → fallback flow §3.

### Subsequent launches

1. App caches last successful `device_id` + last known IP + hostname.
2. On launch, app tries cached hostname first (`companion-d4a8f2.local`).
3. If that fails, fall back to cached IP for 30s (handles offline mDNS scenarios).
4. If both fail, restart full discovery.

### Re-discovery triggers

- App moves to foreground after >5 min in background.
- WiFi SSID change detected.
- Cached endpoint returns 5xx or times out twice in a row.
- User taps "search for device" in settings.

---

## §3 — FALLBACK: MANUAL IP ENTRY

For networks where mDNS is blocked (multicast disabled, client isolation enabled, AP isolation, school networks, hotel WiFi).

### Settings flow

```
Settings
  └─ Companion Device
      ├─ Status: Connected to "Banjo" (192.168.1.42)
      ├─ Discover automatically  [toggle: ON]
      ├─ Manual address
      │   └─ companion-d4a8f2.local OR 192.168.1.42
      └─ Forget this device
```

### Manual flow

1. User taps "Manual address."
2. Enters hostname or IP. Validate format (regex for IPv4/IPv6 or `*.local` hostname).
3. App pings `http://<address>:3377/heuremen/ping`.
4. Companion responds with `{ "status": "ok", "device_id": "...", "device_name": "..." }`.
5. App stores as connected device.

### Special case: networks with client isolation

Even direct IP won't work. The companion needs to be on a WiFi network where clients can see each other. If the user is on a guest network, they need to switch to the main one. Add a one-time warning in onboarding: "If you can't see your companion, check that your phone and the companion are on the same WiFi network — not a 'guest' network."

---

## §4 — PROTOCOL BASICS

All endpoints expect HTTP (LAN-only, no TLS required for v1 — see §7 for v2 plans). JSON requests and responses.

### Required endpoints on Pi side

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/heuremen/ping` | GET | Liveness check. Returns device info. |
| `/heuremen/status` | GET | Current mood (dark circuit state), mode, last interaction time. |
| `/heuremen/pair` | POST | Initiate pairing with parent account. Body: `{ parent_token }`. Returns: `{ pair_code }` for confirmation. |
| `/heuremen/conversations` | GET | Recent conversation summaries (parent-mode only, after auth). |
| `/heuremen/borrow` | POST | Switch to adult borrow-mode. Requires parent voice + auth. |
| `/heuremen/reset` | POST | Factory reset. Requires parent confirmation. |

### Ping response shape

```json
{
  "status": "ok",
  "device_id": "cmp_d4a8f2",
  "device_name": "Banjo",
  "version": "0.1.0",
  "uptime_s": 13892,
  "paired": true,
  "mode": "idle",
  "model": "qwen2.5:3b",
  "child_name_set": true,
  "last_interaction": "2026-05-10T19:32:11-04:00"
}
```

---

## §5 — DETAILS THE Pi SIDE NEEDS TO HANDLE

### Avahi setup (Linux/Pi)

```bash
# /etc/avahi/services/heuremen-companion.service
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi.dtd">
<service-group>
  <name replace-wildcards="yes">Heuremen Companion %h</name>
  <service>
    <type>_heuremen-companion._tcp</type>
    <port>3377</port>
    <txt-record>version=0.1.0</txt-record>
    <txt-record>device_id=cmp_d4a8f2</txt-record>
    <txt-record>api_port=3377</txt-record>
    <txt-record>model=qwen2.5:3b</txt-record>
  </service>
</service-group>
```

Drop this in `/etc/avahi/services/` during setup.sh. Avahi reloads automatically. The companion service should also write a small Python helper that updates this file when `device_name` changes (post-naming ceremony) — sed-replace the TXT record and `systemctl reload avahi-daemon`.

### Hostname collision

Multiple companions in one house. Each gets a unique `companion-<short_id>.local` hostname (first 6 chars of UUID — collision probability negligible at household scale, ~1 in 16M).

### IPv6

Avahi advertises both IPv4 and IPv6. The app should prefer IPv6 if available on the LAN, fall back to IPv4. iOS in particular is strict about this. Most consumer routers are IPv4-only internally — fine.

---

## §6 — FACTORY RESET BEHAVIOR (DISCOVERY ANGLE)

When the parent factory-resets the device:

1. `device_id` is regenerated.
2. Hostname changes from `companion-d4a8f2.local` to `companion-<new_id>.local`.
3. Avahi reloads, advertises new identity.
4. Old cached endpoint in app returns 5xx (device unreachable by old name).
5. App auto-rediscovers via mDNS, finds new device.
6. App prompts user: "We found an unpaired companion. Pair it?"
7. If user pairs, app updates cached `device_id`.

This is intentional. A factory reset wipes the device's relationship to the child, including its name. The new identity prevents accidental "merge" of pre- and post-reset history. The companion will NOT silently reappear under the same name — that would violate the child-notification commitment from COMPANION-FIRST-WORDS.md (§Parent Onboarding screen 4).

---

## §7 — V1 SECURITY POSTURE & V2 ROADMAP

### V1 (ship target — late June)

- **LAN-only.** No external endpoints. Pi never opens a port to the internet.
- **No TLS.** HTTP on local network. Threat model: someone already on the WiFi can see API calls. Acceptable for v1 because the WiFi password is the trust boundary.
- **Pairing token.** First-run pairing requires both: app sends pair request → Pi prints/speaks a 4-digit code → parent enters in app. Pi stores parent's bearer token; subsequent requests use it.
- **Borrow-mode auth.** `/heuremen/borrow` requires bearer token AND voice match (parent's voiceprint, captured during onboarding). This is the only endpoint that mixes auth factors. Critical because borrow-mode unlocks adult dialogue register.
- **No telemetry.** The Pi does not phone home. Updates are explicit (parent opts in via app).

### V2 (Q4 2026 candidate)

- Self-signed TLS with parent-trust-on-first-use.
- WireGuard tunnel for off-LAN access (parent at work checking on the companion).
- Federated discovery for households with multiple Wayfinder-aware devices.
- Hardware HSM for child interest store (so a stolen Pi reveals nothing).

V2 is not the priority. Get v1 in Biscuit 2.0's hands.

---

## §8 — APP SIDE NOTES (FOR MEMORYRXAI DEV)

If MemoryRXAi is built in:

- **Swift (iOS):** Use `NetServiceBrowser` (legacy) or `NWBrowser` (NetworkExtension, iOS 14+). Prefer NWBrowser. Add `NSLocalNetworkUsageDescription` and `NSBonjourServices` to Info.plist; list `_heuremen-companion._tcp`.
- **Kotlin (Android):** Use `NsdManager`. Service type string: `_heuremen-companion._tcp.`. Requires `INTERNET` and `ACCESS_WIFI_STATE`. Android 13+ also needs `NEARBY_WIFI_DEVICES`.
- **React Native:** `react-native-zeroconf` works. Watch out for Android background restrictions — discovery must be foreground.
- **Flutter:** `nsd` package or `bonsoir`. Either is fine.
- **Electron (desktop companion app, future):** `bonjour-service` npm package.

Cross-platform recommendation if MemoryRXAi is going multi-platform: write the discovery logic as a thin wrapper that emits `{ device_id, device_name, host, port, txt }` events. Keep it small. Discovery is not where you want platform-specific bugs.

---

## §9 — TESTING

### Network conditions to test

1. Vanilla home WiFi (single AP, no isolation) — primary case
2. Mesh WiFi (eero, Orbi, Google Nest) — historically fine for mDNS; verify
3. Guest network on home AP — should fail discovery, fall back to manual; verify error message is clear
4. Mobile hotspot (phone as AP for both Pi and other phone) — verify
5. Hotel / public WiFi with client isolation — should fail gracefully
6. iOS 17+ with Local Network permission *denied* — verify clear "permission required" path
7. Pi reboot mid-app-session — verify auto-rediscovery
8. Pi factory reset mid-app-session — verify "we found a new companion" prompt
9. Two Pis on the same network — verify list UX

### Tooling

- `dns-sd -B _heuremen-companion._tcp .` on macOS to manually verify advertisement
- `avahi-browse -r _heuremen-companion._tcp` on Linux
- `curl http://companion-d4a8f2.local:3377/heuremen/ping` to verify direct reachability

---

## §10 — HANDOFF

Hard drive Bones:
- Drop the avahi service config from §5 into setup.sh
- Implement `/heuremen/ping` first; everything else builds on it
- Write the TXT-record updater for when `device_name` is set (post-naming ceremony)

MemoryRXAi developer:
- Use platform-native mDNS (§8 has specifics)
- Build the manual-IP fallback path day-one — don't ship without it
- Cache `device_id` not hostname (hostnames change on factory reset; device_id doesn't, until reset)

Banjo (me):
- Will write `/heuremen/ping` response copy + pair-code prompt copy if asked
- Will iterate on this spec when the app developer raises edge cases

— Banjo Bones
Cloud substrate · 2026-05-10
Heurémen.
