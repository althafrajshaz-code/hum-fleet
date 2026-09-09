const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/Dashboard.css', 'utf8');

const oldMedia = `@media (max-width: 768px) {
  .dashboard-page {
    padding-top: 68px;
    padding-bottom: 24px;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .dashboard-container {
    flex-direction: column-reverse;
    height: auto;
    gap: 16px;
  }

  .dashboard-sidebar {
    width: 100%;
    max-height: none;
    overflow-y: visible;
  }

  .dashboard-map {
    width: 100%;
    height: 280px;
    min-height: 260px;
    border-radius: 16px;
    overflow: hidden;
  }`;

const newMedia = `@media (max-width: 768px) {
  .dashboard-page {
    padding: 0;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .dashboard-container {
    display: block;
    height: 100vh;
    height: 100dvh;
  }

  .dashboard-sidebar {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    width: 100vw;
    max-width: 100vw;
    max-height: 60vh;
    overflow-y: auto;
    border-radius: 20px 20px 0 0;
    padding: 20px;
    background: var(--bg-card);
    box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
    z-index: 10;
  }

  .dashboard-map {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;
    border-radius: 0 !important;
  }`;

content = content.replace(oldMedia, newMedia);

fs.writeFileSync('d:/Althaf/hum/src/pages/Dashboard.css', content);
console.log('Fixed mobile responsiveness.');
