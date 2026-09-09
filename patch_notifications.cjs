const fs = require('fs');
let c = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

if (!c.includes("if (Notification.permission !== 'granted')")) {
  // Request notification permission on mount
  c = c.replace(
    /useEffect\(\(\) => \{\s*const token = localStorage\.getItem\('token'\);/,
    `useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') Notification.requestPermission();
    }
    const token = localStorage.getItem('token');`
  );

  // Add system notification in poll
  c = c.replace(
    /hasActiveRideRef\.current = true;\s*try \{/,
    `hasActiveRideRef.current = true;
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('New Ride Request!', { body: 'Open HUM Fleet to view the destination.', vibrate: [200, 100, 200] });
              }
              try {`
  );

  fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', c);
  console.log('Notification patched');
}
