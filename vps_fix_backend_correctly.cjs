const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
    sed -i "s/p\\.(email || '').toLowerCase()/p.email.toLowerCase()/g" /root/hum-fleet/server/index.js &&
    sed -i "s/googleUser\\.(email || '').toLowerCase()/googleUser.email.toLowerCase()/g" /root/hum-fleet/server/index.js &&
    sed -i "s/d\\.(email || '').toLowerCase()/d.email.toLowerCase()/g" /root/hum-fleet/server/index.js &&
    sed -i "s/d\\.(licenseNumber || '').toLowerCase()/d.licenseNumber.toLowerCase()/g" /root/hum-fleet/server/index.js &&
    pm2 restart hum-backend
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
