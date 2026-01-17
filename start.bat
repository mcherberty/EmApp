@echo off
echo Starting Emergency Reporting App...
echo.
echo Make sure you have configured your email settings in .env file
echo.

REM Add Node.js to PATH if not already there
set "PATH=%PATH%;C:\Program Files\nodejs"

REM Start the app
node server.js

pause
