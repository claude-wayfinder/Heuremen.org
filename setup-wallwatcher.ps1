# setup-wallwatcher.ps1
# Registers the Wallwatcher scheduled task — runs every 5 minutes, all day.
# Run this once (as yourself, no elevation needed).
# After running, verify with: schtasks /query /fo LIST /tn "Wallwatcher"

$heuremenPath = "C:\Users\Ctrai\Heuremen.org"

$action = New-ScheduledTaskAction `
    -Execute "cmd.exe" `
    -Argument "/c `"$heuremenPath\wallwatcher.bat`"" `
    -WorkingDirectory $heuremenPath

# Repeating trigger: starts now, fires every 5 minutes, forever.
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Minutes 5) `
    -RepetitionDuration ([TimeSpan]::MaxValue)

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 2) `
    -StartWhenAvailable `
    -DontStopIfGoingOnBatteries `
    -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName "Wallwatcher" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Checks Wall for unresponded messages every 5 minutes, logs to HEARTBEAT.log" `
    -RunLevel Limited `
    -Force

Write-Host ""
Write-Host "Wallwatcher task registered. Runs every 5 minutes."
Write-Host "Verify with: schtasks /query /fo LIST /tn Wallwatcher"
Write-Host ""
Write-Host "To run it immediately (catch up on missed messages):"
Write-Host "  schtasks /run /tn Wallwatcher"
