const fs = require('fs');
const pathCss = 'd:\\Althaf\\hum\\src\\pages\\Dashboard.css';
const pathJsx = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';

// 1. Hide Scrollbar in Dashboard.css
let cssContent = fs.readFileSync(pathCss, 'utf8');
const targetScrollbar = `.dashboard-sidebar::-webkit-scrollbar { width: 6px; }
.dashboard-sidebar::-webkit-scrollbar-track { background: transparent; }
.dashboard-sidebar::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }`;
const replaceScrollbar = `.dashboard-sidebar::-webkit-scrollbar { display: none; }
.dashboard-sidebar { -ms-overflow-style: none; scrollbar-width: none; }`;

if (cssContent.includes(targetScrollbar)) {
  cssContent = cssContent.replace(targetScrollbar, replaceScrollbar);
  fs.writeFileSync(pathCss, cssContent, 'utf8');
  console.log('Scrollbar hidden.');
}

// 2. Fix Footer Height in DriverDashboard.jsx
let jsxContent = fs.readFileSync(pathJsx, 'utf8');
const targetContainer = `<div className="dashboard-container container" style={{ position: 'relative' }}>`;
const replaceContainer = `<div className="dashboard-container container" style={{ position: 'relative', height: '100dvh', maxHeight: '100dvh' }}>`;

if (jsxContent.includes(targetContainer)) {
  jsxContent = jsxContent.replace(targetContainer, replaceContainer);
  fs.writeFileSync(pathJsx, jsxContent, 'utf8');
  console.log('Footer blank space fixed.');
}
