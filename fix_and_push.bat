@echo off
cd /d "C:\Users\HP Pavilion\Desktop\pt"
echo === Running npm install ===
call npm install
echo === npm install done ===
echo === Git add and commit ===
"C:\Program Files\Git\cmd\git.exe" add package-lock.json
"C:\Program Files\Git\cmd\git.exe" commit -m "fix: regenerate package-lock.json for new dependencies"
echo === Git push ===
"C:\Program Files\Git\cmd\git.exe" push origin main
echo === ALL DONE ===
pause
