const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    console.log('SFTP connected. Uploading files...');
    
    const files = [
      { local: 'src/pages/PassengerDashboard.jsx', remote: '/root/hum-fleet/src/pages/PassengerDashboard.jsx' },
      { local: 'src/pages/DriverDashboard.jsx', remote: '/root/hum-fleet/src/pages/DriverDashboard.jsx' },
      { local: 'src/pages/Dashboard.css', remote: '/root/hum-fleet/src/pages/Dashboard.css' },
      { local: 'public/map.html', remote: '/root/hum-fleet/public/map.html' },
      { local: 'server/index.js', remote: '/root/hum-fleet/server/index.js' },
      { local: 'public/apks/HUM_Passenger.apk', remote: '/root/hum-fleet/public/apks/HUM_Passenger.apk' },
      { local: 'public/apks/HUM_Driver.apk', remote: '/root/hum-fleet/public/apks/HUM_Driver.apk' },
      { local: 'src/pages/LandingPage.jsx', remote: '/root/hum-fleet/src/pages/LandingPage.jsx' }
    ];

    let uploaded = 0;
    
    files.forEach(file => {
      sftp.fastPut(file.local, file.remote, (err) => {
        if (err) {
          console.error('Failed to upload ' + file.local, err);
          return;
        }
        console.log('Uploaded ' + file.local);
        uploaded++;
        
        if (uploaded === files.length) {
          console.log('All files uploaded. Rebuilding frontend and restarting backend...');
          
          // ADDED: cp -r dist/* /var/www/humfleet/
          conn.exec('cd /root/hum-fleet && npm run build && cp -r dist/* /var/www/humfleet/ && cp public/map.html /var/www/humfleet/map.html && cd server && pm2 restart all', (err, stream) => {
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
        }
      });
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
