const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Replace the container
let oldContainer = `<div className="incoming-request animate-fade-in delay-100" style={{ background: '#ffffff', borderColor: '#e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>`;
let newContainer = `<div className="animate-fade-in delay-100" style={{ margin: '16px 0', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>`;
if (content.includes(oldContainer)) {
    content = content.replace(oldContainer, newContainer);
    console.log("Replaced container");
} else {
    console.log("Could not find container");
}

// Replace the padding and h3 size
let oldInner = `<div style={{ textAlign: 'center', padding: '16px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>`;
let newInner = `<div style={{ textAlign: 'center', padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>`;
if (content.includes(oldInner)) {
    content = content.replace(oldInner, newInner);
    console.log("Replaced inner box padding");
} else {
    console.log("Could not find inner box");
}

// Replace buttons layout
let acceptedBlockOld = `                      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        <Button variant="primary" onClick={() => {`;

let acceptedBlockNew = `                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <Button variant="primary" onClick={() => {`;

if (content.includes(acceptedBlockOld)) {
    content = content.replace(acceptedBlockOld, acceptedBlockNew);
    console.log("Replaced buttons flex-direction");
} else {
    let acceptedBlockOldWin = acceptedBlockOld.replace(/\n/g, '\r\n');
    let acceptedBlockNewWin = acceptedBlockNew.replace(/\n/g, '\r\n');
    if (content.includes(acceptedBlockOldWin)) {
        content = content.replace(acceptedBlockOldWin, acceptedBlockNewWin);
        console.log("Replaced buttons flex-direction (win)");
    } else {
        console.log("Could not find buttons flex-direction block");
    }
}

// Make button text larger
let oldBtn = `<Navigation size={18} /> Navigate`;
let newBtn = `<Navigation size={22} /> NAVIGATE TO PICKUP`;
if (content.includes(oldBtn)) {
    content = content.replace(oldBtn, newBtn);
}

let oldBtn2Full = `<Button variant="outline" onClick={handleArrive} style={{ flex: 1, borderColor: '#10b981', color: '#10b981', padding: '12px', fontSize: '15px', fontWeight: '800', borderRadius: '10px' }}>
                          Arrived
                        </Button>`;
let newBtn2Full = `<Button variant="outline" onClick={handleArrive} style={{ width: '100%', borderColor: '#10b981', color: '#10b981', padding: '16px', fontSize: '16px', fontWeight: '900', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)' }}>
                          I HAVE ARRIVED
                        </Button>`;
                        
if (content.includes(oldBtn2Full)) {
    content = content.replace(oldBtn2Full, newBtn2Full);
} else {
    let oldBtn2FullWin = oldBtn2Full.replace(/\n/g, '\r\n');
    let newBtn2FullWin = newBtn2Full.replace(/\n/g, '\r\n');
    if (content.includes(oldBtn2FullWin)) {
        content = content.replace(oldBtn2FullWin, newBtn2FullWin);
    } else {
        console.log("Could not find arrived button");
    }
}

let oldNavBtn = `}} style={{ flex: 1, background: '#10b981', color: 'white', padding: '12px', fontSize: '15px', fontWeight: '800', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>`;
let newNavBtn = `}} style={{ width: '100%', background: '#10b981', color: 'white', padding: '18px', fontSize: '18px', fontWeight: '900', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>`;
if (content.includes(oldNavBtn)) {
    content = content.replace(oldNavBtn, newNavBtn);
} else {
    console.log("Could not find navigate button style");
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
