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
         console.log('Canceling ride ' + r.id + ' for driver ' + r.driverEmail);
         r.status = 'Cancelled';
      }
      return r;
    });
    await AppState.updateOne({ _id: 'humFleetState' }, { $set: { activeRides: updatedRides } });
    console.log('Updated rides in mongo. Now triggering server restart...');
  } else {
    console.log('No active rides found in mongo.');
  }
  process.exit(0);
}).catch(console.error);
