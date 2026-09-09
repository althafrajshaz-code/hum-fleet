const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`cd /root/hum-fleet/server && node -e "
const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});
const AppState = mongoose.model('AppState', new mongoose.Schema({ _id: String }, { strict: false }));
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const state = await AppState.findOne({ _id: 'humFleetState' });
  const driver = state._doc.drivers.find(d => d.email === 'inam@gmail.com');
  console.log('FCM TOKEN:', driver ? driver.fcmToken : 'DRIVER NOT FOUND');
  process.exit(0);
});
"`, (err, stream) => {
    stream.on('close', () => conn.end()).on('data', d => process.stdout.write(d)).stderr.on('data', d => process.stderr.write(d));
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
