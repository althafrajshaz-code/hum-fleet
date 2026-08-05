const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'capacitor.config.json');

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const url = process.argv[2];

  if (url) {
    config.server = config.server || {};
    config.server.url = url;
    config.server.cleartext = true;
    console.log(`Set Capacitor server URL to: ${url}`);
  } else {
    if (config.server && config.server.url) {
      delete config.server.url;
      console.log('Removed Capacitor server URL (Reverted to local bundle)');
    }
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
} catch (error) {
  console.error('Error updating capacitor.config.json:', error);
  process.exit(1);
}
