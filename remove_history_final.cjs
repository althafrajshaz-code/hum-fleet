const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');
const lines = code.split('\n');

// Remove the button around line 1254
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('title="Ride History"')) {
    // go backwards to find <button and forwards to find </button>
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

// Remove the modal around line 2737
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('> Ride History</h3>')) {
    // go backwards to find the modal background div
    let start = i;
    while (start >= 0 && !lines[start].includes('position: \'fixed\', inset: 0')) start--;
    // go back one more line for the {showHistoryModal && (
    start--;
    
    // go forwards to find the closing of the modal 
    let end = i;
    let divCount = 1; // we're inside the modal content
    while (end < lines.length) {
      end++;
      if (lines[end].includes('<div')) divCount++;
      if (lines[end].includes('</div')) divCount--;
      
      // when we reach the end of the history modal...
      if (lines[end].includes(')}')) {
        // check if this is the end of the modal
        // just a heuristic, let's keep going until we hit the next modal
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
console.log('History removed!');
