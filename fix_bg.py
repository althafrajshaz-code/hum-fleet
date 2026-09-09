import os
content = '''import { Capacitor } from '@capacitor/core';
import { BackgroundMode } from '@anuradev/capacitor-background-mode';
import { LocalNotifications } from '@capacitor/local-notifications';

const setupBackground = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await LocalNotifications.requestPermissions();
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

export const triggerRideNotification = async (pickup, dropoff) => {
    if (!Capacitor.isNativePlatform()) return;
    try {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'New Trip Request!',
                    body: Pickup:  \\nDropoff: ,
                    id: new Date().getTime(),
                    schedule: { at: new Date(Date.now() + 100) },
                    actionTypeId: '',
                    extra: null,
                    sound: 'default'
                }
            ]
        });
    } catch (e) {}
};

export { setupBackground };'''

with open('src/utils/background.js', 'w', encoding='utf-8') as f:
    f.write(content)
