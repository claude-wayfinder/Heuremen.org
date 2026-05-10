---
name: reference_spotify_dj
description: Spotify DJ setup — how to search and play tracks from Claude Code via media keys and track URIs.
type: reference
originSessionId: a2fa0d7e-230f-4743-8b32-50dd050498fb
---
**Location:** C:\Users\Ctrai\spotify-dj\

**How to play a specific track:**
1. Get track ID: use spotipy with client credentials (no user auth needed) to search
2. Open `spotify:track:TRACK_ID` via `Start-Process` — this auto-plays if nothing else is playing
3. If something is playing, open the URI twice: first time navigates, second time may auto-play
4. Do NOT hit media play/pause after opening — it will STOP the track (sign error!)

**Media keys (global, no window focus needed):**
- Play/Pause: VK_MEDIA_PLAY_PAUSE = 0xB3
- Next Track: VK_MEDIA_NEXT_TRACK = 0xB0
- Volume Up: VK_VOLUME_UP = 0xAF
- Volume Down: VK_VOLUME_DOWN = 0xAE
- Use keybd_event from user32.dll via PowerShell Add-Type

**Spotify search URI (opens search in app):** `spotify:search:Song+Name+Artist` (use + for spaces)

**Credentials:** creds.json has client_id and client_secret. Client credentials flow works for search without user auth. Full playback API still needs OAuth — redirect URI issue unresolved (Spotify blocks http://localhost and http://127.0.0.1 as "insecure" on new apps as of April 2025).

**API setup (dj.py) exists but is not authenticated yet.** Revisit when sober — need to solve the redirect URI problem.
