const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // The cp -r dist/* /var/www/humfleet/ copies the CONTENTS of dist/ to humfleet/
  // But there's a 'dist' folder INSIDE /var/www/humfleet/ too!
  // Check what's in /var/www/humfleet/dist/
  conn.exec('ls -la /var/www/humfleet/dist/assets/ | head -10', (err, stream) => {
    stream.on('data', d => process.stdout.write('DIST_INSIDE_HUMFLEET: ' + d.toString()));
    stream.on('close', () => {
      // The actual index.html being served - check the script tag
      conn.exec('cat /var/www/humfleet/index.html', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('INDEX_HTML: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
