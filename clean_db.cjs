const mongoose = require('mongoose');
require('dotenv').config({ path: 'server/.env' });

const stateSchema = new mongoose.Schema({ _id: String }, { strict: false });
const AppState = mongoose.model('AppState', stateSchema);

async function cleanDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  const state = await AppState.findOne({ _id: 'humFleetState' });
  if (state && state._doc.activeRides) {
    const rides = state._doc.activeRides.map(r => {
      if (r.vehiclePhotos) {
        r.vehiclePhotos = {
          profile: r.vehiclePhotos.profile || '',
          front: r.vehiclePhotos.exteriorFront || r.vehiclePhotos.exterior || r.vehiclePhotos.front || ''
        };
      }
      return r;
    });
    await AppState.updateOne({ _id: 'humFleetState' }, { '$set': { activeRides: rides } });
    console.log('Cleaned up activeRides in MongoDB');
  }
  process.exit(0);
}
cleanDB();
