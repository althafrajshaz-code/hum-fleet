const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec('nc -zv ac-dwijw1m-shard-00-00.scz9vvx.mongodb.net 27017', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
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
