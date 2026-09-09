const fs = require('fs');
let cssContent = fs.readFileSync('d:/Althaf/hum/src/pages/Dashboard.css', 'utf8');

const uberCss = `

/* Uber-style Car Searching Animation */
.uber-searching-box {
  width: 100%;
  max-width: 240px;
  height: 3px;
  background: rgba(16, 185, 129, 0.2);
  position: relative;
  border-radius: 4px;
  margin: 24px auto 10px auto;
}

.uber-searching-car {
  position: absolute;
  top: -12px;
  left: 50%;
  color: #10b981;
  animation: uber-car-drive 2.5s ease-in-out infinite;
}

@keyframes uber-car-drive {
  0% { transform: translateX(-120px) scaleX(1); }
  48% { transform: translateX(120px) scaleX(1); }
  50% { transform: translateX(120px) scaleX(-1); }
  98% { transform: translateX(-120px) scaleX(-1); }
  100% { transform: translateX(-120px) scaleX(1); }
}
`;

if (!cssContent.includes('.uber-searching-box')) {
  fs.writeFileSync('d:/Althaf/hum/src/pages/Dashboard.css', cssContent + uberCss);
}

let jsxContent = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

const oldSearching = `{/* RADAR ANIMATION COMPONENT */}`;

const newSearching = `{/* UBER STYLE CAR ANIMATION */}
                <div className="uber-searching-box">
                  <div className="uber-searching-car">
                    <Car size={24} fill="#10b981" />
                  </div>
                </div>

                {/* RADAR ANIMATION COMPONENT */}`;

if (!jsxContent.includes('uber-searching-box')) {
  jsxContent = jsxContent.replace(oldSearching, newSearching);
  fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', jsxContent);
}

console.log('Added Uber-style car animation');
