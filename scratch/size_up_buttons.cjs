const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// For Arrived (Verify Passenger) state
let innerArrivedOld = `<div style={{ textAlign: 'center', padding: '16px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '18px', fontWeight: '900' }}>Verify Passenger</h3>`;
let innerArrivedNew = `<div style={{ textAlign: 'center', padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '18px', fontWeight: '900' }}>Verify Passenger</h3>`;
if (content.includes(innerArrivedOld)) {
    content = content.replace(innerArrivedOld, innerArrivedNew);
} else {
    let old_win = innerArrivedOld.replace(/\n/g, '\r\n');
    let new_win = innerArrivedNew.replace(/\n/g, '\r\n');
    if (content.includes(old_win)) {
        content = content.replace(old_win, new_win);
    }
}

let verifyBtnOld = `<Button variant="primary" className="full-width" onClick={handleVerifyPin} style={{ background: '#3b82f6', color: 'white', padding: '12px', fontSize: '15px', fontWeight: '800', borderRadius: '10px' }} disabled={ridePin.length < 4}>`;
let verifyBtnNew = `<Button variant="primary" className="full-width" onClick={handleVerifyPin} style={{ background: '#3b82f6', color: 'white', padding: '18px', fontSize: '18px', fontWeight: '900', borderRadius: '12px', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }} disabled={ridePin.length < 4}>`;
if (content.includes(verifyBtnOld)) {
    content = content.replace(verifyBtnOld, verifyBtnNew);
}

// For In Progress (Complete Ride) state
let innerProgressOld = `<div style={{ textAlign: 'center', padding: '16px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ color: '#8b5cf6', marginBottom: '10px', fontSize: '18px', fontWeight: '900' }}>Trip in Progress</h3>`;
let innerProgressNew = `<div style={{ textAlign: 'center', padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ color: '#8b5cf6', marginBottom: '10px', fontSize: '18px', fontWeight: '900' }}>Trip in Progress</h3>`;
if (content.includes(innerProgressOld)) {
    content = content.replace(innerProgressOld, innerProgressNew);
} else {
    let old_win = innerProgressOld.replace(/\n/g, '\r\n');
    let new_win = innerProgressNew.replace(/\n/g, '\r\n');
    if (content.includes(old_win)) {
        content = content.replace(old_win, new_win);
    }
}

let completeBtnOld = `<Button variant="primary" className="full-width" onClick={() => setShowEndTripSummary(true)} style={{ background: '#3b82f6', color: 'white' }}>
                          Complete Ride
                        </Button>`;
let completeBtnNew = `<Button variant="primary" className="full-width" onClick={() => setShowEndTripSummary(true)} style={{ background: '#3b82f6', color: 'white', padding: '18px', fontSize: '18px', fontWeight: '900', borderRadius: '12px', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}>
                          COMPLETE RIDE
                        </Button>`;
if (content.includes(completeBtnOld)) {
    content = content.replace(completeBtnOld, completeBtnNew);
} else {
    let old_win = completeBtnOld.replace(/\n/g, '\r\n');
    let new_win = completeBtnNew.replace(/\n/g, '\r\n');
    if (content.includes(old_win)) {
        content = content.replace(old_win, new_win);
    }
}

let inputPinOld = `<input 
                        type="text" 
                        value={ridePin} 
                        onChange={(e) => setRidePin(e.target.value.replace(/\\D/g, '').slice(0, 10))}
                        placeholder="ENTER CUSTOMER ID" 
                        style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '4px', textAlign: 'center', width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #3b82f6', background: '#f8fafc', color: '#0f172a', marginBottom: '16px' }}
                      />`;
let inputPinNew = `<input 
                        type="text" 
                        value={ridePin} 
                        onChange={(e) => setRidePin(e.target.value.replace(/\\D/g, '').slice(0, 10))}
                        placeholder="ENTER CUSTOMER ID" 
                        style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '4px', textAlign: 'center', width: '100%', padding: '16px', borderRadius: '12px', border: '3px solid #3b82f6', background: '#f8fafc', color: '#0f172a', marginBottom: '16px' }}
                      />`;

if (content.includes(inputPinOld)) {
    content = content.replace(inputPinOld, inputPinNew);
} else {
    let old_win = inputPinOld.replace(/\n/g, '\r\n');
    let new_win = inputPinNew.replace(/\n/g, '\r\n');
    if (content.includes(old_win)) {
        content = content.replace(old_win, new_win);
    }
}

// In Arrived state, the Navigate button was side-by-side with Verify Pin? Wait, no, Verify is separate. Let's check the code for Arrived state.
let arrivedNavOld = `style={{ flex: 1, borderColor: '#10b981', color: '#10b981', padding: '12px', fontSize: '15px', fontWeight: '800', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}`;
let arrivedNavNew = `style={{ width: '100%', borderColor: '#10b981', color: '#10b981', padding: '16px', fontSize: '16px', fontWeight: '900', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(16,185,129,0.05)' }}`;
if (content.includes(arrivedNavOld)) {
     content = content.replace(arrivedNavOld, arrivedNavNew);
}

// Same for the in progress state Navigate button
if (content.includes(arrivedNavOld)) {
     content = content.replace(arrivedNavOld, arrivedNavNew);
}

// Ensure flex-direction column in Arrived / In Progress button groups
let rowOld = `<div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>`;
let rowNew = `<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>`;
content = content.split(rowOld).join(rowNew);

console.log("Done");
fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
