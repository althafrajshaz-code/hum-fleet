const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("node -e \"const fs=require('fs'); fetch('http://localhost:5000/api/drivers').then(r=>r.json()).then(async drivers => { const arr = Array.isArray(drivers)?drivers:drivers.data; const d = arr.find(x=>x.email==='inam@gmail.com'); if(d) { d.acceptedCategories = ['Mini', 'Auto', 'Bike', 'Sedan', 'SUV / XL (6 Seater)', 'Premium']; d.acceptsIntercity = true; d.allowsPets = true; await fetch('http://localhost:5000/api/drivers/' + d.email + '/approve', {method:'POST'}); console.log('Updated Inam to accept all rides'); } })\"", (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.on('close', () => {
      console.log('Result:', out);
      conn.end();
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
