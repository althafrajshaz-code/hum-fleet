const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

conn.on('ready', () => {
  conn.exec('cd /root/hum-fleet && git checkout HEAD -- src/pages/DriverDashboard.jsx && cat src/pages/DriverDashboard.jsx', (err, stream) => {
    if (err) throw err;
    let dataStr = '';
    stream.on('data', (d) => { dataStr += d.toString(); })
          .on('close', () => {
             fs.writeFileSync('src/pages/DriverDashboard.jsx', dataStr);
             console.log('Restored locally!');
             conn.end();
          });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
