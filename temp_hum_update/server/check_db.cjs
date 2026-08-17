const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://althafrajshaz_db_user:admin123@cluster0.1xzktis.mongodb.net/?appName=Cluster0";

const AppStateSchema = new mongoose.Schema({
  _id: { type: String, default: 'humFleetState' }
}, { strict: false });

const AppState = mongoose.model('AppState', AppStateSchema);

async function checkDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    const doc = await AppState.findById('humFleetState').lean();
    console.log(JSON.stringify(doc.adminCredentials, null, 2));
    
    // Fix it if it's broken
    if (!doc.adminCredentials || !doc.adminCredentials.username) {
       console.log("Fixing adminCredentials in DB!");
       await AppState.updateOne({ _id: 'humFleetState' }, { $set: { adminCredentials: { username: 'admin', password: 'admin123' } } });
       console.log("Fixed.");
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkDB();
