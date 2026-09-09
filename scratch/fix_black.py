import sys

with open('android/app/src/main/java/com/humfleet/main/MainActivity.java', 'r', encoding='utf-8') as f:
    text = f.read()

to_remove = """
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
        
        requestOverlayPermission();"""

text = text.replace(to_remove, "")

method_to_remove = """
    
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
    }"""

text = text.replace(method_to_remove, "")

with open('android/app/src/main/java/com/humfleet/main/MainActivity.java', 'w', encoding='utf-8') as f:
    f.write(text)
