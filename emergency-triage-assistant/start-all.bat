@echo off
echo ========================================
echo   Emergency Triage Assistant - Startup
echo ========================================
echo.

echo [1/4] Starting Node.js Backend (Groq-powered)...
cd backend
start "Node.js Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [2/4] Starting FastAPI Backend (Groq-powered)...
cd ..\fastapi-backend
start "FastAPI Backend" cmd /k "python -m uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak >nul

echo [3/4] Starting React Frontend...
cd ..\frontend
start "React Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   All Services Started Successfully!
echo ========================================
echo.
echo Node.js Backend (Groq):  http://localhost:5000
echo FastAPI Backend (Groq):  http://localhost:8000
echo API Documentation:       http://localhost:8000/docs
echo React Frontend:          http://localhost:5173
echo Main Triage App:         http://localhost:5173
echo RAG Dashboard:           http://localhost:5173/rag.html
echo.
echo All services now use Groq API (llama3-8b-8192)
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /FI "WindowTitle eq Node.js Backend*" /T /F
taskkill /FI "WindowTitle eq FastAPI Backend*" /T /F
taskkill /FI "WindowTitle eq React Frontend*" /T /F
