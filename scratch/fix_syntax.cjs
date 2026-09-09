const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const target = '        </div>\n        \n        <div className="dashboard-map';
const replacement = '        </div>\n          </>)}\n        </div>\n        <div className="dashboard-map';

// Wait, looking at the code around 3633:
// 3633:         </div>
// 3634:         
// 3635:         <div className="dashboard-map animate-fade-in delay-100"

content = content.replace('        </div>\n        \n        <div className="dashboard-map', '        </div>\n          </>)}\n        </div>\n        <div className="dashboard-map');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content, 'utf8');
console.log('Fixed syntax error!');
