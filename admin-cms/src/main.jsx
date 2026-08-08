
// LOCALTUNNEL BYPASS INTERCEPTOR
if (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt')) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = function (resource, config) {
    config = config || {};
    if (config.headers instanceof Headers) {
      config.headers.set('Bypass-Tunnel-Reminder', 'true');
    } else {
      config.headers = Object.assign({}, config.headers, { 'Bypass-Tunnel-Reminder': 'true' });
    }
    return originalFetch(resource, config);
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
