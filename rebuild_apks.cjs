const { Client } = require('ssh2');
const c = new Client();

c.on('ready', () => {
  console.log('Removing stuck APK from assets and rebuilding...');
  const cmd = [
    'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64',
    'export ANDROID_HOME=/root/android-sdk',
    'export PATH=$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/35.0.0:/usr/local/bin:$PATH',
    'echo "sdk.dir=/root/android-sdk" > /root/hum-fleet/android/local.properties',

    // Remove the stuck massive APK from Android assets
    'rm -rf /root/hum-fleet/android/app/src/main/assets/public/apks/',
    'echo "Cleared assets/public/apks"',

    // Also make sure public/apks is clean (no APKs)
    'rm -f /root/hum-fleet/public/apks/HUM_Driver.apk /root/hum-fleet/public/apks/HUM_Passenger.apk',
    'rm -f /root/hum-fleet/public/apks/HUM_Driver_v2.apk',

    // ====== BUILD DRIVER APK ======
    'echo "=== Building DRIVER APK ==="',
    'cd /root/hum-fleet',
    'VITE_APP_MODE=driver npx vite build 2>&1 | tail -3',
    'npx cap sync android 2>&1 | tail -3',
    'echo "Assets size after sync:"',
    'du -sh /root/hum-fleet/android/app/src/main/assets/',
    'cd android',
    './gradlew clean assembleRelease 2>&1 | tail -5',
    'ls -lh app/build/outputs/apk/release/app-release.apk',
    'cp app/build/outputs/apk/release/app-release.apk /root/apks_backup/HUM_Driver_slim.apk',

    // ====== BUILD PASSENGER APK ======
    'echo "=== Building PASSENGER APK ==="',
    'rm -rf /root/hum-fleet/android/app/src/main/assets/public/',
    'cd /root/hum-fleet',
    'VITE_APP_MODE=passenger npx vite build 2>&1 | tail -3',
    'npx cap sync android 2>&1 | tail -3',
    'echo "Assets size after sync:"',
    'du -sh /root/hum-fleet/android/app/src/main/assets/',
    'cd android',
    './gradlew clean assembleRelease 2>&1 | tail -5',
    'ls -lh app/build/outputs/apk/release/app-release.apk',
    'cp app/build/outputs/apk/release/app-release.apk /root/apks_backup/HUM_Passenger_slim.apk',

    // Restore original APKs to public folder and deploy slim ones to web
    'cp /root/apks_backup/HUM_Driver.apk /root/hum-fleet/public/apks/ 2>/dev/null || true',
    'cp /root/apks_backup/HUM_Passenger.apk /root/hum-fleet/public/apks/ 2>/dev/null || true',
    'cp /root/apks_backup/HUM_Driver_slim.apk /var/www/humfleet/apks/HUM_Driver.apk',
    'cp /root/apks_backup/HUM_Passenger_slim.apk /var/www/humfleet/apks/HUM_Passenger.apk',

    'echo "=== ALL DONE ==="',
    'ls -lh /var/www/humfleet/apks/',
  ].join(' && ');

  c.exec(cmd, (err, stream) => {
    if (err) { console.error(err); c.end(); return; }
    stream.on('close', (code) => {
      console.log('Done, code:', code);
      c.end();
    }).on('data', d => process.stdout.write('' + d))
      .stderr.on('data', d => process.stderr.write('ERR: ' + d));
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
