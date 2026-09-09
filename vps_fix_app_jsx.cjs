const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
node -e "
const fs = require('fs');
let code = fs.readFileSync('/root/hum-fleet/src/App.jsx', 'utf8');
if (!code.includes('GlobalErrorBoundary')) {
  code = code.replace(
    \\\"import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';\\\",
    \\\"import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';\\\\nimport GlobalErrorBoundary from './GlobalErrorBoundary';\\\"
  );
  code = code.replace(/<Routes>/g, '<GlobalErrorBoundary><Routes>');
  code = code.replace(/<\\/Routes>/g, '</Routes></GlobalErrorBoundary>');
  fs.writeFileSync('/root/hum-fleet/src/App.jsx', code);
}
" && cd /root/hum-fleet && npm run build
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
