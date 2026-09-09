@echo off
setlocal
cd /d "%~dp0"
echo Starting the resume website. Open http://localhost:8080 after startup.
call gradlew.bat bootRun
if errorlevel 1 pause
endlocal
