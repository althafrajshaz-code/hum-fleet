const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected. Downloading DriverDashboard.jsx from server...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastGet(
      '/root/hum-fleet/src/pages/DriverDashboard.jsx',
      'src/pages/DriverDashboard_SERVER.jsx',
      (err) => {
        if (err) throw err;
        console.log('Downloaded DriverDashboard_SERVER.jsx');
        conn.end();
      }
    );
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
