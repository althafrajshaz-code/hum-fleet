const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`curl -X POST -H "Content-Type: application/json" -d '{"name":"test2","email":"test2@test.com","phone":"+91 1234567891","password":"123"}' http://localhost:5000/api/passengers/signup`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
