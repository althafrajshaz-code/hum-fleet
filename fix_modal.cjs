const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const targetStr = \      {/* ========== PAYMENT GATEWAY MODAL ========== */}
      {showPayDuesModal && systemSettings && (
                  <button onClick={() => { setShowPayDuesModal(false); setPayDuesSuccess(false); setPayDuesError(null); setPayAmount(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>\;

const replacementStr = \      {/* ========== PAYMENT GATEWAY MODAL ========== */}
      {showPayDuesModal && systemSettings && (
        <div className=\modal-overlay\ style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className=\glass-card animate-fade-in\ style={{ width: '100%', maxWidth: '440px', padding: '20px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color=\ar(--primary)\ />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Settle Platform Dues</h3>
              </div>
              <button onClick={() => { setShowPayDuesModal(false); setPayDuesSuccess(false); setPayDuesError(null); setPayAmount(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>\;

if (content.includes(targetStr)) {
  fs.writeFileSync('src/pages/DriverDashboard.jsx', content.replace(targetStr, replacementStr));
  console.log('Fixed exactly!');
} else {
  const index1 = content.indexOf('{showPayDuesModal && systemSettings && (');
  const index2 = content.indexOf('<button onClick={() => { setShowPayDuesModal(false);');
  if (index1 > -1 && index2 > -1) {
     const goodPart = \{showPayDuesModal && systemSettings && (
        <div className=\modal-overlay\ style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className=\glass-card animate-fade-in\ style={{ width: '100%', maxWidth: '440px', padding: '20px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color=\ar(--primary)\ />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Settle Platform Dues</h3>
              </div>
              \;
     fs.writeFileSync('src/pages/DriverDashboard.jsx', content.substring(0, index1) + goodPart + content.substring(index2));
     console.log('Fixed using loose search!');
  } else {
     console.log('Not found');
  }
}

