const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GRADLE_FILE = path.join(__dirname, 'android', 'app', 'build.gradle');
const STRINGS_FILE = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
const CAPACITOR_CONFIG = path.join(__dirname, 'capacitor.config.json');
const APK_OUTPUT = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const EXPORTED_DIR = path.join(__dirname, 'exported_apks');

// Save originals
const originalGradle = fs.readFileSync(GRADLE_FILE, 'utf8');
const originalStrings = fs.readFileSync(STRINGS_FILE, 'utf8');
const originalCapConfig = fs.readFileSync(CAPACITOR_CONFIG, 'utf8');

function setAppConfig(appId, appName, remoteUrl) {
  let gradle = originalGradle;
  gradle = gradle.replace(/applicationId "[^"]*"/, `applicationId "${appId}"`);
  fs.writeFileSync(GRADLE_FILE, gradle, 'utf8');

  let strings = originalStrings;
  strings = strings.replace(/<string name="app_name">.*<\/string>/, `<string name="app_name">${appName}</string>`);
  strings = strings.replace(/<string name="title_activity_main">.*<\/string>/, `<string name="title_activity_main">${appName}</string>`);
  strings = strings.replace(/<string name="package_name">.*<\/string>/, `<string name="package_name">${appId}</string>`);
  strings = strings.replace(/<string name="custom_url_scheme">.*<\/string>/, `<string name="custom_url_scheme">${appId}</string>`);
  fs.writeFileSync(STRINGS_FILE, strings, 'utf8');
  
  let capConfig = JSON.parse(originalCapConfig);
  capConfig.appId = appId;
  capConfig.appName = appName;
  capConfig.server = capConfig.server || {};
  if (remoteUrl) {
    capConfig.server.url = remoteUrl;
    capConfig.server.cleartext = true;
    capConfig.server.allowNavigation = ["humfleet.xyz", "*.humfleet.xyz"];
    capConfig.plugins = capConfig.plugins || {};
    capConfig.plugins.SplashScreen = {
      launchShowDuration: 3000,
      launchAutoHide: true
    };
  } else {
    delete capConfig.server.url;
  }
  fs.writeFileSync(CAPACITOR_CONFIG, JSON.stringify(capConfig, null, 2), 'utf8');
}

function restoreOriginals() {
  fs.writeFileSync(GRADLE_FILE, originalGradle, 'utf8');
  fs.writeFileSync(STRINGS_FILE, originalStrings, 'utf8');
  fs.writeFileSync(CAPACITOR_CONFIG, originalCapConfig, 'utf8');
}

function run(cmd, env) {
  console.log(`\n>> ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', cwd: __dirname, env: { ...process.env, ...env } });
}

if (!fs.existsSync(EXPORTED_DIR)) fs.mkdirSync(EXPORTED_DIR, { recursive: true });

try {
  console.log('\n====== BUILDING PASSENGER APK ======\n');
  setAppConfig('com.humfleet.passenger', 'HUM Passenger', 'https://humfleet.xyz/passenger/login');
  run('npm run build', { VITE_APP_MODE: 'passenger', VITE_API_BASE: 'https://humfleet.xyz' });
  run('npx cap sync android');
  execSync('.\\gradlew.bat clean assembleDebug', { stdio: 'inherit', cwd: path.join(__dirname, 'android') });
  fs.copyFileSync(APK_OUTPUT, path.join(EXPORTED_DIR, 'HUM_Passenger.apk'));
  
  console.log('\n====== BUILDING CAPTAIN APK ======\n');
  setAppConfig('com.humfleet.captain', 'HUM Captain', 'https://humfleet.xyz/driver/login');
  run('npm run build', { VITE_APP_MODE: 'driver', VITE_API_BASE: 'https://humfleet.xyz' });
  run('npx cap sync android');
  execSync('.\\gradlew.bat clean assembleDebug', { stdio: 'inherit', cwd: path.join(__dirname, 'android') });
  fs.copyFileSync(APK_OUTPUT, path.join(EXPORTED_DIR, 'HUM_Captain.apk'));
  
  console.log('\n====== RESTORING WEB BUILD ======\n');
  restoreOriginals();
  run('npm run build');
  
  console.log('\n====== ALL DONE ======');
} catch (err) {
  console.error('BUILD FAILED:', err.message);
  restoreOriginals();
  process.exit(1);
}
