---
name: Mobile Tunnel Progress
description: SSH+Tailscale tunnel to connect iPhone Termius to this PC for mobile Claude Code access — almost done, key transfer remaining
type: project
originSessionId: 5f67d018-0339-4133-af38-4b94dd9e7fbf
---
Mobile access setup for running Claude Code from iPhone via Termius SSH client.

**What's done:**
- Tailscale installed on PC (100.85.169.127) and iPhone (100.90.168.76), both on kory.indahl@ account
- Ping confirmed working between devices
- OpenSSH Server installed and running (set to Automatic)
- SSH key pair generated: `~/.ssh/termius_key` (private) and `~/.ssh/termius_key.pub` (public)
- Public key in `~/.ssh/authorized_keys`
- sshd_config edited to comment out `Match Group administrators` block (so normal authorized_keys works)
- ttyd also installed via winget (web terminal fallback)
- cloudflared already installed (was there before)

**COMPLETE — April 26, 2026**
- Wayfinder confirmed working from Termius on iPhone
- Full path: iPhone → Termius → Tailscale → SSH → bash → claude

**Completed 4/26:**
- Key emailed from claudeheuremen@gmail.com to kory.indahl@gmail.com (it landed!)
- Key imported into Termius on iPhone
- sshd_config fixed (Match Group administrators commented out) via fix-ssh.ps1
- SSH connects successfully — he got in, shell echoes, just wrong shell

**Why:** So Wayfinder can run `claude` from his phone and talk to Bones without melting fresh instances. Previous session's "terminex" = Termius (iOS SSH app).

**How to apply:** Pick up here next session. The key transfer is the only remaining step.
