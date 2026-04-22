@echo off
echo [%date% %time%] WALLWATCHER starting >> "%~dp0HEARTBEAT.log"
node "%~dp0wallwatcher.js" >> "%~dp0HEARTBEAT.log" 2>&1
echo [%date% %time%] WALLWATCHER complete >> "%~dp0HEARTBEAT.log"
