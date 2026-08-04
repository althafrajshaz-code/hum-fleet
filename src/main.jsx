

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
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
