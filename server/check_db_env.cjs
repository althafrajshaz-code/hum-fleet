const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log('Using connection string:', MONGODB_URI);

const AppStateSchema = new mongoose.Schema({
  _id: { type: String, default: 'humFleetState' }
}, { strict: false });

const AppState = mongoose.model('AppState', AppStateSchema);

async function checkDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');
    const doc = await AppState.findById('humFleetState').lean();
    if (doc) {
      console.log('Found humFleetState document!');
      console.log('Drivers Count:', doc.drivers ? doc.drivers.length : 0);
      console.log('Passengers Count:', doc.passengers ? doc.passengers.length : 0);
      if (doc.drivers) {
        console.log('Drivers:', doc.drivers.map(d => ({ name: d.name, email: d.email, status: d.status })));
      }
      if (doc.passengers) {
        console.log('Passengers:', doc.passengers.map(p => ({ name: p.name, email: p.email })));
      }
    } else {
      console.log('humFleetState document NOT found!');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkDB();
