@echo off
cd /d "%~dp0"
title Portfolio Editor
echo Starting CMS server + website...
start "CMS" cmd /k "pip install fastapi uvicorn python-multipart -q && python tools\cms_server.py"
timeout /t 2 /nobreak >nul
start "Website" cmd /k "npm run dev"
echo.
echo  Portfolio Editor running!
echo  Open: http://localhost:5173/profile/
echo  Click the "Edit" button bottom-right to add photos.
echo.
pause
