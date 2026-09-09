

// LOCALTUNNEL BYPASS INTERCEPTOR
const originalFetch = window.fetch;
window.fetch = async function () {
  let [resource, config] = arguments;
  const url = typeof resource === 'string' ? resource : (resource?.url || '');
  
  if (!config) config = {};
  
  // Only add the bypass header for non-Google/Firebase requests
  // Otherwise Firebase authentication requests will fail with CORS errors
  if (!url.includes('googleapis.com') && !url.includes('firebase')) {
    if (!config.headers) config.headers = {};
    config.headers['Bypass-Tunnel-Reminder'] = 'true';
  }
  
  return originalFetch(resource, config);
};

import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';





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

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
