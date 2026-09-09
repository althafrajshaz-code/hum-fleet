import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r"<div style=\{\{\s*borderTop:\s*'1px solid rgba\(59, 130, 246, 0\.2\)',\s*marginTop:\s*'8px',\s*paddingTop:\s*'8px',\s*fontSize:\s*'13px',\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*'4px'\s*\}\}>\s*<div><strong>Estimated Distance:</strong> \{currentRide\.totalKm \|\| 8\.0\} KM</div>\s*<div style=\{\{\s*paddingLeft:\s*'8px',\s*borderLeft:\s*'2px solid #3b82f6',\s*color:\s*'var\(--text-muted\)',\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*'2px',\s*fontSize:\s*'12px'\s*\}\}>\s*<div>.*Base Price: INR \{parseFloat\(currentRide\.fare\)\.toFixed\(2\)\}</div>\s*\{parseFloat\(currentRide\.driverTip\) > 0 && <div>.*Driver Tip: \+INR \{parseFloat\(currentRide\.driverTip\)\.toFixed\(2\)\}</div>\}\s*<div>.*GST Tax \(5%\): \+INR \{\(parseFloat\(currentRide\.fare\) \* 0\.05\)\.toFixed\(2\)\}</div>\s*<div style=\{\{\s*borderTop:\s*'1px solid rgba\(59, 130, 246, 0\.3\)',\s*marginTop:\s*'4px',\s*paddingTop:\s*'4px',\s*fontWeight:\s*'bold',\s*color:\s*'var\(--text-main\)'\s*\}\}>\s*.*Collect Cash: INR \{\(parseFloat\(currentRide\.fare\) \* 1\.05 \+ parseFloat\(currentRide\.driverTip \|\| 0\)\)\.toFixed\(2\)\}\s*</div>\s*</div>\s*</div>\s*<div className=\"req-price est-price\" style=\{\{\s*color:\s*'#3b82f6',\s*marginTop:\s*'8px'\s*\}\}>Total Fare: INR \{\(parseFloat\(currentRide\.fare\) \+ parseFloat\(currentRide\.driverTip \|\| 0\)\)\.toFixed\(2\)\}</div>")

replacement = r'''<div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)', marginTop: '8px', paddingTop: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div><strong>Estimated Distance:</strong> {currentRide.totalKm || 8.0} KM</div>
                          </div>
  
                          <div style={{ borderTop: '1px dashed var(--border)', marginTop: '8px', paddingTop: '8px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '15px' }}>
                            <span>TRIP FARE:</span>
                            <span>INR {(parseFloat(currentRide.fare) * 1.05 + parseFloat(currentRide.driverTip || 0)).toFixed(2)}</span>
                          </div>'''

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
