const fs = require('fs');

let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

if (!content.includes("const HumFleet = registerPlugin('HumFleet');")) {
    content = content.replace("import { registerPlugin } from '@capacitor/core';", "");
    content = content.replace("import { setupBackground", "import { registerPlugin } from '@capacitor/core';\nconst HumFleet = registerPlugin('HumFleet');\nimport { setupBackground");
}

let oldCall = `bringToFront(); triggerRideNotification(data.pickup || 'Current Location', data.dropoff || 'their destination');`;
let newCall = `HumFleet.showFloatingWidget({ pickup: data.pickup || 'Current Location', dropoff: data.dropoff || 'their destination' }).catch(e=>console.log(e));\n                  triggerRideNotification(data.pickup || 'Current Location', data.dropoff || 'their destination');`;

if (content.includes(oldCall)) {
    content = content.replace(oldCall, newCall);
    fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
    console.log("Patched DriverDashboard.jsx");
} else {
    console.log("Could not find oldCall");
}
