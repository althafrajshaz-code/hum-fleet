const fs = require('fs');
let content = fs.readFileSync('D:/Althaf/hum/src/main.jsx', 'utf8');

const oldShimRegex = /\/\/ CAPACITOR GEOLOCATION SHIM[\s\S]*?(?=\nimport \{ StrictMode \} from 'react')/g;
content = content.replace(oldShimRegex, '');

const newShim = `
// CAPACITOR GEOLOCATION SHIM
if (Capacitor.isNativePlatform() && window.navigator && window.navigator.geolocation) {
  window.navigator.geolocation.getCurrentPosition = async (success, error, options) => {
    try {
      let hasPerm = await Geolocation.checkPermissions();
      if (hasPerm.location !== 'granted' && hasPerm.location !== 'prompt') {
         // It might be denied
      }
      
      if (hasPerm.location !== 'granted') {
        hasPerm = await Geolocation.requestPermissions();
      }
      
      if (hasPerm.location !== 'granted') {
          alert('System Location Permission Denied: ' + JSON.stringify(hasPerm));
          if (error) error(new Error("Location access denied"));
          return;
      }
      
      try {
        const pos = await Geolocation.getCurrentPosition(options || { enableHighAccuracy: true });
        if (success) success(pos);
      } catch (innerErr) {
        alert('GPS Failed: ' + innerErr.message);
        if (error) error(innerErr);
      }
      
    } catch (err) {
      alert('Capacitor Error: ' + err.message);
      if (error) error(err);
    }
  };

  window.navigator.geolocation.watchPosition = (success, error, options) => {
    Geolocation.watchPosition(options || { enableHighAccuracy: true }, (pos, err) => {
      if (err && error) {
        error(err);
      } else if (pos && success) {
        success(pos);
      }
    });
    return 1;
  };
}
`;

content = content.replace("import { StrictMode } from 'react'", newShim + "\nimport { StrictMode } from 'react'");
fs.writeFileSync('D:/Althaf/hum/src/main.jsx', content, 'utf8');
