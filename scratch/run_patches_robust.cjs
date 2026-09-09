const fs = require('fs');

const patches = [
  'patch_driver_menu.cjs',
  'patch_driver_card_colors.cjs',
  'patch_driver_earnings_toggle.cjs',
  'patch_driver_searching.cjs',
  'patch_driver_theme_radar.cjs',
  'patch_uber_car.cjs',
  'patch_remove_radar.cjs',
  'patch_remove_scan.cjs',
  'patch_driver_map_sync.cjs',
  'patch_remove_waiting.cjs'
];

for (let file of patches) {
  let patchCode = fs.readFileSync(file, 'utf8');
  
  // Inject a monkey-patch for String.prototype.replace to ignore \r\n differences
  // and handle multiple string replacements if needed.
  const header = `
    const originalReplace = String.prototype.replace;
    String.prototype.replace = function(search, replacement) {
      if (typeof search === 'string') {
        const normSearch = search.replace(/\\r\\n/g, '\\n');
        const normThis = this.replace(/\\r\\n/g, '\\n');
        if (normThis.includes(normSearch)) {
           console.log("[MATCH FOUND IN " + "${file}" + "]");
           return normThis.split(normSearch).join(typeof replacement === 'string' ? replacement.replace(/\\r\\n/g, '\\n') : replacement);
        } else {
           console.log("[NO MATCH FOUND IN " + "${file}" + "] for snippet starting with: " + search.substring(0, 50).replace(/\\n/g, '\\\\n'));
        }
      }
      return originalReplace.call(this, search, replacement);
    };
  `;
  
  fs.writeFileSync('temp_' + file, header + patchCode);
  try {
    require('child_process').execSync('node temp_' + file, {stdio: 'inherit'});
  } catch(e) {
    console.log("Error in " + file);
  }
  fs.unlinkSync('temp_' + file);
}
