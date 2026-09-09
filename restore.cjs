const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

conn.on('ready', () => {
  console.log('Restoring DriverDashboard on VPS...');
  conn.exec('cd /root/hum-fleet && git checkout -- src/pages/DriverDashboard.jsx', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('Restored. Downloading to local workspace...');
      conn.sftp((err, sftp) => {
        if (err) throw err;
        sftp.fastGet('/root/hum-fleet/src/pages/DriverDashboard.jsx', 'src/pages/DriverDashboard.jsx', (err) => {
          if (err) throw err;
          console.log('Downloaded successfully.');
          conn.end();
        });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
