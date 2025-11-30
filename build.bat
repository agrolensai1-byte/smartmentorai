@echo off
REM SmartMentorAI Docker Build Script for Windows

setlocal enabledelayedexpansion

set "PROJECT_NAME=smartmentorai"
set "IMAGE_NAME=%PROJECT_NAME%:latest"
set "VERSION=1.0.0"

echo.
echo 🐳 Building SmartMentorAI Docker Image...
echo 📦 Image: %IMAGE_NAME%
echo 📌 Version: %VERSION%
echo.

docker build ^
    --tag %IMAGE_NAME% ^
    --tag %PROJECT_NAME%:%VERSION% ^
    --build-arg VERSION=%VERSION% ^
    --label "version=%VERSION%" ^
    --label "project=%PROJECT_NAME%" ^
    .

if %errorlevel% neq 0 (
    echo ❌ Docker build failed!
    exit /b 1
)

echo.
echo ✅ Docker image built successfully!
echo.
echo 📋 Available images:
docker images | findstr /i %PROJECT_NAME%

echo.
echo 🚀 To run the container:
echo    docker-compose up -d
echo.
echo 🌐 To access the application:
echo    http://localhost:3000
echo.
echo 📊 To view logs:
echo    docker-compose logs -f smartmentorai
echo.
