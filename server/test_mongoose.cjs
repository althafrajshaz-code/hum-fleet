const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://althafrajshaz:Aariz123@cluster0.db8s5.mongodb.net/hum_fleet?retryWrites=true&w=majority');
  console.log("Connected to MongoDB");

  const AppStateSchema = new mongoose.Schema({
    _id: { type: String, default: 'humFleetState' },
    vehicleCategories: { type: mongoose.Schema.Types.Mixed, default: [] }
  }, { strict: false });
  const AppState = mongoose.models.AppState || mongoose.model('AppState', AppStateSchema);

  // Read current
  let doc = await AppState.findById('humFleetState').lean();
  let vehicleCategories = doc ? doc.vehicleCategories : [];
  console.log("Initial categories in DB:", vehicleCategories.map(c => c.name));

  // Modify
  vehicleCategories.push({ id: 999, name: 'Test Category DB Save' });

  // Save
  await AppState.findOneAndUpdate(
    { _id: 'humFleetState' },
    { vehicleCategories: vehicleCategories },
    { upsert: true, new: true }
  );

  // Verify
  let doc2 = await AppState.findById('humFleetState').lean();
  console.log("Categories in DB after save:", doc2.vehicleCategories.map(c => c.name));

  // Revert back (pop) to not clutter the DB
  vehicleCategories.pop();
  await AppState.findOneAndUpdate(
    { _id: 'humFleetState' },
    { vehicleCategories: vehicleCategories },
    { upsert: true, new: true }
  );

  mongoose.disconnect();
}
run();
