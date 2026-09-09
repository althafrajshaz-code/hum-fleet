const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec('find /root/hum-fleet -name "DriverDashboard.jsx" -o -name "CaptainDashboard.jsx" -o -name "*.bak" -o -name "*.zip" | grep -v node_modules', (err, stream) => {
    if (err) throw err;
    stream.on('data', (d) => console.log('OUT: ' + d.toString()))
          .on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
