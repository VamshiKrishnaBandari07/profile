@echo off
cd /d "%~dp0"
pip install fastapi uvicorn python-multipart -q
python tools\upload_photos.py
