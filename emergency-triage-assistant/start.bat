@echo off
echo ========================================
echo Emergency Response Triage Assistant
echo Starting Application...
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Application Started!
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo The application will open in separate windows.
echo Close those windows to stop the servers.
echo ========================================
echo.

timeout /t 5 /nobreak >nul
start http://localhost:3000

echo Press any key to close this window...
pause >nul
