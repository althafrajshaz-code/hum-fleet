const fs = require('fs');

let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Find all occurrences of the useEffect
const target = `  useEffect(() => {
    if (currentRide) {
      if (currentRide.status === 'Accepted') {
         if (!['navigate_pickup', 'arrived', 'enter_pin'].includes(driverTripStage)) {
            setDriverTripStage('navigate_pickup');
         }
      } else {
         setDriverTripStage('navigate_pickup');
      }
    }
  }, [currentRide?.status]);`;

const target2 = `  useEffect(() => {
    if (currentRide) {
      if (currentRide.status === 'Accepted') {
         if (!['navigate_pickup', 'arrived', 'enter_pin'].includes(driverTripStage)) {
            setDriverTripStage('navigate_pickup');
         }
      } else {
         setDriverTripStage('navigate_pickup');
      }
    }
  }, [currentRide?.status]);`;

// I will just use regex to remove ALL of them, and then append EXACTLY ONE after currentRide
content = content.replace(/useEffect\(\(\) => \{\s*if \(currentRide\) \{\s*if \(currentRide\.status === 'Accepted'\) \{\s*if \(!\['navigate_pickup', 'arrived', 'enter_pin'\]\.includes\(driverTripStage\)\) \{\s*setDriverTripStage\('navigate_pickup'\);\s*\}\s*\} else \{\s*setDriverTripStage\('navigate_pickup'\);\s*\}\s*\}\s*\}, \[currentRide\?\.status\]\);/g, '');

const anchor = 'const [currentRide, setCurrentRide] = useState(null);';
if (content.includes(anchor)) {
    content = content.replace(anchor, anchor + '\n\n' + target);
    console.log('Fixed DriverDashboard.jsx');
} else {
    console.log('Anchor not found');
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', content, 'utf8');
