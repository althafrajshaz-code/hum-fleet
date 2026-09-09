const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const regex = /\{\/\* Badges Display \*\/\}\s*\{driverDetails\?\.badges && driverDetails\.badges\.length > 0 && \(\s*<div style=\{\{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', marginTop: '10px' \}\}>\s*<button/;

const replaceStr = '{/* Badges Display */}\n' +
'                {driverDetails?.badges && driverDetails.badges.length > 0 && (\n' +
'                  <div style={{ display: \'flex\', flexWrap: \'wrap\', justifyContent: \'center\', gap: \'4px\', marginTop: \'10px\' }}>\n' +
'                    {[...new Set(driverDetails.badges)].map(badge => (\n' +
'                      <span key={badge} style={{ background: \'rgba(59,130,246,0.1)\', border: \'1px solid rgba(59,130,246,0.3)\', color: \'#3b82f6\', fontSize: \'10px\', fontWeight: \'bold\', padding: \'2px 6px\', borderRadius: \'8px\' }}>\n' +
'                        {badge} <span style={{ color: \'var(--text-muted)\' }}>({driverDetails.badges.filter(b => b === badge).length})</span>\n' +
'                      </span>\n' +
'                    ))}\n' +
'                  </div>\n' +
'                )}\n' +
'              </div>\n' +
'            </div>\n' +
'            \n' +
'            {/* TODAY\\'S EARNINGS COMPACT CARD */}\n' +
'            <div style={{ background: \'rgba(16,185,129,0.07)\', border: \'1px solid rgba(16,185,129,0.2)\', borderRadius: \'12px\', padding: \'16px\', display: \'flex\', flexDirection: \'column\', alignItems: \'center\', justifyContent: \'center\', gap: \'8px\' }}>\n' +
'              <div style={{ display: \'flex\', alignItems: \'center\', gap: \'8px\' }}>\n' +
'                <div style={{ fontSize: \'12px\', fontWeight: \'800\', color: \'rgba(16,185,129,0.9)\', textTransform: \'uppercase\', letterSpacing: \'0.6px\' }}>?? Today\\'s Earnings</div>\n' +
'                <button onClick={() => setHideEarningsAmount(!hideEarningsAmount)} style={{ background: \'none\', border: \'none\', color: \'var(--text-muted)\', cursor: \'pointer\', display: \'flex\', alignItems: \'center\', padding: \'4px\' }}>\n' +
'                  {hideEarningsAmount ? <EyeOff size={14} /> : <Eye size={14} />}\n' +
'                </button>\n' +
'              </div>\n' +
'              <div style={{ fontSize: \'28px\', fontWeight: \'900\', color: \'#10b981\', textAlign: \'center\' }}>\n' +
'                {hideEarningsAmount ? \'***\' : ?}\n' +
'              </div>\n' +
'\n' +
'              {/* Toggle details button */}\n' +
'              <button';

content = content.replace(regex, replaceStr);
fs.writeFileSync('src/pages/DriverDashboard.jsx', content);

