const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function buildApp(type) {
    console.log(`\n================================`);
    console.log(`=== BUILDING ${type.toUpperCase()} APP ===`);
    console.log(`================================`);
    
    // 1. Build Vite App with env var
    console.log(`\n[1/5] Building Web App for ${type}...`);
    fs.writeFileSync('.env', `VITE_APP_MODE=${type}\nVITE_API_BASE=https://humfleet.xyz\n`);
    execSync(`npm run build`, { 
        stdio: 'inherit' 
    });

    // 2. Update Android strings.xml
    console.log(`\n[2/5] Updating Android App Name...`);
    const appName = type === 'driver' ? 'Hum Captain' : 'Hum Passenger';
    const appId = type === 'driver' ? 'com.humfleet.captain' : 'com.humfleet.passenger';
    
    const stringsPath = path.join(__dirname, 'android/app/src/main/res/values/strings.xml');
    let stringsXml = fs.readFileSync(stringsPath, 'utf8');
    stringsXml = stringsXml.replace(/<string name="app_name">.*?<\/string>/, `<string name="app_name">${appName}</string>`);
    stringsXml = stringsXml.replace(/<string name="title_activity_main">.*?<\/string>/, `<string name="title_activity_main">${appName}</string>`);
    stringsXml = stringsXml.replace(/<string name="package_name">.*?<\/string>/, `<string name="package_name">${appId}</string>`);
    stringsXml = stringsXml.replace(/<string name="custom_url_scheme">.*?<\/string>/, `<string name="custom_url_scheme">${appId}</string>`);
    fs.writeFileSync(stringsPath, stringsXml);

    // 3. Update build.gradle applicationId
    console.log(`\n[3/5] Updating Android Application ID to ${appId}...`);
    const gradlePath = path.join(__dirname, 'android/app/build.gradle');
    let gradle = fs.readFileSync(gradlePath, 'utf8');
    gradle = gradle.replace(/applicationId ".*?"/, `applicationId "${appId}"`);
    fs.writeFileSync(gradlePath, gradle);

    // 4. Update capacitor.config.json
    console.log(`\n[4/5] Syncing Capacitor Assets...`);
    const capPath = path.join(__dirname, 'capacitor.config.json');
    let capConfig = JSON.parse(fs.readFileSync(capPath, 'utf8'));
    capConfig.appId = appId;
    capConfig.appName = appName;
    fs.writeFileSync(capPath, JSON.stringify(capConfig, null, 2));

    execSync('npx cap sync android', { stdio: 'inherit' });

    // 5. Assemble Debug APK
    console.log(`\n[5/5] Compiling Android APK for ${appName}...`);
    execSync('.\\gradlew clean assembleDebug', { cwd: path.join(__dirname, 'android'), stdio: 'inherit' });

    // 6. Copy APK to root exported_apks/
    const apkPath = path.join(__dirname, 'android/app/build/outputs/apk/debug/app-debug.apk');
    const outName = type === 'driver' ? 'HUM_Captain.apk' : 'HUM_Passenger.apk';
    const outPath = path.join(__dirname, 'exported_apks', outName);
    
    // Ensure exported_apks exists
    if (!fs.existsSync(path.join(__dirname, 'exported_apks'))) {
        fs.mkdirSync(path.join(__dirname, 'exported_apks'), { recursive: true });
    }
    
    fs.copyFileSync(apkPath, outPath);
    console.log(`\n✅ SUCCESSFULLY COMPILED: ${outPath}`);
}

try {
    buildApp('driver');
    buildApp('passenger');
    
    // Restore back to main
    console.log('\n=== Restoring main Web App ===');
    const capPath = path.join(__dirname, 'capacitor.config.json');
    let capConfig = JSON.parse(fs.readFileSync(capPath, 'utf8'));
    capConfig.appId = "com.humfleet.main";
    capConfig.appName = "Hum Fleet";
    fs.writeFileSync(capPath, JSON.stringify(capConfig, null, 2));

    const stringsPath = path.join(__dirname, 'android/app/src/main/res/values/strings.xml');
    let stringsXml = fs.readFileSync(stringsPath, 'utf8');
    stringsXml = stringsXml.replace(/<string name="app_name">.*?<\/string>/, `<string name="app_name">Hum Fleet</string>`);
    stringsXml = stringsXml.replace(/<string name="title_activity_main">.*?<\/string>/, `<string name="title_activity_main">Hum Fleet</string>`);
    stringsXml = stringsXml.replace(/<string name="package_name">.*?<\/string>/, `<string name="package_name">com.humfleet.main</string>`);
    stringsXml = stringsXml.replace(/<string name="custom_url_scheme">.*?<\/string>/, `<string name="custom_url_scheme">com.humfleet.main</string>`);
    fs.writeFileSync(stringsPath, stringsXml);

    const gradlePath = path.join(__dirname, 'android/app/build.gradle');
    let gradle = fs.readFileSync(gradlePath, 'utf8');
    gradle = gradle.replace(/applicationId ".*?"/, `applicationId "com.humfleet.main"`);
    fs.writeFileSync(gradlePath, gradle);

    // Restore .env for web
    fs.writeFileSync('.env', `VITE_API_BASE=https://humfleet.xyz\n`);

    execSync(`npm run build`, { stdio: 'inherit' });
    execSync('npx cap sync android', { stdio: 'inherit' });
    
    console.log('\n=============================================');
    console.log('🎉 ALL APPS COMPILED SUCCESSFULLY!');
} catch (e) {
    console.error(e);
}
