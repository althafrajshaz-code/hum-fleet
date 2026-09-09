package com.humfleet.main;

import android.app.Activity;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.ImageButton;
import android.widget.Toast;

public class RideCallActivity extends Activity {

    private Handler autoDeclineHandler = new Handler(Looper.getMainLooper());
    private Runnable autoDeclineRunnable;
    private int notificationId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Wake up and show over lock screen
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            );
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        setContentView(R.layout.activity_ride_call);

        String pickup  = getIntent().getStringExtra("pickup");
        String dropoff = getIntent().getStringExtra("dropoff");
        String fare    = getIntent().getStringExtra("fare");
        notificationId = getIntent().getIntExtra("notificationId", 1001);

        TextView tvPickup  = findViewById(R.id.tv_call_pickup);
        TextView tvDropoff = findViewById(R.id.tv_call_dropoff);
        TextView tvFare    = findViewById(R.id.tv_call_fare);
        TextView tvTimer   = findViewById(R.id.tv_call_timer);

        if (pickup  != null) tvPickup.setText(pickup);
        if (dropoff != null) tvDropoff.setText(dropoff);
        if (fare    != null) tvFare.setText("₹" + fare);

        // 30-second countdown timer
        final int[] seconds = {30};
        tvTimer.setText("30s");
        Handler countdownHandler = new Handler(Looper.getMainLooper());
        Runnable countdownRunnable = new Runnable() {
            @Override
            public void run() {
                seconds[0]--;
                tvTimer.setText(seconds[0] + "s");
                if (seconds[0] <= 0) {
                    dismissCall();
                } else {
                    countdownHandler.postDelayed(this, 1000);
                }
            }
        };
        countdownHandler.postDelayed(countdownRunnable, 1000);

        // Accept button
        ImageButton btnAccept = findViewById(R.id.btn_call_accept);
        btnAccept.setOnClickListener(v -> {
            countdownHandler.removeCallbacks(countdownRunnable);
            cancelNotification();
            // Open the main app
            Intent launchIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(launchIntent);
            }
            // Broadcast accept action so JS side can know
            Intent acceptIntent = new Intent("com.humfleet.RIDE_ACCEPTED");
            sendBroadcast(acceptIntent);
            finish();
        });

        // Decline button
        ImageButton btnDecline = findViewById(R.id.btn_call_decline);
        btnDecline.setOnClickListener(v -> {
            countdownHandler.removeCallbacks(countdownRunnable);
            dismissCall();
        });
    }

    private void dismissCall() {
        cancelNotification();
        // Broadcast decline action so JS side can mark driver as busy/skip
        Intent declineIntent = new Intent("com.humfleet.RIDE_DECLINED");
        sendBroadcast(declineIntent);
        finish();
    }

    private void cancelNotification() {
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(notificationId);
        // Also stop floating service if running
        try { stopService(new Intent(this, FloatingRideService.class)); } catch (Exception e) {}
    }
}
