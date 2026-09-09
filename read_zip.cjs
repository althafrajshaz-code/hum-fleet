const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec('unzip -p /root/hum-fleet/HumComplete.zip src/pages/DriverDashboard.jsx | head -n 30', (err, stream) => {
    if (err) throw err;
    let dataStr = '';
    stream.on('data', (d) => { dataStr += d.toString(); })
          .on('close', () => {
             console.log('OUT:', dataStr);
             conn.end();
          });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
