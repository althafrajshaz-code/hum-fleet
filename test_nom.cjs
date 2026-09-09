const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec('curl -s -H "User-Agent: Hum-Taxi-App-Backend/1.0" "https://nominatim.openstreetmap.org/search?q=Trivandrum&format=json&limit=1"', (err, stream) => { 
    stream.on('data', (d) => console.log(d.toString())).on('close', () => conn.end()); 
  }); 
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
