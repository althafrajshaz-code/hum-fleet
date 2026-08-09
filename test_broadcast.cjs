async function test() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';
  const res = await fetch(`${API_BASE}/api/admin/messages/broadcast-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Hello from agent test!' })
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
}
test();
