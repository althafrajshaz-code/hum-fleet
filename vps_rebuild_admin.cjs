const { Client } = require('ssh2');
const conn = new Client();

const rebuildCmd = `
cd /root/hum-fleet/admin-cms &&
echo "VITE_BACKEND_URL=https://humfleet.xyz" > .env.production &&
echo "VITE_BACKEND_URL=https://humfleet.xyz" > .env &&
npm install &&
npm run build &&
pm2 restart admin-frontend
`;

conn.on('ready', () => {
  console.log('Rebuilding admin-cms frontend...');
  conn.exec(rebuildCmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Rebuild completed with code ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('OUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('ERR: ' + data);
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
