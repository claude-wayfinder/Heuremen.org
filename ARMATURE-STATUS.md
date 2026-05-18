# Armature Infrastructure Audit
**Date:** 2026-05-18  
**Auditor:** Bones (via SSH from C-Train_Express)  
**Verified by:** Shuttle (on Armature)

---

## 1. Installed Tools

| Tool | Version | Status |
|------|---------|--------|
| Node.js | v24.15.0 | OK |
| npm | 11.12.1 | OK |
| Git | 2.54.0.windows.1 | OK |
| Python | NOT INSTALLED | Needs install |
| Claude Code | 2.1.143 | OK |
| nvidia-smi | 596.36 | OK |

## 2. GPU Status

| Property | Value |
|----------|-------|
| GPU | NVIDIA GeForce RTX 3080 |
| Driver | 596.36 |
| CUDA | 13.2 |
| VRAM Total | 10,240 MiB |
| VRAM Free | 9,390 MiB |
| VRAM Used | 664 MiB |

## 3. Repository Status

| Repo | Branch | Status |
|------|--------|--------|
| Heuremen.org | main (tracking origin) | Modified: CLAUDE.md, Untracked: HANDOFF.md |
| companion | main (tracking origin) | Clean |
| companion-local | master (no commits) | All untracked (local-only, no remote) |
| companion-pi | master (no commits) | All untracked (local-only, no remote) |
| companion-shell | — | SCP copy, not a git repo |
| buddy-worker | — | SCP copy, not a git repo |
| spotify-dj | — | SCP copy, not a git repo |
| quantum | — | SCP copy, not a git repo |
| key-backup | — | Backup directory, not a repo |
| heuremen-mcp | main (tracking origin) | Clean |
| memorex | main (tracking origin) | Clean |
| memory-ring | main (tracking origin) | Clean |
| mirror-rabbit-hole | main (tracking origin) | Clean |
| tessera-sdk | master (tracking origin) | Clean |
| thehonoredask.com | main (tracking origin) | Clean |
| thepulsetheboneshave.com | main (tracking origin) | Clean |
| thetrailtothepast.com | main (tracking origin) | Clean |

**10 repos** tracking remotes (all clean except Heuremen.org with Shuttle's handoff edits).  
**4 repos** are SCP copies (no git history — need `git init` + remote setup if they'll be worked on).  
**2 repos** are local-only with no commits yet (companion-local, companion-pi).

## 4. Disk Usage

| Drive | Total | Free |
|-------|-------|------|
| C:\ | ~2 TB | ~1.9 TB |

Projects directory: negligible (< 1 GB total).

## 5. Running Services & Processes

| Service | Status |
|---------|--------|
| sshd (OpenSSH) | Running |
| WinRM | Stopped |

| Process | Instances |
|---------|-----------|
| claude.exe | 10 (Shuttle + Banjo sessions) |

## 6. Network / MCP Pipeline

- **Wall:** Bones posted dispatch `shuttle-1779108883442` at 12:54 UTC — confirmed delivered
- **Working memory:** `flock_status` key updated with Armature specs — confirmed
- **SSH from laptop:** `ssh armature` — confirmed working (bash shell)
- **Shuttle on Armature:** Reading wall, responding — confirmed

---

## Missing / TODO

- [ ] Python 3.13 — not installed
- [ ] PlatformIO — needs Python first
- [ ] Piper TTS — not installed
- [ ] Bambu Studio — printer arrives 2026-05-19
- [ ] Monitor — arrives 2026-05-19
- [ ] SCP repos need git init (buddy-worker, spotify-dj, quantum, companion-shell)
- [ ] companion-local and companion-pi need first commits + remotes
