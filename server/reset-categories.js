import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const AppStateSchema = new mongoose.Schema({
  vehicleCategories: { type: mongoose.Schema.Types.Mixed, default: [] },
}, { strict: false });

const AppState = mongoose.model('AppState', AppStateSchema);

async function resetCategories() {
  await mongoose.connect(process.env.MONGODB_URI);


  
  const defaultCategories = [
    { id: 'auto', name: '🛺 Auto Rickshaw', maxPassengers: 3, baseFare: 30.00, ratePerKm: 15.00, icon: '🛺' },
    { id: 'mini', name: '🚙 Mini', maxPassengers: 4, baseFare: 40.00, ratePerKm: 18.00, icon: '🚙' },
    { id: 'hatchback', name: '🚗 Hatchback', maxPassengers: 4, baseFare: 50.00, ratePerKm: 20.00, icon: '🚗' },
    { id: 'sedan', name: '🚘 Sedan (AC)', maxPassengers: 4, baseFare: 60.00, ratePerKm: 22.00, icon: '🚘' },
    { id: 'suv', name: '🚐 SUV / XL (6 Seater)', maxPassengers: 6, baseFare: 80.00, ratePerKm: 25.00, icon: '🚐' },
    { id: 'ev', name: '⚡ EV Green Cab (Eco)', maxPassengers: 4, baseFare: 45.00, ratePerKm: 16.00, icon: '⚡' },
    { id: 'premium', name: '💎 Premium / Luxury', maxPassengers: 4, baseFare: 100.00, ratePerKm: 30.00, icon: '💎' }
  ];

  await AppState.updateOne(
    { _id: 'humFleetState' },
    { $set: { vehicleCategories: defaultCategories } }
  );

  console.log('Successfully reset vehicle categories to defaults.');
  process.exit(0);
}

resetCategories();
