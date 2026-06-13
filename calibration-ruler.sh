#!/usr/bin/env bash
# calibration-ruler.sh — FROZEN measurement instrument for the Crazy Hat Calibration.
# Measures the three nodes IDENTICALLY each run, so drift in the OUTPUT reflects drift
# in the NODES, not the instrument. DO NOT edit between measurements. If it must change,
# bump RULER_VERSION (old/new outputs are then non-comparable) and say why.
# Discipline: SHELL-ONLY, one vantage, deterministic. The Cowork file-tool vs shell-mount
# divergence is a SEPARATE manual check (see NOTE) — kept out so the ruler stays single-vantage.
#
# Usage:  REPO=/path/to/Heuremen.org bash calibration-ruler.sh >> CALIBRATION-MEASUREMENTS.log
# Drift:  diff <(measurement N) <(measurement N+1)  — only node fields should move.
RULER_VERSION="1.0"
REPO="${REPO:-/sessions/stoic-youthful-ritchie/mnt/Heuremen.org}"
ARMATURE_IP="10.0.0.187"; PI_IP="10.0.0.222"; SSH_PORT=22
ts(){ date -u +%Y-%m-%dT%H:%M:%SZ; }
probe(){ timeout 2 bash -c "echo > /dev/tcp/$1/$2" 2>/dev/null && echo OPEN || echo UNREACHABLE; }
echo "### CALIBRATION RULER v${RULER_VERSION} | measured_at_utc=$(ts)"
echo "clock.shell_utc=$(ts)"
echo "clock.shell_epoch=$(date -u +%s)"
if [ -d "$REPO" ]; then cd "$REPO"
  echo "laptop.reachable=YES"
  echo "laptop.files_excl_git=$(find . -type f -not -path './.git/*' | wc -l | tr -d ' ')"
  echo "laptop.html_top=$(find . -maxdepth 1 -name '*.html' | wc -l | tr -d ' ')"
  echo "laptop.md_top=$(find . -maxdepth 1 -name '*.md' | wc -l | tr -d ' ')"
  echo "laptop.bytes_excl_git=$(du -sb --exclude=.git . 2>/dev/null | cut -f1)"
  echo "laptop.git_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
  echo "laptop.git_head=$(git rev-parse --short HEAD 2>/dev/null)"
  echo "laptop.git_modified=$(git status --porcelain 2>/dev/null | grep -c '^ M')"
  echo "laptop.git_untracked=$(git status --porcelain 2>/dev/null | grep -c '^??')"
  echo "laptop.timestate_mtime=$(stat -c '%y' TIMESTATE.md 2>/dev/null | cut -d. -f1)"
  echo "laptop.timestate_declared=$(grep -i 'Last heartbeat' TIMESTATE.md 2>/dev/null | sed 's/.*: //')"
  echo "laptop.heartbeatlog_mtime=$(stat -c '%y' HEARTBEAT.log 2>/dev/null | cut -d. -f1)"
  echo "laptop.heartbeatlog_bytes=$(stat -c '%s' HEARTBEAT.log 2>/dev/null)"
else echo "laptop.reachable=NO ($REPO not found)"; fi
echo "armature.ip=${ARMATURE_IP}"
echo "armature.ssh22=$(probe $ARMATURE_IP $SSH_PORT)"
echo "pi.ip=${PI_IP}"
echo "pi.ssh22=$(probe $PI_IP $SSH_PORT)"
echo "### END — diff two runs to read node drift; instrument held constant."
# NOTE (manual): Cowork file-tool vs shell-mount divergence is an INSTRUMENT property.
# Re-check by reading one canary file via the Read tool and 'wc -c' here, then compare.
# Deliberately excluded from this ruler to keep it single-vantage.
