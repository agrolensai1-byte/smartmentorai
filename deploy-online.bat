@echo off
REM SmartMentorAI - Online Deployment Quick Start
REM This script prepares your project for GitHub and cloud deployment

echo.
echo ========================================
echo  SmartMentorAI - Deploy Online
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Git is not installed
    echo Download from: https://git-scm.com
    pause
    exit /b 1
)

echo ✓ Git is installed

REM Initialize Git if needed
if not exist .git (
    echo.
    echo Initializing Git repository...
    git init
    git config user.name "SmartMentorAI"
    git config user.email "admin@smartmentorai.com"
    git add .
    git commit -m "SmartMentorAI - Initial commit for online deployment"
    echo ✓ Git initialized and committed
) else (
    echo ✓ Git repository already exists
)

echo.
echo ========================================
echo  DEPLOYMENT OPTIONS
echo ========================================
echo.
echo 1. Deploy to Render (RECOMMENDED - FREE)
echo    https://render.com
echo.
echo 2. Deploy to Railway
echo    https://railway.app
echo.
echo 3. Deploy to Heroku (After free tier ends)
echo    https://www.heroku.com
echo.
echo 4. Deploy to DigitalOcean App Platform
echo    https://www.digitalocean.com
echo.
echo ========================================
echo.

echo Next Steps:
echo.
echo 1. Create GitHub Repository:
echo    - Go to https://github.com/new
echo    - Create new repo named: smartmentorai
echo.
echo 2. Push to GitHub:
echo    git branch -M main
echo    git remote add origin https://github.com/YOUR_USERNAME/smartmentorai.git
echo    git push -u origin main
echo.
echo 3. Deploy to Render:
echo    - Sign up at https://render.com (with GitHub)
echo    - Click "New +" then "Web Service"
echo    - Select your smartmentorai repository
echo    - Build Command: npm install
echo    - Start Command: node server.js
echo    - Click "Create Web Service"
echo    - Wait 2-5 minutes for deployment
echo.
echo For detailed instructions, read: DEPLOYMENT_GUIDE.md
echo.
pause
