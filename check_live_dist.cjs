const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Check the live dist - when was it built and does it have the Captain text?
  conn.exec('ls -la /var/www/humfleet/assets/ | head -5', (err, stream) => {
    stream.on('data', d => process.stdout.write('DIST_ASSETS: ' + d.toString()));
    stream.on('close', () => {
      // Check if "Captain" text is in the live bundle
      conn.exec('grep -c "Captain" /var/www/humfleet/assets/*.js 2>/dev/null || echo "NOT FOUND"', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('CAPTAIN_IN_BUNDLE: ' + d.toString()));
        stream2.on('close', () => {
          // Check if polling fix is in the live bundle  
          conn.exec('grep -c "foreground" /var/www/humfleet/assets/*.js 2>/dev/null || echo "NOT FOUND"', (err3, stream3) => {
            stream3.on('data', d => process.stdout.write('POLLING_IN_BUNDLE: ' + d.toString()));
            stream3.on('close', () => conn.end());
          });
        });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
