const { Client } = require('ssh2');
const conn = new Client();

const newEnv = `MONGODB_URI=mongodb+srv://althafrajshaz_db_user:admin123@cluster0.scz9vvx.mongodb.net/?appName=Cluster0`;

conn.on('ready', () => {
  console.log('Connected. Fixing .env...');
  conn.exec(`echo "${newEnv}" > /root/hum-fleet/server/.env && pm2 restart hum-backend`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('Fixed .env and restarted backend.');
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
