const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb+srv://humfleet:Vf98sS2oOqf4wK5d@humfleet.2n80t.mongodb.net/?retryWrites=true&w=majority&appName=HumFleet');
  
  const db = mongoose.connection.db;
  const state = await db.collection('appstates').findOne({ _id: 'humFleetState' });
  
  console.log("MongoDB vehicleCategories:");
  console.log(JSON.stringify(state.vehicleCategories, null, 2));
  
  mongoose.disconnect();
}
test();
