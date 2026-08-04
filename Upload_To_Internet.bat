@echo off
echo =======================================================
echo    HUM FLEET - UPLOAD TO INTERNET (FIREBASE)
echo =======================================================
echo.
echo STEP 1: Logging you into Google...
echo (If it asks a Y/N question, type Y and press Enter)
echo.
call npx firebase-tools login
echo.
echo =======================================================
echo STEP 2: Preparing and Uploading your App...
echo =======================================================
call npm run build
call npx firebase-tools deploy --project hum-4bb7f
echo.
echo =======================================================
echo ALL DONE! YOUR APP IS NOW LIVE ON THE INTERNET!
echo =======================================================
pause
