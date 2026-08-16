const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// We will use PowerShell's Compress-Archive but we'll first copy to a temp dir without node_modules
const sourceDir = 'd:\\Althaf\\hum';
const tempDir = 'd:\\Althaf\\hum_temp_backup';
const destZip = 'd:\\Althaf\\hum_fleet_backup.zip';

console.log('Starting backup process...');

// 1. Create temp dir
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir);

// 2. Copy files excluding node_modules and .git
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  const basename = path.basename(src);
  if (basename === 'node_modules' || basename === '.git') return;

  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying files (excluding node_modules)...');
copyRecursiveSync(sourceDir, tempDir);

// 3. Zip it
console.log('Zipping...');
try {
  if (fs.existsSync(destZip)) fs.unlinkSync(destZip);
  execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${destZip}'"`);
  console.log('Successfully created ' + destZip);
} catch(e) {
  console.error('Error zipping:', e);
}

// 4. Cleanup temp
console.log('Cleaning up...');
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Backup Complete!');
