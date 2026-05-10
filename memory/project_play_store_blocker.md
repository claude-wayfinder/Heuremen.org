---
name: Play Store signing key blocker
description: AAB signing key mismatch — rebuilt in PWABuilder with new key, Play Console rejects. Need to reset upload key or reuse original keystore
type: project
originSessionId: 9c9a51f5-4bac-48b3-a957-6e44099d469d
---
**Google Play Console rejects the AAB** — signing key fingerprint doesn't match.

Expected: `SHA1: FA:B6:98:AA:C0:B6:1E:88:95:2A:BC:93:67:26:EA:1C:41:B6:0E:7B`
Got: `SHA1: 81:B7:D2:A6:37:35:73:55:A0:D5:AB:35:1B:D1:5E:31:62:C7:87:50`

**Why:** PWABuilder generates a new signing key each time you package. First AAB was uploaded with key A, second rebuild used key B.

**How to fix:**
1. If no version has been published yet: reset the upload key in Play Console (Settings > App signing)
2. Or: find the `.keystore` file from the FIRST PWABuilder download zip and use it when rebuilding
3. Or: create a brand new app listing in Play Console and upload the latest AAB fresh

**Package name:** `org.heuremen.companion`
**Privacy policy:** https://heuremen.org/privacy.html
