const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Fix the "waiting for ride from 8 kms" banner:
content = content.replace("Waiting for Incoming Rides under 8.0 KM...", "{`Destination: ${currentRide.dropoff.split(',')[0]}`}");
// Actually, they wanted to REMOVE the whole banner if there is no currentRide!
// The original patch replaced `(isOnline) && (` with `(isOnline && currentRide) && (`
// Let's do that robustly:
const bannerRegex = /\{\(isOnline\)\s*&&\s*\(\s*<div[^>]*>\s*\{currentRide \? [^:]+ : '[^']+'\}\s*<\/div>\s*\)\}/m;

content = content.replace(
  "{currentRide ? `Destination: ${currentRide.dropoff.split(',')[0]}` : 'Waiting for Incoming Rides under 8.0 KM...'}",
  "{`Destination: ${currentRide.dropoff.split(',')[0]}`}"
);
content = content.replace(
  "{(isOnline) && (\n            <div style={{",
  "{(isOnline && currentRide) && (\n            <div style={{"
);
content = content.replace(
  "{(isOnline) && (\r\n            <div style={{",
  "{(isOnline && currentRide) && (\n            <div style={{"
);


fs.writeFileSync('src/pages/DriverDashboard.jsx', content, 'utf8');
console.log('Fixed banner!');
