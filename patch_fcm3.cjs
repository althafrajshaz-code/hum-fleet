const fs = require('fs');
let code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

if (!code.includes('@capacitor/push-notifications')) {
  code = code.replace(
    /import \{ useNavigate \} from 'react-router-dom';/,
    `import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';`
  );
}

if (!code.includes('registerPushNotifications')) {
  const pushCode = `
  const registerPushNotifications = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        if (permStatus.receive !== 'granted') {
          console.warn('User denied push notification permissions');
          return;
        }

        await PushNotifications.register();

        PushNotifications.addListener('registration', async (token) => {
          console.log('Push registration success, token: ' + token.value);
          const email = localStorage.getItem('driverEmail');
          if (email) {
            try {
              await fetch(\`\${API_BASE}/api/drivers/fcm-token\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, fcmToken: token.value })
              });
            } catch (err) {
              console.error('Failed to save FCM token to backend', err);
            }
          }
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.error('Error on registration: ' + JSON.stringify(error));
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received: ' + JSON.stringify(notification));
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push action performed: ' + JSON.stringify(notification));
        });
      }
    } catch (err) {
      console.error('Push Notifications setup failed:', err);
    }
  };
`;

  code = code.replace(
    /  const goOnline = \(\) => \{/,
    pushCode + '\n  const goOnline = () => {'
  );

  code = code.replace(
    /    if \('Notification' in window && Notification.permission !== 'granted'\) \{\n      Notification.requestPermission\(\);\n    \}/,
    `    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    registerPushNotifications();`
  );
  
  fs.writeFileSync('src/pages/DriverDashboard.jsx', code);
  console.log('Successfully patched DriverDashboard.jsx');
} else {
  console.log('Already patched');
}
