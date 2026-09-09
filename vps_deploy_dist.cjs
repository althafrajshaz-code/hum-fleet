const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('rm -rf /var/www/humfleet/* && cp -r /root/hum-fleet/dist/* /var/www/humfleet/', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { console.log('Copied to var/www/humfleet'); conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
