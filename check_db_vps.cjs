const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`cd /root/hum-fleet/server && node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb+srv://althafrajshaz_db_user:admin123@cluster0.scz9vvx.mongodb.net/?appName=Cluster0').then(async () => { const AppState = mongoose.model('AppState', new mongoose.Schema({ _id: String }, { strict: false })); const state = await AppState.findById('humFleetState').lean(); for (let key of Object.keys(state)) { try { const size = Buffer.byteLength(JSON.stringify(state[key] || '')); console.log(key, (size / 1024 / 1024).toFixed(2) + ' MB'); } catch(e){} } process.exit(0); });"`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end())
      .on('data', data => process.stdout.write(data))
      .stderr.on('data', data => process.stderr.write(data));
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
