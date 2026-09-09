const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    console.log('SFTP connected. Uploading DriverDashboard.jsx...');
    sftp.fastPut('src/pages/DriverDashboard.jsx', '/root/hum-fleet/src/pages/DriverDashboard.jsx', (err) => {
      if (err) {
        console.error('Failed to upload', err);
        conn.end();
        return;
      }
      console.log('Uploaded DriverDashboard.jsx');
      
      console.log('Rebuilding frontend and restarting backend...');
      conn.exec('cd /root/hum-fleet && npm run build && cp -r dist/* /var/www/humfleet/ && cd server && pm2 restart all', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Build and restart completed with code ' + code);
          conn.end();
        }).on('data', (data) => {
          console.log('OUT: ' + data);
        }).stderr.on('data', (data) => {
          console.error('ERR: ' + data);
        });
      });
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
