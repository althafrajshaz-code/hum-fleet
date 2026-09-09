package com.humfleet.main;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.content.Intent;
import android.provider.Settings;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(HumFleetPlugin.class);
        super.onCreate(savedInstanceState);
        

        createRideNotificationChannel();
    }


    private void createRideNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                "ride_requests_6",
                "Ride Requests",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Alerts for incoming ride requests");
            channel.enableVibration(true);
            channel.setShowBadge(true);
            channel.enableLights(true);

            // Custom voice sound
            Uri soundUri = Uri.parse("android.resource://" + getPackageName() + "/raw/ride_alert_voice");
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .build();
            channel.setSound(soundUri, audioAttributes);

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}
