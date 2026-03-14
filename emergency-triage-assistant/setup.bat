@echo off
echo ========================================
echo Emergency Response Triage Assistant
echo Automated Setup Script
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend\.env and add your OpenAI API key!
    echo.
) else (
    echo .env file already exists.
)

cd ..

echo.
echo [2/4] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)

cd ..

echo.
echo [3/4] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Edit backend\.env and add your OpenAI API key
echo 2. Open TWO terminal windows
echo 3. Terminal 1: cd backend ^&^& npm run dev
echo 4. Terminal 2: cd frontend ^&^& npm run dev
echo 5. Open browser to http://localhost:3000
echo ========================================
echo.
echo [4/4] Would you like to start the servers now? (Y/N)
set /p start="Enter choice: "

if /i "%start%"=="Y" (
    echo.
    echo Starting servers...
    echo Backend will run on http://localhost:5000
    echo Frontend will run on http://localhost:3000
    echo.
    echo Press Ctrl+C to stop the servers
    echo.
    start cmd /k "cd backend && npm run dev"
    timeout /t 3 /nobreak >nul
    start cmd /k "cd frontend && npm run dev"
    echo.
    echo Servers started in separate windows!
) else (
    echo.
    echo Setup complete! Start servers manually when ready.
)

echo.
pause
