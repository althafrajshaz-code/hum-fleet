const fs = require('fs');
let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

let uiClearStart = content.indexOf(`    // Clear UI instantly`);
let tryCatchStart = content.indexOf(`    try {\r\n      await fetch(\`\${API_BASE}/api/rides/\${rideId}/rate-driver\``, uiClearStart);
if (tryCatchStart === -1) {
    tryCatchStart = content.indexOf(`    try {\n      await fetch(\`\${API_BASE}/api/rides/\${rideId}/rate-driver\``, uiClearStart);
}

if (uiClearStart !== -1 && tryCatchStart !== -1) {
    let tryCatchEnd = content.indexOf(`    }\r\n`, tryCatchStart);
    if (tryCatchEnd === -1) tryCatchEnd = content.indexOf(`    }\n`, tryCatchStart);
    tryCatchEnd += 6; 

    let fetchBlock = content.substring(tryCatchStart, tryCatchEnd);
    let beforeUiClear = content.substring(0, uiClearStart);
    let betweenBlocks = content.substring(uiClearStart, tryCatchStart);
    let afterFetch = content.substring(tryCatchEnd);

    content = beforeUiClear + fetchBlock + `\n` + betweenBlocks.replace(`// Clear UI instantly`, `// Clear UI AFTER server has processed it`) + afterFetch;

    let fetchActiveTarget = `        if (data) {\r\n          setActiveRide(data);`;
    if (!content.includes(fetchActiveTarget)) {
        fetchActiveTarget = `        if (data) {\n          setActiveRide(data);`;
    }
    
    let idx = content.indexOf(fetchActiveTarget);
    if (idx !== -1) {
        let blockEnd = content.indexOf(`        }\r\n      }`, idx);
        if (blockEnd === -1) blockEnd = content.indexOf(`        }\n      }`, idx);
        
        if (blockEnd !== -1) {
            let prefix = content.substring(0, blockEnd + 9);
            let suffix = content.substring(blockEnd + 9);
            content = prefix + ` else {\n          setActiveRide(null);\n        }\n` + suffix;
            fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
            console.log("Successfully fixed both issues.");
        } else {
            console.log("Could not find block end for fetchPassengerActiveRide");
        }
    } else {
        console.log("Could not find fetchPassengerActiveRide target");
    }
} else {
    console.log("Could not find blocks:", uiClearStart, tryCatchStart);
}
