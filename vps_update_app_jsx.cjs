const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
sed -i 's/import { BrowserRouter as Router, Routes, Route, Navigate } from \\'react-router-dom\\';/import { BrowserRouter as Router, Routes, Route, Navigate } from \\'react-router-dom\\';\\nimport GlobalErrorBoundary from \\'.\\/GlobalErrorBoundary\\';/' /root/hum-fleet/src/App.jsx &&
sed -i 's/<Routes>/<GlobalErrorBoundary><Routes>/' /root/hum-fleet/src/App.jsx &&
sed -i 's/<\\/Routes>/<\\/Routes><\\/GlobalErrorBoundary>/' /root/hum-fleet/src/App.jsx &&
cd /root/hum-fleet && npm run build && pm2 restart frontend
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
