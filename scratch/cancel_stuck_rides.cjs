async function fixRides() {
  try {
    const res = await fetch('http://187.127.165.79:5000/api/admin/rides');
    const rides = await res.json();
    
    console.log(`Found ${rides.length} rides.`);
    for (const r of rides) {
      if (['Accepted', 'In Progress', 'Arrived'].includes(r.status)) {
        console.log(`Cancelling stuck ride ${r.id} for driver ${r.driverEmail}...`);
        const cancelRes = await fetch(`http://187.127.165.79:5000/api/rides/${r.id}/cancel`, { method: 'POST' });
        console.log(`Cancel response: ${cancelRes.status}`);
      }
    }
    console.log("Done.");
  } catch (err) {
    console.error(err);
  }
}

fixRides();
