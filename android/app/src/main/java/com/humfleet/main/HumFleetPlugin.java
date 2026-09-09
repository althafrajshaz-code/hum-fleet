package com.humfleet.main;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "HumFleet")
public class HumFleetPlugin extends Plugin {

    private static final String CALL_CHANNEL_ID  = "ride_call_channel";
    private static final int    NOTIFICATION_ID   = 1001;

    @PluginMethod
    public void showRideCallNotification(PluginCall call) {
        String pickup  = call.getString("pickup",  "Pickup Location");
        String dropoff = call.getString("dropoff", "Dropoff Location");
        String fare    = call.getString("fare",    "");

        createCallChannel();

        // Full-screen intent → RideCallActivity (shown when phone is locked)
        Intent fullScreenIntent = new Intent(getContext(), RideCallActivity.class);
        fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_NO_USER_ACTION);
        fullScreenIntent.putExtra("pickup", pickup);
        fullScreenIntent.putExtra("dropoff", dropoff);
        fullScreenIntent.putExtra("fare", fare);
        fullScreenIntent.putExtra("notificationId", NOTIFICATION_ID);

        int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            piFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent fullScreenPi = PendingIntent.getActivity(
                getContext(), 0, fullScreenIntent, piFlags);

        // Accept action → opens app
        Intent acceptIntent = new Intent(getContext(), RideCallActivity.class);
        acceptIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        acceptIntent.putExtra("pickup", pickup);
        acceptIntent.putExtra("dropoff", dropoff);
        acceptIntent.putExtra("fare", fare);
        acceptIntent.putExtra("notificationId", NOTIFICATION_ID);
        acceptIntent.putExtra("action", "accept");
        PendingIntent acceptPi = PendingIntent.getActivity(
                getContext(), 1, acceptIntent, piFlags);

        // Decline action → broadcast receiver that just cancels
        Intent declineIntent = new Intent("com.humfleet.RIDE_DECLINED");
        declineIntent.setPackage(getContext().getPackageName());
        PendingIntent declinePi = PendingIntent.getBroadcast(
                getContext(), 2, declineIntent, piFlags);

        String fareLabel = fare.isEmpty() ? "" : " • ₹" + fare;
        String title = "New Ride Request" + fareLabel;

        Uri soundUri = Uri.parse("android.resource://" + getContext().getPackageName() + "/raw/ride_alert_voice");

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getContext(), CALL_CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText("📍 " + pickup + "  →  " + dropoff)
                .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText("Pickup: " + pickup + "\nDrop-off: " + dropoff))
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setFullScreenIntent(fullScreenPi, true)
                .setAutoCancel(true)
                .setOngoing(true)
                .setSound(soundUri)
                .setVibrate(new long[]{0, 500, 200, 500})
                .addAction(android.R.drawable.ic_menu_call, "Accept", acceptPi)
                .addAction(android.R.drawable.ic_delete, "Decline", declinePi);

        NotificationManager nm = (NotificationManager) getContext().getSystemService(getContext().NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(NOTIFICATION_ID, builder.build());

        call.resolve();
    }

    @PluginMethod
    public void hideRideCallNotification(PluginCall call) {
        NotificationManager nm = (NotificationManager) getContext().getSystemService(getContext().NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(NOTIFICATION_ID);
        call.resolve();
    }

    /** Start the native background ride poller — call when driver goes ONLINE. */
    @PluginMethod
    public void startRidePoller(PluginCall call) {
        String email   = call.getString("email",   "");
        String apiBase = call.getString("apiBase", "https://humfleet.xyz");
        Intent intent = new Intent(getContext(), RidePollerService.class);
        intent.putExtra("email",   email);
        intent.putExtra("apiBase", apiBase);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                getContext().startForegroundService(intent);
            } else {
                getContext().startService(intent);
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start ride poller", e);
        }
    }

    /** Stop the native background ride poller — call when driver goes OFFLINE. */
    @PluginMethod
    public void stopRidePoller(PluginCall call) {
        Intent intent = new Intent(getContext(), RidePollerService.class);
        try {
            getContext().stopService(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to stop ride poller", e);
        }
    }

    @PluginMethod
    public void showFloatingWidget(PluginCall call) {
        String pickup  = call.getString("pickup",  "Pickup Location");
        String dropoff = call.getString("dropoff", "Dropoff Location");

        Intent intent = new Intent(getContext(), FloatingRideService.class);
        intent.putExtra("pickup", pickup);
        intent.putExtra("dropoff", dropoff);

        try {
            getContext().startService(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start floating service", e);
        }
    }

    @PluginMethod
    public void hideFloatingWidget(PluginCall call) {
        Intent intent = new Intent(getContext(), FloatingRideService.class);
        try {
            getContext().stopService(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to stop floating service", e);
        }
    }

    @PluginMethod
    public void requestOverlayPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!android.provider.Settings.canDrawOverlays(getContext())) {
                Intent intent = new Intent(android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getContext().getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
                call.resolve();
            } else {
                call.resolve(); // already granted
            }
        } else {
            call.resolve(); // not needed below M
        }
    }

    private void createCallChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getContext().getSystemService(getContext().NOTIFICATION_SERVICE);
            if (nm == null) return;
            // Delete old channel if exists to force sound update
            if (nm.getNotificationChannel(CALL_CHANNEL_ID) == null) {
                NotificationChannel channel = new NotificationChannel(
                        CALL_CHANNEL_ID,
                        "Ride Calls",
                        NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("Incoming ride request alerts");
                channel.enableVibration(true);
                channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                channel.enableLights(true);

                Uri soundUri = Uri.parse("android.resource://" + getContext().getPackageName() + "/raw/ride_alert_voice");
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                        .build();
                channel.setSound(soundUri, audioAttributes);

                nm.createNotificationChannel(channel);
            }
        }
    }
}
