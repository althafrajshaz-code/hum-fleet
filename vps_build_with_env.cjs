const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
cd /root/hum-fleet
VITE_BACKEND_URL=https://humfleet.xyz npm run build
cp -r dist/* /var/www/humfleet/
chown -R www-data:www-data /var/www/humfleet
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
