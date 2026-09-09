const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected');
  conn.exec('find /var/www/humfleet/ -name "*.apk" -exec ls -lh {} \\; && echo "---CHECK ASSETS---" && ls -lah /var/www/humfleet/assets/*.apk 2>/dev/null || echo "No APKs in assets" && echo "---CHECK PUBLIC---" && find /var/www/humfleet/ -name "*.apk" -type f', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end())
      .on('data', (data) => console.log(data.toString()))
      .stderr.on('data', (data) => console.error(data.toString()));
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
