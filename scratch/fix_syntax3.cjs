const fs = require('fs');

// 1. Run all patches
require('child_process').execSync('node patch_driver_menu.cjs && node patch_driver_card_colors.cjs && node patch_driver_earnings_toggle.cjs && node patch_driver_searching.cjs && node patch_driver_theme_radar.cjs && node patch_uber_car.cjs && node patch_remove_radar.cjs && node patch_remove_scan.cjs && node patch_driver_map_sync.cjs && node patch_remove_waiting.cjs', {stdio: 'inherit'});

let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 2. Fix the syntax error from patch_driver_menu.cjs
// It opened `{showMainMenu && (<>` but failed to close it because oldE wasn't found.
// The end of the sidebar is right before dashboard-map. 
// It looks like:
//           </div>
//           
//         <div className="dashboard-map
// We want to insert `</>)}` right before `          </div>`

content = content.replace('          </div>\n          \n        <div className="dashboard-map', '          </>)}\n          </div>\n          \n        <div className="dashboard-map');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content, 'utf8');
console.log('Fixed syntax error inside sidebar!');
