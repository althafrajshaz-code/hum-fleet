const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.VITE_MONGO_URI || 'mongodb+srv://althafrajshaz:Aariz123@cluster0.db8s5.mongodb.net/hum_fleet?retryWrites=true&w=majority');
  console.log("Connected to MongoDB");

  const AppStateSchema = new mongoose.Schema({
    _id: { type: String, default: 'humFleetState' },
    vehicleCategories: { type: mongoose.Schema.Types.Mixed, default: [] }
  }, { strict: false });
  const AppState = mongoose.models.AppState || mongoose.model('AppState', AppStateSchema);

  let doc = await AppState.findById('humFleetState').lean();
  let vehicleCategories = doc ? doc.vehicleCategories : [];
  
  console.log("Initial categories in DB:", vehicleCategories.map(c => c.baseFare));

  // Mutate array
  if (vehicleCategories.length > 0) {
    vehicleCategories[0].baseFare = Math.floor(Math.random() * 100);
    console.log("Mutated category 0 baseFare in memory to:", vehicleCategories[0].baseFare);
  }

  // Save using findOneAndUpdate
  await AppState.findOneAndUpdate(
    { _id: 'humFleetState' },
    { vehicleCategories: vehicleCategories },
    { upsert: true, new: true }
  );
  console.log("Saved to DB using findOneAndUpdate");

  // Fetch again
  let doc2 = await AppState.findById('humFleetState').lean();
  console.log("Categories in DB after save:", doc2.vehicleCategories.map(c => c.baseFare));

  mongoose.disconnect();
}
run();
