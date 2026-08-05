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
node set-capacitor-url.cjs "https://hum-8p7vgcaqv-althafrajshaz-codes-projects.vercel.app/passenger"
call npx cap sync
cd android
call gradlew clean bundleRelease
if %errorlevel% neq 0 ( echo Error building Passenger AAB && exit /b %errorlevel% )
copy app\build\outputs\bundle\release\app-release.aab d:\Althaf\HUM_AABs\HUM_Passenger.aab
cd ..

echo [3/3] Building Driver AAB...
node set-capacitor-url.cjs "https://hum-8p7vgcaqv-althafrajshaz-codes-projects.vercel.app/driver"
call npx cap sync
cd android
call gradlew clean bundleRelease
if %errorlevel% neq 0 ( echo Error building Driver AAB && exit /b %errorlevel% )
copy app\build\outputs\bundle\release\app-release.aab d:\Althaf\HUM_AABs\HUM_Driver.aab
cd ..

echo Restoring capacitor config...
node set-capacitor-url.cjs

echo ==========================================
echo        ALL 3 AABS BUILT SUCCESSFULLY!     
echo ==========================================
echo Build complete. Check d:\Althaf\HUM_AABs
