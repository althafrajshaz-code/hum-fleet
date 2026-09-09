const fs = require('fs');
let content = fs.readFileSync('D:/Althaf/hum/src/main.jsx', 'utf8');

const shim = `
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

// CAPACITOR GEOLOCATION SHIM
if (Capacitor.isNativePlatform()) {
  window.navigator.geolocation = {
    getCurrentPosition: async (success, error, options) => {
      try {
        let hasPerm = await Geolocation.checkPermissions();
        if (hasPerm.location !== 'granted') {
          hasPerm = await Geolocation.requestPermissions();
        }
        if (hasPerm.location !== 'granted') {
            if (error) error(new Error("Location access denied"));
            return;
        }
        const pos = await Geolocation.getCurrentPosition(options || { enableHighAccuracy: true });
        if (success) success(pos);
      } catch (err) {
        if (error) error(err);
      }
    },
    watchPosition: (success, error, options) => {
      let watchIdPromise = Geolocation.watchPosition(options || { enableHighAccuracy: true }, (pos, err) => {
        if (err && error) {
          error(err);
        } else if (pos && success) {
          success(pos);
        }
      });
      return 1;
    },
    clearWatch: (id) => {}
  };
}
`;

if (!content.includes('CAPACITOR GEOLOCATION SHIM')) {
  content = content.replace("import { StrictMode } from 'react'", shim + "\nimport { StrictMode } from 'react'");
  fs.writeFileSync('D:/Althaf/hum/src/main.jsx', content, 'utf8');
  console.log('Shim injected');
}
