const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Find the start of the block
let startPattern = `              {/* Active ride card`;
let idxStart = content.indexOf(startPattern);
if (idxStart === -1) {
    console.log("Could not find start pattern.");
}

if (idxStart !== -1) {
    let idxEnd = content.indexOf(`              {/* Offline status screen */}`, idxStart);
    if (idxEnd === -1) {
       idxEnd = content.indexOf(`              {/* Available Pre-booked Trips Section`, idxStart);
    }

    if (idxEnd !== -1) {
        // Extract the block
        let block = content.substring(idxStart, idxEnd);
        
        // Remove it from the current position
        content = content.substring(0, idxStart) + content.substring(idxEnd);
        
        // Insert it at the top
        let targetPattern = `          {/* DRIVER PROFILE & ONLINE STATUS CARD */}`;
        let targetIdx = content.indexOf(targetPattern);
        if (targetIdx !== -1) {
            content = content.substring(0, targetIdx) + block + `\n` + content.substring(targetIdx);
            fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
            console.log("Moved active ride card to the top successfully.");
        } else {
            console.log("Could not find target pattern.");
        }
    } else {
        console.log("Could not find end of block.");
    }
}
