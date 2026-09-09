const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const distFunc = `const getFrontendDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
};
`;

if (!driverContent.includes('const getFrontendDistance')) {
  // Inject right before DriverDashboard component
  driverContent = driverContent.replace(
    "const DriverDashboard = () => {",
    distFunc + "\nconst DriverDashboard = () => {"
  );
  fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
  console.log("Added getFrontendDistance to DriverDashboard.jsx");
} else {
  console.log("getFrontendDistance already exists in DriverDashboard.jsx");
}
