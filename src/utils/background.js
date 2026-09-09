import { Capacitor, registerPlugin } from '@capacitor/core';
import { BackgroundMode } from '@anuradev/capacitor-background-mode';
import { LocalNotifications } from '@capacitor/local-notifications';

const HumFleet = registerPlugin('HumFleet');

const setupBackground = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await requestOverlayPermission();
        await LocalNotifications.requestPermissions();

        // Ensure the HIGH-importance channel exists (safe to call multiple times)
        if (Capacitor.getPlatform() === 'android') {
            await LocalNotifications.createChannel({
                id: 'ride_requests_6',
                name: 'Ride Requests',
                description: 'Alerts for incoming ride requests',
                importance: 5,        // IMPORTANCE_HIGH = 5 on Android
                visibility: 1,        // VISIBILITY_PUBLIC
                vibration: true,
                lights: true,
                sound: 'ride_alert_voice.wav',
            });
        }
    } catch (e) {
        console.log('Background plugins not available or permission denied', e);
    }
};

export const enableBackgroundMode = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await BackgroundMode.enable();
        await BackgroundMode.setSettings({
            title: 'HUM Fleet Online',
            text: 'Waiting for new trips...',
            icon: 'ic_launcher',
            color: '10b981',
            resume: true,
            hidden: false,
            bigText: true,
        });
        await BackgroundMode.on('activate', () => {
             BackgroundMode.disableWebViewOptimizations();
             BackgroundMode.disableBatteryOptimizations();
        });
    } catch (e) {}
};

export const disableBackgroundMode = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await BackgroundMode.disable();
    } catch (e) {}
};

export const bringToFront = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await BackgroundMode.wakeUp();
        await BackgroundMode.unlock();
        await BackgroundMode.moveToForeground();
    } catch(e) {}
};

/**
 * Show an incoming-call style full-screen notification for a new ride request.
 * On Android: fires a call-style full-screen overlay (like an incoming phone call).
 * On web/iOS: falls back to a regular local notification.
 */
export const triggerRideNotification = async (pickup, dropoff, fare = '') => {
    if (!Capacitor.isNativePlatform()) return;

    if (Capacitor.getPlatform() === 'android') {
        try {
            // Show call-style full-screen notification via native plugin
            await HumFleet.showRideCallNotification({ pickup, dropoff, fare: String(fare) });
            return;
        } catch (e) {
            console.log('Call notification failed, falling back to local:', e);
        }
    }

    // Fallback: standard local notification (iOS or if native call fails)
    try {
        const baseId = Math.floor(Math.random() * 90000) + 10000;
        await LocalNotifications.schedule({
            notifications: [
                {
                    id: baseId,
                    title: '🚗 New Trip Request!',
                    body: `📍 Pickup: ${pickup}\n🏁 Dropoff: ${dropoff}`,
                    channelId: 'ride_requests_6',
                    smallIcon: 'ic_launcher',
                    sound: 'ride_alert_voice.wav',
                    schedule: { at: new Date(Date.now() + 100) },
                }
            ]
        });
    } catch (e) {
        console.log('Notification error:', e);
    }
};

/**
 * Start the native Android background ride poller.
 * Call when driver goes ONLINE. Runs completely independently of the WebView,
 * so notifications fire even when app is minimized or screen is locked.
 */
export const startRidePoller = async (email) => {
    if (!Capacitor.isNativePlatform()) return;
    if (Capacitor.getPlatform() !== 'android') return;
    try {
        await HumFleet.startRidePoller({ email, apiBase: 'https://humfleet.xyz' });
    } catch (e) {
        console.log('startRidePoller error:', e);
    }
};

/**
 * Stop the native Android background ride poller.
 * Call when driver goes OFFLINE.
 */
export const stopRidePoller = async () => {
    if (!Capacitor.isNativePlatform()) return;
    if (Capacitor.getPlatform() !== 'android') return;
    try {
        await HumFleet.stopRidePoller();
    } catch (e) {
        console.log('stopRidePoller error:', e);
    }
};

export const requestOverlayPermission = async () => {
    if (!Capacitor.isNativePlatform()) return;
    if (Capacitor.getPlatform() !== 'android') return;
    try {
        await HumFleet.requestOverlayPermission();
    } catch (e) {
        console.log('Overlay permission error:', e);
    }
};

export { setupBackground };
