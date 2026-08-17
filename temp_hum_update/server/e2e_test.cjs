const API_BASE = 'http://localhost:5000';

async function req(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, options);
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch(e) {
    return { status: res.status, data: text };
  }
}

async function run() {
  console.log("=== Hum Fleet E2E Test ===");
  const timestamp = Date.now();
  const passengerEmail = `passenger_${timestamp}@test.com`;
  const passengerPhone = `900${timestamp}`.substring(0, 10);
  const driverEmail = `driver_${timestamp}@test.com`;
  const driverPhone = `901${timestamp}`.substring(0, 10);
  
  // 1. Check Admin Panel endpoints
  console.log("\n1. Checking Admin Endpoints");
  let res = await req('GET', '/api/settings');
  console.log('GET /api/settings:', res.status);

  // 2. Create Passenger Entry
  console.log("\n2. Creating Passenger Entry");
  res = await req('POST', '/api/passengers/signup', {
    name: "Test Passenger",
    email: passengerEmail,
    phone: passengerPhone,
    password: "password123"
  });
  console.log('POST /api/passengers/signup:', res.status, res.data.id ? 'Success' : res.data);
  const passengerId = res.data.id;

  // 3. Create Driver Entry
  console.log("\n3. Creating Driver Entry");
  res = await req('POST', '/api/drivers', {
    email: driverEmail,
    phone: driverPhone,
    licenseNumber: `LIC${timestamp}`,
    ratePerKm: 15,
    ratePerHour: 100,
    vehicleType: 'Sedan',
    vehicles: [{ make: 'Toyota', model: 'Camry', plate: `TX${timestamp}`.substring(0, 8) }]
  });
  console.log('POST /api/drivers:', res.status, res.data.id ? 'Success' : res.data);
  const driverId = res.data.id;

  // 4. Driver Request to Admin Panel (Simulate Admin Approval)
  console.log("\n4. Approving Driver (Admin Panel Action)");
  if (driverId) {
    res = await req('POST', `/api/drivers/${driverId}/approve`);
    console.log(`POST /api/drivers/${driverId}/approve:`, res.status, res.data.status === 'Approved' ? 'Approved' : res.data);
  } else {
    console.log("Skipped: Driver creation failed");
  }

  // 5. Create Ride
  console.log("\n5. Checking Ride functionality");
  res = await req('POST', '/api/rides', {
    passengerName: "Test Passenger",
    passengerEmail: passengerEmail,
    pickup: "Dubai Mall",
    dropoff: "Burj Khalifa",
    fare: "50",
    pickupCoords: { lat: 25.1972, lng: 55.2744 },
    dropoffCoords: { lat: 25.1975, lng: 55.2740 },
    paymentType: "cash"
  });
  console.log('POST /api/rides:', res.status, res.data.id ? `Ride Created (ID: ${res.data.id})` : res.data);
  const rideId = res.data.id;

  console.log("\n=== E2E Test Completed ===");
}

run();
