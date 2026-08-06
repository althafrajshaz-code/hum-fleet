const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://althafrajshaz_db_user:admin123@cluster0.1xzktis.mongodb.net/?appName=Cluster0";

const AppStateSchema = new mongoose.Schema({
  _id: { type: String, default: 'humFleetState' },
  drivers: { type: mongoose.Schema.Types.Mixed, default: [] },
  passengers: { type: mongoose.Schema.Types.Mixed, default: [] },
}, { timestamps: true, minimize: false, strict: false });

const AppState = mongoose.model('AppState', AppStateSchema);

async function clearDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Clearing drivers and passengers...');
    
    const doc = await AppState.findById('humFleetState');
    if (doc) {
      doc.drivers = [];
      doc.passengers = [];
      await doc.save();
      console.log('Successfully cleared all drivers and passengers.');
    } else {
      console.log('No state found, nothing to clear.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

clearDB();
