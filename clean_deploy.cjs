const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  console.log('Connected. Doing a clean deploy...');
  // Clear webroot assets, then copy fresh from dist
  conn.exec(
    'rm -rf /var/www/humfleet/assets && cp -r /root/hum-fleet/dist/assets /var/www/humfleet/assets && cp /root/hum-fleet/dist/index.html /var/www/humfleet/index.html && echo "DONE"',
    (err, stream) => {
      if (err) throw err;
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', (code) => {
        // Verify
        conn.exec('ls -la /var/www/humfleet/assets/ && cat /var/www/humfleet/index.html', (err2, stream2) => {
          stream2.on('data', d => process.stdout.write(d.toString()));
          stream2.on('close', () => conn.end());
        });
      });
    }
  );
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
