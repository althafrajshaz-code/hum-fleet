const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add States
if (!content.includes('const [prefCategories')) {
  content = content.replace(
    /const \[profileSaveStatus, setProfileSaveStatus\] = useState\(null\);.*?\n/s,
    `const [profileSaveStatus, setProfileSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  // Preferences State
  const [prefCategories, setPrefCategories] = useState([]);
  const [prefIntercity, setPrefIntercity] = useState(false);
  const [prefSaveStatus, setPrefSaveStatus] = useState(null);
`
  );
}

// 2. Add handleSavePreferences
if (!content.includes('const handleSavePreferences')) {
  content = content.replace(
    /const handleSaveProfile = async \(\) => \{/s,
    `const handleSavePreferences = async () => {
    setPrefSaveStatus('saving');
    try {
      const email = localStorage.getItem('driverEmail');
      const response = await fetch(\`\${API_BASE}/api/drivers/preferences\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, acceptedCategories: prefCategories, acceptsIntercity: prefIntercity })
      });
      if (response.ok) {
        setPrefSaveStatus('saved');
        const data = await response.json();
        setDriverDetails(data);
        setTimeout(() => setPrefSaveStatus(null), 3000);
      } else {
        setPrefSaveStatus('error');
      }
    } catch (err) {
      setPrefSaveStatus('error');
    }
  };

  const handleSaveProfile = async () => {`
  );
}

// 3. Initialize preferences when fetching driver status
if (!content.includes('setPrefCategories(data.acceptedCategories')) {
  content = content.replace(
    /if \(data.profilePic\) setDriverProfilePic\(data.profilePic\);/s,
    `if (data.profilePic) setDriverProfilePic(data.profilePic);
        if (data.acceptedCategories) setPrefCategories(data.acceptedCategories);
        if (data.acceptsIntercity !== undefined) setPrefIntercity(data.acceptsIntercity);
`
  );
}

// 4. Add the Preferences sub-tab button
if (!content.includes('setSettingsSubTab(\'preferences\')')) {
  content = content.replace(
    /<button[^>]*onClick=\{\(\) => setSettingsSubTab\('appearance'\)\}[^>]*>.*?<\/button>/s,
    `$&

                <button
                  onClick={() => setSettingsSubTab('preferences')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: settingsSubTab === 'preferences' ? 'var(--primary)' : 'transparent',
                    color: settingsSubTab === 'preferences' ? '#000' : 'var(--text-muted)',
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
                  <Settings size={13} /> Prefs
                </button>`
  );
}

// 5. Add Preferences UI Tab
if (!content.includes('SUB-SECTION 5: PREFERENCES')) {
  content = content.replace(
    /\{settingsSubTab === 'appearance' && \(/s,
    `{/* SUB-SECTION 5: PREFERENCES */}
              {settingsSubTab === 'preferences' && (
                <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={18} color="var(--primary)" />
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>Ride Preferences</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                    Select which types of trips you want to receive. Enable additional vehicle classes to get more trips.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Accepted Categories</span>
                    {['Auto', 'Mini', 'Sedan', 'SUV / XL (6 Seater)', 'Premium', 'Bike'].map(cat => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <input
                          type="checkbox"
                          checked={prefCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPrefCategories([...prefCategories, cat]);
                            } else {
                              setPrefCategories(prefCategories.filter(c => c !== cat));
                            }
                          }}
                          style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Special Trip Types</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <input
                        type="checkbox"
                        checked={prefIntercity}
                        onChange={(e) => setPrefIntercity(e.target.checked)}
                        style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                      />
                      Accept Intercity Rides
                    </label>
                  </div>

                  {prefSaveStatus === 'saved' && (
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
                      ✓ Preferences updated successfully.
                    </div>
                  )}
                  {prefSaveStatus === 'error' && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#ef4444', fontWeight: '700' }}>
                      Failed to save preferences.
                    </div>
                  )}

                  <Button
                    variant="primary"
                    onClick={handleSavePreferences}
                    disabled={prefSaveStatus === 'saving'}
                    style={{ padding: '10px', fontSize: '13px', fontWeight: '800', marginTop: '8px' }}
                  >
                    {prefSaveStatus === 'saving' ? '⏳ Saving...' : '💾 Save Preferences'}
                  </Button>
                </div>
              )}

              {/* SUB-SECTION 6: THEME */}
              {settingsSubTab === 'appearance' && (`
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully patched DriverDashboard.jsx with Preferences UI');
