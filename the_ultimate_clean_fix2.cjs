const fs = require('fs');

let text = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Docs and Photos removal
const targetDocsBtnRegex = /<button[^>]*onClick=\{\(\) => setSettingsSubTab\('documents'\)\}[^>]*>[\s\S]*?Docs & Photos[\s\S]*?<\/button>/;
text = text.replace(targetDocsBtnRegex, "");

// 2. Settle Platform Dues (Total Pending amount + remove QR code)
const targetDuesInputRegex = /<label style=\{\{ fontSize: '11px', color: 'var\(--text-muted\)', fontWeight: '700' \}\}>Enter Payment Amount \(INR\)<\/label>/;
const replaceDuesInput = `<div style={{ fontSize: '14px', fontWeight: '800', color: '#ef4444', marginBottom: '8px' }}>Total Pending Dues (Including GST): \u20B9{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</div>\n                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Enter Payment Amount (INR)</label>`;
text = text.replace(targetDuesInputRegex, replaceDuesInput);

const qrRegex = /\{systemSettings\.qrCodeUrl && \([\s\S]*?Scan with GPay, PhonePe, Paytm, etc\.<\/div>\s*<\/div>\s*\)\}/;
text = text.replace(qrRegex, "");

// 3. Ride Preferences Restriction
const targetRidePrefs = /const driverRate = parseFloat\(driverDetails\?\.ratePerKm \|\| 0\);/;
const replaceRidePrefs = `const driverCat = availableCategories.find(c => String(c.id).toLowerCase() === String(driverDetails?.vehicleCategory || '').toLowerCase() || String(c.name).toLowerCase() === String(driverDetails?.vehicleCategory || '').toLowerCase());\n                          const driverRate = parseFloat(driverCat?.ratePerKm || 0);`;
text = text.replace(targetRidePrefs, replaceRidePrefs);

// 4. ?750 Limit Progress Bar + Dues Breakdown Changes
const startBreakdown = "{/* Dues Breakdown */}";
const endBreakdownStr = "Total Commission Dues:</span>\n                      <strong style={{ color: '#ef4444' }}>";
const duesRegex = /\{\/\* Dues Breakdown \*\/\}[\s\S]*?Total Commission Dues:<\/span>\s*<strong style=\{\{ color: '#ef4444' \}\}>.*?(<\/div>\s*<\/div>)/;

const newDues = `                {/* Dues Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>\uD83D\uDCCA Platform Commission Breakdown</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Platform Commission:</span>
                    <strong style={{ color: '#ef4444' }}>-\u20B9{(parseFloat(wallet?.toBePaid || 0) - parseFloat(wallet?.gstCollected || 0)).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST Collected:</span>
                    <strong style={{ color: '#ef4444' }}>-\u20B9{parseFloat(wallet?.gstCollected || 0).toFixed(2)}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                    <span style={{ color: '#ef4444' }}>Total Commission Dues:</span>
                    <strong style={{ color: '#ef4444' }}>-\u20B9{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {/* Progress Bar for 750 Limit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                    <span style={{ color: 'var(--text-main)' }}>Dues Limit</span>
                    <span style={{ color: parseFloat(wallet?.toBePaid || 0) >= 700 ? '#ef4444' : 'var(--text-main)' }}>
                      \u20B9{parseFloat(wallet?.toBePaid || 0).toFixed(2)} / \u20B9750
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: \`\${Math.min(100, (parseFloat(wallet?.toBePaid || 0) / 750) * 100)}%\`, background: parseFloat(wallet?.toBePaid || 0) >= 700 ? '#ef4444' : parseFloat(wallet?.toBePaid || 0) >= 500 ? '#f59e0b' : '#10b981', transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>*Trips will be blocked once dues reach \u20B9750.</span>
                </div>`;
text = text.replace(duesRegex, newDues);

// 5. Commission Policy
const policyRegex = /<div[^>]*>.*?<strong>Commission Policy:<\/strong>.*?<\/div>/s;
const newPolicy = `<div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px', lineHeight: '1.5' }}>
                  \uD83D\uDCA1 <strong>Commission Policy:</strong> Platform fee is tiered (\u20B910 for trips up to \u20B91000, \u20B920 up to \u20B91500, \u20B925 above \u20B91500) + 5% GST on base fare. Dues must be paid through the gateway before pending balance crosses \u20B91,500.
                </div>`;
text = text.replace(policyRegex, newPolicy);

// 6. Generic Text replacements that the previous AI did
text = text.replace(/driverInfo\?\.name/g, 'driverDetails?.name');
text = text.replace(/driverInfo\?\.phone/g, 'driverDetails?.phone');
text = text.replace(/after 10% commission/g, 'after platform dues');
text = text.replace(/Commission \(10%\)/g, 'Dues & Fees');
text = text.replace(/\(10% Platform Commission & GST Dues\)/g, '(Platform Fees & GST)');
text = text.replace(/style=\{\{ display: "none",  display: "none", padding: "18px 14px",/g, 'style={{ padding: "18px 14px",');
text = text.replace(/style=\{\{ display: "none", display: "none", padding: "18px 14px",/g, 'style={{ padding: "18px 14px",');
text = text.replace(/wallet\.toBePaid/g, 'wallet?.toBePaid');
text = text.replace(/wallet\.cashCollected/g, 'wallet?.cashCollected');
text = text.replace(/wallet\.gstCollected/g, 'wallet?.gstCollected');

// 7. Optimistic Go Online (Prevent UI bounce)
const goOnlineRegex = /registerPushNotifications\(\);\s*const email = localStorage\.getItem\('driverEmail'\);\s*if \(navigator\.geolocation\) \{/;
const newGoOnline = `registerPushNotifications();\n    const email = localStorage.getItem('driverEmail');\n    fetch(API_BASE + '/api/drivers/location', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, isOnline: true }) }).catch(console.error);\n    if (navigator.geolocation) {`;
text = text.replace(goOnlineRegex, newGoOnline);

// 8. Fix the corrupted stars and template literals from original codebase if any
text = text.replace(/`\~. \$\{driverDetails\?\.rating \|\| '5\.0'\}`/g, "'Star ' + (driverDetails?.rating || '5.0')");

fs.writeFileSync('src/pages/DriverDashboard.jsx', text);
console.log("Replacements applied successfully.");
