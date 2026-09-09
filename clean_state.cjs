const fs = require('fs');
const file = '/root/hum-fleet/server/humFleetState.json';
const state = JSON.parse(fs.readFileSync(file, 'utf8'));

let cleaned = 0;
for (const ride of state.activeRides) {
  if (['Completed', 'Cancelled', 'Driver Cancelled'].includes(ride.status)) {
    if (ride.vehiclePhotos) {
      delete ride.vehiclePhotos;
      cleaned++;
    }
  }
}

console.log(`Cleaned vehiclePhotos from ${cleaned} past rides.`);
fs.writeFileSync(file, JSON.stringify(state));
console.log('Saved cleaned state.');
