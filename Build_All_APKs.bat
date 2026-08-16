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
call npx.cmd cap sync
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 ( echo Error building Admin APK && exit /b %errorlevel% )
copy app\build\outputs\apk\debug\app-debug.apk d:\Althaf\HUM_APKs\HUM_Admin.apk
cd ..\..

echo [2/3] Building Passenger APK...
node set-capacitor-url.cjs "https://hum-cyan.vercel.app/passenger" "com.humfleet.passenger" "Hum Fleet Passenger"
call npx.cmd cap sync
cd android
call gradlew clean assembleDebug
if %errorlevel% neq 0 ( echo Error building Passenger APK && exit /b %errorlevel% )
copy app\build\outputs\apk\debug\app-debug.apk d:\Althaf\HUM_APKs\HUM_Passenger.apk
cd ..

echo [3/3] Building Driver APK...
node set-capacitor-url.cjs "https://hum-cyan.vercel.app/driver" "com.humfleet.captain" "Hum Fleet Driver"
call npx.cmd cap sync
cd android
call gradlew clean assembleDebug
if %errorlevel% neq 0 ( echo Error building Driver APK && exit /b %errorlevel% )
copy app\build\outputs\apk\debug\app-debug.apk d:\Althaf\HUM_APKs\HUM_Driver.apk
cd ..

echo Restoring capacitor config...
node set-capacitor-url.cjs "" "com.humfleet.main" "Hum Fleet"

echo ==========================================
echo        ALL 3 APKS BUILT SUCCESSFULLY!     
echo ==========================================
echo Build complete. Check d:\Althaf\HUM_APKs
