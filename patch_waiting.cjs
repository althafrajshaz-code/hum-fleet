const fs = require('fs');

let content = fs.readFileSync('server/index.js', 'utf8');

// 1. Add arrivedAt
const targetArrive = `  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.status = 'Arrived';
    saveData();`;

const replaceArrive = `  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.status = 'Arrived';
    ride.arrivedAt = new Date().toISOString();
    saveData();`;

content = content.replace(targetArrive, replaceArrive);

// 2. Add waiting charge calculation in verify-pin
const targetVerify = `  ride.status = 'In Progress';
  ride.startedAt = new Date().toISOString();
  saveData();`;

const replaceVerify = `  ride.status = 'In Progress';
  ride.startedAt = new Date().toISOString();
  
  if (ride.arrivedAt) {
    const arrivedTime = new Date(ride.arrivedAt).getTime();
    const now = new Date(ride.startedAt).getTime();
    const waitMinutes = Math.floor((now - arrivedTime) / 60000);
    
    // 5 minutes free
    if (waitMinutes > 5) {
      const chargeableMinutes = waitMinutes - 5;
      ride.waitingCharge = (chargeableMinutes * 1.5).toFixed(2);
      ride.waitingMinutes = chargeableMinutes;
    } else {
      ride.waitingCharge = '0.00';
      ride.waitingMinutes = 0;
    }
  }
  
  saveData();`;

content = content.replace(targetVerify, replaceVerify);

// 3. Add to complete calculation
const targetComplete = `    // Calculate GST on the base minimum fare
    const gst = 0; // No GST anymore
    
    // Final fare preserves any voluntary extra tip they offered
    const finalFare = recalculatedMinFare + voluntaryExtraOffer;`;

const replaceComplete = `    // Calculate GST on the base minimum fare
    const gst = 0; // No GST anymore
    
    // Final fare preserves any voluntary extra tip they offered
    const waitingCharge = ride.waitingCharge ? parseFloat(ride.waitingCharge) : 0;
    const finalFare = recalculatedMinFare + voluntaryExtraOffer + waitingCharge;`;

content = content.replace(targetComplete, replaceComplete);

fs.writeFileSync('server/index.js', content);
console.log('Added waiting charge logic to backend');
