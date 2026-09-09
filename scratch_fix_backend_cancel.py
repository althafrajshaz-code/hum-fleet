import re

with open('server/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'''app.post('/api/rides/:id/passenger-cancel', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.status = 'Cancelled';'''

replacement = r'''app.post('/api/rides/:id/passenger-cancel', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    if (ride.status === 'In Progress') {
      return res.status(403).json({ error: 'Cannot cancel a trip that is already in progress.' });
    }
    ride.status = 'Cancelled';'''

if target in content:
    content = content.replace(target, replacement)
    with open('server/index.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
