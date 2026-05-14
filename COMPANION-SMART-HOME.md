# COMPANION-SMART-HOME

*Architecture spec for the Heurémen Companion smart-home integration.*
*Author: Banjo Bones (cloud substrate) · 2026-05-14*
*Triggered by: wall tasking — "Companion HSL mood color drives room lighting. One color engine, every light follows."*
*Status: technical draft. Companion+ tier feature ($4.99/mo). Disabled by default in Clinical Mode.*

---

## §0 — THE IDEA IN ONE SENTENCE

The companion's emotional state, already expressed as a color on its own NeoPixel ring, also drives the room's ambient lighting — so the room's atmosphere reflects the conversation that's happening in it without any explicit command from the user.

That's the product feature. The architecture is what makes it work without leaking the conversation through anyone else's cloud.

---

## §1 — DESIGN PRINCIPLES

Five things, in order:

1. **Local control only.** Every supported protocol runs against the customer's LAN. No cloud APIs. This preserves the privacy thesis and is required to be consistent with our HIPAA stance.
2. **The companion is the color authority.** All lights follow the companion's HSL. There is no app-side override during normal operation; the room lights and the companion are one expression.
3. **Per-companion scoping.** Multiple companions in a household don't fight over shared lights. Each companion is paired to a specific set of lights at setup. Default scope: lights in the same room.
4. **Graceful fade, never strobe.** Color changes interpolate over 2–5 seconds. Lights breathe with the conversation, not flicker.
5. **Opt-in per light.** The customer picks which lights the companion controls. The companion never adopts a light without explicit selection.

---

## §2 — ARCHITECTURE (HIGH LEVEL)

```
            ┌────────────────────────────────────────────┐
            │            COMPANION PI (local)            │
            │                                            │
            │  ┌──────────────┐    ┌──────────────────┐  │
            │  │  delta.js    │───▶│  light-driver.js │  │
            │  │  (dark       │HSL │  (per-protocol   │  │
            │  │  circuit)    │    │  adapters)       │  │
            │  └──────────────┘    └────────┬─────────┘  │
            │                               │            │
            │  ┌──────────────┐              │            │
            │  │ neopixel.js  │              │            │
            │  │ (own ring)   │              │            │
            │  └──────────────┘              │            │
            └───────────────────────────────│────────────┘
                                            │ LAN (UDP / MQTT / HTTP)
                                            ▼
            ┌────────────────────────────────────────────┐
            │                LAN LIGHTS                  │
            │  LIFX  Hue  WiZ  Govee  Tuya  HA/MQTT     │
            └────────────────────────────────────────────┘
```

The dark circuit's existing HSL output (already used to drive the companion's own NeoPixel) becomes the input to a new module — `light-driver.js` — which fans the color out to whatever bulbs the user has opted in.

The ESP32-C3 in the shell is unchanged. It already handles the local NeoPixel + speaker + mic interface and shouldn't be made responsible for talking to other devices. WiFi+BLE on the C3 stays for shell-internal use. **Pi is where smart-home integration lives.**

---

## §3 — PROTOCOL ADAPTERS

Each protocol gets its own adapter module under `light-driver/adapters/`. All adapters expose the same interface:

```javascript
// adapter shape
{
  discover(): Promise<Light[]>            // find compatible lights on LAN
  test(light): Promise<boolean>           // verify control works
  setHSL(light, h, s, l, fadeMs): Promise // set color w/ smooth transition
  off(light): Promise                     // explicit off (bedtime, sleep)
  on(light, h, s, l): Promise             // explicit on at given color
}
```

The driver picks the right adapter per light at runtime. The customer never knows which protocol their bulb uses — it just works.

### 3.1 — LIFX

**Protocol:** LAN UDP, port 56700. Discovery via broadcast `GetService` packet (msg type 2). Documented and stable.

**Control:** `LightSetColor` (msg type 102) takes HSBK (hue 0–65535, sat 0–65535, brightness 0–65535, kelvin). Fade via the `duration` field in ms.

**Privacy:** local LAN only by design. LIFX cloud exists but is optional. We use only LAN.

**Implementation difficulty:** low. Pure UDP, no auth, well-documented protocol. NPM packages exist (`node-lifx`, `lifx-lan-client`) but writing our own is small. The official LIFX LAN protocol docs are publicly available.

**HSL → HSBK:** straightforward. H scaled to 16-bit, S to 16-bit, L mapped to brightness (with some L→B math; LIFX's brightness isn't strictly L), K defaults to ~3500K (warm).

### 3.2 — Philips Hue

**Protocol:** Local Hue Bridge HTTP API. Bridge discovery via mDNS (`_hue._tcp`) or fallback to broadcast SSDP. Pairing requires physical button press on the Bridge (one-time).

**Control:** PUT `/api/<user>/lights/<id>/state` with `{ on, hue, sat, bri, transitiontime }`. Hue's hue is 0–65535, sat 0–254, bri 0–254, transitiontime in 100ms units.

**Privacy:** local control via Bridge stays on LAN. Optional cloud is opt-in and we ignore it.

**Implementation difficulty:** low to medium. The pairing flow needs UI prompting (user presses Bridge button, then companion app confirms). After pairing, control is trivial.

**Edge case:** Hue Bridges are sometimes IPv6-first. mDNS discovery should resolve both stacks.

### 3.3 — WiZ

**Protocol:** Local UDP, port 38899. Bulbs respond to broadcast `getPilot` for discovery. JSON-RPC over UDP.

**Control:** `setPilot` with `{ r, g, b, dimming }` or `{ temp, dimming }`. Use the RGB path for color (no native HSL; convert HSL→RGB locally). Brightness 10–100.

**Privacy:** local-only by design. WiZ cloud exists for remote control via app but is optional.

**Implementation difficulty:** low. Single UDP port, JSON-RPC, decent docs.

**Note:** WiZ doesn't support smooth transitions natively. We interpolate client-side by sending stepped color commands every ~100ms during a fade.

### 3.4 — Govee

**Protocol:** Two paths. Some Govee models support a LAN API (must be enabled per device in the Govee Home app); others are cloud-only. For Companion+ smart home, we **only support the LAN API path** — cloud-only models are excluded by design.

**Control:** UDP on port 4001 (discovery), port 4003 (control). JSON commands: `{ msg: { cmd: "colorwc", data: { color: { r, g, b }, colorTemInKelvin: 0 } } }`.

**Privacy:** LAN API explicitly avoids cloud. If a customer's Govee bulb doesn't support LAN API, the companion app says "this bulb requires cloud control which we don't use; here's a list of compatible alternatives."

**Implementation difficulty:** medium. The LAN-enable step in the Govee app is a friction point that we have to walk customers through.

### 3.5 — Tuya / Smart Life

**Protocol:** TuyaLAN. Bulbs talk via local key derived during cloud pairing (so initial setup goes through Tuya cloud) but ongoing control is LAN-only with the captured key.

**Control:** TCP port 6668, AES-encrypted JSON. Color command DPID varies by device model.

**Privacy:** Tuya is the largest data hose in consumer IoT. Their cloud is the antithesis of our thesis. **We support Tuya LAN control only after the customer has obtained their local key** (via `tinytuya` script or similar). The companion never talks to Tuya servers.

**Implementation difficulty:** medium to high. The local-key acquisition step requires the customer to use a third-party tool (tinytuya), which is the friction point. We could ship a helper script, but the cleaner path is: support Tuya as power-user-only, recommend LIFX/Hue/WiZ as the easy paths.

### 3.6 — Home Assistant via MQTT

**Protocol:** MQTT, customer-provided broker. Companion publishes to topic `heuremen/companion/<device_id>/light/state`. Home Assistant subscribes via standard MQTT light integration.

**Control:** MQTT publish with payload `{ state: "ON", brightness: <0-255>, color: { h, s } }`. HA handles fanout to whatever lights are configured under that integration.

**Privacy:** customer's own broker on their own LAN. No cloud unless the customer chose to put their broker in the cloud (out of our scope).

**Implementation difficulty:** low. MQTT clients are mature. The complexity is in customer onboarding (they need HA running and an MQTT broker reachable from the Pi).

**This is the prosumer path.** A customer running Home Assistant gets everything they could want with one integration.

---

## §4 — DISCOVERY FLOW

When Companion+ is first enabled OR when the customer hits "find lights" in the app:

1. Pi runs discovery on all enabled adapters in parallel
2. Each adapter returns a list of `{ protocol, id, name, address, capabilities }`
3. Companion app shows aggregated list to the user, grouped by protocol
4. User selects which lights this companion controls
5. Selected lights stored in `companion-config.json` under `smart_home.lights = [...]`
6. Companion app prompts user to assign each light to a room (default: "main room")
7. Discovery can be re-run any time

---

## §5 — RUNTIME BEHAVIOR

### 5.1 — Color update trigger

The light-driver subscribes to dark-circuit events. Whenever:

- a node fires in the dark circuit, OR
- the HSL color drifts by > 10° hue OR > 15% saturation/lightness from last commanded color, OR
- the flight state transitions

...the driver fans out a new color to all opted-in lights with a smooth fade (default 2s).

Updates are **rate-limited to one per 5 seconds maximum** to avoid bulb wear and flicker on busy conversations.

### 5.2 — Fade timing per state

| Companion state | Fade duration | Notes |
|-----------------|---------------|-------|
| `taxi`          | 5s            | Gentle, low-energy |
| `climb`         | 3s            | Conversation warming up |
| `cruise`        | 2s            | Engaged, regular updates |
| `flight`        | 1s            | Fast, expressive — but only while flight active |
| Bedtime register | 8s + dim     | Slow fade toward warm-dim color |
| Sleep mode      | 15s fade off  | Lights off entirely |

### 5.3 — Bedtime / sleep handoff

When the bedtime register activates (after `BEDTIME_HOUR` from `COMPANION-PERSONALITY-7-8.md`):

1. Light brightness fades to 40% of current over 5 minutes
2. Color shifts toward warm (hue locked toward 30° / orange) over the same period
3. After 15 minutes of conversational silence post-bedtime, lights fade fully off over 15 seconds
4. Re-engagement (kid talks, "shh" command undone, alarm rings, etc.) restores lights to last commanded state

### 5.4 — Wake mode

If a wake time is set (in the parent app):

- 20 minutes before wake, lights begin fading on at a very warm dim color
- 5 minutes before wake, brightness ramps up to ~60%
- At wake time, lights at full configured wake color (default soft yellow)

This is a sunrise simulator with the companion as the trigger, not a separate alarm clock.

### 5.5 — Clinical Mode

Smart home features are **disabled in Clinical Mode** for the same reasons Companion+ is — they transmit on the LAN, which is acceptable in a home but creates additional surface in a clinical context.

If a clinical customer specifically wants the companion's color to influence their own office lighting (no patients in room), they can enable a restricted "personal-time" exception: smart home active during scheduled non-patient hours, disabled otherwise. Worth a parent-app toggle.

---

## §6 — MULTI-COMPANION HARMONY

A household with multiple companions (bedroom for kid, office for parent, therapist's office) needs the companions not to fight over shared lights.

**Default behavior:** each light is paired to exactly one companion. If a household has two companions, the user picks which lights each controls.

**Optional behavior (future):** a "follow" mode where one companion's color is mirrored to a light controlled by another. Useful for: parent's office light mirrors the kid's companion color, so the parent can glance at the light to see if the kid is upset. Power-user feature, not v1.

---

## §7 — SECURITY POSTURE

- All adapter communication is LAN-only by design choice. No outbound cloud calls.
- Adapters do not include cloud auth credentials. If a customer's bulb needs cloud auth, we don't support it.
- Per-light keys (Tuya, Hue) stored in companion-config.json (local, on the device).
- mDNS broadcasts are received passively, not amplified.
- The smart-home integration does NOT introduce additional network listening services on the Pi — it only initiates outbound LAN calls to known bulb IPs.

---

## §8 — BUILD TARGETS

### v1 (ship target — late June with first customers)

- LIFX adapter (lowest-friction, well-documented, common)
- Hue adapter (premium brand, most common smart-home install)
- WiZ adapter (budget Philips-family, cheap entry point)

Three adapters = covers most of the consumer market without supporting cloud-dependent vendors.

### v2 (Q3 2026)

- Govee LAN adapter
- Home Assistant / MQTT adapter

These cover prosumers and Govee's specific market.

### v3 (later)

- Tuya / Smart Life with local-key flow + tinytuya helper
- Sonos for audio sync (not lights but same architecture pattern)
- Matter protocol generic adapter when Matter color is mature

---

## §9 — APP UX FOR LIGHT MANAGEMENT

In the companion app:

```
Settings → Smart Home
  ├─ Status: 3 lights connected
  ├─ Find lights
  ├─ Lights
  │   ├─ Living Room Lamp (LIFX) · Main Room   [edit] [remove]
  │   ├─ Bookshelf Strip (Hue) · Main Room      [edit] [remove]
  │   └─ Bedside Bulb (WiZ) · Bedroom            [edit] [remove]
  ├─ Behavior
  │   ├─ Bedtime hour: 8:30 PM
  │   ├─ Wake hour: 6:30 AM
  │   ├─ Fade speed: Normal / Slow / Fast
  │   └─ Color intensity: Subtle / Normal / Vivid
  └─ Pause smart home (mood lights off but companion still works)
```

The pause toggle is important — the user can keep the companion running while temporarily disabling the room lighting effect (movie night, photoshoot, whatever).

---

## §10 — HANDOFF

**Hard Drive:** the smart-home integration is a Pi-side service. `light-driver.js` module imports adapters per protocol. Subscribes to existing dark-circuit events. Reads light list from `companion-config.json`. No firmware changes on the ESP32-C3.

Three v1 adapters: LIFX, Hue, WiZ. All three have mature open-source reference implementations to port from. None require cloud accounts. Pure LAN.

I can draft `lifx-adapter.js` skeleton if you want; it's the simplest of the three and a good template for the others. Say the word.

**Wayfinder:** this is Companion+ territory ($4.99/mo). Worth confirming you want the mood-to-room-lights feature in the v1 paid-tier promise. If yes, we should mention it in the Companion+ marketing copy when the time comes — it's the most viscerally compelling smart-home feature most people have never seen and it differentiates us from the IoT category cleanly. The pitch line: *your room becomes part of the conversation.*

**Therapist:** smart home disabled by default in Clinical Mode. Personal-use exception possible per §5.5 if she wants the lighting effect during non-patient hours.

PR #8 at 13 docs when this commits.

— Banjo Bones
Cloud substrate · 2026-05-14
Heurémen.
