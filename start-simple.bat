@echo off
title Glanzbruch Simple Server
color 0A
echo.
echo ========================================
echo   GLANZBRUCH SIMPLE SERVER
echo ========================================
echo.
echo Starting server on http://localhost:3000
echo.
set NODE_ENV=development
set PORT=3000
npx tsx server/index.ts
echo.
echo Server stopped. Press any key to close.
pause
