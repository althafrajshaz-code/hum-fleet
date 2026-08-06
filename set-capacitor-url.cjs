const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'capacitor.config.json');
const buildGradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
const stringsXmlPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const url = process.argv[2];
  const appId = process.argv[3];
  const appName = process.argv[4];

  if (url) {
    config.server = config.server || {};
    config.server.url = url;
    config.server.cleartext = true;
    console.log(`Set Capacitor server URL to: ${url}`);
  } else {
    if (config.server && config.server.url) {
      delete config.server.url;
      console.log('Removed Capacitor server URL');
    }
  }

  if (appId) {
    config.appId = appId;
    if (appName) config.appName = appName;
    
    // Update build.gradle (Only Application ID, keep namespace the same)
    if (fs.existsSync(buildGradlePath)) {
      let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
      buildGradle = buildGradle.replace(/applicationId "[^"]+"/g, `applicationId "${appId}"`);
      fs.writeFileSync(buildGradlePath, buildGradle);
      console.log(`Updated build.gradle applicationId to: ${appId}`);
    }
    
    // Update strings.xml (App name)
    if (fs.existsSync(stringsXmlPath) && appName) {
      let stringsXml = fs.readFileSync(stringsXmlPath, 'utf8');
      stringsXml = stringsXml.replace(/<string name="app_name">[^<]+<\/string>/g, `<string name="app_name">${appName}</string>`);
      stringsXml = stringsXml.replace(/<string name="title_activity_main">[^<]+<\/string>/g, `<string name="title_activity_main">${appName}</string>`);
      fs.writeFileSync(stringsXmlPath, stringsXml);
      console.log(`Updated strings.xml app name to: ${appName}`);
    }
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
} catch (error) {
  console.error('Error updating config:', error);
  process.exit(1);
}
