const fs = require('fs');

let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Fix the scrollbar hiding class and make it slightly wider via negative margin
let oldContainer = `<div className="animate-fade-in delay-100" style={{ margin: '16px 0', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{\`
                    .incoming-request::-webkit-scrollbar { display: none; }
                  \`}</style>`;
let newContainer = `<div className="animate-fade-in delay-100 active-ride-card" style={{ margin: '16px -8px', width: 'calc(100% + 16px)', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{\`
                    .active-ride-card::-webkit-scrollbar { display: none; }
                  \`}</style>`;

if (content.includes(oldContainer)) {
    content = content.replace(oldContainer, newContainer);
} else {
    let old_win = oldContainer.replace(/\n/g, '\r\n');
    let new_win = newContainer.replace(/\n/g, '\r\n');
    if (content.includes(old_win)) {
        content = content.replace(old_win, new_win);
    }
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
