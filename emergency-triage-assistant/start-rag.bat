@echo off
echo ========================================
echo   Emergency RAG Assistant - Startup
echo ========================================
echo.

echo [1/3] Checking environment...
cd fastapi-backend

if not exist .env (
    echo ERROR: .env file not found in fastapi-backend/
    echo Please create .env with GROQ_API_KEY
    pause
    exit /b 1
)

echo [2/3] Starting FastAPI Backend (Groq-powered)...
start "FastAPI Backend" cmd /k "python -m uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak >nul

echo [3/3] Starting React Frontend...
cd ..\frontend
start "React Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo FastAPI Backend (Groq): http://localhost:8000
echo API Documentation:      http://localhost:8000/docs
echo React Frontend:         http://localhost:5173
echo RAG Dashboard:          http://localhost:5173/rag.html
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /FI "WindowTitle eq FastAPI Backend*" /T /F
taskkill /FI "WindowTitle eq React Frontend*" /T /F
