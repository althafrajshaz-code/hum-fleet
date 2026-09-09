const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  console.log('Connected. Clearing Vite cache and rebuilding...');
  // Delete dist and node_modules/.vite to force a clean rebuild
  conn.exec('cd /root/hum-fleet/admin-cms && rm -rf dist node_modules/.vite && npm run build && pm2 restart admin-frontend', (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', (code) => {
      console.log('Build exited with code', code);
      conn.end();
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
