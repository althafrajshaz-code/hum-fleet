@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot
set ANDROID_HOME=C:\Users\acer\AppData\Local\Android\Sdk
mkdir d:\Althaf\HUM_APKs

echo Building Captain APK...
node set-capacitor-url.cjs "https://humfleet.xyz/driver/login" "com.humfleet.captain" "Hum Captain"
call npx.cmd cap sync
cd android
call gradlew clean assembleDebug
if %errorlevel% neq 0 ( echo Error building Captain APK && exit /b %errorlevel% )
copy app\build\outputs\apk\debug\app-debug.apk d:\Althaf\HUM_APKs\HUM_Driver.apk
cd ..
echo Restoring capacitor config...
node set-capacitor-url.cjs "" "com.humfleet.main" "Hum Fleet"
echo DONE
