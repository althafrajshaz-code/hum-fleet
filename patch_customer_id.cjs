const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', 'utf8');

const oldHtml = `{passengerId && (
                  <div style={{ marginTop: '4px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', fontWeight: 'bold' }}>
                    Customer ID: {passengerId}
                  </div>
                )}`;

const newHtml = `{passengerId && (
                  <div style={{ marginTop: '2px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Customer ID: {passengerId}
                  </div>
                )}`;

content = content.replace(oldHtml, newHtml);

fs.writeFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', content);
console.log('Fixed Customer ID styling.');
