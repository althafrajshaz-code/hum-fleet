const fs = require('fs');

let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

let idx1 = content.indexOf(`{/* DRIVER PROFILE & ONLINE STATUS CARD`);
let idx2 = content.indexOf(`) : (`, idx1);

if (idx1 !== -1 && idx2 !== -1) {
    let fallbackEndMarker = `{showMainMenu && (<>`;
    let idx4 = content.indexOf(fallbackEndMarker, idx2);
    if (idx4 !== -1) {
        let chunk = content.substring(idx2 + 5, idx4);
        let lastBracket = chunk.lastIndexOf(`)}`);
        if (lastBracket !== -1) {
            chunk = chunk.substring(0, lastBracket) + chunk.substring(lastBracket + 2);
        }
        let newContent = content.substring(0, idx1) + 
                         `{/* DRIVER PROFILE & ONLINE STATUS CARD */}\n` +
                         chunk + 
                         fallbackEndMarker + 
                         content.substring(idx4 + fallbackEndMarker.length);
        fs.writeFileSync('src/pages/DriverDashboard.jsx', newContent);
        console.log("Successfully removed toggle logic with fallback!");
    } else {
        console.log("Could not find fallback end marker.");
    }
} else {
    console.log("Could not find start markers", idx1, idx2);
}
