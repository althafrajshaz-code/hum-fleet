const fs = require('fs');
let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// The trip distance was not patched properly.
const oldTripDistRegex = /\/\/ Distance calculation:[^;]+:\s*8;/;
const newTripDist = `// Distance calculation including multiple stops
  const tripDistance = React.useMemo(() => {
    if (!pickupCoords || !dropoffCoords) return 8;
    let dist = 0;
    let current = pickupCoords;
    for (const stop of (stops || [])) {
      if (stop && stop.coords && stop.coords.lat && stop.coords.lng) {
        dist += getFrontendDistance(current.lat, current.lng, stop.coords.lat, stop.coords.lng);
        current = stop.coords;
      }
    }
    dist += getFrontendDistance(current.lat, current.lng, dropoffCoords.lat, dropoffCoords.lng);
    return parseFloat(dist.toFixed(1));
  }, [pickupCoords, dropoffCoords, stops]);`;

content = content.replace(oldTripDistRegex, newTripDist);

// Let's also verify that 'stops' state is declared
if (!content.includes('const [stops, setStops]')) {
  content = content.replace(
    'const [dropoffCoords, setDropoffCoords] = useState(null);',
    'const [dropoffCoords, setDropoffCoords] = useState(null);\n  const [stops, setStops] = useState([]);'
  );
}

fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
console.log('Fixed trip distance in PassengerDashboard.jsx');
