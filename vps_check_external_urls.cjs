const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const cmd = `grep -rnIE --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git "loca\\.lt|vercel\\.app|localhost:5000" /root/hum-fleet/`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
