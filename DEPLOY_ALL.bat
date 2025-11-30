@echo off
REM SmartMentorAI - COMPLETE AUTOMATED DEPLOYMENT SCRIPT
REM This script automates as much as possible

echo.
echo ════════════════════════════════════════════════════════════════
echo   SMARTMENTORAI - AUTOMATED ONLINE DEPLOYMENT
echo ════════════════════════════════════════════════════════════════
echo.

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Git not installed. Download: https://git-scm.com
    pause
    exit /b 1
)
echo ✓ Git installed

REM Setup Git user (if not already done)
git config --global user.name "SmartMentorAI" >nul 2>&1
git config --global user.email "deploy@smartmentorai.com" >nul 2>&1
echo ✓ Git configured

REM Check if in correct directory
if not exist "server.js" (
    echo ✗ Not in project directory
    echo Go to: C:\Users\Lenovo\Downloads\Cardano Hackthon
    pause
    exit /b 1
)
echo ✓ Project directory verified

echo.
echo ════════════════════════════════════════════════════════════════
echo   STEP 1: GitHub Setup (Manual - Takes 2 minutes)
echo ════════════════════════════════════════════════════════════════
echo.
echo IMPORTANT: You must do this manually:
echo.
echo 1. Go to: https://github.com/new
echo 2. Create repository:
echo    - Name: smartmentorai
echo    - Description: SmartMentorAI - AI Learning Platform
echo    - Keep it PUBLIC
echo    - Click "Create repository"
echo.
echo 3. You'll see a setup page. Copy your HTTPS URL
echo    (Should look like: https://github.com/YOUR_USERNAME/smartmentorai.git)
echo.
echo When ready, type your GitHub username below:
set /p GITHUB_USER="Your GitHub username: "

if "%GITHUB_USER%"=="" (
    echo ✗ No username provided
    pause
    exit /b 1
)

echo ✓ GitHub username: %GITHUB_USER%

echo.
echo ════════════════════════════════════════════════════════════════
echo   STEP 2: Push Code to GitHub (Automated)
echo ════════════════════════════════════════════════════════════════
echo.

cd /d "C:\Users\Lenovo\Downloads\Cardano Hackthon"

echo Preparing repository...
git branch -M main >nul 2>&1

echo Checking for existing remote...
git remote remove origin >nul 2>&1

echo Adding GitHub remote...
git remote add origin https://github.com/%GITHUB_USER%/smartmentorai.git

echo.
echo ⚠️  GitHub will ask for your credentials:
echo    - Username: %GITHUB_USER%
echo    - Password: Your GitHub password
echo      (or Personal Access Token if 2FA enabled)
echo.
echo Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ✗ Push failed!
    echo   Possible issues:
    echo   1. Wrong GitHub username
    echo   2. Repository doesn't exist yet (create at github.com/new)
    echo   3. Wrong password/token
    echo.
    pause
    exit /b 1
)

echo ✓ Code pushed to GitHub!

echo.
echo ════════════════════════════════════════════════════════════════
echo   STEP 3: Deploy on Render (Manual - Takes 5 minutes)
echo ════════════════════════════════════════════════════════════════
echo.
echo NOW:
echo 1. Go to: https://render.com/signup
echo 2. Sign up with GitHub (click "Continue with GitHub")
echo 3. Authorize Render
echo 4. Click: "New +" button
echo 5. Select: "Web Service"
echo 6. Select repository: smartmentorai
echo 7. Click: "Connect"
echo.
echo CONFIGURE THESE SETTINGS:
echo   Name:            smartmentorai
echo   Environment:     Node
echo   Build Command:   npm install
echo   Start Command:   node server.js
echo   Instance Type:   Free
echo.
echo 8. Click: "Create Web Service"
echo 9. Wait 2-5 minutes for deployment
echo.
echo Your app will be at:
echo   https://smartmentorai.onrender.com
echo   https://smartmentorai.onrender.com/skilleedge-pro.html
echo.

start https://render.com/signup

echo.
echo ════════════════════════════════════════════════════════════════
echo   ✅ DEPLOYMENT STEPS COMPLETE!
echo ════════════════════════════════════════════════════════════════
echo.
echo Your code is on GitHub: https://github.com/%GITHUB_USER%/smartmentorai
echo.
echo Waiting for you to complete Render deployment...
echo.
pause
