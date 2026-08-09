async function run() {
  try {
    console.log(`\nUpdating category auto baseFare...`);
    const putRes = await fetch(`https://hum-fleet-api.onrender.com/api/vehicle-categories/auto`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseFare: 88.88
      })
    });
    
    console.log("PUT Response status:", putRes.status);
    const putData = await putRes.json();
    console.log("PUT Response data:", putData);

    const verifyRes = await fetch('https://hum-fleet-api.onrender.com/api/vehicle-categories');
    const verifyData = await verifyRes.json();
    console.log("\nAll Categories:", JSON.stringify(verifyData, null, 2));
  } catch(e) {
    console.error(e);
  }
}
run();
