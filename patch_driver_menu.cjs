
const fs = require('fs');
let c = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

c = c.replace(/import \{ (.*?X.*?) \} from 'lucide-react';/, "import { Menu, $1 } from 'lucide-react';");
c = c.replace("const [activeMenu, setActiveMenu] = useState('dispatches');", "const [showMainMenu, setShowMainMenu] = useState(false);\n  const [activeMenu, setActiveMenu] = useState('dispatches');");

const oldH = `<div className="driver-header-card" style={{\n            display: 'flex',\n            flexDirection: 'column',\n            gap: '12px',`;
const newH = `<div className="driver-header-card" style={{\n            position: 'relative',\n            display: 'flex',\n            flexDirection: 'column',\n            gap: '12px',`;
c = c.replace(oldH, newH);

const oldP = `{/* 1. CENTERED DRIVER PROFILE SECTION */}`;
const newP = `{/* HAMBURGER MENU BUTTON */}\n            <button \n              onClick={() => setShowMainMenu(!showMainMenu)}\n              style={{\n                position: 'absolute',\n                top: '14px',\n                right: '14px',\n                background: 'rgba(255, 255, 255, 0.1)',\n                border: '1px solid rgba(255, 255, 255, 0.2)',\n                borderRadius: '8px',\n                padding: '6px',\n                color: '#fff',\n                cursor: 'pointer',\n                zIndex: 20,\n                display: 'flex',\n                alignItems: 'center',\n                justifyContent: 'center'\n              }}\n            >\n              {showMainMenu ? <X size={20} /> : <Menu size={20} />}\n            </button>\n            {/* 1. CENTERED DRIVER PROFILE SECTION */}`;
c = c.replace(oldP, newP);

const oldT = `{/* DRIVER TRAVEL ROUTE / DESTINATION FILTER */}`;
const newT = `{showMainMenu && (<>\n          {/* DRIVER TRAVEL ROUTE / DESTINATION FILTER */}`;
c = c.replace(oldT, newT);

const oldE = `            </div>\n        </div>\n      </div>\n\n      {/* MODALS */}`;
const newE = `            </div>\n          </>)}\n        </div>\n      </div>\n\n      {/* MODALS */}`;
c = c.replace(oldE, newE);

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', c);
console.log('Driver Menu patched successfully!');
