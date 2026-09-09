const { Client } = require('ssh2');
const conn = new Client();

const fixBackendCmd = `
sed -i "s/email.toLowerCase()/(email || '').toLowerCase()/g" /root/hum-fleet/server/index.js &&
sed -i "s/licenseNumber.toLowerCase()/(licenseNumber || '').toLowerCase()/g" /root/hum-fleet/server/index.js &&
pm2 restart hum-backend
`;

conn.on('ready', () => {
  conn.exec(fixBackendCmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Fixed backend code ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('OUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('ERR: ' + data);
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
