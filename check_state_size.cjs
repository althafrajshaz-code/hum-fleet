const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`node -e "const state = require('./server/humFleetState.json'); Object.keys(state).forEach(k => console.log(k + ': ' + (JSON.stringify(state[k] || {}).length / 1024 / 1024).toFixed(2) + ' MB'));"`, {cwd: '/root/hum-fleet'}, (err, stream) => {
    stream.on('data', d => process.stdout.write(d)).on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
