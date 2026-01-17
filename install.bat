@echo off
REM Install Node.js and dependencies for Emergency Reporting App

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Node.js is already installed
    goto install_deps
)

REM Download Node.js
echo Downloading Node.js...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi' -OutFile '%TEMP%\node-installer.msi'"

REM Install Node.js
echo Installing Node.js...
msiexec /i "%TEMP%\node-installer.msi" /quiet /norestart

REM Wait for installation
timeout /t 10 /nobreak

REM Refresh PATH
setx PATH "%PATH%;C:\Program Files\nodejs"

REM Install dependencies
:install_deps
echo Installing npm dependencies...
cd /d "%~dp0"
call npm install

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the app, run:
echo   npm start
echo.
echo Or for development mode:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
