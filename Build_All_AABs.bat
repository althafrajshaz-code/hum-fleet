@echo off
echo ==========================================
echo       HUM FLEET - 3 AAB BUILDER (PLAY STORE)
echo ==========================================

set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot
set ANDROID_HOME=C:\Users\acer\AppData\Local\Android\Sdk
mkdir d:\Althaf\HUM_AABs 2>nul

echo [1/3] Building Admin AAB...
cd admin-cms
call npm run build
call npx cap sync
cd android
call gradlew clean bundleRelease
if %errorlevel% neq 0 ( echo Error building Admin AAB && exit /b %errorlevel% )
copy app\build\outputs\bundle\release\app-release*.aab d:\Althaf\HUM_AABs\HUM_Admin.aab
cd ..\..

echo [2/3] Building Passenger AAB...
(
  echo VITE_APP_MODE=passenger
  echo VITE_BACKEND_URL=https://server-ashen-beta.onrender.com
  echo VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
) > .env.production
call npm run build
call npx cap sync
cd android
call gradlew clean bundleRelease
if %errorlevel% neq 0 ( echo Error building Passenger AAB && exit /b %errorlevel% )
copy app\build\outputs\bundle\release\app-release*.aab d:\Althaf\HUM_AABs\HUM_Passenger.aab
cd ..

echo [3/3] Building Driver AAB...
(
  echo VITE_APP_MODE=driver
  echo VITE_BACKEND_URL=https://server-ashen-beta.onrender.com
  echo VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
) > .env.production
call npm run build
call npx cap sync
cd android
call gradlew clean bundleRelease
if %errorlevel% neq 0 ( echo Error building Driver AAB && exit /b %errorlevel% )
copy app\build\outputs\bundle\release\app-release*.aab d:\Althaf\HUM_AABs\HUM_Driver.aab
cd ..

echo Restoring .env.production for web...
(
  echo VITE_BACKEND_URL=https://server-ashen-beta.onrender.com
  echo VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
) > .env.production

echo ==========================================
echo        ALL 3 AABS BUILT SUCCESSFULLY!     
echo ==========================================
echo Build complete. Check d:\Althaf\HUM_AABs
