const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec('cd /root/hum-fleet && git diff src/pages/DriverDashboard.jsx || true', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', (d) => { out += d.toString(); })
          .on('close', () => { console.log('GIT DIFF OUT:', out); conn.end(); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
