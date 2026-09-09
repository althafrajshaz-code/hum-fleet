const fs = require('fs');
let c = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

if (!c.includes('completedRideData')) {
  // 1. Add state
  c = c.replace(
    'const [showRating, setShowRating] = useState(false);',
    'const [showRating, setShowRating] = useState(false);\n  const [completedRideData, setCompletedRideData] = useState(null);'
  );

  // 2. Update handleCompleteRide
  c = c.replace(
    /if \(response\.ok\) \{\s*setShowEndTripSummary\(false\);\s*setShowRating\(true\);/,
    `if (response.ok) {\n        setCompletedRideData({ ...currentRide, status: 'Completed' });\n        setShowEndTripSummary(false);\n        setCurrentRide(null);\n        setShowRating(true);`
  );

  // 3. Update handleSubmitRating
  c = c.replace(
    /setShowRating\(false\);\s*setRatingValue\(5\);\s*setRatingComment\(''\);/,
    `setShowRating(false);\n      setCompletedRideData(null);\n      setRatingValue(5);\n      setRatingComment('');`
  );

  // 4. Update JSX rendering for Rating
  c = c.replace(
    '{(showRating && currentRide) ? (',
    '{(showRating && (currentRide || completedRideData)) ? ('
  );

  c = c.replace(
    /<h2>Rate Passenger<\/h2>\s*<p>How was your trip with \{currentRide\.passengerName\}\?<\/p>/g,
    `<h2>Rate Passenger</h2>\n            <p>How was your trip with {(currentRide || completedRideData).passengerName}?</p>`
  );

  c = c.replace(
    /onClick=\{\(\) => handleSubmitRating\(currentRide\.id, 'driver'\)\}/g,
    `onClick={() => handleSubmitRating((currentRide || completedRideData).id, 'driver')}`
  );
  
  c = c.replace(
    /const targetRide = currentRide;/g,
    'const targetRide = currentRide || completedRideData;'
  );

  fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', c);
  console.log('Ride completion patched');
}
