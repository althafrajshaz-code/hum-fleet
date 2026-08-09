async function fix() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';
  
  // 1. Delete the bad premium category
  const badId = '💎-premium-/-luxury';
  const encodedId = encodeURIComponent(badId);
  const delRes = await fetch(`${API_BASE}/api/vehicle-categories/${encodedId}`, {
    method: 'DELETE'
  });
  console.log('Delete status:', delRes.status);
  
  // 2. Add the fixed premium category
  const newCat = {
    name: '💎 Premium Luxury', // NO SLASH!
    maxPassengers: 4,
    baseFare: 0,
    ratePerKm: 0,
    icon: '💎'
  };
  const addRes = await fetch(`${API_BASE}/api/vehicle-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCat)
  });
  console.log('Add status:', addRes.status);
  
}
fix();
