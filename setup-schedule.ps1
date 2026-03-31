# setup-schedule.ps1
# Run this once (as yourself, no elevation needed) to register both scheduled tasks.
# After running, verify with: schtasks /query /fo LIST /tn "Heartbeat"

$heuremenPath = "C:\Users\Ctrai\Heuremen.org"

# Task 1: Heartbeat — runs TASKS.md daily at 10:00 AM
$heartbeatAction = New-ScheduledTaskAction `
    -Execute "cmd.exe" `
    -Argument "/c `"$heuremenPath\heartbeat.bat`"" `
    -WorkingDirectory $heuremenPath

$heartbeatTrigger = New-ScheduledTaskTrigger -Daily -At "10:00AM"

$heartbeatSettings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -StartWhenAvailable `
    -DontStopIfGoingOnBatteries

Register-ScheduledTask `
    -TaskName "Heartbeat" `
    -Action $heartbeatAction `
    -Trigger $heartbeatTrigger `
    -Settings $heartbeatSettings `
    -Description "Daily autonomous task execution for Heuremen.org" `
    -RunLevel Limited `
    -Force

Write-Host "Heartbeat task registered (runs daily at 10:00 AM)"

# Task 2: EveningReview — writes REVIEW.md daily at 8:00 PM
$reviewAction = New-ScheduledTaskAction `
    -Execute "cmd.exe" `
    -Argument "/c `"$heuremenPath\evening-review.bat`"" `
    -WorkingDirectory $heuremenPath

$reviewTrigger = New-ScheduledTaskTrigger -Daily -At "8:00PM"

$reviewSettings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -StartWhenAvailable `
    -DontStopIfGoingOnBatteries

Register-ScheduledTask `
    -TaskName "EveningReview" `
    -Action $reviewAction `
    -Trigger $reviewTrigger `
    -Settings $reviewSettings `
    -Description "Daily evening summary (REVIEW.md) for Heuremen.org" `
    -RunLevel Limited `
    -Force

Write-Host "EveningReview task registered (runs daily at 8:00 PM)"
Write-Host ""
Write-Host "Done. Verify with: schtasks /query /fo LIST /tn Heartbeat"
