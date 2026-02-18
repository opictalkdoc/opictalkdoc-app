@echo off
chcp 65001 > nul

echo.
echo ========================================
echo    OPIcTalkDoc Quick Start (Next.js 16)
echo    Port: 3001
echo ========================================
echo.

cd /d "%~dp0frontend"

echo [1/4] Collecting Soridam PIDs (port 3000) to protect...
set "PROTECT_PIDS="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    set "PROTECT_PIDS=!PROTECT_PIDS! %%a"
)

echo [2/4] Stopping other node processes...
setlocal enabledelayedexpansion
for /f "tokens=2" %%p in ('tasklist /FI "IMAGENAME eq node.exe" /NH 2^>nul ^| findstr /I "node.exe"') do (
    set "SKIP=0"
    for %%x in (!PROTECT_PIDS!) do (
        if "%%p"=="%%x" set "SKIP=1"
    )
    if "!SKIP!"=="0" (
        taskkill /PID %%p /F 2>nul
    )
)
endlocal
timeout /t 1 /nobreak >nul
echo Done.

echo [3/4] Checking packages...
if not exist node_modules (
    echo Installing packages...
    call npm install
    if errorlevel 1 (
        echo npm install failed!
        pause
        exit /b 1
    )
) else (
    echo node_modules exists.
)

echo [4/4] Starting Next.js dev server...
echo.
echo ========================================
echo    Next.js 16.1.6 + React 19.2.3
echo    http://localhost:3001
echo ========================================
echo.
echo Press Ctrl+C to stop.
echo.

start /min "" cmd /c "timeout /t 5 /nobreak >nul && start chrome.exe --incognito http://localhost:3001"

cmd /k "npm run dev -- -p 3001"
