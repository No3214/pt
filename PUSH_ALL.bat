@echo off
chcp 65001 >nul
echo ============================================
echo   PT - PUSH ALL CHANGES TO GITHUB
echo ============================================

:: Navigate to the folder where this bat file lives
pushd "%~dp0"
echo Working in: %CD%

:: Fix any stuck git state
echo.
echo [1/5] Cleaning git state...
"C:\Program Files\Git\cmd\git.exe" am --abort 2>nul
"C:\Program Files\Git\cmd\git.exe" rebase --abort 2>nul
"C:\Program Files\Git\cmd\git.exe" merge --abort 2>nul

:: Remove any lock files
del /f ".git\index.lock" 2>nul
del /f ".git\rebase-apply" 2>nul

:: Show status
echo.
echo [2/5] Current status:
"C:\Program Files\Git\cmd\git.exe" status --short

:: Stage everything
echo.
echo [3/5] Staging all changes...
"C:\Program Files\Git\cmd\git.exe" add -A

:: Commit
echo.
echo [4/5] Committing...
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: 13-language i18n, multilingual SEO, auto-detect, RTL support, admin login route"

:: Push
echo.
echo [5/5] Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push origin main

echo.
echo ============================================
echo   DONE! Check output above for errors.
echo ============================================
popd
pause
