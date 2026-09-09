const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Find rating block using regex or substring
let ratingStart = `              {/* Rating Panel Screen`;
let summaryStart = `              {/* Active ride in-progress block - full screen modal for End Trip Summary */}`;

let idxR = content.indexOf(ratingStart);
let blockR = '';
if (idxR !== -1) {
    let nextStart = content.indexOf(`{/* Available Pre-booked Trips Section`, idxR);
    let offlineStart = content.indexOf(`{/* Offline status screen */}`, idxR);
    if (offlineStart !== -1 && offlineStart < nextStart) nextStart = offlineStart;
    
    if (nextStart !== -1) {
        blockR = content.substring(idxR, nextStart);
        content = content.substring(0, idxR) + content.substring(nextStart);
    }
}

let idxS = content.indexOf(summaryStart);
let blockS = '';
if (idxS !== -1) {
    let nextStart = content.indexOf(`{/* Active ride card`, idxS);
    if (nextStart !== -1) {
        blockS = content.substring(idxS, nextStart);
        content = content.substring(0, idxS) + content.substring(nextStart);
    }
}

// Modify Rating Block
blockR = blockR.replace(
    `<div className="incoming-request animate-fade-in delay-100" style={{ background: '#ffffff', borderColor: '#e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '75vh', overflowY: 'auto' }}>`,
    `<div className="animate-fade-in delay-100 active-ride-card" style={{ margin: '16px -8px', width: 'calc(100% + 16px)', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>\n<style>{\`.active-ride-card::-webkit-scrollbar { display: none; }\`}</style>`
);

// Modify Summary Block
let oldSummaryWrap = `<div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>`;
let oldSummaryInner = `<div style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 16px 48px rgba(0,0,0,0.25)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>`;
let oldSummaryStyle = `<style>{\`.end-trip-modal::-webkit-scrollbar { display: none; }\`}</style>`;
let oldSummaryEndModal = `<div className="end-trip-modal">`;

let newSummaryWrap = `<div className="animate-fade-in delay-100 active-ride-card" style={{ margin: '16px -8px', width: 'calc(100% + 16px)', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '24px', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
<style>{\`.active-ride-card::-webkit-scrollbar { display: none; }\`}</style>
<div>`;

if (blockS.includes(oldSummaryWrap)) {
    blockS = blockS.replace(oldSummaryWrap, newSummaryWrap);
    blockS = blockS.replace(oldSummaryInner, '');
    blockS = blockS.replace(oldSummaryStyle, '');
    blockS = blockS.replace(oldSummaryEndModal, '');
    
    let lastDivIdx = blockS.lastIndexOf('</div>');
    if (lastDivIdx !== -1) {
        blockS = blockS.substring(0, lastDivIdx) + blockS.substring(lastDivIdx + 6);
    }
} else {
    // Note: React uses tabs or spaces differently, let's just use regex replacement for the first wrapper
    blockS = blockS.replace(/<div style={{ position: 'fixed'[^>]+>/, newSummaryWrap);
    blockS = blockS.replace(/<div style={{ width: '100%', maxWidth: '480px'[^>]+>/, '');
    blockS = blockS.replace(/<style>{\`.end-trip-modal::-webkit-scrollbar \{ display: none; \}\`}<\/style>/, '');
    blockS = blockS.replace(/<div className="end-trip-modal">/, '');
    
    // Remove one closing div
    let lastDivIdx = blockS.lastIndexOf('</div>');
    if (lastDivIdx !== -1) {
        blockS = blockS.substring(0, lastDivIdx) + blockS.substring(lastDivIdx + 6);
    }
}

// Insert blockS and blockR right after the Active Ride Card
let activeRideStart = `              {/* Active ride card`;
let idxActive = content.indexOf(activeRideStart);
if (idxActive !== -1) {
    let nextStart = content.indexOf(`{/* Offline status screen */}`, idxActive);
    if (nextStart === -1) nextStart = content.indexOf(`{/* Available Pre-booked Trips Section`, idxActive);
    
    if (nextStart !== -1) {
        content = content.substring(0, nextStart) + '\n' + blockS + '\n' + blockR + '\n' + content.substring(nextStart);
    }
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
