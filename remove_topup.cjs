const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');
const lines = code.split('\n');

// 1. Remove "+ Top-Up" button
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('+ Top-Up')) {
    let start = i;
    while (start >= 0 && !lines[start].includes('<button')) start--;
    let end = i;
    while (end < lines.length && !lines[end].includes('</button>')) end++;
    
    if (start >= 0 && end < lines.length) {
      for (let j = start; j <= end; j++) {
        lines[j] = '';
      }
    }
  }
}

// 2. Remove the Top-Up Wallet modal
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('> Top-Up Wallet</h3>')) {
    let start = i;
    while (start >= 0 && !lines[start].includes('position: \'fixed\', inset: 0')) start--;
    start--; // Get {showTopupModal && (
    
    let end = i;
    let divCount = 1;
    while (end < lines.length) {
      end++;
      if (lines[end].includes('<div')) divCount++;
      if (lines[end].includes('</div')) divCount--;
      if (lines[end].includes(')}')) {
        if (lines[end+2] && lines[end+2].includes('CHOOSE FROM MAP MODAL')) {
          break;
        }
      }
    }
    
    if (start >= 0 && end < lines.length) {
      for (let j = start; j <= end+1; j++) {
        lines[j] = '';
      }
    }
  }
}

fs.writeFileSync('src/pages/PassengerDashboard.jsx', lines.join('\n'));
console.log('Top-Up removed!');
