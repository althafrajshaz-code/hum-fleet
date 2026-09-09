package com.humfleet.main;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class RidePollerService extends Service {

    private static final String TAG              = "RidePollerService";
    private static final String FOREGROUND_CHAN  = "ride_poller_fg";
    private static final String CALL_CHAN        = "ride_call_channel";
    private static final int    FG_NOTIF_ID      = 9001;
    private static final int    CALL_NOTIF_ID    = 1001;
    private static final int    POLL_INTERVAL_MS = 4000;

    private Handler  handler;
    private Runnable pollRunnable;
    private String   driverEmail;
    private String   apiBase;
    private String   lastRideId = null;

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            driverEmail = intent.getStringExtra("email");
            apiBase     = intent.getStringExtra("apiBase");
            if (apiBase == null || apiBase.isEmpty()) apiBase = "https://humfleet.xyz";
        }
        if (driverEmail == null || driverEmail.isEmpty()) { stopSelf(); return START_NOT_STICKY; }

        createForegroundChannel();
        startForeground(FG_NOTIF_ID, buildForegroundNotification());
        createCallChannel();

        handler = new Handler(Looper.getMainLooper());
        pollRunnable = new Runnable() {
            @Override public void run() {
                pollForRide();
                handler.postDelayed(this, POLL_INTERVAL_MS);
            }
        };
        handler.post(pollRunnable);
        Log.d(TAG, "Poller started for " + driverEmail);
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (handler != null && pollRunnable != null) handler.removeCallbacks(pollRunnable);
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(CALL_NOTIF_ID);
    }

    private void pollForRide() {
        new Thread(() -> {
            try {
                String enc = URLEncoder.encode(driverEmail, "UTF-8");
                URL url = new URL(apiBase + "/api/rides/active?email=" + enc);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);
                conn.setRequestProperty("Accept", "application/json");
                int code = conn.getResponseCode();
                if (code == 200) {
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) sb.append(line);
                    br.close();
                    String body = sb.toString().trim();
                    if (body.isEmpty() || body.equals("null") || body.equals("{}") || body.equals("[]")) {
                        lastRideId = null;
                        return;
                    }
                    JSONObject ride = new JSONObject(body);
                    String rideId = ride.optString("_id", ride.optString("id", ""));
                    if (!rideId.isEmpty() && rideId.equals(lastRideId)) return;
                    lastRideId = rideId;
                    String pickup  = ride.optString("pickup",  "Pickup Location");
                    String dropoff = ride.optString("dropoff", "Dropoff Location");
                    String fare    = ride.optString("fare",    "");
                    handler.post(() -> showRideCallNotification(pickup, dropoff, fare));
                } else if (code == 404) {
                    lastRideId = null;
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.e(TAG, "Poll error: " + e.getMessage());
            }
        }).start();
    }

    private void showRideCallNotification(String pickup, String dropoff, String fare) {
        Intent fsIntent = new Intent(this, RideCallActivity.class);
        fsIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_NO_USER_ACTION);
        fsIntent.putExtra("pickup", pickup);
        fsIntent.putExtra("dropoff", dropoff);
        fsIntent.putExtra("fare", fare);
        fsIntent.putExtra("notificationId", CALL_NOTIF_ID);

        int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) piFlags |= PendingIntent.FLAG_IMMUTABLE;
        PendingIntent fsPi = PendingIntent.getActivity(this, 0, fsIntent, piFlags);

        Intent acceptIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());
        if (acceptIntent == null) acceptIntent = new Intent(this, MainActivity.class);
        acceptIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent acceptPi = PendingIntent.getActivity(this, 1, acceptIntent, piFlags);

        Intent declineIntent = new Intent("com.humfleet.RIDE_DECLINED");
        declineIntent.setPackage(getPackageName());
        PendingIntent declinePi = PendingIntent.getBroadcast(this, 2, declineIntent, piFlags);

        String fareLabel = (fare == null || fare.isEmpty()) ? "" : " • ₹" + fare;
        Uri soundUri = Uri.parse("android.resource://" + getPackageName() + "/raw/ride_alert_voice");

        try {
            Intent floatIntent = new Intent(this, FloatingRideService.class);
            floatIntent.putExtra("pickup", pickup);
            floatIntent.putExtra("dropoff", dropoff);
            startService(floatIntent);
        } catch (Exception e) {}

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CALL_CHAN)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("New Ride Request" + fareLabel)
                .setContentText("📍 " + pickup + "  →  " + dropoff)
                .setStyle(new NotificationCompat.BigTextStyle().bigText("Pickup: " + pickup + "\nDrop-off: " + dropoff))
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setFullScreenIntent(fsPi, true)
                .setAutoCancel(false)
                .setOngoing(true)
                .setSound(soundUri)
                .setVibrate(new long[]{0, 500, 200, 500, 200, 500})
                .addAction(android.R.drawable.ic_menu_call, "Accept", acceptPi)
                .addAction(android.R.drawable.ic_delete,    "Decline", declinePi);

        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(CALL_NOTIF_ID, builder.build());
    }

    private Notification buildForegroundNotification() {
        int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) piFlags |= PendingIntent.FLAG_IMMUTABLE;
        Intent launchIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());
        PendingIntent contentPi = launchIntent != null
                ? PendingIntent.getActivity(this, 0, launchIntent, piFlags) : null;
        return new NotificationCompat.Builder(this, FOREGROUND_CHAN)
                .setSmallIcon(android.R.drawable.ic_menu_directions)
                .setContentTitle("HUM Fleet Online")
                .setContentText("Waiting for new trips...")
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .setSilent(true)
                .setContentIntent(contentPi)
                .build();
    }

    private void createForegroundChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (nm == null || nm.getNotificationChannel(FOREGROUND_CHAN) != null) return;
            NotificationChannel ch = new NotificationChannel(FOREGROUND_CHAN, "HUM Fleet Status", NotificationManager.IMPORTANCE_LOW);
            ch.setSound(null, null);
            nm.createNotificationChannel(ch);
        }
    }

    private void createCallChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (nm == null || nm.getNotificationChannel(CALL_CHAN) != null) return;
            NotificationChannel ch = new NotificationChannel(CALL_CHAN, "Ride Calls", NotificationManager.IMPORTANCE_HIGH);
            ch.enableVibration(true);
            ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            ch.enableLights(true);
            Uri soundUri = Uri.parse("android.resource://" + getPackageName() + "/raw/ride_alert_voice");
            AudioAttributes aa = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE).build();
            ch.setSound(soundUri, aa);
            nm.createNotificationChannel(ch);
        }
    }
}
