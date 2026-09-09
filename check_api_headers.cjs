const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // The http code is 200, but check the actual content type - does it return JSON or HTML?
  conn.exec('curl -s -I http://admin.humfleet.xyz/api/vehicle-categories', (err, stream) => {
    stream.on('data', d => process.stdout.write('HEADERS: ' + d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
