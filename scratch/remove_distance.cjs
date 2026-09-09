const fs = require('fs');
let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const startPattern = `                  {pickup && dropoff && (\n                    <div style={{\n                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.1))',`;
const startPatternWin = startPattern.replace(/\n/g, '\r\n');

const endPattern = `                  )}\n\n                  {isIntercity && (`;
const endPatternWin = `                  )}\r\n\r\n                  {isIntercity && (`;

let replaced = false;

let idx = content.indexOf(`{bookingStep === 2 && (`);
if (idx !== -1) {
    let startIdx = content.indexOf(`                  {pickup && dropoff && (`, idx);
    let endIdx = content.indexOf(`                  )}`, startIdx + 100);
    
    if (startIdx !== -1 && endIdx !== -1) {
        // Double check this is the route distance block
        let block = content.substring(startIdx, endIdx + 20);
        if (block.includes("Calculated Route Distance")) {
             let newContent = content.substring(0, startIdx) + content.substring(endIdx + 20);
             // wait, endIdx + 20 might swallow too much.
             // Let's just do an exact index replace
             newContent = content.substring(0, startIdx) + content.substring(endIdx + 20).replace(/^[ \t\r\n]+/, '');
             fs.writeFileSync('src/pages/PassengerDashboard.jsx', newContent);
             console.log("Removed route distance block.");
             replaced = true;
        }
    }
}

if (!replaced) {
    console.log("Failed to replace");
}
