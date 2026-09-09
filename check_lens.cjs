const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`node -e "const fs=require('fs'); const s=JSON.parse(fs.readFileSync('/root/hum-fleet/server/humFleetState.json')); const r = s.activeRides.reduce((max, ride) => JSON.stringify(ride).length > JSON.stringify(max).length ? ride : max, s.activeRides[0]); Object.keys(r).forEach(k => console.log(k, JSON.stringify(r[k]||'').length));"`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d)).on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
