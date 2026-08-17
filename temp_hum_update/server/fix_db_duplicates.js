const mongoose = require('mongoose');

// Schema
const AppStateSchema = new mongoose.Schema({
  drivers: { type: mongoose.Schema.Types.Mixed, default: [] },
  passengers: { type: mongoose.Schema.Types.Mixed, default: [] },
  activeRides: { type: mongoose.Schema.Types.Mixed, default: [] },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  vehicleCategories: { type: mongoose.Schema.Types.Mixed, default: [] },
  promotions: { type: mongoose.Schema.Types.Mixed, default: [] },
  adminCredentials: { type: mongoose.Schema.Types.Mixed, default: {} },
  driverMessages: { type: mongoose.Schema.Types.Mixed, default: {} },
  passengerMessages: { type: mongoose.Schema.Types.Mixed, default: {} },
  rideMessages: { type: mongoose.Schema.Types.Mixed, default: {} },
  dynamicLocations: { type: mongoose.Schema.Types.Mixed, default: [] },
  employees: { type: mongoose.Schema.Types.Mixed, default: [] }
});

const AppState = mongoose.model('AppState', AppStateSchema);

async function fixDuplicateIds() {
  const uri = "mongodb+srv://althafrajshaz_db_user:admin123@cluster0.scz9vvx.mongodb.net/?appName=Cluster0";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const doc = await AppState.findById('humFleetState');
  if (doc) {
    let drivers = doc.drivers || [];
    let updated = false;

    // Fix duplicate IDs
    let seenIds = new Set();
    for (let i = 0; i < drivers.length; i++) {
      if (seenIds.has(drivers[i].id)) {
        console.log("Found duplicate driver ID:", drivers[i].id);
        const newId = Math.max(0, ...drivers.map(d => Number(d.id) || 0)) + 1;
        drivers[i].id = newId;
        console.log("Reassigned to new ID:", newId);
        updated = true;
      }
      seenIds.add(drivers[i].id);
    }

    if (updated) {
      doc.drivers = drivers;
      doc.markModified('drivers');
      await doc.save();
      console.log("Saved fixed drivers to MongoDB.");
    } else {
      console.log("No duplicate driver IDs found.");
    }
  } else {
    console.log("humFleetState document not found.");
  }

  await mongoose.disconnect();
}

fixDuplicateIds().catch(console.error);
