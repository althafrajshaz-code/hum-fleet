const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Syncing Capacitor...');
  execSync('npx cap sync', { stdio: 'inherit' });
  
  console.log('Building Android APK...');
  execSync('gradlew assembleRelease', { cwd: path.join(__dirname, 'android'), stdio: 'inherit' });
  
  console.log('Copying and Uploading...');
  const apkPath = path.join(__dirname, 'android/app/build/outputs/apk/release/app-release.apk');
  const exportedDir = path.join(__dirname, 'exported_apks');
  
  fs.copyFileSync(apkPath, path.join(exportedDir, 'HUM_Passenger.apk'));
  fs.copyFileSync(apkPath, path.join(exportedDir, 'HUM_Driver.apk'));
  
  execSync('node scratch/upload_latest_apks.cjs', { stdio: 'inherit' });
  
  console.log('ALL DONE! NEW APK IS LIVE.');
} catch (e) {
  console.error('Error during build process:', e);
}
