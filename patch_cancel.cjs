const fs = require('fs');
let content = fs.readFileSync('server/index.js', 'utf8');

// 1. Update passenger-cancel logic to credit driver wallet immediately and save passenger debt
const targetCancel = `        const driver = drivers.find(d => d.email === ride.driverEmail);
        if (driver) {
          driver.pendingCompensation = parseFloat(((driver.pendingCompensation || 0) + totalPenalty).toFixed(2));
        }`;

const replaceCancel = `        const driver = drivers.find(d => d.email === ride.driverEmail);
        if (driver) {
          if (!driver.wallet) driver.wallet = { toBePaid: 0, cashCollected: 0 };
          driver.wallet.toBePaid = parseFloat((driver.wallet.toBePaid - totalPenalty).toFixed(2));
        }`;

content = content.replace(targetCancel, replaceCancel);

// 2. Update new ride creation to include passenger debt and increase the NEW driver's wallet due if cash
const targetCreate = `  // Use the fare exactly as sent from the frontend (surge already applied there)
  const finalFare = Math.round(parseFloat(fare || 0));

  // Calculate per-trip platform fee based on fare tiers`;

const replaceCreate = `  // Use the fare exactly as sent from the frontend (surge already applied there)
  let finalFare = Math.round(parseFloat(fare || 0));
  
  // Add hidden cancellation debt from previous rides
  const passenger = passengers.find(p => p.email === (passengerEmail || 'anoop.nair@gmail.com'));
  let hiddenDebt = 0;
  if (passenger && passenger.cancellationDebt > 0) {
    hiddenDebt = passenger.cancellationDebt;
    finalFare += hiddenDebt;
    // Clear the debt since it's now bundled into this ride's fare
    passenger.cancellationDebt = 0;
  }

  // Calculate per-trip platform fee based on fare tiers`;

content = content.replace(targetCreate, replaceCreate);

// 3. When the NEW trip completes, if it's a cash trip, the new driver collected the hidden debt.
// That debt belongs to HUM (since HUM already credited the old driver).
// So we must ADD the hidden debt to the NEW driver's wallet.toBePaid.
const targetComplete = `    // Final fare preserves any voluntary extra tip they offered
    const waitingCharge = ride.waitingCharge ? parseFloat(ride.waitingCharge) : 0;
    const finalFare = recalculatedMinFare + voluntaryExtraOffer + waitingCharge;`;

const replaceComplete = `    // Final fare preserves any voluntary extra tip they offered
    const waitingCharge = ride.waitingCharge ? parseFloat(ride.waitingCharge) : 0;
    const finalFare = recalculatedMinFare + voluntaryExtraOffer + waitingCharge + (ride.hiddenDebt || 0);`;

content = content.replace(targetComplete, replaceComplete);


// Wait, I also need to make sure the ride object SAVES the hidden debt so the complete endpoint can use it!
const targetNewRide = `    originalFare: fare,
    fare: finalFare,
    driverTip: parseFloat(driverTip || 0),`;

const replaceNewRide = `    originalFare: fare,
    fare: finalFare,
    hiddenDebt: hiddenDebt,
    driverTip: parseFloat(driverTip || 0),`;

content = content.replace(targetNewRide, replaceNewRide);


// 4. In complete endpoint, add the hidden debt to the driver's dues if it's a cash trip
const targetWalletComplete = `    if (collectCash) {
      ride.paymentType = 'cash';
    }

    // Update driver's wallet (no longer deducting commission/fees, so toBePaid stays stable)
    const driver = drivers.find(d => d.email === ride.driverEmail);`;

const replaceWalletComplete = `    if (collectCash) {
      ride.paymentType = 'cash';
    }

    // Update driver's wallet (no longer deducting commission/fees, so toBePaid stays stable)
    const driver = drivers.find(d => d.email === ride.driverEmail);
    if (driver) {
      if (!driver.wallet) driver.wallet = { cashCollected: 0, toBePaid: 0 };
      if (ride.paymentType === 'cash') {
        driver.wallet.cashCollected += totalCollected;
        // The hidden debt was collected in cash by this driver, but it's owed to HUM
        if (ride.hiddenDebt > 0) {
          driver.wallet.toBePaid += ride.hiddenDebt;
        }
      }
    }`;

content = content.replace(targetWalletComplete, replaceWalletComplete);

fs.writeFileSync('server/index.js', content);
console.log('Successfully patched cancellation debt logic');
