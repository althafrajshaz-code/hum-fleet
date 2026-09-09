const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = '  const handleActivateVehicle = async (vehicleId) => {';

const replacement = `  const handleSavePreferences = async () => {
    setPrefSaveStatus('saving');
    try {
      const email = localStorage.getItem('driverEmail');
      const response = await fetch(\`\${API_BASE}/api/drivers/preferences\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, acceptedCategories: prefCategories, acceptsIntercity: prefIntercity })
      });
      if (response.ok) {
        setPrefSaveStatus('saved');
        const data = await response.json();
        setDriverDetails(data);
        setTimeout(() => setPrefSaveStatus(null), 3000);
      } else {
        setPrefSaveStatus('error');
      }
    } catch (err) {
      setPrefSaveStatus('error');
    }
  };

  const handleActivateVehicle = async (vehicleId) => {`;

if (content.includes(target) && !content.includes('const handleSavePreferences = async () => {')) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Injected handleSavePreferences successfully.');
} else {
  console.log('Target not found or already injected.');
}
