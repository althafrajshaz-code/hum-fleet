const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  const content = fs.readFileSync('d:\\Althaf\\hum\\GlobalErrorBoundary.jsx', 'utf8');
  conn.exec(`cat << 'EOF' > /root/hum-fleet/src/GlobalErrorBoundary.jsx\n${content}\nEOF`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
