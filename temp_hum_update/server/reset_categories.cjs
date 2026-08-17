const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://althafrajshaz:Aarizahamed@humfleet.w561j.mongodb.net/hum_fleet?retryWrites=true&w=majority";

const defaultCategories = [
  { id: 'auto', name: '🛺 Auto Rickshaw', maxPassengers: 3, baseFare: 60, ratePerKm: 18, icon: '🛺' },
  { id: 'mini', name: '🚗 Mini / Hatchback', maxPassengers: 4, baseFare: 70, ratePerKm: 20, icon: '🚗' },
  { id: 'sedan', name: '🚘 Sedan (AC)', maxPassengers: 4, baseFare: 80, ratePerKm: 22, icon: '🚘' },
  { id: 'suv', name: '🚐 SUV / XL (6 Seater)', maxPassengers: 6, baseFare: 120, ratePerKm: 28, icon: '🚐' },
  { id: 'ev', name: '⚡ EV Green Cab', maxPassengers: 4, baseFare: 60, ratePerKm: 18, icon: '⚡' }
];

async function resetCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB.');

    const AppState = mongoose.model('AppState', new mongoose.Schema({}, { strict: false }), 'app_state');

    console.log('Resetting vehicle categories...');
    const result = await AppState.updateOne(
      { _id: 'humFleetState' },
      { $set: { vehicleCategories: defaultCategories } },
      { upsert: true }
    );

    console.log('Update result:', result);
    console.log('Successfully reset categories.');
  } catch (error) {
    console.error('Error resetting categories:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

resetCategories();
