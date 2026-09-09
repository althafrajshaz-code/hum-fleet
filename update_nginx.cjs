const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('rm -rf /var/www/humfleet/* && cp -r /root/hum-fleet/dist/* /var/www/humfleet/ && systemctl restart nginx', (err, stream) => {
    stream.on('data', (d) => console.log(d.toString())).on('close', () => { console.log('Done'); conn.end(); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
