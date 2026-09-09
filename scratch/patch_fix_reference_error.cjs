const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const problematicEffect = `    useEffect(() => {
    if (currentRide) {
      if (currentRide.status === 'Accepted') {
         if (!['navigate_pickup', 'arrived', 'enter_pin'].includes(driverTripStage)) {
            setDriverTripStage('navigate_pickup');
         }
         setDriverTripStage('navigate_pickup');
      }
    }
  }, [currentRide?.status]);`;

// Remove the problematic effect from where it is now
if (driverContent.includes(problematicEffect)) {
    driverContent = driverContent.replace(problematicEffect, '');
} else {
    // Try relaxing whitespace if there are CRLF issues
    const regex = /useEffect\(\(\) => \{\s*if \(currentRide\) \{\s*if \(currentRide\.status === 'Accepted'\) \{\s*if \(\!\['navigate_pickup', 'arrived', 'enter_pin'\]\.includes\(driverTripStage\)\) \{\s*setDriverTripStage\('navigate_pickup'\);\s*\}\s*setDriverTripStage\('navigate_pickup'\);\s*\}\s*\}\s*\}, \[currentRide\?\.status\]\);/;
    driverContent = driverContent.replace(regex, '');
}

// Re-inject it safely below currentRide
const anchor = 'const [currentRide, setCurrentRide] = useState(null);';
if (driverContent.includes(anchor)) {
    driverContent = driverContent.replace(anchor, anchor + '\n\n' + problematicEffect);
    console.log('Successfully moved the effect below currentRide initialization.');
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
