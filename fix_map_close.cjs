const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Replace the handleMessage part that closes the modal
const badLogic = `      if (event.data && event.data.type === 'MAP_LOCATION_SELECTED') {
        // Handle map modal selection
        setShowMapModal(false);
        if (mapModalTarget === 'dropoff') {
          setDropoff(event.data.address);
          setDropoffCoords({ lat: event.data.lat, lng: event.data.lng });
          setMapModalTarget(null);
          return;
        } else if (mapModalTarget === 'pickup') {
          setPickup(event.data.address);
          setPickupCoords({ lat: event.data.lat, lng: event.data.lng });
          setMapModalTarget(null);
          return;
        }`;

const goodLogic = `      if (event.data && event.data.type === 'MAP_LOCATION_SELECTED') {
        // Just update state, let the user click "Confirm" to close the modal
        if (mapModalTarget === 'dropoff') {
          setDropoff(event.data.address);
          setDropoffCoords({ lat: event.data.lat, lng: event.data.lng });
          return;
        } else if (mapModalTarget === 'pickup') {
          setPickup(event.data.address);
          setPickupCoords({ lat: event.data.lat, lng: event.data.lng });
          return;
        }`;

if (code.includes(badLogic)) {
  code = code.replace(badLogic, goodLogic);
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log('Fixed map modal closing instantly');
} else {
  console.log('Could not find the exact map modal closing logic');
}
