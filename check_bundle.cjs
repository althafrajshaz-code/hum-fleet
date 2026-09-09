const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('grep -c "categories" /root/hum-fleet/admin-cms/dist/assets/index-BpybLk0-.js', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()))
      .stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
