const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

// 1. Add Menu to lucide-react import
content = content.replace(/import \{ (.*?X.*?) \} from 'lucide-react';/, "import { Menu, $1 } from 'lucide-react';");

// 2. Add useState
content = content.replace("const [activeMenu, setActiveMenu] = useState('dispatches');", "const [showMainMenu, setShowMainMenu] = useState(false);\n  const [activeMenu, setActiveMenu] = useState('dispatches');");

// 3. Make driver-header-card relative and add hamburger
const oldHeaderCard = `<div className="driver-header-card" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',`;

const newHeaderCard = `<div className="driver-header-card" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',`;

content = content.replace(oldHeaderCard, newHeaderCard);

const oldProfileSection = `{/* 1. CENTERED DRIVER PROFILE SECTION */}`;
const newProfileSection = `{/* HAMBURGER MENU BUTTON */}
            <button 
              onClick={() => setShowMainMenu(!showMainMenu)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '6px',
                color: '#fff',
                cursor: 'pointer',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showMainMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
            {/* 1. CENTERED DRIVER PROFILE SECTION */}`;

content = content.replace(oldProfileSection, newProfileSection);

// 4. Wrap everything else in showMainMenu
const oldTravelRouteStart = `{/* DRIVER TRAVEL ROUTE / DESTINATION FILTER */}`;
const newTravelRouteStart = `{showMainMenu && (<>\n          {/* DRIVER TRAVEL ROUTE / DESTINATION FILTER */}`;

content = content.replace(oldTravelRouteStart, newTravelRouteStart);

// We need to close it before </div> </div> </div> for dashboard-page
const oldSidebarEnd = `            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}`;
const newSidebarEnd = `            </div>
          </>)}
        </div>
      </div>

      {/* MODALS */}`;

content = content.replace(`            </div>\n          </div>\n        </div>\n      </div>\n\n      {/* MODALS */}`, `            </div>\n          </>)}\n        </div>\n      </div>\n\n      {/* MODALS */}`);

fs.writeFileSync('d:/Althaf/hum/patch_driver_menu.cjs', `
const fs = require('fs');
let c = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

c = c.replace(/import \\{ (.*?X.*?) \\} from 'lucide-react';/, "import { Menu, $1 } from 'lucide-react';");
c = c.replace("const [activeMenu, setActiveMenu] = useState('dispatches');", "const [showMainMenu, setShowMainMenu] = useState(false);\\n  const [activeMenu, setActiveMenu] = useState('dispatches');");

const oldH = \`<div className="driver-header-card" style={{\\n            display: 'flex',\\n            flexDirection: 'column',\\n            gap: '12px',\`;
const newH = \`<div className="driver-header-card" style={{\\n            position: 'relative',\\n            display: 'flex',\\n            flexDirection: 'column',\\n            gap: '12px',\`;
c = c.replace(oldH, newH);

const oldP = \`{/* 1. CENTERED DRIVER PROFILE SECTION */}\`;
const newP = \`{/* HAMBURGER MENU BUTTON */}\\n            <button \\n              onClick={() => setShowMainMenu(!showMainMenu)}\\n              style={{\\n                position: 'absolute',\\n                top: '14px',\\n                right: '14px',\\n                background: 'rgba(255, 255, 255, 0.1)',\\n                border: '1px solid rgba(255, 255, 255, 0.2)',\\n                borderRadius: '8px',\\n                padding: '6px',\\n                color: '#fff',\\n                cursor: 'pointer',\\n                zIndex: 20,\\n                display: 'flex',\\n                alignItems: 'center',\\n                justifyContent: 'center'\\n              }}\\n            >\\n              {showMainMenu ? <X size={20} /> : <Menu size={20} />}\\n            </button>\\n            {/* 1. CENTERED DRIVER PROFILE SECTION */}\`;
c = c.replace(oldP, newP);

const oldT = \`{/* DRIVER TRAVEL ROUTE / DESTINATION FILTER */}\`;
const newT = \`{showMainMenu && (<>\\n          {/* DRIVER TRAVEL ROUTE / DESTINATION FILTER */}\`;
c = c.replace(oldT, newT);

const oldE = \`            </div>\\n        </div>\\n      </div>\\n\\n      {/* MODALS */}\`;
const newE = \`            </div>\\n          </>)}\\n        </div>\\n      </div>\\n\\n      {/* MODALS */}\`;
c = c.replace(oldE, newE);

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', c);
console.log('Driver Menu patched successfully!');
`);
