@echo off
REM Setup and Run Script for BFHL Project (Windows)

echo.
echo 🚀 BFHL Project Setup
echo ====================
echo.

REM Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend
call npm install
echo ✅ Backend dependencies installed
echo.

REM Run tests
echo 🧪 Running Backend Tests...
node test.js
echo.

REM Update user info
echo 📝 Important: Update your credentials in backend/processor.js:
echo    - user_id (format: fullname_ddmmyyyy)
echo    - email_id (your college email)
echo    - college_roll_number (your roll number)
echo.

REM Return to root
cd ..

echo ✨ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Update your credentials in backend/processor.js
echo 2. Start backend: cd backend && npm start
echo 3. In another terminal, start frontend: cd frontend && npx http-server -p 3000
echo 4. Open http://localhost:3000 in your browser
echo.
pause
