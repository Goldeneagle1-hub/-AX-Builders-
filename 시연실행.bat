@echo off
chcp 65001 >nul
setlocal

echo =======================================================
echo   제주민원메이트 (Jeju Minwon Mate) 시연 실행기
echo =======================================================
echo.

cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

if not exist "node_modules" (
  echo [1/3] 최초 실행 감지: 패키지를 설치합니다...
  call npm install
)

if not exist "dist\server\server\server.js" (
  echo [2/3] 프로덕션 빌드를 생성합니다...
  call npm run build
)

echo [3/3] 서버를 실행하고 브라우저를 엽니다 (http://localhost:3000) ...
start "" /B cmd /c "timeout /t 2 /nobreak >nul && (start chrome http://localhost:3000 2>nul || start http://localhost:3000)"

call npm start
pause
