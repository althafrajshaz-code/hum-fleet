@echo off
echo ==========================================
echo       HUM FLEET - 3 APK BUILDER           
echo ==========================================

set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot
set ANDROID_HOME=C:\Users\acer\AppData\Local\Android\Sdk
mkdir d:\Althaf\HUM_APKs

echo [1/3] Building Admin APK...
cd admin-cms
call npm run build
call npx cap sync
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 ( echo Error building Admin APK && exit /b %errorlevel% )
copy app\build\outputs\apk\debug\app-debug.apk d:\Althaf\HUM_APKs\HUM_Admin.apk
cd ..\..

echo [2/3] Building Passenger APK...
(
  echo VITE_APP_MODE=passenger
  echo VITE_BACKEND_URL=https://server-ashen-beta.onrender.com
  echo VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
) > .env.production
call npm run build
call npx cap sync
cd android
call gradlew clean assembleDebug
if %errorlevel% neq 0 ( echo Error building Passenger APK && exit /b %errorlevel% )
copy app\build\outputs\apk\debug\app-debug.apk d:\Althaf\HUM_APKs\HUM_Passenger.apk
cd ..

echo [3/3] Building Driver APK...
(
  echo VITE_APP_MODE=driver
  echo VITE_BACKEND_URL=https://server-ashen-beta.onrender.com
  echo VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
) > .env.production
call npm run build
call npx cap sync
cd android
call gradlew clean assembleDebug
if %errorlevel% neq 0 ( echo Error building Driver APK && exit /b %errorlevel% )
copy app\build\outputs\apk\debug\app-debug.apk d:\Althaf\HUM_APKs\HUM_Driver.apk
cd ..

echo Restoring .env.production for web...
(
  echo VITE_BACKEND_URL=https://server-ashen-beta.onrender.com
  echo VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
) > .env.production

echo ==========================================
echo        ALL 3 APKS BUILT SUCCESSFULLY!     
echo ==========================================
echo Build complete. Check d:\Althaf\HUM_APKs
