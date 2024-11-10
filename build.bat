@echo off
setlocal enabledelayedexpansion

set "project_name=DevCenter"
set "run=node index.js"
set "build=npm install"

echo =============================================
echo Project: %project_name%
echo =============================================
echo Choice an option:
echo 1. Run (DevCenter)
echo 2. Install (depencies)

set /p choice=Run option:

if "%choice%"=="1" (
    echo Running DevCenter...
    %run%
) else if "%choice%"=="2" (
    echo Installing depencies...
    %build%
    pip install cryptography
    pip install requests
) else (
    echo Invalid option
)

endlocal