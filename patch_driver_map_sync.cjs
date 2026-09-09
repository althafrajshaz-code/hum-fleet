const fs = require('fs');

// 1. Update map.html
let mapHtml = fs.readFileSync('d:/Althaf/hum/public/map.html', 'utf8');
mapHtml = mapHtml.replace(
  `      if (event.data.type === 'UPDATE_CAR_LOCATION') {
        const { lat, lng } = event.data;
        if (!carMarker) {
          carMarker = L.marker([lat, lng], { icon: carIcon }).addTo(map);
        } else {
          carMarker.setLatLng([lat, lng]);
        }
      }`,
  `      if (event.data.type === 'UPDATE_CAR_LOCATION') {
        const { lat, lng, center } = event.data;
        if (!carMarker) {
          carMarker = L.marker([lat, lng], { icon: carIcon }).addTo(map);
        } else {
          carMarker.setLatLng([lat, lng]);
        }
        if (center) {
          map.setView([lat, lng], 15);
        }
      }`
);
fs.writeFileSync('d:/Althaf/hum/public/map.html', mapHtml);

// 2. Update DriverDashboard.jsx
let driverJsx = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

// Fix iframe sync
driverJsx = driverJsx.replace(
  `  // Sync maps on driver coordinates change
  useEffect(() => {
    if (driverDetails && isOnline) {
      const mapIframe = document.getElementById('driver-map-iframe');
      if (mapIframe && mapIframe.contentWindow) {
        mapIframe.contentWindow.postMessage({
          type: 'SET_DRIVER_LOCATION',
          lat: driverDetails.lat || 28.6304,
          lng: driverDetails.lng || 77.2177
        }, '*');
      }
    }
  }, [driverDetails, isOnline]);`,
  `  // Sync maps on driver coordinates change
  useEffect(() => {
    if (driverDetails && isOnline) {
      const mapIframe = document.getElementById('map-iframe');
      if (mapIframe && mapIframe.contentWindow) {
        mapIframe.contentWindow.postMessage({
          type: 'UPDATE_CAR_LOCATION',
          lat: driverDetails.lat || 28.6304,
          lng: driverDetails.lng || 77.2177,
          center: true
        }, '*');
      }
    }
  }, [driverDetails, isOnline]);`
);

// Fix driver-header-card background
driverJsx = driverJsx.replace(
  `          {/* DRIVER PROFILE & ONLINE STATUS CARD */}
          <div className="driver-header-card" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '18px 14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-md)'
          }}>`,
  `          {/* DRIVER PROFILE & ONLINE STATUS CARD */}
          <div className="driver-header-card" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '18px 14px',
            background: isOnline ? (theme === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(24, 24, 27, 0.7)') : 'var(--bg-card)',
            backdropFilter: isOnline ? 'blur(10px)' : 'none',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.3s ease'
          }}>`
);

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', driverJsx);
console.log('Fixed driver map sync and transparent header');
