const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    let files = [
      { local: 'src/pages/PassengerDashboard.jsx', remote: '/root/hum-fleet/src/pages/PassengerDashboard.jsx' },
      { local: 'server/index.js', remote: '/root/hum-fleet/server/index.js' }
    ];
    let count = 0;
    files.forEach(f => {
      sftp.fastPut(f.local, f.remote, err => {
        count++;
        console.log('Uploaded', f.local);
        if (count === files.length) {
          console.log('Building...');
          conn.exec('cd /root/hum-fleet && npm run build && cp -r dist/* /var/www/humfleet/ && systemctl restart nginx && cd server && pm2 restart all', (err, stream) => {
            stream.on('close', () => { console.log('Done'); conn.end(); }).on('data', d => console.log(''+d));
          });
        }
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
