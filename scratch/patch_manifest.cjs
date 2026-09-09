const fs = require('fs');
let manifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');

if (!manifest.includes('android.permission.SYSTEM_ALERT_WINDOW')) {
    manifest = manifest.replace(
        '</manifest>',
        '    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />\n' +
        '    <uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />\n' +
        '    <uses-permission android:name="android.permission.WAKE_LOCK" />\n' +
        '    <uses-permission android:name="android.permission.DISABLE_KEYGUARD" />\n' +
        '</manifest>'
    );
    fs.writeFileSync('android/app/src/main/AndroidManifest.xml', manifest);
    console.log("Patched manifest");
}
