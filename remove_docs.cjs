const fs = require('fs');
let code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const target = `<button
                  onClick={() => setSettingsSubTab('documents')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: settingsSubTab === 'documents' ? 'var(--primary)' : 'transparent',
                    color: settingsSubTab === 'documents' ? '#000' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileText size={13} /> Docs & Photos
                </button>`;

code = code.replace(target, '');
fs.writeFileSync('src/pages/DriverDashboard.jsx', code);
