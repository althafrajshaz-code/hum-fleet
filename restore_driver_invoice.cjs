const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

const generateInvoiceStr = `const [invoiceHtml, setInvoiceHtml] = useState(null);

  const generateDriverInvoice = (ride, driverDet) => {
    const fare = parseFloat(ride.fare || 0);
    const gst = parseFloat(ride.gst || (fare * 0.05));
    const commission = parseFloat(ride.commission || (fare * 0.05));
    const totalCollected = parseFloat(ride.totalCollected || (fare + gst));
    const driverPayout = (fare - commission).toFixed(2);
    const driverName = driverDet?.name || 'Partner Driver';
    const driverPhone = driverDet?.phone || '-';
    const completedDate = ride.completedAt ? new Date(ride.completedAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) : '-';

    const html = \`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Invoice #HUMF-\${String(ride.id).padStart(5,'0')}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#fff;color:#1a1a2e;padding:16px}.inv-box{max-width:540px;margin:0 auto;border:1px solid #e2e8f0;border-radius:14px;padding:20px}.inv-head{display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:2px solid #10b981;margin-bottom:14px}.inv-brand{font-size:18px;font-weight:900;color:#10b981}.inv-id{font-size:11px;color:#64748b;font-weight:700;text-align:right}.inv-title{font-size:14px;font-weight:800;color:#1a1a2e}.sec{margin-bottom:14px}.sec-title{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#10b981;margin-bottom:6px;padding-bottom:3px;border-bottom:1px dashed #d1fae5}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px}.lbl{font-size:9px;color:#64748b;font-weight:600}.val{font-size:11px;font-weight:700;color:#1a1a2e}.route-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;margin-bottom:14px}.route-lbl{font-size:8px;font-weight:800;text-transform:uppercase;color:#16a34a;margin-bottom:2px}.route-val{font-size:11px;font-weight:600;margin-bottom:6px;color:#1a1a2e}table{width:100%;border-collapse:collapse}td{padding:5px 0;font-size:11px;border-bottom:1px solid #f1f5f9}td:last-child{text-align:right;font-weight:700}.total td{border-top:2px solid #10b981;border-bottom:none;font-size:13px;font-weight:800;color:#10b981;padding-top:8px}.payout td{border-bottom:none;font-size:12px;font-weight:800;color:#3b82f6}.footer{text-align:center;margin-top:14px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:8px;color:#94a3b8;line-height:1.4}.badge{display:inline-block;padding:2px 7px;border-radius:12px;font-size:8px;font-weight:800;text-transform:uppercase}.cash{background:#fef3c7;color:#92400e;border:1px solid #fde68a}.prepaid{background:#dbeafe;color:#1e40af;border:1px solid #93c5fd}@media print{body{padding:0}.inv-box{border:none}}</style></head><body>
<div class="inv-box">
<div class="inv-head"><div class="inv-brand">🚗 HUM Fleet</div><div><div class="inv-title">Trip Invoice</div><div class="inv-id">#HUMF-\${String(ride.id).padStart(5,'0')}</div></div></div>
<div class="sec"><div class="sec-title">Trip Information</div><div class="grid2">
<div><div class="lbl">Date & Time</div><div class="val">\${completedDate}</div></div>
<div><div class="lbl">Payment</div><div class="val"><span class="badge \${ride.paymentType === 'prepaid' ? 'prepaid' : 'cash'}">\${ride.paymentType === 'prepaid' ? '💳 Prepaid' : '💵 Cash'}</span></div></div>
<div><div class="lbl">Distance</div><div class="val">\${ride.finalDistance || ride.totalKm || '-'} KM</div></div>
<div><div class="lbl">Passenger</div><div class="val">\${ride.passengerName || '-'}</div></div>
</div></div>
<div class="route-box">
<div class="route-lbl">🟢 Pickup</div><div class="route-val">\${ride.pickup || '-'}</div>
<div class="route-lbl">🔴 Drop-off</div><div class="route-val" style="margin-bottom:0">\${ride.dropoff || '-'}</div>
</div>
<div class="sec"><div class="sec-title">Driver</div><div class="grid2">
<div><div class="lbl">Name</div><div class="val">\${driverName}</div></div>
<div><div class="lbl">Phone</div><div class="val">\${driverPhone}</div></div>
</div></div>
<div class="sec"><div class="sec-title">Fare Breakdown</div>
<table>
<tr><td>Base Fare (\${ride.finalDistance || ride.totalKm || '-'} KM)</td><td>₹\${fare.toFixed(2)}</td></tr>
<tr><td>GST (5%)</td><td>₹\${gst.toFixed(2)}</td></tr>
<tr class="total"><td>Total Collected</td><td>₹\${totalCollected.toFixed(2)}</td></tr>
<tr><td style="color:#ef4444">HUM Commission (5%)</td><td style="color:#ef4444">-₹\${commission.toFixed(2)}</td></tr>
<tr class="payout"><td>💰 Your Payout</td><td>₹\${driverPayout}</td></tr>
</table></div>
<div class="footer">HUM Fleet Pvt Ltd • System-generated invoice • For disputes contact admin support</div>
</div>
</body></html>\`;

    setInvoiceHtml(html);
  };`;

if(!content.includes('setInvoiceHtml(')) {
  content = content.replace("const [activeMenu, setActiveMenu] = useState('dispatches');", generateInvoiceStr + "\n\n  const [activeMenu, setActiveMenu] = useState('dispatches');");
}

const invoiceModal = `{/* ========== INVOICE MODAL ========== */}
      {invoiceHtml && (
        <div onClick={() => setInvoiceHtml(null)} style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', height: '85vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} color="var(--primary)" /> Trip Invoice</span>
              <button onClick={() => setInvoiceHtml(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={22} /></button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', background: '#fff' }}>
              <iframe title="Invoice" srcDoc={invoiceHtml} style={{ width: '100%', height: '100%', border: 'none' }} id="driver-invoice-iframe" />
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', gap: '10px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setInvoiceHtml(null)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer' }}>Back</button>
              <button onClick={() => { const f = document.getElementById('driver-invoice-iframe'); if (f) f.contentWindow.print(); }} style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>📄 Download / Print PDF</button>
            </div>
          </div>
        </div>
      )}`;

if(!content.includes('INVOICE MODAL')) {
  content = content.replace("{/* ========== PAYMENT GATEWAY MODAL ========== */}", invoiceModal + "\n\n      {/* ========== PAYMENT GATEWAY MODAL ========== */}");
}

const invoiceButtonStr = `<div style={{ textAlign: 'right', marginLeft: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                              <div style={{ fontWeight: '800', fontSize: '14px', color: '#10b981' }}>₹{(parseFloat(ride.fare || 0) * 0.9).toFixed(2)}</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Gross: ₹{ride.fare || 0}</div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); generateDriverInvoice(ride, driverDetails); }}
                                style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '800', cursor: 'pointer', marginTop: '2px' }}
                              >
                                View Invoice
                              </button>
                            </div>`;

// Wait, the old string may have changed if the previous patch was applied.
const oldDivStr = `<div style={{ textAlign: 'right', marginLeft: '12px' }}>
                              <div style={{ fontWeight: '800', fontSize: '14px', color: '#10b981' }}>₹{(parseFloat(ride.fare) * 0.9).toFixed(2)}</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>of ₹{ride.fare}</div>
                              {ride.driverBalance !== undefined && ride.driverBalance !== null && (
                                <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', marginTop: '2px' }}>
                                  Bal: {parseFloat(ride.driverBalance) < 0 ? '-' : ''}₹{Math.abs(parseFloat(ride.driverBalance)).toFixed(2)}
                                </div>
                              )}
                            </div>`;

if(!content.includes('View Invoice')) {
  content = content.replace(oldDivStr, invoiceButtonStr);
}

if(!content.includes('FileText')) {
  content = content.replace("import { Sun, Moon,", "import { FileText, Sun, Moon,");
}

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
