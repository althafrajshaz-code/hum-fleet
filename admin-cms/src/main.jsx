

// LOCALTUNNEL BYPASS INTERCEPTOR
const originalFetch = window.fetch;
window.fetch = async function () {
  let [resource, config] = arguments;
  if (!config) config = {};
  if (!config.headers) config.headers = {};
  config.headers['Bypass-Tunnel-Reminder'] = 'true';
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
