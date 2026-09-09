const fs = require('fs');

let mainActivity = fs.readFileSync('android/app/src/main/java/com/humfleet/main/MainActivity.java', 'utf8');

if (!mainActivity.includes('requestOverlayPermission')) {
    let imports = `import android.content.Intent;
import android.provider.Settings;
import android.view.WindowManager;`;

    mainActivity = mainActivity.replace('import android.os.Bundle;', 'import android.os.Bundle;\n' + imports);

    let oncreate = `
        super.onCreate(savedInstanceState);
        
        // Turn screen on and bypass lock screen
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            );
        }
        
        requestOverlayPermission();
`;
    
    mainActivity = mainActivity.replace('super.onCreate(savedInstanceState);', oncreate);

    let requestMethod = `
    private void requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                try {
                    Intent intent = new Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getPackageName())
                    );
                    startActivityForResult(intent, 1234);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
`;

    mainActivity = mainActivity.replace('private void createRideNotificationChannel()', requestMethod + '\n    private void createRideNotificationChannel()');

    fs.writeFileSync('android/app/src/main/java/com/humfleet/main/MainActivity.java', mainActivity);
    console.log("Patched MainActivity.java");
}
