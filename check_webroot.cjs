const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Check what's actually in /var/www/humfleet/ right now
  conn.exec('ls -la /var/www/humfleet/ && ls -la /var/www/humfleet/assets/ | head -10', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.on('close', () => {
      // Check the nginx humfleet config - what root is it serving?
      conn.exec('cat /etc/nginx/sites-available/humfleet', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('NGINX: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
