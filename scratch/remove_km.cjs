const fs = require('fs');

// --- PASSENGER DASHBOARD ---
let contentPass = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Replace the verbose receipt details in PassengerDashboard
let passReceiptOld = `<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Distance Travelled:</span>
                  <span style={{ fontWeight: 'bold' }}>{activeRide.totalKm || 8.0} KM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rate per KM:</span>
                  <span>₹15.00</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Kilometers Fare:</span>
                  <span>₹{parseFloat(activeRide.fare || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#f59e0b' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST Tax (5%):</span>
                  <span>+₹{parseFloat(activeRide.gst || 0).toFixed(2)}</span>
                </div>`;

let passReceiptNew = `<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Trip Fare:</span>
                  <span>₹{parseFloat(activeRide.fare || 0).toFixed(2)}</span>
                </div>
                {parseFloat(activeRide.driverTip || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tip:</span>
                    <span>+₹{parseFloat(activeRide.driverTip || 0).toFixed(2)}</span>
                  </div>
                )}`;

if (contentPass.includes(passReceiptOld)) {
    contentPass = contentPass.replace(passReceiptOld, passReceiptNew);
} else {
    // Try with Windows line endings
    if (contentPass.includes(passReceiptOld.replace(/\n/g, '\r\n'))) {
        contentPass = contentPass.replace(passReceiptOld.replace(/\n/g, '\r\n'), passReceiptNew.replace(/\n/g, '\r\n'));
    }
}
fs.writeFileSync('src/pages/PassengerDashboard.jsx', contentPass);


// --- DRIVER DASHBOARD ---
let contentDriver = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Remove KM from Rating Panel step 1
contentDriver = contentDriver.replace(
    `<span style={{ color: 'var(--text-muted)' }}>Trip Fare ({finalDist.toFixed(1)} KM)</span>`,
    `<span style={{ color: 'var(--text-muted)' }}>Trip Fare</span>`
);
contentDriver = contentDriver.replace(
    `Trip Fare (\${finalDist.toFixed(2)} KM)`,
    `Trip Fare`
);

// 2. Remove "Extra Distance Travelled" from End Trip Summary modal
let extraDistBlock = `{isMore && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontSize: '11px' }}>
                                  <span>Extra Distance Travelled:</span>
                                  <span>+{(finalDist - baseTotal).toFixed(2)} KM</span>
                                </div>
                              )}`;

if (contentDriver.includes(extraDistBlock)) {
    contentDriver = contentDriver.replace(extraDistBlock, '');
} else if (contentDriver.includes(extraDistBlock.replace(/\n/g, '\r\n'))) {
    contentDriver = contentDriver.replace(extraDistBlock.replace(/\n/g, '\r\n'), '');
}

// 3. Remove "Estimated Distance" from "Trip in Progress" Active Ride card
contentDriver = contentDriver.replace(
    `<div><strong>Estimated Distance:</strong> {currentRide.totalKm || 8.0} KM</div>`,
    ``
);

fs.writeFileSync('src/pages/DriverDashboard.jsx', contentDriver);
