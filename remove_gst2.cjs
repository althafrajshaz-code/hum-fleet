
const fs = require('fs');

let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');
content = content.replace(/<div style={{ padding: '10px', border: '1px solid rgba\(16, 185, 129, 0\.25\)', borderRadius: '10px', background: 'rgba\(16, 185, 129, 0\.04\)', textAlign: 'center' }}>[\s\S]*?GST Collected<\/span>[\s\S]*?<\/div>/g, '');
content = content.replace(/<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>\s*<span style={{ color: 'var\(--text-muted\)' }}>GST Collected:<\/span>[\s\S]*?<\/div>/g, '');
content = content.replace(/<span style={{ color: 'var\(--text-muted\)' }}>Government GST \(5%\):<\/span>[\s\S]*?<\/div>/g, '');
content = content.replace(/<div>• GST Tax \(5%\):[\s\S]*?<\/div>/g, '');
content = content.replace(/<span>GST Tax \(5%\):<\/span>\s*<span>₹\{tax\.toFixed\(2\)\}<\/span>/g, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
