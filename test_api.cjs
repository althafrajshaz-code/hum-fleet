const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Test the API directly
  conn.exec('curl -s http://localhost:5000/api/vehicle-categories', (err, stream) => {
    stream.on('data', d => process.stdout.write('API: ' + d.toString()));
    stream.stderr.on('data', d => process.stdout.write('ERR: ' + d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
