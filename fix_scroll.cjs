const fs = require('fs');
let css = fs.readFileSync('src/pages/Dashboard.css', 'utf8');

// Replace hidden scrollbars with thin, visible ones
css = css.replace(/scrollbar-width: none;/g, 'scrollbar-width: thin; scrollbar-color: var(--primary) transparent;');
css = css.replace(/\.dashboard-sidebar::-webkit-scrollbar\s*\{\s*display:\s*none;\s*\}/g, '.dashboard-sidebar::-webkit-scrollbar { width: 6px; }\n.dashboard-sidebar::-webkit-scrollbar-track { background: transparent; }\n.dashboard-sidebar::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }');

// Add scroll indicator (drag handle pill) for mobile sidebar
const handleCss = `
  .dashboard-sidebar {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: 60vh;
    max-height: 60vh;
    overflow-y: auto;
    padding-bottom: 20px;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
  }

  .dashboard-sidebar::before {
    content: '';
    display: block;
    width: 40px;
    height: 5px;
    background: var(--border);
    border-radius: 10px;
    margin: -10px auto 15px auto;
  }
`;

css = css.replace(/\.dashboard-sidebar\s*\{\s*position:\s*relative;\s*top:\s*auto;\s*left:\s*auto;\s*width:\s*100%;\s*height:\s*60vh;\s*max-height:\s*60vh;\s*overflow-y:\s*auto;\s*padding-bottom:\s*20px;\s*border-radius:\s*20px 20px 0 0;\s*box-shadow:\s*0 -4px 15px rgba\(0,0,0,0\.1\);\s*\}/, handleCss);

fs.writeFileSync('src/pages/Dashboard.css', css, 'utf8');
console.log('Fixed Scrollbars');
