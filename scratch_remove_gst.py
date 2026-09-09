import re

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r"<\s*div style=\{\{\s*borderTop:\s*'1px dashed var\(--border\)',\s*marginTop:\s*'6px',\s*paddingTop:\s*'6px',\s*color:\s*'var\(--text-main\)',\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*'4px'\s*\}\}>\s*<\s*div style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'space-between'\s*\}\}>\s*<span>Fare Price:[\s\S]*?<\/\s*div>\s*<\/\s*div>", re.MULTILINE)

replacement = r'''                    <div style={{ borderTop: '1px dashed var(--border)', marginTop: '8px', paddingTop: '8px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px' }}>
                      <span>TRIP FARE:</span>
                      <span>INR {parseFloat(activeRide.totalCollected || (parseFloat(activeRide.fare || 0) * 1.05)).toFixed(2)}</span>
                    </div>'''

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Not found regex")
