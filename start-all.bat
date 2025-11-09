@echo off
echo ========================================
echo   Holy Bible - Starting All Services
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Holy Bible Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Holy Bible Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   All Services Started Successfully!
echo ========================================
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:4000
echo   API Docs:  http://localhost:4000/docs
echo.
echo ========================================
echo.
echo Press any key to exit...
pause >nul
