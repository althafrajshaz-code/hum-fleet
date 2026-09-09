const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const apkPath = path.join(__dirname, 'android/app/build/outputs/apk/release/app-release.apk');
const exportedDir = path.join(__dirname, 'exported_apks');

if (!fs.existsSync(exportedDir)) fs.mkdirSync(exportedDir);

try {
  console.log('--- BUILDING DRIVER (CAPTAIN) APP ---');
  execSync('set VITE_APP_MODE=driver&& npm run build', { stdio: 'inherit', env: { ...process.env, VITE_APP_MODE: 'driver' } });
  execSync('npx cap sync', { stdio: 'inherit' });
  execSync('gradlew assembleRelease', { cwd: path.join(__dirname, 'android'), stdio: 'inherit' });
  fs.copyFileSync(apkPath, path.join(exportedDir, 'HUM_Captain.apk'));
  console.log('Driver APK built and copied to HUM_Captain.apk!');

  console.log('--- BUILDING PASSENGER APP ---');
  execSync('set VITE_APP_MODE=passenger&& npm run build', { stdio: 'inherit', env: { ...process.env, VITE_APP_MODE: 'passenger' } });
  execSync('npx cap sync', { stdio: 'inherit' });
  execSync('gradlew assembleRelease', { cwd: path.join(__dirname, 'android'), stdio: 'inherit' });
  fs.copyFileSync(apkPath, path.join(exportedDir, 'HUM_Passenger.apk'));
  console.log('Passenger APK built and copied to HUM_Passenger.apk!');

  console.log('--- UPLOADING TO SERVER ---');
  const conn = new Client();
  conn.on('ready', () => {
    conn.sftp((err, sftp) => {
      if (err) throw err;
      
      console.log('Uploading HUM_Captain.apk...');
      sftp.fastPut(path.join(exportedDir, 'HUM_Captain.apk'), '/var/www/humfleet/apks/HUM_Captain.apk', (err) => {
        if (err) throw err;
        console.log('Uploaded Captain APK.');
        
        console.log('Uploading HUM_Passenger.apk...');
        sftp.fastPut(path.join(exportedDir, 'HUM_Passenger.apk'), '/var/www/humfleet/apks/HUM_Passenger.apk', (err) => {
          if (err) throw err;
          console.log('Uploaded Passenger APK.');
          
          // Also link HUM_Driver.apk to HUM_Captain.apk just in case they download the old link
          conn.exec('cp /var/www/humfleet/apks/HUM_Captain.apk /var/www/humfleet/apks/HUM_Driver.apk', (err) => {
            console.log('Done replicating Driver APK.');
            conn.end();
            console.log('ALL DONE! NEW APKS ARE LIVE!');
          });
        });
      });
    });
  }).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });

} catch (e) {
  console.error('Error during build process:', e);
}
