const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

// 1. Import Sun and Moon
content = content.replace(
  "import { Menu, Power",
  "import { Sun, Moon, Menu, Power"
);

// 2. Replace the hamburger menu button wrapper to include the Theme toggle
const oldHamburger = `{/* HAMBURGER MENU BUTTON */}
            <button 
              onClick={() => setShowMainMenu(!showMainMenu)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                color: 'var(--text-main)',
                cursor: 'pointer',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showMainMenu ? <X size={20} /> : <Menu size={20} />}
            </button>`;

const newButtons = `<div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 20 }}>
              {/* THEME TOGGLE BUTTON */}
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '6px',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* HAMBURGER MENU BUTTON */}
              <button 
                onClick={() => setShowMainMenu(!showMainMenu)}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '6px',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showMainMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>`;

content = content.replace(oldHamburger, newButtons);

// 3. Upgrade the searching indicator to radar animation
const oldSearching = `{isOnline && !currentRide && !isPaused && (
              <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid #10b981', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', letterSpacing: '0.5px' }}>SEARCHING FOR RIDES...</span>
              </div>
            )}`;

const newSearching = `{isOnline && !currentRide && !isPaused && (
              <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', boxShadow: 'inset 0 0 20px rgba(16,185,129,0.05)' }}>
                
                {/* RADAR ANIMATION COMPONENT */}
                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(16,185,129,0.3)' }}>
                  {/* Radar Sweep */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%', background: 'conic-gradient(from 0deg, transparent 70%, rgba(16,185,129,0.8) 100%)', transformOrigin: '0% 0%', animation: 'radar-sweep 2s linear infinite' }}></div>
                  
                  {/* Sonar Ripples */}
                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid rgba(16,185,129,0.6)', borderRadius: '50%', animation: 'sonar-ripple 2s ease-out infinite' }}></div>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid rgba(16,185,129,0.4)', borderRadius: '50%', animation: 'sonar-ripple 2s ease-out infinite 1s' }}></div>

                  {/* Center Dot */}
                  <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                </div>

                <span style={{ fontSize: '13px', fontWeight: '900', color: '#10b981', letterSpacing: '1px', textShadow: '0 0 10px rgba(16,185,129,0.3)' }}>SEARCHING FOR RIDES...</span>
              </div>
            )}`;

content = content.replace(oldSearching, newSearching);

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
console.log('Added dark theme toggle and radar animation.');
