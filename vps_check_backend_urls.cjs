const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const cmd = `grep -rnIE --exclude-dir=node_modules "loca\\.lt|vercel\\.app|localhost:300" /root/hum-fleet/server/`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
