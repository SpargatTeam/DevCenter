@echo off
setlocal enabledelayedexpansion

REM Nume proiect
set "project_name=devcenter"

REM Opțiuni de build
set "run=node index.js"
set "build=npm install"

REM Afișarea meniului de opțiuni
echo =============================================
echo Proiect: %project_name%
echo =============================================
echo Selectează o opțiune:
echo 1. Run (rulare aplicație JS)
echo 2. Build (construire executabil JS)

REM Citirea alegerii utilizatorului
set /p choice=Introdu numărul opțiunii tale: 

REM Executarea opțiunii selectate
if "%choice%"=="1" (
    echo Rulăm aplicația JS...
    %run%
) else if "%choice%"=="2" (
    echo Instalam dependentele JS...
    %build%
) else (
    echo Alegere invalidă. Te rog să încerci din nou.
)

endlocal
