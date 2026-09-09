const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
    curl -X POST -H "Content-Type: application/json" -d '{"name":"TestCat","maxPassengers":4,"baseFare":50,"ratePerKm":10}' http://localhost:5000/api/vehicle-categories &&
    pm2 restart hum-backend &&
    sleep 5 &&
    curl http://localhost:5000/api/vehicle-categories
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
