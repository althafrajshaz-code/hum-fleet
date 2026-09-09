const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected. Rebuilding frontend with all current source files...');
  // The source on server already has the correct file (we verified it's 4176 lines with our fixes)
  // Just rebuild and copy to webroot
  conn.exec('cd /root/hum-fleet && npm run build && cp -r dist/* /var/www/humfleet/', (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', (code) => {
      console.log('Build + deploy exit code:', code);
      conn.end();
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
