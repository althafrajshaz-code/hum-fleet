const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading background.js...');
    sftp.fastPut('src/utils/background.js', '/root/hum-fleet/src/utils/background.js', (err) => {
      if (err) {
          conn.exec('mkdir -p /root/hum-fleet/src/utils', () => {
            sftp.fastPut('src/utils/background.js', '/root/hum-fleet/src/utils/background.js', () => { uploadRest(sftp); });
          });
      } else {
          uploadRest(sftp);
      }
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });

function uploadRest(sftp) {
    console.log('Uploading package.json...');
    sftp.fastPut('package.json', '/root/hum-fleet/package.json', (err) => {
      console.log('Uploading DriverDashboard.jsx...');
      sftp.fastPut('src/pages/DriverDashboard.jsx', '/root/hum-fleet/src/pages/DriverDashboard.jsx', (err) => {
        if (err) throw err;
        console.log('Uploaded DriverDashboard.jsx');
        sftp.fastPut('src/pages/PassengerDashboard.jsx', '/root/hum-fleet/src/pages/PassengerDashboard.jsx', (err) => {
          if (err) throw err;
          console.log('Uploaded PassengerDashboard.jsx');
          conn.exec("cd /root/hum-fleet && npm install && npm run build && find /var/www/humfleet -maxdepth 1 -mindepth 1 -not -name 'apks' -exec rm -rf {} + && cp -r dist/* /var/www/humfleet/ && systemctl restart nginx", (err, stream) => {
            if (err) throw err;
            stream.on('close', (code) => { console.log('Build code ' + code); conn.end(); })
              .on('data', d => console.log('OUT: ' + d))
              .stderr.on('data', d => console.log('ERR: ' + d));
          });
        });
      });
    });
}
