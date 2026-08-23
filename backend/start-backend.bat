@echo off
echo ========================================================
echo Starting Smart Exams System - Spring Boot Backend
echo ========================================================

REM Set JAVA_HOME explicitly to the local Java 21 installation
set JAVA_HOME=C:\Program Files\Java\jdk-21
echo Using JAVA_HOME: %JAVA_HOME%

REM Ensure we are in the backend directory
cd /d "%~dp0"

echo Running Maven wrapper...
call .\mvnw.cmd spring-boot:run

pause
