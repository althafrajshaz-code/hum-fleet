const Client = require('ssh2').Client;
const conn = new Client();

const mongooseScript = `
const mongoose = require('mongoose');
const uri = 'mongodb+srv://althafrajshaz:SHAFLAlTHAF.1992@hum.p3l3p.mongodb.net/hum_fleet?retryWrites=true&w=majority&appName=hum';
mongoose.connect(uri).then(async () => {
  const schema = new mongoose.Schema({}, { strict: false });
  const AppState = mongoose.model('AppState', schema, 'appstates');
  const state = await AppState.findOne({ _id: 'humFleetState' });
  if (state && state._doc.activeRides) {
    console.log('Found activeRides:', state._doc.activeRides.length);
    const updatedRides = state._doc.activeRides.map(r => {
      if (['Accepted', 'In Progress', 'Arrived'].includes(r.status)) {
         console.log('Canceling ride ' + r.id);
         r.status = 'Cancelled';
      }
      return r;
    });
    await AppState.updateOne({ _id: 'humFleetState' }, { $set: { activeRides: updatedRides } });
    console.log('Updated rides in mongo.');
  }
  process.exit(0);
}).catch(console.error);
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`cat << 'EOF' > /root/hum-fleet/server/fixMongo.js\n${mongooseScript}\nEOF\ncd /root/hum-fleet/server && node fixMongo.js && pm2 restart all`, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Command finished with code ' + code);
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
