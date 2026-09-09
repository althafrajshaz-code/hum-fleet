const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Regex to remove ANY useEffect containing navigate_pickup near the top (and duplicate at bottom)
const regex = /useEffect\(\(\) => \{\s*if \(currentRide\) \{\s*if \(currentRide\.status === 'Accepted'\) \{[\s\S]*?\}, \[currentRide\?\.status\]\);/g;

driverContent = driverContent.replace(regex, '');

// 2. Re-inject exactly ONE copy BELOW currentRide
const anchor = 'const [currentRide, setCurrentRide] = useState(null);';
const newEffect = `  useEffect(() => {
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

if (driverContent.includes(anchor)) {
    driverContent = driverContent.replace(anchor, anchor + '\n\n' + newEffect);
    console.log('Successfully removed old effect and inserted safely.');
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
